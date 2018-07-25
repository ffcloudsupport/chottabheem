/* Source Code Header
Program Name	:	corporateConversionITR56.js
Module Name		:
Description  	:	In this program we are Extraction all the information from ITR3,ITR4 source file and converting into CSV output files.

Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 24/07/2017
Created By		:	Mohammed Salman
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		:	Revision Date:		Revised By		Details
1.1					01/08/2017			sekar           Added output path and integrated with FFEngine

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
const PLcsvPath = 'PLCsvFiles/';

module.exports = {
	CorpPLConversion(ofilename, rfilename, year, orderNo, pullSeqNo) {
		const FilePaths = [];
		FilePaths[0] = path1 + orderNo + path2 + '/' + ofilename;
		FilePaths[1] = path1 + orderNo + path2 + '/' + rfilename;
		console.log(ofilename, rfilename,year, orderNo,pullSeqNo);


		//common variables in all ITR's
		var saleGood = [];    var saleSer = [];    var opRevtoAmt = []; var totOthInc = [];
		var openStock = [];   var purchase = [];   var closeStock = []; var conStore = [];
		var prFuel = [];      var totEmpComp = []; var badDeb = [];     var proveBadDoubt =[];
		var othProExp =[];    var pbita =[];       var intExpdtls =[];  var depAmort =[];
	    var provCurTax =[];   var proveDefTax =[]; var balbfYr =[];     var trfRes =[];
		var GrossRept =[];    var grsProfit =[];   var expense =[];     var assyear = [];
		var totExCus = [];    var expVat = [];     var expVat1 = [];    var toexpVat = [];
		var formname = [];    var bussrec =[];     var uniexc =[];      var uniexc1 =[];
		var travelEx =[];     var uniexc2 =[];     var div =[];         var keyMan =[];
		var servtx =[];       var servtx1 =[];     var servtx2 =[];     var vattax =[];
		var vattax1 =[];      var vattax2 =[];     var othDuytax =[];   var othDutytax1 =[];
	    var othDutytax2 =[];  var totrev =[];      var rentin =[];      var com =[];
		var inter = [];		  var ProfitOnSale =[];var ProfitOnInv =[]; var ProfitOnOth =[];
		var ProfitOnCurr =[]; var ProfitOnAgri =[];var MiscOth =[];     var rawmat =[];
		var rawmat1 =[];      var workInPro =[];   var workInPro1 =[];  var finiGoods =[];
		var finiGoods1 =[];   var totCre =[];      var freight =[];     var rentExp =[];
		var repairBld =[];    var repairMach =[];  var salsWage =[];    var bonus =[];
		var medExp =[];       var leavEn =[];      var leaveTrav =[];   var contToSuper =[];
		var contToPF =[];     var contToGrat =[];  var contToOth =[];   var othEmpBen =[];
		var compPaid =[];     var amtPaid =[];     var medIn =[];       var lifeIn =[];
		var othIn =[];        var totIns =[];      var staffWel =[];    var ent =[];
		var conf =[];         var salePro =[];     var adver =[];       var nonResOther =[];
		var nonResOther1 =[]; var nonResOther2 =[];var nonResOther3 =[];var hosp =[];
		var other =[];        var other1 =[];      var other2 =[];      var other3 =[];
		var tot =[];          var tot1 =[];        var tot2 =[];        var handleBoard =[];
		var foreignTrav =[];  var convey =[];      var tel =[];         var guestHouse =[];
		var clubEx =[];       var festCeleb =[];   var schol =[];       var giftDet =[];
		var cessDet =[];      var audit =[];       var othExp =[];      var panDet =[];
		var otherAmt =[];     var panNotAvail =[]; var pbtDet =[];      var proAftrTax =[];
		var amtAvlApprDet =[];var propAccBal =[];  var netpro =[];      var dona =[];
		var rType =[];        var cusDuty =[];     var counterDuty =[]; var splDuty =[];
		var fName =[];        var mName =[];       var surName =[];     var name =[];

		//new variables for ITR-3/4
		var grossRecPrf =[];  var grossProPrf =[]; var expPrf =[];      var netProPrf =[];
		var grossFromPro =[]; var totBussPro =[]; var intIncome = [];  var othFinInc = [];
		var partSal = [];  var badDebPan =[]; var resPart = [];  var resOthers = [];
		var apprDividend = []; var apprdivTax =[]; var apprOthers =[]; var apprTot =[];

		//this condition gets executed when revised file found.
		if( typeof rfilename != 'undefined'){
			var data = fs.readFileSync(FilePaths[1]);
			console.log('Revised file found');
			if (data) {
				try {
					const doc = new dom().parseFromString(data.toString());
					const select = xpath.useNamespaces({ 'ITRForm':'http://incometaxindiaefiling.gov.in/master' });
					formname = checkFieldAvl('//ITRForm:FormName/text()', 0);
					console.log(formname);
					assyear = checkFieldAvl('//ITRForm:AssessmentYear/text()',0);
					console.log(assyear);

					//if the formName is ITR-3/4 and the year is 2014/2015/2016/2017 it get's executed
					if(((formname == 'ITR-4') && (assyear == 2014 ||assyear == 2015 ||assyear == 2016 || assyear == 2017)) || (formname == 'ITR-3' && (assyear == 2017 || assyear == 2018)) ){

						saleGood = checkFieldAvl('//ITRForm:SaleOfGoods/text()', 0);
						saleSer = checkFieldAvl('//ITRForm:SaleOfServices/text()', 0);
						opRevtoAmt = checkFieldAvl('//ITRForm:OperatingRevenueTotAmt/text()', 0);
						totOthInc = checkFieldAvl('//ITRForm:TotOthIncome/text()', 0);
						openStock = checkFieldAvl('//ITRForm:OpeningStock/text()', 0);
						purchase = checkFieldAvl('//ITRForm:Purchases/text()', 0);
						closeStock = checkFieldAvl('//ITRForm:ClosingStock/text()', 0);
						conStore = checkFieldAvl('//ITRForm:ConsumptionOfStores/text()', 0);
						prFuel = checkFieldAvl('//ITRForm:PowerFuel/text()', 0);
						totEmpComp = checkFieldAvl('//ITRForm:TotEmployeeComp/text()', 0);
						badDeb = checkFieldAvl('//ITRForm:BadDebt/text()', 0);
						proveBadDoubt = checkFieldAvl('//ITRForm:ProvForBadDoubtDebt/text()', 0);
						othProExp = checkFieldAvl('//ITRForm:OthProvisionsExpdr/text()', 0);
						pbita = checkFieldAvl('//ITRForm:PBIDTA/text()', 0);
						intExpdtls = checkFieldAvl('//ITRForm:InterestExpdr/text()', 0);
						depAmort = checkFieldAvl('//ITRForm:DepreciationAmort/text()', 0);
						provCurTax = checkFieldAvl('//ITRForm:ProvForCurrTax/text()', 0);
						proveDefTax = checkFieldAvl('//ITRForm:ProvDefTax/text()', 0);
						balbfYr = checkFieldAvl('//ITRForm:BalBFPrevYr/text()', 0);
						trfRes = checkFieldAvl('//ITRForm:TrfToReserves/text()', 0);
						GrossRept = checkFieldAvl('//ITRForm:GrossReceipt/text()', 0);
						grsProfit = checkFieldAvl('//ITRForm:GrossProfit/text()', 0);
						expense = checkFieldAvl('//ITRForm:Expenses/text()', 0);
						expVat = checkFieldAvl('//ITRForm:TotExciseCustomsVAT/text()', 0);
						toexpVat = checkFieldAvl('//ITRForm:TotExciseCustomsVAT/text()', 1);
						bussrec = checkFieldAvl('//ITRForm:BusinessReceipts/text()', 0);
						uniexc = checkFieldAvl('//ITRForm:UnionExciseDuty/text()', 0);
						vattax = checkFieldAvl('//ITRForm:VATorSaleTax/text()', 0);
						vattax1 = checkFieldAvl('//ITRForm:VATorSaleTax/text()', 1);
						vattax2 = checkFieldAvl('//ITRForm:VATorSaleTax/text()', 2);
						othDuytax = checkFieldAvl('//ITRForm:OthDutyTaxCess/text()', 0);
						totrev = checkFieldAvl('//ITRForm:TotRevenueFrmOperations/text()', 0);
						rentin = checkFieldAvl('//ITRForm:RentInc/text()', 0);
						com = checkFieldAvl('//ITRForm:Comissions/text()', 0);
						div = checkFieldAvl('//ITRForm:Dividends/text()', 0);
						inter = checkFieldAvl('//ITRForm:InterestInc/text()', 0);
						ProfitOnSale = checkFieldAvl('//ITRForm:ProfitOnSaleFixedAsset/text()', 0);
						ProfitOnInv = checkFieldAvl('//ITRForm:ProfitOnInvChrSTT/text()', 0);
						ProfitOnOth = checkFieldAvl('//ITRForm:ProfitOnOthInv/text()', 0);
						ProfitOnCurr = checkFieldAvl('//ITRForm:ProfitOnCurrFluct/text()', 0);
						ProfitOnAgri = checkFieldAvl('//ITRForm:ProfitOnAgriIncome/text()', 0);
						MiscOth = checkFieldAvl('//ITRForm:MiscOthIncome/text()', 0);
						rawmat = checkFieldAvl('//ITRForm:RawMaterial/text()', 0);
						workInPro = checkFieldAvl('//ITRForm:WorkInProgress/text()', 0);
						finiGoods = checkFieldAvl('//ITRForm:FinishedGoods/text()', 0);
						totCre = checkFieldAvl('//ITRForm:TotCreditsToPL/text()', 0);
						rawmat1 = checkFieldAvl('//ITRForm:RawMaterial/text()', 1);
						workInPro1 = checkFieldAvl('//ITRForm:WorkInProgress/text()', 1);
						finiGoods1 = checkFieldAvl('//ITRForm:FinishedGoods/text()', 1);
						uniexc1 = checkFieldAvl('//ITRForm:UnionExciseDuty/text()', 1);
						othDutytax1 = checkFieldAvl('//ITRForm:OthDutyTaxCess/text()', 1);
						freight = checkFieldAvl('//ITRForm:Freight/text()', 0);
						rentExp = checkFieldAvl('//ITRForm:RentExpdr/text()', 0);
						repairBld = checkFieldAvl('//ITRForm:RepairsBldg/text()', 0);
						repairMach = checkFieldAvl('//ITRForm:RepairMach/text()', 0);
						salsWage = checkFieldAvl('//ITRForm:SalsWages/text()', 0);
						bonus = checkFieldAvl('//ITRForm:Bonus/text()', 0);
						medExp = checkFieldAvl('//ITRForm:MedExpReimb/text()', 0);
						leavEn = checkFieldAvl('//ITRForm:LeaveEncash/text()', 0);
						leaveTrav = checkFieldAvl('//ITRForm:LeaveTravelBenft/text()', 0);
						contToSuper = checkFieldAvl('//ITRForm:ContToSuperAnnFund/text()', 0);
						contToPF = checkFieldAvl('//ITRForm:ContToPF/text()', 0);
						contToGrat = checkFieldAvl('//ITRForm:ContToGratFund/text()', 0);
						contToOth = checkFieldAvl('//ITRForm:ContToOthFund/text()', 0);
						othEmpBen = checkFieldAvl('//ITRForm:OthEmpBenftExpdr/text()', 0);
						compPaid = checkFieldAvl('//ITRForm:AnyCompPaidToNonRes/text()', 0);
						amtPaid = checkFieldAvl('//ITRForm:AmtPaidToNonRes/text()', 0);
						medIn = checkFieldAvl('//ITRForm:MedInsur/text()', 0);
						lifeIn = checkFieldAvl('//ITRForm:LifeInsur/text()', 0);
						keyMan = checkFieldAvl('//ITRForm:KeyManInsur/text()', 0);
						othIn = checkFieldAvl('//ITRForm:OthInsur/text()', 0);
						totIns = checkFieldAvl('//ITRForm:TotInsurances/text()', 0);
						staffWel = checkFieldAvl('//ITRForm:StaffWelfareExp/text()', 0);
						ent = checkFieldAvl('//ITRForm:Entertainment/text()', 0);
						hosp = checkFieldAvl('//ITRForm:Hospitality/text()', 0);
						conf = checkFieldAvl('//ITRForm:Conference/text()', 0);
						salePro = checkFieldAvl('//ITRForm:SalePromoExp/text()', 0);
						adver = checkFieldAvl('//ITRForm:Advertisement/text()', 0);
						nonResOther = checkFieldAvl('//ITRForm:NonResOtherCompany/text()', 0);
						other = checkFieldAvl('//ITRForm:Others/text()', 0);
						tot = checkFieldAvl('//ITRForm:Total/text()', 0);
						nonResOther1 = checkFieldAvl('//ITRForm:NonResOtherCompany/text()', 1);
						other1 = checkFieldAvl('//ITRForm:Others/text()', 1);
						tot1 = checkFieldAvl('//ITRForm:Total/text()', 1);
						nonResOther2 = checkFieldAvl('//ITRForm:NonResOtherCompany/text()', 2);
						other2 = checkFieldAvl('//ITRForm:Others/text()', 2);
						tot2 = checkFieldAvl('//ITRForm:Total/text()', 2);
						handleBoard = checkFieldAvl('//ITRForm:HotelBoardLodge/text()',0 );
						travelEx = checkFieldAvl('//ITRForm:TravelExp/text()', 0);
						foreignTrav = checkFieldAvl('//ITRForm:ForeignTravelExp/text()', 0);
						convey = checkFieldAvl('//ITRForm:ConveyanceExp/text()', 0);
						tel = checkFieldAvl('//ITRForm:TelephoneExp/text()', 0);
						guestHouse = checkFieldAvl('//ITRForm:GuestHouseExp/text()', 0);
						clubEx = checkFieldAvl('//ITRForm:ClubExp/text()', 0);
						festCeleb = checkFieldAvl('//ITRForm:FestivalCelebExp/text()', 0);
						schol = checkFieldAvl('//ITRForm:Scholarship/text()', 0);
						giftDet = checkFieldAvl('//ITRForm:Gift/text()', 0);
						dona = checkFieldAvl('//ITRForm:Donation/text()', 0);
						uniexc2 = checkFieldAvl('//ITRForm:UnionExciseDuty/text()', 2);
						servtx = checkFieldAvl('//ITRForm:ServiceTax/text()', 0);
						servtx1 = checkFieldAvl('//ITRForm:ServiceTax/text()', 1);
						servtx2 = checkFieldAvl('//ITRForm:ServiceTax/text()', 2);
						cessDet = checkFieldAvl('//ITRForm:Cess/text()', 0);
						othDutytax2 = checkFieldAvl('//ITRForm:OthDutyTaxCess/text()', 2);
						expVat1 = checkFieldAvl('//ITRForm:TotExciseCustomsVAT/text()', 2);
						audit = checkFieldAvl('//ITRForm:AuditFee/text()', 0);
						othExp = checkFieldAvl('//ITRForm:OtherExpenses/text()', 0);
						panDet = checkFieldAvl('//ITRForm:PAN/text()', 0);
						panNotAvail = checkFieldAvl('//ITRForm:OthersWherePANNotAvlble/text()', 0);
						otherAmt = checkFieldAvl('//ITRForm:OthersAmtLt1Lakh/text()', 0);
						badDeb = checkFieldAvl('//ITRForm:BadDebt/text()', 0);
						nonResOther3 = checkFieldAvl('//ITRForm:NonResOtherCompany/text()', 3);
						other3 = checkFieldAvl('//ITRForm:Others/text()', 3);
						intExpdtls = checkFieldAvl('//ITRForm:InterestExpdr/text()', 0);
						pbtDet = checkFieldAvl('//ITRForm:PBT/text()', 0);
						proAftrTax = checkFieldAvl('//ITRForm:ProfitAfterTax/text()', 0);
						amtAvlApprDet = checkFieldAvl('//ITRForm:AmtAvlAppr/text()', 0);
						propAccBal = checkFieldAvl('//ITRForm:ProprietorAccBalTrf/text()', 0);
						GrossRept = checkFieldAvl('//ITRForm:GrossReceipt/text()', 0);
						grsProfit = checkFieldAvl('//ITRForm:GrossProfit/text()', 0);
						expense = checkFieldAvl('//ITRForm:Expenses/text()', 0);
						netpro = checkFieldAvl('//ITRForm:NetProfit/text()', 0);
						rType= checkFieldAvl('//ITRForm:ReturnType/text()',0);
						cusDuty= checkFieldAvl('//ITRForm:CustomDuty/text()',0);
						counterDuty= checkFieldAvl('//ITRForm:CounterVailDuty/text()',0);
						splDuty= checkFieldAvl('//ITRForm:SplAddDuty/text()',0);
						fName= checkFieldAvl('//ITRForm:FirstName/text()',0);
						surName= checkFieldAvl('//ITRForm:SurNameOrOrgName/text()',0);
						try{
							//mName= checkFieldAvl('//ITRForm:MiddleName/text()',0);
							mName = select('//ITRForm:MiddleName/text()', doc)[0].nodeValue;

						}
						catch(e){
							mName = ' ';
						}
						name= fName+" "+mName+" "+surName;
						//new xml tags extracted for ITR-3/4
						grossFromPro = checkFieldAvl('//ITRForm:GrossFromProfession/text()', 0);
						grossRecPrf= checkFieldAvl('//ITRForm:GrossReceiptPrf/text()', 0);
						grossProPrf= checkFieldAvl('//ITRForm:GrossProfitPrf/text()', 0);
						expPrf= checkFieldAvl('//ITRForm:ExpensesPrf/text()', 0);
						netProPrf= checkFieldAvl('//ITRForm:NetProfitPrf/text()', 0);
						totBussPro= checkFieldAvl('//ITRForm:TotBusinessProfession/text()', 0);
						intIncome = 0;
						othFinInc =0;
						partSal = 0;
						badDebPan = 0;
						resPart = 0;
						resOthers = 0;apprDividend =0;
						apprdivTax = 0;
						apprOthers =0;
						apprTot =0;
					}
				}
				 catch(e){

				}
			}
			 else{
				console.log('No data found');
			}
		}
		else{
			var data = fs.readFileSync(FilePaths[0]);
			console.log('original file found');
			if (data) {
				try {
					const doc = new dom().parseFromString(data.toString());
					const select = xpath.useNamespaces({ 'ITRForm':'http://incometaxindiaefiling.gov.in/master','ITRForm':'http://incometaxindiaefiling.gov.in/Corpmaster' });
					formname = checkFieldAvl('//ITRForm:FormName/text()', 0);
					console.log(formname);
					assyear = checkFieldAvl('//ITRForm:AssessmentYear/text()',0);
					console.log(assyear);

					//if the formName is ITR-3/4 and the year is 2014/2015/2016/2017 it get's executed
					if(((formname == 'ITR-4') && (assyear == 2014 ||assyear == 2015 ||assyear == 2016 || assyear == 2017)) || (formname == 'ITR-3' && (assyear == 2017 || assyear == 2018)) ){

						saleGood = checkFieldAvl('//ITRForm:SaleOfGoods/text()', 0);
						saleSer = checkFieldAvl('//ITRForm:SaleOfServices/text()', 0);
						opRevtoAmt = checkFieldAvl('//ITRForm:OperatingRevenueTotAmt/text()', 0);
						totOthInc = checkFieldAvl('//ITRForm:TotOthIncome/text()', 0);
						openStock = checkFieldAvl('//ITRForm:OpeningStock/text()', 0);
						purchase = checkFieldAvl('//ITRForm:Purchases/text()', 0);
						closeStock = checkFieldAvl('//ITRForm:ClosingStock/text()', 0);
						conStore = checkFieldAvl('//ITRForm:ConsumptionOfStores/text()', 0);
						prFuel = checkFieldAvl('//ITRForm:PowerFuel/text()', 0);
						totEmpComp = checkFieldAvl('//ITRForm:TotEmployeeComp/text()', 0);
						badDeb = checkFieldAvl('//ITRForm:BadDebt/text()', 0);
						proveBadDoubt = checkFieldAvl('//ITRForm:ProvForBadDoubtDebt/text()', 0);
						othProExp = checkFieldAvl('//ITRForm:OthProvisionsExpdr/text()', 0);
						pbita = checkFieldAvl('//ITRForm:PBIDTA/text()', 0);
						intExpdtls = checkFieldAvl('//ITRForm:InterestExpdr/text()', 0);
						depAmort = checkFieldAvl('//ITRForm:DepreciationAmort/text()', 0);
						provCurTax = checkFieldAvl('//ITRForm:ProvForCurrTax/text()', 0);
						proveDefTax = checkFieldAvl('//ITRForm:ProvDefTax/text()', 0);
						balbfYr = checkFieldAvl('//ITRForm:BalBFPrevYr/text()', 0);
						trfRes = checkFieldAvl('//ITRForm:TrfToReserves/text()', 0);
						GrossRept = checkFieldAvl('//ITRForm:GrossReceipt/text()', 0);
						grsProfit = checkFieldAvl('//ITRForm:GrossProfit/text()', 0);
						expense = checkFieldAvl('//ITRForm:Expenses/text()', 0);
						expVat = checkFieldAvl('//ITRForm:TotExciseCustomsVAT/text()', 0);
						toexpVat = checkFieldAvl('//ITRForm:TotExciseCustomsVAT/text()', 1);
						bussrec = checkFieldAvl('//ITRForm:BusinessReceipts/text()', 0);
						uniexc = checkFieldAvl('//ITRForm:UnionExciseDuty/text()', 0);
						vattax = checkFieldAvl('//ITRForm:VATorSaleTax/text()', 0);
						vattax1 = checkFieldAvl('//ITRForm:VATorSaleTax/text()', 1);
						vattax2 = checkFieldAvl('//ITRForm:VATorSaleTax/text()', 2);
						othDuytax = checkFieldAvl('//ITRForm:OthDutyTaxCess/text()', 0);
						totrev = checkFieldAvl('//ITRForm:TotRevenueFrmOperations/text()', 0);
						rentin = checkFieldAvl('//ITRForm:RentInc/text()', 0);
						com = checkFieldAvl('//ITRForm:Comissions/text()', 0);
						div = checkFieldAvl('//ITRForm:Dividends/text()', 0);
						inter = checkFieldAvl('//ITRForm:InterestInc/text()', 0);
						ProfitOnSale = checkFieldAvl('//ITRForm:ProfitOnSaleFixedAsset/text()', 0);
						ProfitOnInv = checkFieldAvl('//ITRForm:ProfitOnInvChrSTT/text()', 0);
						ProfitOnOth = checkFieldAvl('//ITRForm:ProfitOnOthInv/text()', 0);
						ProfitOnCurr = checkFieldAvl('//ITRForm:ProfitOnCurrFluct/text()', 0);
						ProfitOnAgri = checkFieldAvl('//ITRForm:ProfitOnAgriIncome/text()', 0);
						MiscOth = checkFieldAvl('//ITRForm:MiscOthIncome/text()', 0);
						rawmat = checkFieldAvl('//ITRForm:RawMaterial/text()', 0);
						workInPro = checkFieldAvl('//ITRForm:WorkInProgress/text()', 0);
						finiGoods = checkFieldAvl('//ITRForm:FinishedGoods/text()', 0);
						totCre = checkFieldAvl('//ITRForm:TotCreditsToPL/text()', 0);
						rawmat1 = checkFieldAvl('//ITRForm:RawMaterial/text()', 1);
						workInPro1 = checkFieldAvl('//ITRForm:WorkInProgress/text()', 1);
						finiGoods1 = checkFieldAvl('//ITRForm:FinishedGoods/text()', 1);
						uniexc1 = checkFieldAvl('//ITRForm:UnionExciseDuty/text()', 1);
						othDutytax1 = checkFieldAvl('//ITRForm:OthDutyTaxCess/text()', 1);
						freight = checkFieldAvl('//ITRForm:Freight/text()', 0);
						rentExp = checkFieldAvl('//ITRForm:RentExpdr/text()', 0);
						repairBld = checkFieldAvl('//ITRForm:RepairsBldg/text()', 0);
						repairMach = checkFieldAvl('//ITRForm:RepairMach/text()', 0);
						salsWage = checkFieldAvl('//ITRForm:SalsWages/text()', 0);
						bonus = checkFieldAvl('//ITRForm:Bonus/text()', 0);
						medExp = checkFieldAvl('//ITRForm:MedExpReimb/text()', 0);
						leavEn = checkFieldAvl('//ITRForm:LeaveEncash/text()', 0);
						leaveTrav = checkFieldAvl('//ITRForm:LeaveTravelBenft/text()', 0);
						contToSuper = checkFieldAvl('//ITRForm:ContToSuperAnnFund/text()', 0);
						contToPF = checkFieldAvl('//ITRForm:ContToPF/text()', 0);
						contToGrat = checkFieldAvl('//ITRForm:ContToGratFund/text()', 0);
						contToOth = checkFieldAvl('//ITRForm:ContToOthFund/text()', 0);
						othEmpBen = checkFieldAvl('//ITRForm:OthEmpBenftExpdr/text()', 0);
						compPaid = checkFieldAvl('//ITRForm:AnyCompPaidToNonRes/text()', 0);
						amtPaid = checkFieldAvl('//ITRForm:AmtPaidToNonRes/text()', 0);
						medIn = checkFieldAvl('//ITRForm:MedInsur/text()', 0);
						lifeIn = checkFieldAvl('//ITRForm:LifeInsur/text()', 0);
						keyMan = checkFieldAvl('//ITRForm:KeyManInsur/text()', 0);
						othIn = checkFieldAvl('//ITRForm:OthInsur/text()', 0);
						totIns = checkFieldAvl('//ITRForm:TotInsurances/text()', 0);
						staffWel = checkFieldAvl('//ITRForm:StaffWelfareExp/text()', 0);
						ent = checkFieldAvl('//ITRForm:Entertainment/text()', 0);
						hosp = checkFieldAvl('//ITRForm:Hospitality/text()', 0);
						conf = checkFieldAvl('//ITRForm:Conference/text()', 0);
						salePro = checkFieldAvl('//ITRForm:SalePromoExp/text()', 0);
						adver = checkFieldAvl('//ITRForm:Advertisement/text()', 0);
						nonResOther = checkFieldAvl('//ITRForm:NonResOtherCompany/text()', 0);
						other = checkFieldAvl('//ITRForm:Others/text()', 0);
						tot = checkFieldAvl('//ITRForm:Total/text()', 0);
						nonResOther1 = checkFieldAvl('//ITRForm:NonResOtherCompany/text()', 1);
						other1 = checkFieldAvl('//ITRForm:Others/text()', 1);
						tot1 = checkFieldAvl('//ITRForm:Total/text()', 1);
						nonResOther2 = checkFieldAvl('//ITRForm:NonResOtherCompany/text()', 2);
						other2 = checkFieldAvl('//ITRForm:Others/text()', 2);
						tot2 = checkFieldAvl('//ITRForm:Total/text()', 2);
						handleBoard = checkFieldAvl('//ITRForm:HotelBoardLodge/text()',0 );
						travelEx = checkFieldAvl('//ITRForm:TravelExp/text()', 0);
						foreignTrav = checkFieldAvl('//ITRForm:ForeignTravelExp/text()', 0);
						convey = checkFieldAvl('//ITRForm:ConveyanceExp/text()', 0);
						tel = checkFieldAvl('//ITRForm:TelephoneExp/text()', 0);
						guestHouse = checkFieldAvl('//ITRForm:GuestHouseExp/text()', 0);
						clubEx = checkFieldAvl('//ITRForm:ClubExp/text()', 0);
						festCeleb = checkFieldAvl('//ITRForm:FestivalCelebExp/text()', 0);
						schol = checkFieldAvl('//ITRForm:Scholarship/text()', 0);
						giftDet = checkFieldAvl('//ITRForm:Gift/text()', 0);
						dona = checkFieldAvl('//ITRForm:Donation/text()', 0);
						uniexc2 = checkFieldAvl('//ITRForm:UnionExciseDuty/text()', 2);
						servtx = checkFieldAvl('//ITRForm:ServiceTax/text()', 0);
						servtx1 = checkFieldAvl('//ITRForm:ServiceTax/text()', 1);
						servtx2 = checkFieldAvl('//ITRForm:ServiceTax/text()', 2);
						cessDet = checkFieldAvl('//ITRForm:Cess/text()', 0);
						othDutytax2 = checkFieldAvl('//ITRForm:OthDutyTaxCess/text()', 2);
						expVat1 = checkFieldAvl('//ITRForm:TotExciseCustomsVAT/text()', 2);
						audit = checkFieldAvl('//ITRForm:AuditFee/text()', 0);
						othExp = checkFieldAvl('//ITRForm:OtherExpenses/text()', 0);
						panDet = checkFieldAvl('//ITRForm:PAN/text()', 0);
						panNotAvail = checkFieldAvl('//ITRForm:OthersWherePANNotAvlble/text()', 0);
						otherAmt = checkFieldAvl('//ITRForm:OthersAmtLt1Lakh/text()', 0);
						badDeb = checkFieldAvl('//ITRForm:BadDebt/text()', 0);
						nonResOther3 = checkFieldAvl('//ITRForm:NonResOtherCompany/text()', 3);
						other3 = checkFieldAvl('//ITRForm:Others/text()', 3);
						intExpdtls = checkFieldAvl('//ITRForm:InterestExpdr/text()', 0);
						pbtDet = checkFieldAvl('//ITRForm:PBT/text()', 0);
						proAftrTax = checkFieldAvl('//ITRForm:ProfitAfterTax/text()', 0);
						amtAvlApprDet = checkFieldAvl('//ITRForm:AmtAvlAppr/text()', 0);
						propAccBal = checkFieldAvl('//ITRForm:ProprietorAccBalTrf/text()', 0);
						GrossRept = checkFieldAvl('//ITRForm:GrossReceipt/text()', 0);
						grsProfit = checkFieldAvl('//ITRForm:GrossProfit/text()', 0);
						expense = checkFieldAvl('//ITRForm:Expenses/text()', 0);
						netpro = checkFieldAvl('//ITRForm:NetProfit/text()', 0);
						rType= checkFieldAvl('//ITRForm:ReturnType/text()',0);
						cusDuty= checkFieldAvl('//ITRForm:CustomDuty/text()',0);
						counterDuty= checkFieldAvl('//ITRForm:CounterVailDuty/text()',0);
						splDuty= checkFieldAvl('//ITRForm:SplAddDuty/text()',0);
						fName= checkFieldAvl('//ITRForm:FirstName/text()',0);
						surName= checkFieldAvl('//ITRForm:SurNameOrOrgName/text()',0);
						try{
							//mName= checkFieldAvl('//ITRForm:MiddleName/text()',0);
							mName = select('//ITRForm:MiddleName/text()', doc)[0].nodeValue;

						}
						catch(e){
							mName = ' ';
						}
						name= fName+" "+mName+" "+surName;
						//new xml tags extracted for ITR-3/4
						grossFromPro = checkFieldAvl('//ITRForm:GrossFromProfession/text()', 0);
						grossRecPrf= checkFieldAvl('//ITRForm:GrossReceiptPrf/text()', 0);
						grossProPrf= checkFieldAvl('//ITRForm:GrossProfitPrf/text()', 0);
						expPrf= checkFieldAvl('//ITRForm:ExpensesPrf/text()', 0);
						netProPrf= checkFieldAvl('//ITRForm:NetProfitPrf/text()', 0);
						totBussPro= checkFieldAvl('//ITRForm:TotBusinessProfession/text()', 0);
						intIncome = 0;
						othFinInc =0;
						partSal = 0;
						badDebPan = 0;
						resPart = 0;
						resOthers = 0;apprDividend =0;
						apprdivTax = 0;
						apprOthers =0;
						apprTot =0;
					}
				}
				 catch(e){

				}
			}
			 else{
				console.log('No data found');
			}
		}
		function checkFieldAvl(FieldName,integer){

			try{

					const doc = new dom().parseFromString(data.toString());
					const select = xpath.useNamespaces({ 'ITRForm' : 'http://incometaxindiaefiling.gov.in/master'});
					let value = select(FieldName, doc)[integer].nodeValue
					return value;

			}
			catch(e){
				let value = 0;
				return value;
			}
		}
		//Mapping of json object for ITR-3/4
		if(((formname == 'ITR-4') && (assyear == 2014 ||assyear == 2015 ||assyear == 2016)) || (formname == 'ITR-3' && (assyear == 2017 || assyear == 2018)) ){

			var parDtls = [];
			parDtls = {
			plitrc_OrgName: name,                                 //concatinated field for Org name.
			plitrc_pan: panDet,                                   //PAN
			plitrc_itr_form: formname,                            //FormName
			plitrc_ay: assyear,                 				  //AssessmentYear
			plitrc_form_type: rType,                              //ReturnType
			plitrc_sale_of_goods: saleGood,     		 	  	  //SaleOfGoods
			plitrc_sale_of_service: saleSer,    	 	 		  //SaleOfServices
			plitrc_other_ops_revenue: opRevtoAmt,	 	 	 	  //OperatingRevenueTotAmt
			plitr6_interest_income : intIncome,
			plitr6_oth_finservice_income : othFinInc,
			plitrc_total_sales_bus_recpt : bussrec,               //<ITRForm:BusinessReceipts>
			plitr35_gross_recpt_prof: grossFromPro,               //GrossFromProfession
			plitrc_excise_duty_revenue : uniexc,                  //<ITRForm:UnionExciseDuty>
			plitrc_service_tax_revenue : servtx,                  //<ITRForm:ServiceTax>
			plitrc_VAT_ST_revenue : vattax,                       //VATorSaleTax
			plitrc_other_cess_revenue : othDuytax,                //OthDutyTaxCess
			plitrc_total_taxes_revenue: expVat,  	 	 	 	  //TotExciseCustomsVAT
			plitrc_total_revenue_ops : totrev,					  //TotRevenueFrmOperations
			plitrc_othinc_rent : rentin,						  //RentInc
			plitrc_othinc_comm : com,                             //Comissions
			plitrc_othinc_dividend : div,                         //Dividends
			plitrc_othinc_interest : inter,                       //InterestInc
			plitrc_othinc_sale_fixedassets : ProfitOnSale,        //ProfitOnSaleFixedAsset
			plitrc_othinc_sale_securities : ProfitOnInv,          //ProfitOnInvChrSTT
			plitrc_othinc_sale_othinvest : ProfitOnOth,           //ProfitOnOthInv
			plitrc_othinc_currfluct: ProfitOnCurr,                //ProfitOnCurrFluct
			plitrc_othinc_agriculture : ProfitOnAgri,             //ProfitOnAgriIncome
			plitrc_othinc_others : MiscOth,                       //MiscOthIncome
			plitrc_othinc_total: totOthInc,      	 	 		  //TotOthIncome
			plitrc_clstock_rawmat : rawmat,                       //RawMaterial
			plitrc_clstock_wip : workInPro,                       //WorkInProgress
			plitrc_clstock_fingoods : finiGoods,                  //FinishedGoods
			plitrc_clstock_total: closeStock,  	         		  //ClosingStock
			plitrc_totalcredits_pl : totCre,                         //TotCreditsToPL
			plitrc_opstock_rawmat : rawmat1,                      //RawMaterial
			plitrc_opstock_wip : workInPro1,                      //WorkInProgress
			plitrc_opstock_fingoods : finiGoods1,                 //FinishedGoods
			plitrc_opstock_total: openStock,    	 	  	 	  //OpeningStock
			plitrc_purchases: purchase,         	 	 	 	  //Purchases
			plitrc_customs_duty_purchase: cusDuty,                //CustomDuty
			plitrc_ctveil_duty_purchase: counterDuty,             //CounterVailDuty
			plitrc_spladdnl_duty_purchase: splDuty,               //SplAddDuty
			plitrc_excise_duty_purchase : uniexc1,                //<ITRForm:UnionExciseDuty>
			plitrc_service_tax_purchase: servtx2,                 //<ITRForm:ServiceTax>
			plitrc_VAT_ST_purchase : vattax1,                     //VATorSaleTax
			plitrc_other_tax_purchase : othDutytax1,              //OthDutyTaxCess
			plitrc_total_taxes_purchase: expVat1,     	     	  //TotExciseCustomsVAT
			plitrc_freight :freight,                              //Freight
			plitrc_stores_spares: conStore,    		      	 	  //ConsumptionOfStores
			plitrc_powerfuel: prFuel,           	      		  //PowerFuel
			plitrc_rents : rentExp,                               //RentExpdr
			plitrc_repair_bldg : repairBld,                       //RepairsBldg
			plitrc_repair_mach : repairMach,                      //RepairMach
			plitrc_comp_salaries : salsWage,                      //SalsWages
			plitrc_comp_bonus : bonus,                            //Bonus
			plitrc_comp_medexp : medExp,                          //MedExpReimb
			plitrc_comp_leave_encash : leavEn,                    //LeaveEncash
			plitrc_comp_leave_travel : leaveTrav,                 //LeaveTravelBenft
			plitrc_comp_superann : contToSuper,                   //ContToSuperAnnFund
			plitrc_comp_pf : contToPF,                            //ContToPF
			plitrc_comp_gratuity: contToGrat,                     //ContToGratFund
			plitrc_comp_otherfund: contToOth,                     //ContToOthFund
			plitrc_comp_other_empexp: othEmpBen,                  //OthEmpBenftExpdr
			plitrc_comp_total: totEmpComp,               	 	  //TotEmployeeComp
			plitrc_comp_nonres_yesno: compPaid,                   //AnyCompPaidToNonRes
			plitrc_comp_other_nonres:amtPaid,                     //AmtPaidToNonRes
			plitrc_ins_medical: medIn,                            //MedInsur
			plitrc_ins_life: lifeIn,                              //LifeInsur
			plitrc_ins_keyman: keyMan,                            //keyMan
			plitrc_ins_others: othIn,                             //OthInsur
			plitrc_ins_total: totIns,                             //TotInsurances
			plitrc_staff_welfare_exp: staffWel,                   //StaffWelfareExp
			plitrc_entertainment: ent,                            //Entertainment
			plitrc_hospitality: hosp,                             //Hospitality
			plitrc_conference: conf,                              //Conference
			plitrc_sales_promo: salePro,                          //SalePromoExp
			plitrc_advertisement: adver,                          //Advertisement
			plitrc_comm_nonres: nonResOther,                      //NonResOtherCompany
			plitrc_comm_others: other,                            //Other
			plitrc_comm_total: tot,                               //Total
			plitrc_royalty_nonres: nonResOther1,                  //NonResOtherCompany
			plitrc_royalty_others: other1,                        //Other
			plitrc_royalty_total: tot1,                           //Total
			plitrc_consult_nonres: nonResOther2,                  //NonResOtherCompany
			plitrc_consult_others: other2,                        //Other
			plitrc_consult_total: tot2,                           //Total
			plitrc_hotel_expenses: handleBoard,				      //HotelBoardLodge
			plitrc_travel_nonforeign: travelEx,                   //TravelExp
			plitrc_travel_foreign: foreignTrav,                   //ForeignTravelExp
			plitrc_conveyance_expenses: convey,                   //ConveyanceExp
			plitrc_telephone_expenses: tel,                       //TelephoneExp
			plitrc_guesthouse_expenses: guestHouse,               //GuestHouseExp
			plitrc_club_expenses: clubEx,                         //ClubExp
			plitrc_festival_expenses: festCeleb,                  //FestivalCelebExp
			plitrc_scholarship: schol,                            //Scholarship
			plitrc_gifts: giftDet,                                //Gift
			plitrc_donations: dona,                               //Donation
			plitrc_ratestax_excise : uniexc2,                     //<ITRForm:UnionExciseDuty>
			plitrc_ratestax_sertax: servtx1,                      //<ITRForm:ServiceTax>
			plitrc_ratestax_vat_st : vattax2,                     //VATorSaleTax
			plitrc_ratestax_cess: cessDet,                        //Cess
			plitrc_ratestax_others : othDutytax2,                 //OthDutyTaxCess
			plitrc_ratestax_total: toexpVat,             	 	  //TotExciseCustomsVAT
			plitrc_audit_fee: audit,                              //AuditFee
			plitr35_partner_salary : partSal,
			plitrc_oth_expenses: othExp,                          //OtherExpenses
			plitrc_baddebt_1lk_pan : badDebPan,
			plitrc_baddebt_1lk_nopan: panNotAvail,                //OthersWherePANNotAvlble
			plitrc_baddebt_amt_lt1lakh: otherAmt,                 //OthersAmtLt1Lakh
			plitrc_baddebt_total: badDeb,                 		  //BadDebt
			plitrc_baddebt_provision: proveBadDoubt,    	 	  //provForbadDebtDetls
			plitrc_oth_provisions: othProExp,         	     	  //OthProvisionsExpdr
			plitrc_pbdit: pbita,                  	       	      //PBIDTA
			plitrc_int_nonres_partner: nonResOther3,              //NonResOtherCompany
			plitrc_int_nonres_others: other3,                     //Other
			plitr35_int_res_partner: resPart,
			plitr35_int_res_others: resOthers,
			plitrc_int_total: intExpdtls,      	            	  //InterestExpdr
			plitrc_dep_amt: depAmort,  	                    	  //DepreciationAmort
			plitrc_profit_beforetax: pbtDet,                      //PBT
			plitrc_curtax_provisions: provCurTax,          	      //ProvForCurrTax
			plitrc_deftax_provisions: proveDefTax,    	     	  //ProvDefTax
			plitrc_profit_aftertax: proAftrTax,                   //ProfitAfterTax
			plitrc_bal_bf: balbfYr,                   	   	      //BalBFPrevYr
			plitrc_amt_appropriation : amtAvlApprDet,             //AmtAvlAppr
			plitrc_appr_reserves: trfRes,            	   	      //TrfToReserves
			plitr6_appr_dividend: apprDividend,
			plitr6_appr_dividendtax :apprdivTax,
			plitr6_appr_others : apprOthers,
			plitr6_appr_total: apprTot,

			plitrc_balanceto_bs : propAccBal,                     //ProprietorAccBalTrf
			plitrc_bus_grossreciepts: GrossRept,     	  	      //GrossReceipt
			plitrc_bus_grossprofit: grsProfit,        	 	      //GrossProfit
			plitrc_bus_expenses: expense,             	   		  //Expenses
			plitrc_bus_netprofit: netpro,                         //NetProfit
			plitr35_prf_grossreciepts: grossRecPrf,               //GrossProfitPrf
			plitr35_prf_grossprofit: grossProPrf,                 //GrossProfitPrf
			plitr35_prf_expenses: expPrf,                         //ExpensesPrf
			plitr35_prf_netprofit: netProPrf,                     //NetProfitPrf
			plitr35_noaccts_totalProfit: totBussPro,              //TotBusinessProfession
		};
			//console.log(parDtls);
			//Header info which is made to appear  in csv on top.
			const header = ['plitrc_OrgName', 'plitrc_pan', 'plitrc_itr_form', 'plitrc_ay', 'plitrc_form_type', 'plitrc_sale_of_goods', 'plitrc_sale_of_service',
							'plitrc_other_ops_revenue','plitr6_interest_income','plitr6_oth_finservice_income', 'plitrc_total_sales_bus_recpt', 'plitr35_gross_recpt_prof', 'plitrc_excise_duty_revenue', 'plitrc_service_tax_revenue',
							'plitrc_VAT_ST_revenue', 'plitrc_other_cess_revenue', 'plitrc_total_taxes_revenue', 'plitrc_total_revenue_ops', 'plitrc_othinc_rent', 'plitrc_othinc_comm',
							'plitrc_othinc_dividend', 'plitrc_othinc_interest', 'plitrc_othinc_sale_fixedassets', 'plitrc_othinc_sale_securities', 'plitrc_othinc_sale_othinvest',
							'plitrc_othinc_currfluct', 'plitrc_othinc_agriculture', 'plitrc_othinc_others', 'plitrc_othinc_total', 'plitrc_clstock_rawmat', 'plitrc_clstock_wip',
							'plitrc_clstock_fingoods', 'plitrc_clstock_total', 'plitrc_totalcredits_pl', 'plitrc_opstock_rawmat', 'plitrc_opstock_wip', 'plitrc_opstock_fingoods',
							'plitrc_opstock_total', 'plitrc_purchases', 'plitrc_customs_duty_purchase', 'plitrc_ctveil_duty_purchase', 'plitrc_spladdnl_duty_purchase',
							'plitrc_excise_duty_purchase', 'plitrc_service_tax_purchase', 'plitrc_VAT_ST_purchase', 'plitrc_other_tax_purchase', 'plitrc_total_taxes_purchase',
							'plitrc_freight', 'plitrc_stores_spares', 'plitrc_powerfuel', 'plitrc_rents', 'plitrc_repair_bldg', 'plitrc_repair_mach', 'plitrc_comp_salaries',
							'plitrc_comp_bonus', 'plitrc_comp_medexp', 'plitrc_comp_leave_encash', 'plitrc_comp_leave_travel', 'plitrc_comp_superann', 'plitrc_comp_pf',
							'plitrc_comp_gratuity', 'plitrc_comp_otherfund', 'plitrc_comp_other_empexp', 'plitrc_comp_total', 'plitrc_comp_nonres_yesno', 'plitrc_comp_other_nonres',
							'plitrc_ins_medical', 'plitrc_ins_life', 'plitrc_ins_keyman', 'plitrc_ins_others', 'plitrc_ins_total', 'plitrc_staff_welfare_exp', 'plitrc_entertainment',
							'plitrc_hospitality', 'plitrc_conference', 'plitrc_sales_promo', 'plitrc_advertisement', 'plitrc_comm_nonres', 'plitrc_comm_others', 'plitrc_comm_total',
							'plitrc_royalty_nonres', 'plitrc_royalty_others', 'plitrc_royalty_total', 'plitrc_consult_nonres', 'plitrc_consult_others', 'plitrc_consult_total',
							'plitrc_hotel_expenses', 'plitrc_travel_nonforeign', 'plitrc_travel_foreign', 'plitrc_conveyance_expenses', 'plitrc_telephone_expenses',
							'plitrc_guesthouse_expenses', 'plitrc_club_expenses', 'plitrc_festival_expenses', 'plitrc_scholarship', 'plitrc_gifts', 'plitrc_donations',
							'plitrc_ratestax_excise', 'plitrc_ratestax_sertax', 'plitrc_ratestax_vat_st', 'plitrc_ratestax_cess', 'plitrc_ratestax_others', 'plitrc_ratestax_total',
							'plitrc_audit_fee','plitr35_partner_salary', 'plitrc_oth_expenses','plitrc_baddebt_1lk_pan', 'plitrc_baddebt_1lk_nopan', 'plitrc_baddebt_amt_lt1lakh', 'plitrc_baddebt_total', 'plitrc_baddebt_provision',
							'plitrc_oth_provisions', 'plitrc_pbdit', 'plitrc_int_nonres_partner', 'plitrc_int_nonres_others','plitr35_int_res_partner', 'plitr35_int_res_others','plitrc_int_total', 'plitrc_dep_amt', 'plitrc_profit_beforetax',
							'plitrc_curtax_provisions', 'plitrc_deftax_provisions', 'plitrc_profit_aftertax', 'plitrc_bal_bf', 'plitrc_amt_appropriation', 'plitrc_appr_reserves','plitr6_appr_dividend', 'plitr6_appr_dividendtax',
							'plitr6_appr_others','plitr6_appr_total','plitrc_balanceto_bs', 'plitrc_bus_grossreciepts', 'plitrc_bus_grossprofit', 'plitrc_bus_expenses', 'plitrc_bus_netprofit', 'plitr35_prf_grossreciepts',
							'plitr35_prf_grossprofit', 'plitr35_prf_expenses', 'plitr35_prf_netprofit', 'plitr35_noaccts_totalProfit'];
			try {
				const ffcsv = json2csv({
				data: parDtls,
				fields: header
				});
				const fileEx = '.csv';
				const type = 'PLInd';
				if (ffcsv) {
					fs.writeFileSync(path1 + orderNo + path3 + '/' + panDet + '_' + type + '_' + formname + '_' + assyear + fileEx, ffcsv);
					//console.log('Corporate extraction for pl completed');
				} else {

				}
			} catch (e) {

			}
		}
	}
}
