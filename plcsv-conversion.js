/* Source Code Header
Program Name	:	plcsv-Conversion.js
Module Name		:
Description  	:	In this program we are Extraction all the OutstandingTaxDemand information from Json source file and converting into CSV output files.

Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 27/02/2017
Created By		:	sekar
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		:	Revision Date:		Revised By		  Details
1.1		    		12th Aug 2016		sekar			  Modified for fixing logic issues
1.2				:	24th Aug 2016 		sekar 			  Added Missed field for ITR1 &ITR2 &ITR3
1.3				:	30th Aug 2016		sekar			  Adding try and Catch Error
1.4             :	6th Oct 2016		sekar			  Added ExtraFields
1.5             :	20th Oct 2016		sekar			  Added Comments & else Condition for All ITR Mappings
1.6				:	4th Nov 2016		sekar			  Added extra additional mapping fields
1.7				:   19th June 2017		Mohammed Salman	  Adding Extra fields for year 2017
---------------------------------------------------------------------------------------------*/
const fs = require('fs'),
    xml2js = require('xml2js');
const json2csv = require('json2csv');
const JSONPath = require('JSONPath');
const parser = new xml2js.Parser();
const mkdirp = require('mkdirp');
const xpath = require('xpath'),
    dom = require('xmldom').DOMParser;

const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? './googleDownUpload/' : "./awsDownUpload/";
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';
const PLcsvPath = 'PLCsvFiles/';

module.exports = {
    PLConversion(ofilename, rfilename, year, orderNo, pullSeqNo) {
		const FilePaths = [];
        FilePaths[0] = path1 + orderNo + path2 + '/' + ofilename;
        FilePaths[1] = path1 + orderNo + path2 + '/' + rfilename;
        console.log(ofilename, rfilename,year, orderNo,pullSeqNo);


	//variables which are previously present for 2014,15,16 years
	var saleGood = [];
	var saleSer = [];
	var opRevtoAmt = [];
	var totOthInc = [];
	var openStock = [];
	var purchase = [];
	var closeStock = [];
	var conStore = [];
	var prFuel = [];
	var totEmpComp = [];
	var badDeb = [];
	var proveBadDoubt =[];
	var othProExp =[];
	var pbita =[];
	var intExpdtls =[];
	var depAmort =[];
	var provCurTax =[];
	var proveDefTax =[];
	var balbfYr =[];
	var trfRes =[];
	var GrossRept =[];
	var grsProfit =[];
	var expense =[];
	var assyear = [];
	var totExCus = [];
	var expVat = [];
	var toexpVat = [];
	var formname = [];
	var Assets =[];
	var Liability = [];

	//New extracted field variable for 2017
	var bussrec =[];
	var grossFromPro =[];
	var uniexc =[];
	var uniexc1 =[];
	var uniexc2 =[];
	var servtx =[];
	var servtx1 =[];
	var servtx2 =[];
	var vattax =[];
	var vattax1 =[];
	var vattax2 =[];
	var othDuytax =[];
	var othDutytax1 =[];
	var othDutytax2 =[];
	var totrev =[];
	var rentin =[];
	var com =[];
	var div =[];
	var inter = [];
	var ProfitOnSale =[];
	var ProfitOnInv =[];
	var ProfitOnOth =[];
	var ProfitOnCurr =[];
	var ProfitOnAgri =[];
	var MiscOth =[];
	var rawmat =[];
	var rawmat1 =[];
	var workInPro =[];
	var workInPro1 =[];
	var finiGoods =[];
	var finiGoods1 =[];
	var totCre =[];
	var freight =[];
	var rentExp =[];
	var repairBld =[];
	var repairMach =[];
	var salsWage =[];
	var bonus =[];
	var medExp =[];
	var leavEn =[];
	var leaveTrav =[];
	var contToSuper =[];
	var contToPF =[];
	var contToGrat =[];
	var contToOth =[];
	var othEmpBen =[];
	var compPaid =[];
	var amtPaid =[];
	var medIn =[];
	var lifeIn =[];
	var keyMan =[];
	var othIn =[];
	var totIns =[];
	var staffWel =[];
	var ent =[];
	var hosp =[];
	var conf =[];
	var salePro =[];
	var adver =[];
	var nonResOther =[];
	var nonResOther1 =[];
	var nonResOther2 =[];
	var nonResOther3 =[];
	var other =[];
	var other1 =[];
	var other2 =[];
	var other3 =[];
	var tot =[];
	var tot1 =[];
	var tot2 =[];
	var handleBoard =[];
	var travelEx =[];
	var foreignTrav =[];
	var convey =[];
	var tel =[];
	var guestHouse =[];
	var clubEx =[];
	var festCeleb =[];
	var schol =[];
	var giftDet =[];
	var dona =[];
	var cessDet =[];
	var audit =[];
	var othExp =[];
	var panDet =[];
	var amt =[];
	var otherAmt =[];
	var panNotAvail =[];
	var pbtDet =[];
	var proAftrTax =[];
	var amtAvlApprDet =[];
	var propAccBal =[];
	var netpro =[];
	var totBussPro =[];
	var grossRecPrf =[];
	var grossProPrf =[];
	var expPrf =[];
	var netProPrf =[];

	//this condition gets executed when the revised file is found.
	if( typeof rfilename != 'undefined'){
		var data = fs.readFileSync(FilePaths[1]);
		console.log('Revised file found');
		if (data) {
			try {
					const doc = new dom().parseFromString(data.toString());
                    const select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master' })
					formname = checkFieldAvl('//ITRForm:FormName/text()', 0);
					Assets = checkFieldAvl('//ITRForm:TotalImmovablMovablAssets/text()', 0);
					Liability = checkFieldAvl('//ITRForm:LiabilityInRelatAssets/text()', 0);
					assyear = checkFieldAvl('//ITRForm:AssessmentYear/text()',0)
                //will check for the year 2014,2015 & 2016 for ITR-4.
				if(formname == 'ITR-4' && (assyear == 2014 || assyear == 2015 || assyear == 2016) ){

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

					//Added New fields
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
					expVat = checkFieldAvl('//ITRForm:TotExciseCustomsVAT/text()', 0);
					audit = checkFieldAvl('//ITRForm:AuditFee/text()', 0);
					othExp = checkFieldAvl('//ITRForm:OtherExpenses/text()', 0);
					panDet = checkFieldAvl('//ITRForm:PAN/text()', 0);
					amt = checkFieldAvl('//ITRForm:Amount/text()', 0);
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
					grossFromPro = checkFieldAvl('//ITRForm:GrossFromProfession/text()', 0);
					grossRecPrf= checkFieldAvl('//ITRForm:GrossReceiptPrf/text()', 0);
					grossProPrf= checkFieldAvl('//ITRForm:GrossProfitPrf/text()', 0);
					expPrf= checkFieldAvl('//ITRForm:ExpensesPrf/text()', 0);
					netProPrf= checkFieldAvl('//ITRForm:NetProfitPrf/text()', 0);
					totBussPro= checkFieldAvl('//ITRForm:TotBusinessProfession/text()', 0);
                    //since these fields are present only in 2017.
					//so to avoid getting array value as output for any previous years we assigning it to zero.
					// grossFromPro =0;uniexc  =0;uniexc1 =0; uniexc2  =0;servtx  =0;servtx1  =0;servtx2  =0;vattax  =0;vattax1  =0;vattax2  =0;othDuytax  =0;othDutytax1  =0;othDutytax2  =0;totrev  =0;rentin  =0;com  =0;div  =0;inter   =0;ProfitOnSale  =0;
					// ProfitOnInv  =0;ProfitOnOth  =0;ProfitOnCurr  =0;ProfitOnAgri  =0;MiscOth  =0;rawmat  =0;rawmat1  =0;workInPro  =0;workInPro1  =0;finiGoods  =0;finiGoods1  =0;totCre  =0;freight =0;rentExp  =0;repairBld  =0;repairMach  =0;salsWage  =0;
					// bonus  =0;medExp  =0;leavEn  =0;leaveTrav  =0;contToSuper =0;contToPF  =0;contToGrat  =0;contToOth  =0;othEmpBen =0;compPaid  =0;amtPaid  =0;medIn  =0;lifeIn  =0;keyMan  =0;othIn  =0;totIns =0;staffWel  =0;ent =0;hosp  =0;conf  =0;netProPrf =0;
					// salePro  =0;adver  =0;nonResOther =0;nonResOther1 =0;nonResOther2  =0;nonResOther3  =0;other  =0;other1  =0;other2  =0;other3  =0;tot  =0;tot1  =0;tot2  =0;handleBoard  =0;travelEx  =0;foreignTrav  =0;convey  =0;tel  =0;guestHouse  =0;expPrf  =0;
					// clubEx  =0;festCeleb  =0;schol  =0;giftDet  =0;dona  =0;cessDet  =0;audit  =0;othExp  =0;panDet  =0;amt  =0;otherAmt  =0;panNotAvail  =0;pbtDet  =0;proAftrTax  =0;amtAvlApprDet  =0;propAccBal =0;netpro  =0;totBussPro  =0;grossRecPrf  =0;grossProPrf  =0;


			}
			    //if the year is 2017 and ITR-3 it will get executed.
				else if(formname =='ITR-3' && assyear == 2017 ){
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
					//Extracting the values from the new fields which are added for 2017.
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
					expVat = checkFieldAvl('//ITRForm:TotExciseCustomsVAT/text()', 0);
					audit = checkFieldAvl('//ITRForm:AuditFee/text()', 0);
					othExp = checkFieldAvl('//ITRForm:OtherExpenses/text()', 0);
					panDet = checkFieldAvl('//ITRForm:PAN/text()', 0);
					amt = checkFieldAvl('//ITRForm:Amount/text()', 0);
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
					grossFromPro = checkFieldAvl('//ITRForm:GrossFromProfession/text()', 0);
					grossRecPrf= checkFieldAvl('//ITRForm:GrossReceiptPrf/text()', 0);
					grossProPrf= checkFieldAvl('//ITRForm:GrossProfitPrf/text()', 0);
					expPrf= checkFieldAvl('//ITRForm:ExpensesPrf/text()', 0);
					netProPrf= checkFieldAvl('//ITRForm:NetProfitPrf/text()', 0);
					totBussPro= checkFieldAvl('//ITRForm:TotBusinessProfession/text()', 0);

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
	 //If original file found then this gets executed.
	else {
		 var data = fs.readFileSync(FilePaths[0]);
		 console.log('original file found');
		if (data) {
			try {
					const doc = new dom().parseFromString(data.toString());
                    const select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master' })
					formname = checkFieldAvl('//ITRForm:FormName/text()', 0);
					Assets = checkFieldAvl('//ITRForm:TotalImmovablMovablAssets/text()', 0);
					Liability = checkFieldAvl('//ITRForm:LiabilityInRelatAssets/text()', 0);
					assyear = checkFieldAvl('//ITRForm:AssessmentYear/text()',0)
			//will check for the year 2014,2015 & 2016 for ITR-4.
			if(formname == 'ITR-4' && (assyear == 2014 || assyear == 2015 || assyear == 2016) ){
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

					//Added New fields
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
					expVat = checkFieldAvl('//ITRForm:TotExciseCustomsVAT/text()', 0);
					audit = checkFieldAvl('//ITRForm:AuditFee/text()', 0);
					othExp = checkFieldAvl('//ITRForm:OtherExpenses/text()', 0);
					panDet = checkFieldAvl('//ITRForm:PAN/text()', 0);
					amt = checkFieldAvl('//ITRForm:Amount/text()', 0);
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
					grossFromPro = checkFieldAvl('//ITRForm:GrossFromProfession/text()', 0);
					grossRecPrf= checkFieldAvl('//ITRForm:GrossReceiptPrf/text()', 0);
					grossProPrf= checkFieldAvl('//ITRForm:GrossProfitPrf/text()', 0);
					expPrf= checkFieldAvl('//ITRForm:ExpensesPrf/text()', 0);
					netProPrf= checkFieldAvl('//ITRForm:NetProfitPrf/text()', 0);
					totBussPro= checkFieldAvl('//ITRForm:TotBusinessProfession/text()', 0);
					//since these fiels are present only in 2017.
					//so to avoid getting array value as output for any previous years we assigning it to zero.
					// bussrec =0;grossFromPro =0;uniexc  =0;uniexc1 =0; uniexc2  =0;servtx  =0;servtx1  =0;servtx2  =0;vattax  =0;vattax1  =0;vattax2  =0;othDuytax  =0;othDutytax1  =0;othDutytax2  =0;totrev  =0;rentin  =0;com  =0;div  =0;inter   =0;ProfitOnSale  =0;
					// ProfitOnInv  =0;ProfitOnOth  =0;ProfitOnCurr  =0;ProfitOnAgri  =0;MiscOth  =0;rawmat  =0;rawmat1  =0;workInPro  =0;workInPro1  =0;finiGoods  =0;finiGoods1  =0;totCre  =0;freight =0;rentExp  =0;repairBld  =0;repairMach  =0;salsWage  =0;
					// bonus  =0;medExp  =0;leavEn  =0;leaveTrav  =0;contToSuper =0;contToPF  =0;contToGrat  =0;contToOth  =0;othEmpBen =0;compPaid  =0;amtPaid  =0;medIn  =0;lifeIn  =0;keyMan  =0;othIn  =0;totIns =0;staffWel  =0;ent =0;hosp  =0;conf  =0;
					// salePro  =0;adver  =0;nonResOther =0;nonResOther1 =0;nonResOther2  =0;nonResOther3  =0;other  =0;other1  =0;other2  =0;other3  =0;tot  =0;tot1  =0;tot2  =0;handleBoard  =0;travelEx  =0;foreignTrav  =0;convey  =0;tel  =0;guestHouse  =0;
					// clubEx  =0;festCeleb  =0;schol  =0;giftDet  =0;dona  =0;cessDet  =0;audit  =0;othExp  =0;panDet  =0;amt  =0;otherAmt  =0;panNotAvail  =0;pbtDet  =0;proAftrTax  =0;amtAvlApprDet  =0;propAccBal =0;netpro  =0;totBussPro  =0;grossRecPrf  =0;grossProPrf  =0;expPrf  =0;netProPrf =0;
			}
				//if the year is 2017 and ITR-3 it will get executed.
				else if(formname =='ITR-3' && assyear == 2017 ){
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
					//Extracting the values from the new fields which are added for 2017.
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
					expVat = checkFieldAvl('//ITRForm:TotExciseCustomsVAT/text()', 0);
					audit = checkFieldAvl('//ITRForm:AuditFee/text()', 0);
					othExp = checkFieldAvl('//ITRForm:OtherExpenses/text()', 0);
					panDet = checkFieldAvl('//ITRForm:PAN/text()', 0);
					amt = checkFieldAvl('//ITRForm:Amount/text()', 0);
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
					grossFromPro = checkFieldAvl('//ITRForm:GrossFromProfession/text()', 0);
					grossRecPrf= checkFieldAvl('//ITRForm:GrossReceiptPrf/text()', 0);
					grossProPrf= checkFieldAvl('//ITRForm:GrossProfitPrf/text()', 0);
					expPrf= checkFieldAvl('//ITRForm:ExpensesPrf/text()', 0);
					netProPrf= checkFieldAvl('//ITRForm:NetProfitPrf/text()', 0);
					totBussPro= checkFieldAvl('//ITRForm:TotBusinessProfession/text()', 0);

				}
			else{
				console.log('Not ITR-4' & 'ITR-3');
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
		        //Here mapping of json object in the form of key and value pair is being done.
				if(((formname == 'ITR-4') && (assyear == 2014 ||assyear == 2015||assyear == 2016)) || (formname == 'ITR-3' && assyear == 2017) ){
						var parDtls = [];
							parDtls = {
								Year__c: assyear,
								saleOfGood: saleGood,
								saleOfService: saleSer,
								opeRevDetails: opRevtoAmt,
								salesDutyTax: expVat,
								totOthIncome: totOthInc,
								openingStock: openStock,
								purchases: purchase,
								purDutyTax: toexpVat,
								closingStock: closeStock,
								conOfStores: conStore,
								powerFuel: prFuel,
								totEmployeeComp: totEmpComp,
								badDebtDetls: badDeb,
								provForbadDebtDetls: proveBadDoubt,
								othProvExp: othProExp,
								PBITA: pbita,
								intExpDetls: intExpdtls,
								DepAmort: depAmort,
								provCurTax: provCurTax,
								provDefTax: proveDefTax,
								balBFprYr: balbfYr,
								trfToRes: trfRes,
								grossRept: GrossRept,
								grossPft: grsProfit,
								expenses: expense,
								//Mapping of fields which were  newly extracted for 2017.
								busReceipt : bussrec,
								GrossFromProfession: grossFromPro,
								unExDuty : uniexc,
								unExDuty1 : uniexc1,
								unExDuty2 : uniexc2,
								serTax : servtx,
								serviceTax1: servtx1,
								serviceTax2: servtx2,
								vatOrSaleTaxDetails : vattax,
								vatOrSaleTax1 : vattax1,
								vatOrSaleTax2 : vattax2,
								othDutyTax : othDuytax,
								othDutyTax1 : othDutytax1,
								othDutyTax2 : othDutytax2,
								totRevFop : totrev,
								rentIncome : rentin,
								commission : com,
								dividens : div,
								interestIncDetails : inter,
								ProfitOnSaleFixedAsset : ProfitOnSale,
								profitOnInvChargeSTT : ProfitOnInv,
								profitOnotheInv : ProfitOnOth,
								profitOnCurFluct: ProfitOnCurr,
								profitOnAgriInc : ProfitOnAgri,
								miscOtheIncome : MiscOth,
								rawMaterials : rawmat,
								rawMaterials1 : rawmat1,
								workInProgressDetails : workInPro,
								workInProgress1 : workInPro1,
								finishGoods : finiGoods,
								finishGoods1 : finiGoods1,
								totCreditstoPL : totCre,
								FrighrDetails :freight,
								rentExpenditure : rentExp,
								RepairsBldg : repairBld,
								RepairMachdetails : repairMach,
								salesWages : salsWage,
								BounusDetails : bonus,
								medicalExpenditureReimb : medExp,
								LeaveEncash : leavEn,
								LeaveTravelBenefit : leaveTrav,
								ContToSprAnnualFnd : contToSuper,
								ContToPFDetails : contToPF,
								ContToGratFund: contToGrat,
								ContToOthFund: contToOth,
								OthEmpBenftExpdr: othEmpBen,
								AnyCompPaidToNonRes: compPaid,
								AmtPaidToNonRes:amtPaid,
								MedInsur: medIn,
								LifeInsur: lifeIn,
								KeyManInsur: keyMan,
								OthInsur: othIn,
								TotInsurances: totIns,
								StaffWelfareExp: staffWel,
								Entertainment: ent,
								Hospitality: hosp,
								Conference: conf,
								SalePromoExp: salePro,
								Advertisement: adver,
								NonResOtherCompany: nonResOther,
								NonResOtherCompany1: nonResOther1,
								NonResOtherCompany2: nonResOther1,
								NonResOtherCompan3: nonResOther3,
								Others: other,
								Others1: other1,
								Others2: other2,
								Others3: other3,
								Total: tot,
								Total1: tot1,
								Total2: tot2,
								HotelBoardLodge: handleBoard,
								TravelExp: travelEx,
								ForeignTravelExp: foreignTrav,
								ConveyanceExp: convey,
								TelephoneExp: tel,
								GuestHouseExp: guestHouse,
								ClubExp: clubEx,
								FestivalCelebExp: festCeleb,
								Scholarship: schol,
								Gift: giftDet,
								Donation: dona,
								CessDetails: cessDet,
								AuditFee: audit,
								OtherExpenses: othExp,
								PAN: panDet,
								Amount: amt,
								OthersAmtLt1Lakh: otherAmt,
								OthersWherePANNotAvlble: panNotAvail,
								PBT: pbtDet,
								ProfitAfterTax: proAftrTax,
								AmtAvlApprDetails : amtAvlApprDet,
								ProprietorAccBalTrf : propAccBal,
								NetProfit: netpro,
								GrossReceiptPrf: grossRecPrf,
								GrossProfitPrf: grossProPrf,
								ExpensesPrf: expPrf,
								NetProfitPrf: netProPrf,
								TotBusinessProfession: totBussPro,

							};
              //console.log(parDtls);
			  //Header info which is made to appear  in csv on top.
			  const header = ['Year__c','saleOfGood', 'saleOfService', 'opeRevDetails', 'salesDutyTax','totOthIncome','openingStock','purchases','purDutyTax','closingStock','conOfStores','powerFuel','totEmployeeComp','badDebtDetls','provForbadDebtDetls','othProvExp','PBITA','intExpDetls','DepAmort','provCurTax','provDefTax','balBFprYr','trfToRes','grossRept','grossPft','expenses',
			                  'busReceipt','GrossFromProfession','unExDuty','unExDuty1','unExDuty2','serTax','serviceTax1','serviceTax2','vatOrSaleTaxDetails','vatOrSaleTax1','vatOrSaleTax2','othDutyTax','othDutyTax1','othDutyTax2',
							  'totRevFop','rentIncome','commission','dividens','interestIncDetails','ProfitOnSaleFixedAsset','profitOnInvChargeSTT','profitOnotheInv','profitOnCurFluct','profitOnAgriInc','miscOtheIncome','rawMaterials',
							  'rawMaterials1','workInProgressDetails','workInProgress1','finishGoods','finishGoods1','totCreditstoPL','FrighrDetails','rentExpenditure','RepairsBldg','RepairMachdetails','salesWages','BounusDetails',
							  'medicalExpenditureReimb','LeaveEncash','LeaveTravelBenefit','ContToSprAnnualFnd','ContToPFDetails','ContToGratFund','ContToOthFund','OthEmpBenftExpdr','AnyCompPaidToNonRes','AmtPaidToNonRes','MedInsur',
							  'LifeInsur','KeyManInsur','OthInsur','TotInsurances','StaffWelfareExp','Entertainment','Hospitality','Conference','SalePromoExp','Advertisement','NonResOtherCompany','NonResOtherCompany1','NonResOtherCompany2',
							  'NonResOtherCompan3','Others','Others1','Others2','Others3','Total','Total1','Total2','HotelBoardLodge','TravelExp','ForeignTravelExp','ConveyanceExp','TelephoneExp','GuestHouseExp','ClubExp','FestivalCelebExp',
							  'Scholarship','Gift','Donation','CessDetails','AuditFee','OtherExpenses','PAN','Amount','OthersWherePANNotAvlble','OthersAmtLt1Lakh','PBT','ProfitAfterTax','AmtAvlApprDetails','ProprietorAccBalTrf',
							  'NetProfit',,'GrossReceiptPrf','GrossProfitPrf','ExpensesPrf','NetProfitPrf','TotBusinessProfession'];
			try {
                    const ffcsv = json2csv({
                        data: parDtls,
                        fields: header
                    });
                    const fileEx = '.csv';
					const type = 'PL';
						if (ffcsv) {
						try{
							mkdirp.sync(path1 + orderNo + "/"+ PLcsvPath);
						}
						catch(e){
							console.log('error'+e);
						}

						fs.writeFileSync(path1 + orderNo + "/"+ PLcsvPath + '/' + orderNo + '_' + pullSeqNo + '_' + type + '_' + assyear + fileEx, ffcsv);
						console.log('Pl convertion completed');
                    } else {

                    }
                } catch (e) {

				}
		}




	}
};
