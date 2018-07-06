/* Source Code Header
Program Name	:	CorpBS34-Conversion.js
Module Name		:
Description  	:	In this program we are Extraction all the information from ITR3,ITR4 source file and converting into CSV output files.

Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 19/07/2017
Created By		:	Rahul Roushan
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		:	Revision Date:		Revised By		Details
1.1					07-02-2017			sekar           Added output path and integrated with engine

---------------------------------------------------------------------------------------------*/
const fs = require('fs'),
 xml2js = require('xml2js');
const json2csv = require('json2csv');
const JSONPath = require('JSONPath');
const parser = new xml2js.Parser();
const mkdirp = require('mkdirp');
const xpath = require('xpath'),
dom = require('xmldom').DOMParser;

const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? './googleDownUpload/' : "awsDownUpload/";
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';
const BscsvPath = 'BsCsvFiles/';

module.exports = {
    CorpBSConversion(ofilename, rfilename, year, orderNo, pullSeqNo) {
		const FilePaths = [];
        FilePaths[0] = path1 + orderNo + path2 + '/' + ofilename;
        FilePaths[1] = path1 + orderNo + path2 + '/' + rfilename;
		console.log('....................................37BS');
		console.log(ofilename, rfilename,year, orderNo,pullSeqNo);
		//FilePaths[0] = ofilename;
		//FilePaths[1] = rfilename;
		var rupeeLnoth=[];     var pan=[];              var returntyp=[];       var proCap = [];      var totalResSurp = [];       var bankBalc =[];
		var forCurLoan = [];   var totOthInc = [];      var defTax = [];        var grsBlk = [];      var depreciat = [];          var capWrkPrg = [];
	    var totLngTermInv = [];var totTraInv = [];      var totInventries=[];   var sndryDeb = [];    var totCashBankBal = [];     var statReserv =[];
		var othCurAsset = [];  var totLnAdv = [];       var sunCred = [];       var liaLeasAsset=[];  var accrLeaAsset =[];        var prefShares =[];
		var accIntNoDue =[];   var totProvisions = [];  var miscExp = [];       var defTaxAss = [];   var totCurrLiabProv=[];      var casinHand =[];
        var accLosses = [];    var totSunDbtAmt = [];   var totSunCrAmt = [];   var totSktTradAmt =[];var cashBalAmt = [];         var rupeeLn = [];
		var unSecLn =[];       var unSecLnOther = [];   var formname1 = [];     var assyear =[];      var revReserv =[];           var capReserv =[];
		var othReserv=[];     var totalPropFund =[];   var totalRupeeLoan =[]; var totalSecrLoan=[]; var totalUnSecrLoan =[];     var totalLoanFund =[];
		var totalFundSrc =[];  var netBlk =[];          var totalFixedAsset =[];var govtOthSecQuot=[];var govOthSecUnQuot =[];     var equiShares =[];
		var debentr =[];       var totalInvestments =[];var storesConsum =[];   var rawMat =[];       var stkInProc =[];           var finOrTrdGood =[];
		var totalCurrAsset =[];var advRecov =[];        var deposit =[];        var balWithRevAut=[]; var totalCurrAssetLoanAdv=[];var totCurrLiabilities =[];
		var iTProv =[];        var wTProv =[];          var eLS =[];            var othProv=[];       var totCurrLiab =[];         var netCurAsset =[];
		var totFundApp =[];    var totMscAdjust =[];
		var surNameOrgName=[]; var pmcap=[];
		var fNmae=[];         var mName=[];
		var name=[];

	if( typeof rfilename != 'undefined'){
		console.log('revised file found');
		var data = fs.readFileSync(FilePaths[1]);

		if (data) {


		 try {
					const doc = new dom().parseFromString(data.toString());
                    const select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master','ITRForm':'http://incometaxindiaefiling.gov.in/Corpmaster' })
					formname1 = checkFieldAvl1('//ITRForm:FormName/text()', 0);
					assyear = checkFieldAvl1('//ITRForm:AssessmentYear/text()',0);
		      if((formname1 == 'ITR-3' && assyear == 2017 )||(formname1 == 'ITR-4') && (assyear == 2014 || assyear == 2015 || assyear == 2016)){

		            fNmae= checkFieldAvl1('//ITRForm:FirstName/text()', 0);
					try{
							//mName= checkFieldAvl('//ITRForm:MiddleName/text()',0);
							mName = select('//ITRForm:MiddleName/text()', doc)[0].nodeValue;
					}
					catch(e){
						mName = ' ';
					}
				    surNameOrgName= fNmae+' '+ mName+' '+ checkFieldAvl1('//ITRForm:SurNameOrOrgName/text()', 0);
                    pan= checkFieldAvl1('//ITRForm:PAN/text()', 0);
					returntyp= checkFieldAvl1('//ITRForm:ReturnType/text()', 0);
					proCap = checkFieldAvl1('//ITRForm:PropCap/text()', 0);
					revReserv= checkFieldAvl1('//ITRForm:RevResr/text()', 0);
					capReserv=checkFieldAvl1('//ITRForm:CapResr/text()', 0);
					statReserv=checkFieldAvl1('//ITRForm:StatResr/text()', 0);
					othReserv=checkFieldAvl1('//ITRForm:OthResr/text()', 0);
					totalResSurp = checkFieldAvl1('//ITRForm:TotResrNSurp/text()', 0);
					totalPropFund=checkFieldAvl1('//ITRForm:TotPropFund/text()', 0);
					forCurLoan = checkFieldAvl1('//ITRForm:ForeignCurrLoan/text()', 0);
					rupeeLn = checkFieldAvl1('//ITRForm:FrmBank/text()', 0);
					rupeeLnoth =  checkFieldAvl1('//ITRForm:FrmOthrs/text()', 0); //
					totalRupeeLoan=checkFieldAvl1('//ITRForm:TotRupeeLoan/text()', 0);
					totalSecrLoan=checkFieldAvl1('//ITRForm:TotSecrLoan/text()', 0);
					unSecLn = checkFieldAvl1('//ITRForm:FrmBank/text()', 1);
					unSecLnOther = checkFieldAvl1('//ITRForm:FrmOthrs/text()', 1);
					totalUnSecrLoan =checkFieldAvl1('//ITRForm:TotUnSecrLoan/text()', 0);
					totalLoanFund=checkFieldAvl1('//ITRForm:TotLoanFund/text()', 0);
					defTax = checkFieldAvl1('//ITRForm:DeferredTax/text()', 0);
					totalFundSrc=checkFieldAvl1('//ITRForm:TotFundSrc/text()', 0);
					grsBlk = checkFieldAvl1('//ITRForm:GrossBlock/text()', 0);
					depreciat = checkFieldAvl1('//ITRForm:Depreciation/text()', 0);
					netBlk =checkFieldAvl1('//ITRForm:NetBlock/text()', 0);
					capWrkPrg = checkFieldAvl1('//ITRForm:CapWrkProg/text()', 0);
					totalFixedAsset=checkFieldAvl1('//ITRForm:TotFixedAsset/text()', 0);
					govtOthSecQuot  =checkFieldAvl1('//ITRForm:GovtOthSecQuoted/text()', 0);
					govOthSecUnQuot =checkFieldAvl1('//ITRForm:GovOthSecUnQoted/text()', 0);
					totLngTermInv = checkFieldAvl1('//ITRForm:TotLongTermInv/text()', 0);
					equiShares=checkFieldAvl1('//ITRForm::EquityShares/text()', 0);
					prefShares =checkFieldAvl1('//ITRForm:PreferShares/text()', 0);
					debentr =checkFieldAvl1('//ITRForm:Debenture/text()', 0);
					totTraInv = checkFieldAvl1('//ITRForm:TotTradeInv/text()', 0);
					totalInvestments =checkFieldAvl1('//ITRForm:TotInvestments/text()', 0);
					storesConsum=checkFieldAvl1('//ITRForm:StoresConsumables/text()', 0);
					rawMat=checkFieldAvl1('//ITRForm:RawMatl/text()', 0);
					stkInProc=checkFieldAvl1('//ITRForm:StkInProcess/text()', 0);
					finOrTrdGood =checkFieldAvl1('//ITRForm:FinOrTradGood/text()', 0);
					totInventries = checkFieldAvl1('//ITRForm:TotInventries/text()', 0);
					sndryDeb = checkFieldAvl1('//ITRForm:SndryDebtors/text()', 0);
					casinHand =checkFieldAvl1('//ITRForm:CashinHand/text()', 0);
					bankBalc=checkFieldAvl1('//ITRForm:BankBal/text()', 0);
					totCashBankBal = checkFieldAvl1('//ITRForm:TotCashOrBankBal/text()', 0);
					othCurAsset = checkFieldAvl1('//ITRForm:OthCurrAsset/text()', 0);
					totalCurrAsset=checkFieldAvl1('//ITRForm:TotCurrAsset/text()', 0);
					advRecov=checkFieldAvl1('//ITRForm:AdvRecoverable/text()', 0);
					deposit=checkFieldAvl1('//ITRForm::Deposits/text()', 0);
					balWithRevAut=checkFieldAvl1('//ITRForm:BalWithRevAuth/text()', 0);
					totLnAdv = checkFieldAvl1('//ITRForm:TotLoanAdv/text()', 0);
					totalCurrAssetLoanAdv=checkFieldAvl1('//ITRForm:TotCurrAssetLoanAdv/text()', 0);
					sunCred = checkFieldAvl1('//ITRForm:SundryCred/text()', 0);
					liaLeasAsset = checkFieldAvl1('//ITRForm:LiabForLeasedAsset/text()', 0);
					accrLeaAsset = checkFieldAvl1('//ITRForm:AccrIntonLeasedAsset/text()', 0);
					accIntNoDue = checkFieldAvl1('//ITRForm:AccrIntNotDue/text()', 0);
					totCurrLiab=checkFieldAvl1('//ITRForm:TotCurrLiabilities/text()', 0);
					wTProv=checkFieldAvl1('//ITRForm:WTProvision/text()', 0);
					iTProv=checkFieldAvl1('//ITRForm:ITProvision/text()', 0);
					eLS=checkFieldAvl1('//ITRForm:ELSuperAnnGratProvision/text()', 0);
					othProv =checkFieldAvl1('//ITRForm:OthProvision/text()', 0);
					totProvisions = checkFieldAvl1('//ITRForm:TotProvisions/text()', 0);
					totCurrLiabProv=checkFieldAvl1('//ITRForm:TotCurrLiabilitiesProvision/text()', 0);
					netCurAsset=checkFieldAvl1('//ITRForm:NetCurrAsset/text()', 0);
					miscExp = checkFieldAvl1('//ITRForm:MiscExpndr/text()', 0);
					defTaxAss = checkFieldAvl1('//ITRForm:DefTaxAsset/text()', 0);
					accLosses = checkFieldAvl1('//ITRForm:AccumaltedLosses/text()', 0);
					totMscAdjust=checkFieldAvl1('//ITRForm:TotMiscAdjust/text()', 0);
					totFundApp=checkFieldAvl1('//ITRForm:TotFundApply/text()', 0);
					totSunDbtAmt = checkFieldAvl1('//ITRForm:TotSundryDbtAmt/text()', 0);
					totSunCrAmt = checkFieldAvl1('//ITRForm:TotSundryCrdAmt/text()', 0);
					totSktTradAmt = checkFieldAvl1('//ITRForm:TotStkInTradAmt/text()', 0);
					cashBalAmt = checkFieldAvl1('//ITRForm:CashBalAmt/text()', 0);


			}

			else{
				console.log('Not ITR-4 or ITR-3 ');
			}


			}

			catch(e){

					}
			}


			else{
				console.log('No data found');
			}



			}

	else {
		var data =  fs.readFileSync(FilePaths[0]);
		if (data) {
			console.log('Original found');
			try {
					const doc = new dom().parseFromString(data.toString());
                    const select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master'})
					formname1 = checkFieldAvl1('//ITRForm:FormName/text()', 0);
					assyear = checkFieldAvl1('//ITRForm:AssessmentYear/text()',0);

				if((formname1 == 'ITR-4') && (assyear == 2014 || assyear == 2015 || assyear == 2016 ) || (formname1 == 'ITR-3' && assyear == 2017 )){
					fNmae= checkFieldAvl1('//ITRForm:FirstName/text()', 0);
					try{
							//mName= checkFieldAvl('//ITRForm:MiddleName/text()',0);
							mName = select('//ITRForm:MiddleName/text()', doc)[0].nodeValue;
					}
					catch(e){
						mName = ' ';
					}
					surNameOrgName=fNmae+' '+mName+' '+checkFieldAvl1('//ITRForm:SurNameOrOrgName/text()', 0);
					pan= checkFieldAvl1('//ITRForm:PAN/text()', 0);
					returntyp= checkFieldAvl1('//ITRForm:ReturnType/text()', 0);
					proCap = checkFieldAvl1('//ITRForm:PropCap/text()', 0);
					revReserv= checkFieldAvl1('//ITRForm:RevResr/text()', 0);
					capReserv=checkFieldAvl1('//ITRForm:CapResr/text()', 0);
					statReserv=checkFieldAvl1('//ITRForm:StatResr/text()', 0);
					othReserv=checkFieldAvl1('//ITRForm:OthResr/text()', 0);
					totalResSurp = checkFieldAvl1('//ITRForm:TotResrNSurp/text()', 0);
					totalPropFund=checkFieldAvl1('//ITRForm:TotPropFund/text()', 0);
					forCurLoan = checkFieldAvl1('//ITRForm:ForeignCurrLoan/text()', 0);
					rupeeLn = checkFieldAvl1('//ITRForm:FrmBank/text()', 0);
					rupeeLnoth =  checkFieldAvl1('//ITRForm:FrmOthrs/text()', 0); //
					totalRupeeLoan=checkFieldAvl1('//ITRForm:TotRupeeLoan/text()', 0);
					totalSecrLoan=checkFieldAvl1('//ITRForm:TotSecrLoan/text()', 0);
					unSecLn = checkFieldAvl1('//ITRForm:FrmBank/text()', 1);
					unSecLnOther = checkFieldAvl1('//ITRForm:FrmOthrs/text()', 1);
					totalUnSecrLoan =checkFieldAvl1('//ITRForm:TotUnSecrLoan/text()', 0);
					totalLoanFund=checkFieldAvl1('//ITRForm:TotLoanFund/text()', 0);
					defTax = checkFieldAvl1('//ITRForm:DeferredTax/text()', 0);
					totalFundSrc=checkFieldAvl1('//ITRForm:TotFundSrc/text()', 0);
					grsBlk = checkFieldAvl1('//ITRForm:GrossBlock/text()', 0);
					depreciat = checkFieldAvl1('//ITRForm:Depreciation/text()', 0);
					netBlk =checkFieldAvl1('//ITRForm:NetBlock/text()', 0);
					capWrkPrg = checkFieldAvl1('//ITRForm:CapWrkProg/text()', 0);
					totalFixedAsset=checkFieldAvl1('//ITRForm:TotFixedAsset/text()', 0);
					govtOthSecQuot  =checkFieldAvl1('//ITRForm:GovtOthSecQuoted/text()', 0);
					govOthSecUnQuot =checkFieldAvl1('//ITRForm:GovOthSecUnQoted/text()', 0);
					totLngTermInv = checkFieldAvl1('//ITRForm:TotLongTermInv/text()', 0);
					equiShares=checkFieldAvl1('//ITRForm::EquityShares/text()', 0);
					prefShares =checkFieldAvl1('//ITRForm:PreferShares/text()', 0);
					debentr =checkFieldAvl1('//ITRForm:Debenture/text()', 0);
					totTraInv = checkFieldAvl1('//ITRForm:TotTradeInv/text()', 0);
					totalInvestments =checkFieldAvl1('//ITRForm:TotInvestments/text()', 0);
					storesConsum=checkFieldAvl1('//ITRForm:StoresConsumables/text()', 0);
					rawMat=checkFieldAvl1('//ITRForm:RawMatl/text()', 0);
					stkInProc=checkFieldAvl1('//ITRForm:StkInProcess/text()', 0);
					finOrTrdGood =checkFieldAvl1('//ITRForm:FinOrTradGood/text()', 0);
					totInventries = checkFieldAvl1('//ITRForm:TotInventries/text()', 0);
					sndryDeb = checkFieldAvl1('//ITRForm:SndryDebtors/text()', 0);
					casinHand =checkFieldAvl1('//ITRForm:CashinHand/text()', 0);
					bankBalc=checkFieldAvl1('//ITRForm:BankBal/text()', 0);
					totCashBankBal = checkFieldAvl1('//ITRForm:TotCashOrBankBal/text()', 0);
					othCurAsset = checkFieldAvl1('//ITRForm:OthCurrAsset/text()', 0);
					totalCurrAsset=checkFieldAvl1('//ITRForm:TotCurrAsset/text()', 0);
					advRecov=checkFieldAvl1('//ITRForm:AdvRecoverable/text()', 0);
					deposit=checkFieldAvl1('//ITRForm::Deposits/text()', 0);
					balWithRevAut=checkFieldAvl1('//ITRForm:BalWithRevAuth/text()', 0);
					totLnAdv = checkFieldAvl1('//ITRForm:TotLoanAdv/text()', 0);
					totalCurrAssetLoanAdv=checkFieldAvl1('//ITRForm:TotCurrAssetLoanAdv/text()', 0);
					sunCred = checkFieldAvl1('//ITRForm:SundryCred/text()', 0);
					liaLeasAsset = checkFieldAvl1('//ITRForm:LiabForLeasedAsset/text()', 0);
					accrLeaAsset = checkFieldAvl1('//ITRForm:AccrIntonLeasedAsset/text()', 0);
					accIntNoDue = checkFieldAvl1('//ITRForm:AccrIntNotDue/text()', 0);
					totCurrLiab=checkFieldAvl1('//ITRForm:TotCurrLiabilities/text()', 0);
					wTProv=checkFieldAvl1('//ITRForm:WTProvision/text()', 0);
					iTProv=checkFieldAvl1('//ITRForm:ITProvision/text()', 0);
					eLS=checkFieldAvl1('//ITRForm:ELSuperAnnGratProvision/text()', 0);
					othProv =checkFieldAvl1('//ITRForm:OthProvision/text()', 0);
					totProvisions = checkFieldAvl1('//ITRForm:TotProvisions/text()', 0);
					totCurrLiabProv=checkFieldAvl1('//ITRForm:TotCurrLiabilitiesProvision/text()', 0);
					netCurAsset=checkFieldAvl1('//ITRForm:NetCurrAsset/text()', 0);
					miscExp = checkFieldAvl1('//ITRForm:MiscExpndr/text()', 0);
					defTaxAss = checkFieldAvl1('//ITRForm:DefTaxAsset/text()', 0);
					accLosses = checkFieldAvl1('//ITRForm:AccumaltedLosses/text()', 0);
					totMscAdjust=checkFieldAvl1('//ITRForm:TotMiscAdjust/text()', 0);
					totFundApp=checkFieldAvl1('//ITRForm:TotFundApply/text()', 0);
					totSunDbtAmt = checkFieldAvl1('//ITRForm:TotSundryDbtAmt/text()', 0);
					totSunCrAmt = checkFieldAvl1('//ITRForm:TotSundryCrdAmt/text()', 0);
					totSktTradAmt = checkFieldAvl1('//ITRForm:TotStkInTradAmt/text()', 0);
					cashBalAmt = checkFieldAvl1('//ITRForm:CashBalAmt/text()', 0);
				}


				else{
					//console.log('Not ITR-4');
				}
					}
						catch(e){

						}
			}
			else{
				console.log('No data found');
			}


	}
				function checkFieldAvl1(FieldName,integer){
							try{
								const doc = new dom().parseFromString(data.toString());
								const select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master'});
								let value = select(FieldName, doc)[integer].nodeValue
								//console.log(value);
								return value;
							}
							catch(e){
								//console.log('error in field ' + e)
								let value = 0;
								return value;
							}

						}
						              var bsDtls = [];
									  var header=[];

				if((formname1 == 'ITR-3') && (assyear == 2017) ){

							bsDtls = {
								bsitr3_OrgName:surNameOrgName,
								bsitr3_pan:pan,
								bsitr3_itr_form:formname1,
							    bsitr3_ay:assyear,
								bsitr3_form_type:returntyp,
								bsitr3_share_capital:proCap,
								bsitr3_ressurplus_reval: revReserv,
								bsitr3_ressurplus_capital: capReserv,
								bsitr3_ressurplus_stat: statReserv,
								bsitr3_ressurplus_othres: othReserv,
							    bsitr3_ressurplus_total: totalResSurp,
								bsitr3_shareholder_fund_total:totalPropFund,
							    bsitr3_sec_loan_forcur: forCurLoan,
								bsitr3_sec_loan_rup_banks: rupeeLn,
								bsitr3_sec_loan_rup_others:rupeeLnoth,
								bsitr3_sec_loan_rup_total: totalRupeeLoan,
								bsitr3_sec_loan_total: totalSecrLoan,
						        bsitr3_unsec_loan_banks: unSecLn,
								bsitr3_unsec_loan_banks: unSecLnOther,
								bsitr3_unsec_loan_banks : totalUnSecrLoan,
								bsitr3_loans_total: totalLoanFund,
								bsitr3_deferred_tax_liab: defTax,
								bsitr3_source_of_funds:totalFundSrc,
								bsitr3_fixasset_gross_block: grsBlk,
								bsitr3_fixasset_depreciation: depreciat,
								bsitr3_fixasset_net_block:netBlk,
								bsitr3_fixasset_cap_wip: capWrkPrg,
								bsitr3_fixasset_total: totalFixedAsset,
								bsitr3_Invest_lt_quoted: govtOthSecQuot,
							    bsitr3_Invest_lt_unquoted:govOthSecUnQuot,
								bsitr3_Invest_lt_total: totLngTermInv,
								bsitr3_Invest_st_eq_shares:equiShares,
								bsitr3_Invest_st_pref_shares:prefShares,
								bsitr3_Invest_st_deben:debentr,
                                bsitr3_Invest_st_total: totTraInv,
								bsitr3_Invest_total: totalInvestments,
								bsitr3_cur_asset_inv_stores: storesConsum,
								bsitr3_cur_asset_inv_rawmat: rawMat,
								bsitr3_cur_asset_inv_stockinproc: stkInProc,
								bsitr3_cur_asset_inv_fingoods: finOrTrdGood ,
                                bsitr3_cur_asset_inv_total: totInventries,
								bsitr3_cur_asset_debtors: sndryDeb,
								bsitr3_cur_asset_cash: casinHand,
								bsitr3_cur_asset_bank: bankBalc,
							    bsitr3_cur_asset_cashbank_total: totCashBankBal,
								bsitr3_cur_asset_othercurasset: othCurAsset,
								bsitr3_cur_asset_total: totalCurrAsset,
								bsitr3_loan_adv_recover_incash: advRecov,
								bsitr3_loan_adv_other_deploanadv: deposit,
								bsitr3_loan_adv_revauth: balWithRevAut,
								bsitr3_loan_adv_total: totLnAdv,
								bsitr3_cur_asset_loan_adv_total: totalCurrAssetLoanAdv,
								bsitr3_cur_liab_suncreditors: sunCred,
								bsitr3_cur_liab_leasedasset: liaLeasAsset,
								bsitr3_cur_liab_intaccrued: accrLeaAsset,
								bsitr3_cur_liab_intaccruednotdue: accIntNoDue,
								bsitr3_cur_liab_total: totCurrLiab,
								bsitr3_prov_inctax: iTProv,
								bsitr3_prov_wealthtax: wTProv,
								bsitr3_prov_leave_grat: eLS,
								bsitr3_prov_others: othProv,
								bsitr3_prov_total: totProvisions,
								bsitr3_cur_liab_prov_total: totCurrLiabProv,
								bsitr3_net_cur_asset_total: netCurAsset,
                                bsitr3_misc_exp_notwoff: miscExp,
								bsitr3_deferred_tax_asset: defTaxAss,
								bsitr3_pl_accum_bal: accLosses,            //bsitr3_p&l_accum_bal
								bsitr3_expenditure_total: totMscAdjust,
								bsitr3_application_of_funds:totFundApp,
								bsitr3_nobooks_sundrydebtor: totSunDbtAmt,
								bsitr3_nobooks_sundrycreditor: totSunCrAmt,
								bsitr3_nobooks_stock: totSktTradAmt,
								bsitr3_nobooks_cash: cashBalAmt,
							};


              //console.log(bsDtls);
			  header = [
			                    'bsitr3_OrgName',
								'bsitr3_pan',
								'bsitr3_itr_form',
							    'bsitr3_ay',
								'bsitr3_form_type',
								'bsitr3_share_capital',
								'bsitr3_ressurplus_reval',
								'bsitr3_ressurplus_capital',
								'bsitr3_ressurplus_stat',
								'bsitr3_ressurplus_othres',
							    'bsitr3_ressurplus_total',
								'bsitr3_shareholder_fund_total',
							    'bsitr3_sec_loan_forcur',
								'bsitr3_sec_loan_rup_banks',
								'bsitr3_sec_loan_rup_others',
								'bsitr3_sec_loan_rup_total',
								'bsitr3_sec_loan_total',
						        'bsitr3_unsec_loan_banks',
								'bsitr3_unsec_loan_banks',
								'bsitr3_unsec_loan_banks',
								'bsitr3_loans_total',
								'bsitr3_deferred_tax_liab',
								'bsitr3_source_of_funds',
								'bsitr3_fixasset_gross_block',
								'bsitr3_fixasset_depreciation',
								'bsitr3_fixasset_net_block',
								'bsitr3_fixasset_cap_wip',
								'bsitr3_fixasset_total',
								'bsitr3_Invest_lt_quoted',
							    'bsitr3_Invest_lt_unquoted',
								'bsitr3_Invest_lt_total',
								'bsitr3_Invest_st_eq_shares',
								'bsitr3_Invest_st_pref_shares',
								'bsitr3_Invest_st_deben',
                                'bsitr3_Invest_st_total',
								'bsitr3_Invest_total',
								'bsitr3_cur_asset_inv_stores',
								'bsitr3_cur_asset_inv_rawmat',
								'bsitr3_cur_asset_inv_stockinproc',
								'bsitr3_cur_asset_inv_fingoods',
                                'bsitr3_cur_asset_inv_total',
								'bsitr3_cur_asset_debtors',
								'bsitr3_cur_asset_cash',
								'bsitr3_cur_asset_bank',
							    'bsitr3_cur_asset_cashbank_total',
								'bsitr3_cur_asset_othercurasset',
								'bsitr3_cur_asset_total',
								'bsitr3_loan_adv_recover_incash',
								'bsitr3_loan_adv_other_deploanadv',
								'bsitr3_loan_adv_revauth',
								'bsitr3_loan_adv_total',
								'bsitr3_cur_asset_loan_adv_total',
								'bsitr3_cur_liab_suncreditors',
								'bsitr3_cur_liab_leasedasset',
								'bsitr3_cur_liab_intaccrued',
								'bsitr3_cur_liab_intaccruednotdue',
								'bsitr3_cur_liab_total',
								'bsitr3_prov_inctax',
								'bsitr3_prov_wealthtax',
								'bsitr3_prov_leave_grat',
								'bsitr3_prov_others',
								'bsitr3_prov_total',
								'bsitr3_cur_liab_prov_total',
								'bsitr3_net_cur_asset_total',
                                'bsitr3_misc_exp_notwoff',
								'bsitr3_deferred_tax_asset',
								'bsitr3_pl_accum_bal',
								'bsitr3_expenditure_total',
								'bsitr3_application_of_funds',
								'bsitr3_nobooks_sundrydebtor',
								'bsitr3_nobooks_sundrycreditor',
								'bsitr3_nobooks_stock',
								'bsitr3_nobooks_cash'



			  ];


		  }

		else if((formname1 == 'ITR-4') && (assyear == 2014||assyear == 2015||assyear == 2016) ){

			bsDtls = {

				                bsitr4_OrgName:surNameOrgName,
								bsitr4_pan:pan,
								bsitr4_itr_form:formname1,
							    bsitr4_ay:assyear,
								bsitr4_form_type:returntyp,
								bsitr4_share_capital:proCap,
								bsitr4_ressurplus_reval: revReserv,
								bsitr4_ressurplus_capital: capReserv,
								bsitr4_ressurplus_stat: statReserv,
								bsitr4_ressurplus_othres: othReserv,
							    bsitr4_ressurplus_total: totalResSurp,
								bsitr4_shareholder_fund_total:totalPropFund,
							    bsitr4_sec_loan_forcur: forCurLoan,
								bsitr4_sec_loan_rup_banks: rupeeLn,
								bsitr4_sec_loan_rup_others:rupeeLnoth,
								bsitr4_sec_loan_rup_total: totalRupeeLoan,
								bsitr4_sec_loan_total: totalSecrLoan,
						        bsitr4_unsec_loan_banks: unSecLn,
								bsitr4_unsec_loan_banks: unSecLnOther,
								bsitr4_unsec_loan_banks : totalUnSecrLoan,
								bsitr4_loans_total: totalLoanFund,
								bsitr4_deferred_tax_liab: defTax,
								bsitr4_source_of_funds:totalFundSrc,
								bsitr4_fixasset_gross_block: grsBlk,
								bsitr4_fixasset_depreciation: depreciat,
								bsitr4_fixasset_net_block:netBlk,
								bsitr4_fixasset_cap_wip: capWrkPrg,
								bsitr4_fixasset_total: totalFixedAsset,
								bsitr4_Invest_lt_quoted: govtOthSecQuot,
							    bsitr4_Invest_lt_unquoted:govOthSecUnQuot,
								bsitr4_Invest_lt_total: totLngTermInv,
								bsitr4_Invest_st_eq_shares:equiShares,
								bsitr4_Invest_st_pref_shares:prefShares,
								bsitr4_Invest_st_deben:debentr,
                                bsitr4_Invest_st_total: totTraInv,
								bsitr4_Invest_total: totalInvestments,
								bsitr4_cur_asset_inv_stores: storesConsum,
								bsitr4_cur_asset_inv_rawmat: rawMat,
								bsitr4_cur_asset_inv_stockinproc: stkInProc,
								bsitr4_cur_asset_inv_fingoods: finOrTrdGood ,
                                bsitr4_cur_asset_inv_total: totInventries,
								bsitr4_cur_asset_debtors: sndryDeb,
								bsitr4_cur_asset_cash: casinHand,
								bsitr4_cur_asset_bank: bankBalc,
							    bsitr4_cur_asset_cashbank_total: totCashBankBal,
								bsitr4_cur_asset_othercurasset: othCurAsset,
								bsitr4_cur_asset_total: totalCurrAsset,
								bsitr4_loan_adv_recover_incash: advRecov,
								bsitr4_loan_adv_other_deploanadv: deposit,
								bsitr4_loan_adv_revauth: balWithRevAut,
								bsitr4_loan_adv_total: totLnAdv,
								bsitr4_cur_asset_loan_adv_total: totalCurrAssetLoanAdv,
								bsitr4_cur_liab_suncreditors: sunCred,
								bsitr4_cur_liab_leasedasset: liaLeasAsset,
								bsitr4_cur_liab_intaccrued: accrLeaAsset,
								bsitr4_cur_liab_intaccruednotdue: accIntNoDue,
								bsitr4_cur_liab_total: totCurrLiab,
								bsitr4_prov_inctax: iTProv,
								bsitr4_prov_wealthtax: wTProv,
								bsitr4_prov_leave_grat: eLS,
								bsitr4_prov_others: othProv,
								bsitr4_prov_total: totProvisions,
								bsitr4_cur_liab_prov_total: totCurrLiabProv,
								bsitr4_net_cur_asset_total: netCurAsset,
                                bsitr4_misc_exp_notwoff: miscExp,
								bsitr4_deferred_tax_asset: defTaxAss,
								bsitr4_pl_accum_bal: accLosses,            //bsitr3_p&l_accum_bal
								bsitr4_expenditure_total: totMscAdjust,
								bsitr4_application_of_funds:totFundApp,
								bsitr4_nobooks_sundrydebtor: totSunDbtAmt,
								bsitr4_nobooks_sundrycreditor: totSunCrAmt,
								bsitr4_nobooks_stock: totSktTradAmt,
								bsitr4_nobooks_cash: cashBalAmt,
							};


              //console.log(bsDtls);
			 header = [ 'bsitr4_OrgName','bsitr4_pan','bsitr4_itr_form', 'bsitr4_ay','bsitr4_form_type','bsitr4_share_capital','bsitr4_ressurplus_reval','bsitr4_ressurplus_capital','bsitr4_ressurplus_stat','bsitr4_ressurplus_othres', 'bsitr4_ressurplus_total','bsitr4_shareholder_fund_total', 'bsitr4_sec_loan_forcur','bsitr4_sec_loan_rup_banks','bsitr4_sec_loan_rup_others','bsitr4_sec_loan_rup_total','bsitr4_sec_loan_total', 'bsitr4_unsec_loan_banks','bsitr4_unsec_loan_banks','bsitr4_unsec_loan_banks','bsitr4_loans_total','bsitr4_deferred_tax_liab','bsitr4_source_of_funds','bsitr4_fixasset_gross_block','bsitr4_fixasset_depreciation','bsitr4_fixasset_net_block','bsitr4_fixasset_cap_wip',
			 'bsitr4_fixasset_total','bsitr4_Invest_lt_quoted',' bsitr4_Invest_lt_unquoted','bsitr4_Invest_lt_total','bsitr4_Invest_st_eq_shares','bsitr4_Invest_st_pref_shares','bsitr4_Invest_st_deben','bsitr4_Invest_st_total','bsitr4_Invest_total','bsitr4_cur_asset_inv_stores','bsitr4_cur_asset_inv_rawmat',
			 'bsitr4_cur_asset_inv_stockinproc','bsitr4_cur_asset_inv_fingoods' ,'bsitr4_cur_asset_inv_total','bsitr4_cur_asset_debtors','bsitr4_cur_asset_cash','bsitr4_cur_asset_bank', 'bsitr4_cur_asset_cashbank_total','bsitr4_cur_asset_othercurasset','bsitr4_cur_asset_total','bsitr4_loan_adv_recover_incash','bsitr4_loan_adv_other_deploanadv','bsitr4_loan_adv_revauth','bsitr4_loan_adv_total','bsitr4_cur_asset_loan_adv_total','bsitr4_cur_liab_suncreditors','bsitr4_cur_liab_leasedasset','bsitr4_cur_liab_intaccrued','bsitr4_cur_liab_intaccruednotdue','bsitr4_cur_liab_total','bsitr4_prov_inctax','bsitr4_prov_wealthtax','bsitr4_prov_leave_grat','bsitr4_prov_others','bsitr4_prov_total',
			 'bsitr4_cur_liab_prov_total','bsitr4_net_cur_asset_total','bsitr4_misc_exp_notwoff','bsitr4_deferred_tax_asset','bsitr4_pl_accum_bal','bsitr4_expenditure_total','bsitr4_application_of_funds','bsitr4_nobooks_sundrydebtor','bsitr4_nobooks_sundrycreditor','bsitr4_nobooks_stock','bsitr4_nobooks_cash'
			 ];


		}

		else{console.log("no data found")}



		try {
                    const ffcsv = json2csv({
                        data: bsDtls,
                        fields: header
                    });
                    const fileEx = '.csv';
					const type = 'BSInd';
						if (ffcsv) {
						fs.writeFileSync(path1 + orderNo + path3 + '/' + pan + '_' + type + '_' + formname1 + '_' + assyear + fileEx, ffcsv);
					  // fs.writeFileSync(path1 + orderNo + "/"+ BscsvPath + '/' + pan + type + '_' + formname1 + fileEx, ffcsv);
						console.log('BS Individual convertion completed');
                    } else {

                    }
                } catch (e) {

				}

	}
};
