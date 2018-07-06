/* Source Code Header
Program Name	:	bs-Conversion.js
Module Name		:
Description  	:	In this program we are Extraction all the information from ITR source file and converting into CSV output files.

Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 07/02/2017
Created By		:	sekar
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		:	Revision Date:		Revised By		Details
1.1					07-02-2017			sekar
1.2					20-06-2017			Rahul			Added Extra field extraction for 2017
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
    BSConversion(ofilename, rfilename, year, orderNo, pullSeqNo) {
		const FilePaths = [];
       FilePaths[0] = path1 + orderNo + path2 + '/' + ofilename;
        FilePaths[1] = path1 + orderNo + path2 + '/' + rfilename;


        // console.log(ofilename, rfilename,year, orderNo,pullSeqNo);
		//FilePaths[0] = ofilename;
		//FilePaths[1] = rfilename;

	var proCap = [];
	var totalResSurp = [];
	var forCurLoan = [];
	var totOthInc = [];
	var defTax = [];
	var grsBlk = [];
	var depreciat = [];
	var capWrkPrg = [];
	var totLngTermInv = [];
	var totTraInv = [];
	var totInventries = [];
	var sndryDeb = [];
	var totCashBankBal = [];
	var othCurAsset = [];
	var totLnAdv = [];
	var sunCred = [];
	var liaLeasAsset = [];
	var accrLeaAsset =[];
	var accIntNoDue =[];
	var totProvisions = [];
	var miscExp = [];
	var defTaxAss = [];
	var accLosses = [];
	var totSunDbtAmt = [];
	var totSunCrAmt = [];
	var totSktTradAmt =[];
	var cashBalAmt = [];
	var rupeeLn = [];
	var unSecLn =[];
	var unSecLnOther = [];
	var formname1 = [];
	var assyear =[];

	//New varible names for 2017 extraction
	 var revReserv =[];
	var capReserv =[];
	var statReserv =[];
	var othReserv =[];
	var totalPropFund =[];
	var totalRupeeLoan =[];
	var totalSecrLoan =[];
	var totalUnSecrLoan =[];
	var totalLoanFund =[];
	var totalFundSrc =[];
	var netBlk =[];
	var totalFixedAsset =[];
	var govtOthSecQuot =[];
	var govOthSecUnQuot =[];
	var equiShares =[];
	var prefShares =[];
	var debentr =[];
	var totalInvestments =[];
	var storesConsum =[];
	var rawMat =[];
	var stkInProc =[];
	var finOrTrdGood =[];
	var casinHand =[];
	var bankBalc =[];
	var totalCurrAsset =[];
	var advRecov =[];
	var deposit =[];
	var balWithRevAut =[];
	var totalCurrAssetLoanAdv =[];
	var totCurrLiabilities =[];
	var iTProv =[];
	var wTProv =[];
	var eLS =[];
	var othProv =[];
	var totCurrLiab =[];
	var netCurAsset =[];
	var totMscAdjust =[];
	var totFundApp =[];
	var totCurrLiabProv=[];


	if( typeof rfilename != 'undefined'){
		console.log('revised file found');
		var data = fs.readFileSync(FilePaths[1]);
		if (data) {
			try {
					const doc = new dom().parseFromString(data.toString());
                    const select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master' })
					formname1 = checkFieldAvl1('//ITRForm:FormName/text()', 0);
					assyear = checkFieldAvl1('//ITRForm:AssessmentYear/text()',0);
				if((formname1 == 'ITR-4' || formname1 == 'ITR-4S') && (assyear == 2014 || assyear == 2015 || assyear == 2016 )){
					proCap = checkFieldAvl1('//ITRForm:PropCap/text()', 0);
					totalResSurp = checkFieldAvl1('//ITRForm:TotResrNSurp/text()', 0);
					forCurLoan = checkFieldAvl1('//ITRForm:ForeignCurrLoan/text()', 0);
					totOthInc = checkFieldAvl1('//ITRForm:FrmOthrs/text()', 0);
					defTax = checkFieldAvl1('//ITRForm:DeferredTax/text()', 0);
					grsBlk = checkFieldAvl1('//ITRForm:GrossBlock/text()', 0);
					depreciat = checkFieldAvl1('//ITRForm:Depreciation/text()', 0);
					capWrkPrg = checkFieldAvl1('//ITRForm:CapWrkProg/text()', 0);
					totLngTermInv = checkFieldAvl1('//ITRForm:TotLongTermInv/text()', 0);
					totTraInv = checkFieldAvl1('//ITRForm:TotTradeInv/text()', 0);
					totInventries = checkFieldAvl1('//ITRForm:TotInventries/text()', 0);
					sndryDeb = checkFieldAvl1('//ITRForm:SndryDebtors/text()', 0);
					totCashBankBal = checkFieldAvl1('//ITRForm:TotCashOrBankBal/text()', 0);
					othCurAsset = checkFieldAvl1('//ITRForm:OthCurrAsset/text()', 0);
					totLnAdv = checkFieldAvl1('//ITRForm:TotLoanAdv/text()', 0);
					sunCred = checkFieldAvl1('//ITRForm:SundryCred/text()', 0);
					liaLeasAsset = checkFieldAvl1('//ITRForm:LiabForLeasedAsset/text()', 0);
					accrLeaAsset = checkFieldAvl1('//ITRForm:AccrIntonLeasedAsset/text()', 0);
					accIntNoDue = checkFieldAvl1('//ITRForm:AccrIntNotDue/text()', 0);
					totProvisions = checkFieldAvl1('//ITRForm:TotProvisions/text()', 0);
					miscExp = checkFieldAvl1('//ITRForm:MiscExpndr/text()', 0);
					defTaxAss = checkFieldAvl1('//ITRForm:DefTaxAsset/text()', 0);
					accLosses = checkFieldAvl1('//ITRForm:AccumaltedLosses/text()', 0);
					totSunDbtAmt = checkFieldAvl1('//ITRForm:TotSundryDbtAmt/text()', 0);
					totSunCrAmt = checkFieldAvl1('//ITRForm:TotSundryCrdAmt/text()', 0);
					totSktTradAmt = checkFieldAvl1('//ITRForm:TotStkInTradAmt/text()', 0);
					cashBalAmt = checkFieldAvl1('//ITRForm:CashBalAmt/text()', 0);
					rupeeLn = checkFieldAvl1('//ITRForm:FrmBank/text()', 0);
					unSecLn = checkFieldAvl1('//ITRForm:FrmBank/text()', 1);
					unSecLnOther = checkFieldAvl1('//ITRForm:FrmOthrs/text()', 1);

					//New Fields Extraction
					revReserv =  checkFieldAvl1('//ITRForm:RevResr/text()',0);
					capReserv  =  checkFieldAvl1('//ITRForm:CapResr/text()',0);
					statReserv =  checkFieldAvl1('//ITRForm:StatResr/text()',0);
					//totResrNSurp = checkFieldAvl1('//ITRForm:TotResrNSurp/text()',0);
					othReserv = checkFieldAvl1('//ITRForm:OthResr/text()',0);
					totalPropFund =  checkFieldAvl1('//ITRForm:TotPropFund/text()',0);
					totalRupeeLoan= checkFieldAvl1('//ITRForm:TotRupeeLoan/text()',0);
					totalSecrLoan =  checkFieldAvl1('//ITRForm:TotSecrLoan/text()',0);
					totalUnSecrLoan =  checkFieldAvl1('//ITRForm:TotUnSecrLoan/text()',0);
					totalLoanFund =  checkFieldAvl1('//ITRForm:TotLoanFund/text()',0);
					totalFundSrc  = checkFieldAvl1('//ITRForm:TotFundSrc/text()',0);
					netBlk = checkFieldAvl1('//ITRForm:NetBlock/text()',0);
					totalFixedAsset= checkFieldAvl1('//ITRForm:TotFixedAsset/text()',0);
					govtOthSecQuot  = checkFieldAvl1('//ITRForm:GovtOthSecQuoted/text()',0);
					govOthSecUnQuot =  checkFieldAvl1('//ITRForm:GovOthSecUnQoted/text()',0);
					equiShares=  checkFieldAvl1('//ITRForm:EquityShares/text()',0);
					prefShares =  checkFieldAvl1('//ITRForm:PreferShares/text()',0);
					debentr =  checkFieldAvl1('//ITRForm:Debenture/text()',0);
					totalInvestments =  checkFieldAvl1('//ITRForm:TotInvestments/text()',0);
					storesConsum=  checkFieldAvl1('//ITRForm:StoresConsumables/text()',0);
					rawMat = checkFieldAvl1('//ITRForm:RawMatl/text()',0);
					stkInProc =  checkFieldAvl1('//ITRForm:StkInProcess/text()',0);
					finOrTrdGood = checkFieldAvl1('//ITRForm:FinOrTradGood/text()',0);
					casinHand  =  checkFieldAvl1('//ITRForm:CashinHand/text()',0);
					bankBalc = checkFieldAvl1('//ITRForm:BankBal/text()',0);
					totalCurrAsset=  checkFieldAvl1('//ITRForm:TotCurrAsset/text()',0);
					advRecov = checkFieldAvl1('//ITRForm:AdvRecoverable/text()',0);
					deposit = checkFieldAvl1('//ITRForm:Deposits/text()',0);
					balWithRevAut = checkFieldAvl1('//ITRForm:BalWithRevAuth/text()',0);
					totalCurrAssetLoanAdv =  checkFieldAvl1('//ITRForm:TotCurrAssetLoanAdv/text()',0);
					totCurrLiab=  checkFieldAvl1('//ITRForm:TotCurrLiabilities/text()',0);
					wTProv = checkFieldAvl1('//ITRForm:WTProvision/text()',0);
					iTProv=  checkFieldAvl1('//ITRForm:ITProvision/text()',0);
					eLS = checkFieldAvl1('//ITRForm:ELSuperAnnGratProvision/text()',0);
					othProv = checkFieldAvl1('//ITRForm:OthProvision/text()',0);
					totCurrLiabProv=  checkFieldAvl1('//ITRForm:TotCurrLiabilitiesProvision/text()',0)
					netCurAsset = checkFieldAvl1('//ITRForm:NetCurrAsset/text()',0);
					totMscAdjust  =  checkFieldAvl1('//ITRForm:TotMiscAdjust/text()',0);
					totFundApp =  checkFieldAvl1('//ITRForm:TotFundApply/text()',0);

					// revReserv=0;
					// capReserv=0;
					// statReserv=0;
					// othReserv=0;
					// totalPropFund=0;
					// totalRupeeLoan=0;
					// totalSecrLoan=0;
					// totalUnSecrLoan =0;
					// totalLoanFund=0;
					// totalFundSrc=0;
                    // netBlk =0;
					// totalFixedAsset=0;
					// govtOthSecQuot  =0;
					// govOthSecUnQuot =0;
					// equiShares=0;
					// prefShares =0;
					// debentr =0;
					// totalInvestments =0;
					// storesConsum=0;
					// rawMat=0;
					// stkInProc=0;
					// finOrTrdGood =0;
					// casinHand =0;
					// bankBalc=0;
					// totalCurrAsset=0;
					// advRecov=0;
					// deposit=0;
					// balWithRevAut=0;
					// totalCurrAssetLoanAdv=0;
					// totCurrLiab=0;
					// wTProv=0;
					// iTProv=0;
					// eLS=0;
					// othProv =0;
					// totCurrLiabProv=0;
					// netCurAsset=0;
					// totMscAdjust=0;
					// totFundApp=0;


			}
				else if( formname1 == 'ITR-3' && assyear == 2017){
					proCap = checkFieldAvl1('//ITRForm:PropCap/text()', 0);
					totalResSurp = checkFieldAvl1('//ITRForm:TotResrNSurp/text()', 0);
					forCurLoan = checkFieldAvl1('//ITRForm:ForeignCurrLoan/text()', 0);
					totOthInc = checkFieldAvl1('//ITRForm:FrmOthrs/text()', 0);
					defTax = checkFieldAvl1('//ITRForm:DeferredTax/text()', 0);
					grsBlk = checkFieldAvl1('//ITRForm:GrossBlock/text()', 0);
					depreciat = checkFieldAvl1('//ITRForm:Depreciation/text()', 0);
					capWrkPrg = checkFieldAvl1('//ITRForm:CapWrkProg/text()', 0);
					totLngTermInv = checkFieldAvl1('//ITRForm:TotLongTermInv/text()', 0);
					totTraInv = checkFieldAvl1('//ITRForm:TotTradeInv/text()', 0);
					totInventries = checkFieldAvl1('//ITRForm:TotInventries/text()', 0);
					sndryDeb = checkFieldAvl1('//ITRForm:SndryDebtors/text()', 0);
					totCashBankBal = checkFieldAvl1('//ITRForm:TotCashOrBankBal/text()', 0);
					othCurAsset = checkFieldAvl1('//ITRForm:OthCurrAsset/text()', 0);
					totLnAdv = checkFieldAvl1('//ITRForm:TotLoanAdv/text()', 0);
					sunCred = checkFieldAvl1('//ITRForm:SundryCred/text()', 0);
					liaLeasAsset = checkFieldAvl1('//ITRForm:LiabForLeasedAsset/text()', 0);
					accrLeaAsset = checkFieldAvl1('//ITRForm:AccrIntonLeasedAsset/text()', 0);
					accIntNoDue = checkFieldAvl1('//ITRForm:AccrIntNotDue/text()', 0);
					totProvisions = checkFieldAvl1('//ITRForm:TotProvisions/text()', 0);
					miscExp = checkFieldAvl1('//ITRForm:MiscExpndr/text()', 0);
					defTaxAss = checkFieldAvl1('//ITRForm:DefTaxAsset/text()', 0);
					accLosses = checkFieldAvl1('//ITRForm:AccumaltedLosses/text()', 0);
					totSunDbtAmt = checkFieldAvl1('//ITRForm:TotSundryDbtAmt/text()', 0);
					totSunCrAmt = checkFieldAvl1('//ITRForm:TotSundryCrdAmt/text()', 0);
					totSktTradAmt = checkFieldAvl1('//ITRForm:TotStkInTradAmt/text()', 0);
					cashBalAmt = checkFieldAvl1('//ITRForm:CashBalAmt/text()', 0);
					rupeeLn = checkFieldAvl1('//ITRForm:FrmBank/text()', 0);
					unSecLn = checkFieldAvl1('//ITRForm:FrmBank/text()', 1);
					unSecLnOther = checkFieldAvl1('//ITRForm:FrmOthrs/text()', 1);

					//New Fields Extraction
					revReserv =  checkFieldAvl1('//ITRForm:RevResr/text()',0);
					capReserv  =  checkFieldAvl1('//ITRForm:CapResr/text()',0);
					statReserv =  checkFieldAvl1('//ITRForm:StatResr/text()',0);
					//totResrNSurp = checkFieldAvl1('//ITRForm:TotResrNSurp/text()',0);
					othReserv = checkFieldAvl1('//ITRForm:OthResr/text()',0);
					totalPropFund =  checkFieldAvl1('//ITRForm:TotPropFund/text()',0);
					totalRupeeLoan= checkFieldAvl1('//ITRForm:TotRupeeLoan/text()',0);
					totalSecrLoan =  checkFieldAvl1('//ITRForm:TotSecrLoan/text()',0);
					totalUnSecrLoan =  checkFieldAvl1('//ITRForm:TotUnSecrLoan/text()',0);
					totalLoanFund =  checkFieldAvl1('//ITRForm:TotLoanFund/text()',0);
					totalFundSrc  = checkFieldAvl1('//ITRForm:TotFundSrc/text()',0);
					netBlk = checkFieldAvl1('//ITRForm:NetBlock/text()',0);
					totalFixedAsset= checkFieldAvl1('//ITRForm:TotFixedAsset/text()',0);
					govtOthSecQuot  = checkFieldAvl1('//ITRForm:GovtOthSecQuoted/text()',0);
					govOthSecUnQuot =  checkFieldAvl1('//ITRForm:GovOthSecUnQoted/text()',0);
					equiShares=  checkFieldAvl1('//ITRForm:EquityShares/text()',0);
					prefShares =  checkFieldAvl1('//ITRForm:PreferShares/text()',0);
					debentr =  checkFieldAvl1('//ITRForm:Debenture/text()',0);
					totalInvestments =  checkFieldAvl1('//ITRForm:TotInvestments/text()',0);
					storesConsum=  checkFieldAvl1('//ITRForm:StoresConsumables/text()',0);
					rawMat = checkFieldAvl1('//ITRForm:RawMatl/text()',0);
					stkInProc =  checkFieldAvl1('//ITRForm:StkInProcess/text()',0);
					finOrTrdGood = checkFieldAvl1('//ITRForm:FinOrTradGood/text()',0);
					casinHand  =  checkFieldAvl1('//ITRForm:CashinHand/text()',0);
					bankBalc = checkFieldAvl1('//ITRForm:BankBal/text()',0);
					totalCurrAsset=  checkFieldAvl1('//ITRForm:TotCurrAsset/text()',0);
					advRecov = checkFieldAvl1('//ITRForm:AdvRecoverable/text()',0);
					deposit = checkFieldAvl1('//ITRForm:Deposits/text()',0);
					balWithRevAut = checkFieldAvl1('//ITRForm:BalWithRevAuth/text()',0);
					totalCurrAssetLoanAdv =  checkFieldAvl1('//ITRForm:TotCurrAssetLoanAdv/text()',0);
					totCurrLiab=  checkFieldAvl1('//ITRForm:TotCurrLiabilities/text()',0);
					wTProv = checkFieldAvl1('//ITRForm:WTProvision/text()',0);
					iTProv=  checkFieldAvl1('//ITRForm:ITProvision/text()',0);
					eLS = checkFieldAvl1('//ITRForm:ELSuperAnnGratProvision/text()',0);
					othProv = checkFieldAvl1('//ITRForm:OthProvision/text()',0);
					totCurrLiabProv=  checkFieldAvl1('//ITRForm:TotCurrLiabilitiesProvision/text()',0)
					netCurAsset = checkFieldAvl1('//ITRForm:NetCurrAsset/text()',0);
					totMscAdjust  =  checkFieldAvl1('//ITRForm:TotMiscAdjust/text()',0);
					totFundApp =  checkFieldAvl1('//ITRForm:TotFundApply/text()',0);

				}
			else{
				console.log('Not ITR-4');
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
                    const select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master' })
					formname1 = checkFieldAvl1('//ITRForm:FormName/text()', 0);
					assyear = checkFieldAvl1('//ITRForm:AssessmentYear/text()',0);

				if((formname1 == 'ITR-4' || formname1 == 'ITR-4S') && (assyear == 2014 || assyear == 2015 || assyear == 2016 )){
					proCap = checkFieldAvl1('//ITRForm:PropCap/text()', 0);
					console.log(formname1,assyear,proCap);
					totalResSurp = checkFieldAvl1('//ITRForm:TotResrNSurp/text()', 0);
					forCurLoan = checkFieldAvl1('//ITRForm:ForeignCurrLoan/text()', 0);
					totOthInc = checkFieldAvl1('//ITRForm:FrmOthrs/text()', 0);
					defTax = checkFieldAvl1('//ITRForm:DeferredTax/text()', 0);
					grsBlk = checkFieldAvl1('//ITRForm:GrossBlock/text()', 0);
					depreciat = checkFieldAvl1('//ITRForm:Depreciation/text()', 0);
					capWrkPrg = checkFieldAvl1('//ITRForm:CapWrkProg/text()', 0);
					totLngTermInv = checkFieldAvl1('//ITRForm:TotLongTermInv/text()', 0);
					totTraInv = checkFieldAvl1('//ITRForm:TotTradeInv/text()', 0);
					totInventries = checkFieldAvl1('//ITRForm:TotInventries/text()', 0);
					sndryDeb = checkFieldAvl1('//ITRForm:SndryDebtors/text()', 0);
					totCashBankBal = checkFieldAvl1('//ITRForm:TotCashOrBankBal/text()', 0);
					othCurAsset = checkFieldAvl1('//ITRForm:OthCurrAsset/text()', 0);
					totLnAdv = checkFieldAvl1('//ITRForm:TotLoanAdv/text()', 0);
					sunCred = checkFieldAvl1('//ITRForm:SundryCred/text()', 0);
					liaLeasAsset = checkFieldAvl1('//ITRForm:LiabForLeasedAsset/text()', 0);
					accrLeaAsset = checkFieldAvl1('//ITRForm:AccrIntonLeasedAsset/text()', 0);
					accIntNoDue = checkFieldAvl1('//ITRForm:AccrIntNotDue/text()', 0);
					totProvisions = checkFieldAvl1('//ITRForm:TotProvisions/text()', 0);
					miscExp = checkFieldAvl1('//ITRForm:MiscExpndr/text()', 0);
					defTaxAss = checkFieldAvl1('//ITRForm:DefTaxAsset/text()', 0);
					accLosses = checkFieldAvl1('//ITRForm:AccumaltedLosses/text()', 0);
					totSunDbtAmt = checkFieldAvl1('//ITRForm:TotSundryDbtAmt/text()', 0);
					totSunCrAmt = checkFieldAvl1('//ITRForm:TotSundryCrdAmt/text()', 0);
					totSktTradAmt = checkFieldAvl1('//ITRForm:TotStkInTradAmt/text()', 0);
					cashBalAmt = checkFieldAvl1('//ITRForm:CashBalAmt/text()', 0);
					rupeeLn = checkFieldAvl1('//ITRForm:FrmBank/text()', 0);
					unSecLn = checkFieldAvl1('//ITRForm:FrmBank/text()', 1);
					unSecLnOther = checkFieldAvl1('//ITRForm:FrmOthrs/text()', 1);

					//New Fields Extraction
					revReserv =  checkFieldAvl1('//ITRForm:RevResr/text()',0);
					capReserv  =  checkFieldAvl1('//ITRForm:CapResr/text()',0);
					statReserv =  checkFieldAvl1('//ITRForm:StatResr/text()',0);
					//totResrNSurp = checkFieldAvl1('//ITRForm:TotResrNSurp/text()',0);
					othReserv = checkFieldAvl1('//ITRForm:OthResr/text()',0);
					totalPropFund =  checkFieldAvl1('//ITRForm:TotPropFund/text()',0);
					totalRupeeLoan= checkFieldAvl1('//ITRForm:TotRupeeLoan/text()',0);
					totalSecrLoan =  checkFieldAvl1('//ITRForm:TotSecrLoan/text()',0);
					totalUnSecrLoan =  checkFieldAvl1('//ITRForm:TotUnSecrLoan/text()',0);
					totalLoanFund =  checkFieldAvl1('//ITRForm:TotLoanFund/text()',0);
					totalFundSrc  = checkFieldAvl1('//ITRForm:TotFundSrc/text()',0);
					netBlk = checkFieldAvl1('//ITRForm:NetBlock/text()',0);
					totalFixedAsset= checkFieldAvl1('//ITRForm:TotFixedAsset/text()',0);
					govtOthSecQuot  = checkFieldAvl1('//ITRForm:GovtOthSecQuoted/text()',0);
					govOthSecUnQuot =  checkFieldAvl1('//ITRForm:GovOthSecUnQoted/text()',0);
					equiShares=  checkFieldAvl1('//ITRForm:EquityShares/text()',0);
					prefShares =  checkFieldAvl1('//ITRForm:PreferShares/text()',0);
					debentr =  checkFieldAvl1('//ITRForm:Debenture/text()',0);
					totalInvestments =  checkFieldAvl1('//ITRForm:TotInvestments/text()',0);
					storesConsum=  checkFieldAvl1('//ITRForm:StoresConsumables/text()',0);
					rawMat = checkFieldAvl1('//ITRForm:RawMatl/text()',0);
					stkInProc =  checkFieldAvl1('//ITRForm:StkInProcess/text()',0);
					finOrTrdGood = checkFieldAvl1('//ITRForm:FinOrTradGood/text()',0);
					casinHand  =  checkFieldAvl1('//ITRForm:CashinHand/text()',0);
					bankBalc = checkFieldAvl1('//ITRForm:BankBal/text()',0);
					totalCurrAsset=  checkFieldAvl1('//ITRForm:TotCurrAsset/text()',0);
					advRecov = checkFieldAvl1('//ITRForm:AdvRecoverable/text()',0);
					deposit = checkFieldAvl1('//ITRForm:Deposits/text()',0);
					balWithRevAut = checkFieldAvl1('//ITRForm:BalWithRevAuth/text()',0);
					totalCurrAssetLoanAdv =  checkFieldAvl1('//ITRForm:TotCurrAssetLoanAdv/text()',0);
					totCurrLiab=  checkFieldAvl1('//ITRForm:TotCurrLiabilities/text()',0);
					wTProv = checkFieldAvl1('//ITRForm:WTProvision/text()',0);
					iTProv=  checkFieldAvl1('//ITRForm:ITProvision/text()',0);
					eLS = checkFieldAvl1('//ITRForm:ELSuperAnnGratProvision/text()',0);
					othProv = checkFieldAvl1('//ITRForm:OthProvision/text()',0);
					totCurrLiabProv=  checkFieldAvl1('//ITRForm:TotCurrLiabilitiesProvision/text()',0)
					netCurAsset = checkFieldAvl1('//ITRForm:NetCurrAsset/text()',0);
					totMscAdjust  =  checkFieldAvl1('//ITRForm:TotMiscAdjust/text()',0);
					totFundApp =  checkFieldAvl1('//ITRForm:TotFundApply/text()',0);

					// revReserv=0;
					// capReserv=0;
					// statReserv=0;
					// othReserv=0;
					// totalPropFund=0;
					// totalRupeeLoan=0;
					// totalSecrLoan=0;
					// totalUnSecrLoan =0;
					// totalLoanFund=0;
					// totalFundSrc=0;
                    // netBlk =0;
					// totalFixedAsset=0;
					// govtOthSecQuot  =0;
					// govOthSecUnQuot =0;
					// equiShares=0;
					// prefShares =0;
					// debentr =0;
					// totalInvestments =0;
					// storesConsum=0;
					// rawMat=0;
					// stkInProc=0;
					// finOrTrdGood =0;
					// casinHand =0;
					// bankBalc=0;
					// totalCurrAsset=0;
					// advRecov=0;
					// deposit=0;
					// balWithRevAut=0;
					// totalCurrAssetLoanAdv=0;
					// totCurrLiab=0;
					// wTProv=0;
					// iTProv=0;
					// eLS=0;
					// othProv =0;
					// totCurrLiabProv=0;
					// netCurAsset=0;
					// totMscAdjust=0;
					// totFundApp=0;

				}
				else if( formname1 == 'ITR-3' && assyear == 2017){
					proCap = checkFieldAvl1('//ITRForm:PropCap/text()', 0);
					totalResSurp = checkFieldAvl1('//ITRForm:TotResrNSurp/text()', 0);
					forCurLoan = checkFieldAvl1('//ITRForm:ForeignCurrLoan/text()', 0);
					totOthInc = checkFieldAvl1('//ITRForm:FrmOthrs/text()', 0);
					defTax = checkFieldAvl1('//ITRForm:DeferredTax/text()', 0);
					grsBlk = checkFieldAvl1('//ITRForm:GrossBlock/text()', 0);
					depreciat = checkFieldAvl1('//ITRForm:Depreciation/text()', 0);
					capWrkPrg = checkFieldAvl1('//ITRForm:CapWrkProg/text()', 0);
					totLngTermInv = checkFieldAvl1('//ITRForm:TotLongTermInv/text()', 0);
					totTraInv = checkFieldAvl1('//ITRForm:TotTradeInv/text()', 0);
					totInventries = checkFieldAvl1('//ITRForm:TotInventries/text()', 0);
					sndryDeb = checkFieldAvl1('//ITRForm:SndryDebtors/text()', 0);
					totCashBankBal = checkFieldAvl1('//ITRForm:TotCashOrBankBal/text()', 0);
					othCurAsset = checkFieldAvl1('//ITRForm:OthCurrAsset/text()', 0);
					totLnAdv = checkFieldAvl1('//ITRForm:TotLoanAdv/text()', 0);
					sunCred = checkFieldAvl1('//ITRForm:SundryCred/text()', 0);
					liaLeasAsset = checkFieldAvl1('//ITRForm:LiabForLeasedAsset/text()', 0);
					accrLeaAsset = checkFieldAvl1('//ITRForm:AccrIntonLeasedAsset/text()', 0);
					accIntNoDue = checkFieldAvl1('//ITRForm:AccrIntNotDue/text()', 0);
					totProvisions = checkFieldAvl1('//ITRForm:TotProvisions/text()', 0);
					miscExp = checkFieldAvl1('//ITRForm:MiscExpndr/text()', 0);
					defTaxAss = checkFieldAvl1('//ITRForm:DefTaxAsset/text()', 0);
					accLosses = checkFieldAvl1('//ITRForm:AccumaltedLosses/text()', 0);
					totSunDbtAmt = checkFieldAvl1('//ITRForm:TotSundryDbtAmt/text()', 0);
					totSunCrAmt = checkFieldAvl1('//ITRForm:TotSundryCrdAmt/text()', 0);
					totSktTradAmt = checkFieldAvl1('//ITRForm:TotStkInTradAmt/text()', 0);
					cashBalAmt = checkFieldAvl1('//ITRForm:CashBalAmt/text()', 0);
					rupeeLn = checkFieldAvl1('//ITRForm:FrmBank/text()', 0);
					unSecLn = checkFieldAvl1('//ITRForm:FrmBank/text()', 1);
					unSecLnOther = checkFieldAvl1('//ITRForm:FrmOthrs/text()', 1);

					//New Fields Extraction
					revReserv =  checkFieldAvl1('//ITRForm:RevResr/text()',0);
					capReserv  =  checkFieldAvl1('//ITRForm:CapResr/text()',0);
					statReserv =  checkFieldAvl1('//ITRForm:StatResr/text()',0);
					//totResrNSurp = checkFieldAvl1('//ITRForm:TotResrNSurp/text()',0);
					othReserv = checkFieldAvl1('//ITRForm:OthResr/text()',0);
					totalPropFund =  checkFieldAvl1('//ITRForm:TotPropFund/text()',0);
					totalRupeeLoan= checkFieldAvl1('//ITRForm:TotRupeeLoan/text()',0);
					totalSecrLoan =  checkFieldAvl1('//ITRForm:TotSecrLoan/text()',0);
					totalUnSecrLoan =  checkFieldAvl1('//ITRForm:TotUnSecrLoan/text()',0);
					totalLoanFund =  checkFieldAvl1('//ITRForm:TotLoanFund/text()',0);
					totalFundSrc  = checkFieldAvl1('//ITRForm:TotFundSrc/text()',0);
					netBlk = checkFieldAvl1('//ITRForm:NetBlock/text()',0);
					totalFixedAsset= checkFieldAvl1('//ITRForm:TotFixedAsset/text()',0);
					govtOthSecQuot  = checkFieldAvl1('//ITRForm:GovtOthSecQuoted/text()',0);
					govOthSecUnQuot =  checkFieldAvl1('//ITRForm:GovOthSecUnQoted/text()',0);
					equiShares=  checkFieldAvl1('//ITRForm:EquityShares/text()',0);
					prefShares =  checkFieldAvl1('//ITRForm:PreferShares/text()',0);
					debentr =  checkFieldAvl1('//ITRForm:Debenture/text()',0);
					totalInvestments =  checkFieldAvl1('//ITRForm:TotInvestments/text()',0);
					storesConsum=  checkFieldAvl1('//ITRForm:StoresConsumables/text()',0);
					rawMat = checkFieldAvl1('//ITRForm:RawMatl/text()',0);
					stkInProc =  checkFieldAvl1('//ITRForm:StkInProcess/text()',0);
					finOrTrdGood = checkFieldAvl1('//ITRForm:FinOrTradGood/text()',0);
					casinHand  =  checkFieldAvl1('//ITRForm:CashinHand/text()',0);
					bankBalc = checkFieldAvl1('//ITRForm:BankBal/text()',0);
					totalCurrAsset=  checkFieldAvl1('//ITRForm:TotCurrAsset/text()',0);
					advRecov = checkFieldAvl1('//ITRForm:AdvRecoverable/text()',0);
					deposit = checkFieldAvl1('//ITRForm:Deposits/text()',0);
					balWithRevAut = checkFieldAvl1('//ITRForm:BalWithRevAuth/text()',0);
					totalCurrAssetLoanAdv =  checkFieldAvl1('//ITRForm:TotCurrAssetLoanAdv/text()',0);
					totCurrLiab=  checkFieldAvl1('//ITRForm:TotCurrLiabilities/text()',0);
					wTProv = checkFieldAvl1('//ITRForm:WTProvision/text()',0);
					iTProv=  checkFieldAvl1('//ITRForm:ITProvision/text()',0);
					eLS = checkFieldAvl1('//ITRForm:ELSuperAnnGratProvision/text()',0);
					othProv = checkFieldAvl1('//ITRForm:OthProvision/text()',0);
					totCurrLiabProv=  checkFieldAvl1('//ITRForm:TotCurrLiabilitiesProvision/text()',0)
					netCurAsset = checkFieldAvl1('//ITRForm:NetCurrAsset/text()',0);
					totMscAdjust  =  checkFieldAvl1('//ITRForm:TotMiscAdjust/text()',0);
					totFundApp =  checkFieldAvl1('//ITRForm:TotFundApply/text()',0);

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
								const select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master' });
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
				if(((formname1 == 'ITR-4' || formname1 == 'ITR-4S') && (assyear == 2014 ||assyear == 2015||assyear == 2016)) || (formname1 == 'ITR-3' && assyear == 2017) ){
						var bsDtls = [];
							bsDtls = {
								Year__c: assyear,
								PropCap: proCap,
								TotResrnSyrf: totalResSurp,
								foreignCurLoan: forCurLoan,
								FromOthers: totOthInc,
								DeferredTax: defTax,
								GrossBlock: grsBlk,
								Depreciation: depreciat,
								CapWorkProgram: capWrkPrg,
								TotLongTermInvest: totLngTermInv,
								TotalTradeInvest: totTraInv,
								TotalInventries: totInventries,
								SyndryDebtors: sndryDeb,
								TotalCashOrBankBal: totCashBankBal,
								OtherCurAsset: othCurAsset,
								TotalLoanAdv: totLnAdv,
								SundryCred: sunCred,
								LiableForLeasedAsset: liaLeasAsset,
								AccIncLeasedAsset: accrLeaAsset,
								AccIntNotDue: accIntNoDue,
								TotalProvisions: totProvisions,
								MiscExpenditure: miscExp,
								DefTaxAsset: defTaxAss,
								AccumulatedLosses: accLosses,
								TotalSundryDebitAmt: totSunDbtAmt,
								TotalSundryCreAmt: totSunCrAmt,
								TotalSktTradeAmt: totSktTradAmt,
								CashBalAmount: cashBalAmt,
								SecureLoanBank: rupeeLn,
								UnSecLoanBank: unSecLn,
								UnSecureLnFromOthers: unSecLnOther,


								RevaluationReserve: revReserv,
								CapitalReserve: capReserv,
								StatutoryReserve: statReserv,
								AnyOtherReserve: othReserv,
								TotalProprietorFund: totalPropFund,
								TotalRupeeLoans: totalRupeeLoan,
								TotalSecuredLoan: totalSecrLoan,
								TotalUnsecureLoan : totalUnSecrLoan,
								TotalLoanFunds: totalLoanFund,
								Sourcesoffunds: totalFundSrc,
								Netblock: netBlk,
								TotalFixedAssets: totalFixedAsset,
								GovtAndOtherSecuritiesQuoted: govtOthSecQuot,
								GovtAndOtherSecuritiesUnQuoted: govOthSecUnQuot,
								EquityShares:equiShares,
								PreferShares:prefShares,
								Debenture:debentr,
								Totalinvestments: totalInvestments,
								StoresConsumables: storesConsum,
								RawMaterials: rawMat,
								StockinProcess: stkInProc,
								FinishedGoodsorTradedGoods: finOrTrdGood ,
								CashinHand: casinHand,
								BalanceWithBank: bankBalc,
								TotalCurrentAssets: totalCurrAsset,
								AdvRecoverable: advRecov,
								Deposits: deposit ,
								BalWithRevAuth: balWithRevAut,
								TotCurrAssetLoanAdv: totalCurrAssetLoanAdv,
								TotCurrLiabilities: totCurrLiab,
								ITProvision: iTProv,
								WTProvision: wTProv,
								ELSuperAnnGratProvision: eLS,
								OthProvision: othProv,
								TotCurrLiabilitiesProvision: totCurrLiabProv ,
								NetCurrAsset: netCurAsset,
								TotMiscAdjust: totMscAdjust,
								TotalFundApply:totFundApp,
							};
             // console.log(bsDtls);
			  const header = ['Year__c','PropCap', 'TotResrnSyrf', 'foreignCurLoan', 'FromOthers','DeferredTax','GrossBlock','Depreciation','CapWorkProgram','TotLongTermInvest','TotalTradeInvest','TotalInventries','SyndryDebtors','TotalCashOrBankBal','OtherCurAsset','TotalLoanAdv','SundryCred','LiableForLeasedAsset','AccIncLeasedAsset','AccIntNotDue','TotalProvisions','MiscExpenditure','DefTaxAsset','AccumulatedLosses','TotalSundryDebitAmt','TotalSundryCreAmt','TotalSktTradeAmt','CashBalAmount','SecureLoanBank','UnSecLoanBank','UnSecureLnFromOthers',
							  'RevaluationReserve','CapitalReserve', 'StatutoryReserve','AnyOtherReserve','TotalProprietorFund','TotalRupeeLoans','TotalSecuredLoan','TotalUnsecureLoan',
							   'TotalLoanFunds','Sourcesoffunds','Netblock','TotalFixedAssets','GovtAndOtherSecuritiesQuoted','GovtAndOtherSecuritiesUnQuoted','EquityShares','PreferShares',
							   'Debenture','Totalinvestments','StoresConsumables','RawMaterials','StockinProcess','FinishedGoodsorTradedGoods','CashinHand','BalanceWithBank','TotalCurrentAssets','AdvRecoverable',
							   'Deposits','BalWithRevAuth','TotCurrAssetLoanAdv','TotCurrLiabilities','ITProvision','WTProvision','ELSuperAnnGratProvision',
							   'OthProvision','TotCurrLiabilitiesProvision','NetCurrAsset','TotMiscAdjust','TotalFundApply'];
			try {
                    const ffcsv = json2csv({
                        data: bsDtls,
                        fields: header
                    });
                    const fileEx = '.csv';
					const type = 'BS';
						if (ffcsv) {
						try{
							mkdirp.sync(path1 + orderNo + "/"+ BscsvPath);
						}
						catch(e){
							console.log('error'+e);
						}
                       // fs.writeFileSync('taxbs.csv', ffcsv);
						fs.writeFileSync(path1 + orderNo + "/"+ BscsvPath + '/' + orderNo + '_' + pullSeqNo + '_' + type + '_' + assyear + fileEx, ffcsv);
						console.log('BS convertion completed');
                    } else {

                    }
                } catch (e) {

				}

		}
	}
};
