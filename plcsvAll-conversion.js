/* Source Code Header
Program Name	:	bankCsv-Conversion.js
Module Name		:
Description  	:	In this program we are Extracting  Bank information from XML source file and converting into CSV output files.

Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 05/08/2016
Created By		:	sekar
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		:	Revision Date:		Revised By		Details
1.1				:	24th Jan 2017		sekar			Adding New Logic to extract all the bank information
---------------------------------------------------------------------------------------------*/
var csv1 = require('csv-parser')
var fs = require('fs');
const path = require('path');
var json2csv = require('json2csv');
var split = require('split');
const rmdir = require('rmdir');
var Converter = require("csvtojson").Converter;

const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? 'googleDownUpload/' : "awsDownUpload/";
const PLcsvPath = 'PLCsvFiles/';
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';

var converter = new Converter({});


 module.exports = {
	plCSVAllConv(orderNo, pullSeqNo) {
	//	console.log('Enter plcsvall');
		try{
			var items = fs.readdirSync(path1 + orderNo + "/" +PLcsvPath );
		console.log(items + '.....................................');

			for(i=0;i<items.length;i++){
				var files =[];
				var testf =[];
				files[i] = path1 + orderNo + "/" + PLcsvPath + items[i];
				console.log(files[i]+ '...................................');
				const csv=require('csvtojson')
				csv()
				.fromFile(files[i])
				.on('json',(jsonObj)=>{
					testf.push(jsonObj);
					createCSV(testf)
					})
						.on('done',(error)=>{
							//console.log('end')
				})


				}

			}
			catch(e){
				console.log( e +'no files');
			}
			function createCSV(testf){
				if(testf){
						var type = "PlAll";
						var fileEx = ".csv";
						const header = ['Year__c','saleOfGood', 'saleOfService', 'opeRevDetails', 'salesDutyTax','totOthIncome','openingStock','purchases','purDutyTax','closingStock','conOfStores','powerFuel','totEmployeeComp','badDebtDetls','provForbadDebtDetls','othProvExp','PBITA','intExpDetls','DepAmort','provCurTax','provDefTax','balBFprYr','trfToRes','grossRept','grossPft','expenses',
			                  'busReceipt','GrossFromProfession','unExDuty','unExDuty1','unExDuty2','serTax','serviceTax1','serviceTax2','vatOrSaleTaxDetails','vatOrSaleTax1','vatOrSaleTax2','othDutyTax','othDutyTax1','othDutyTax2',
							  'totRevFop','rentIncome','commission','dividens','interestIncDetails','ProfitOnSaleFixedAsset','profitOnInvChargeSTT','profitOnotheInv','profitOnCurFluct','profitOnAgriInc','miscOtheIncome','rawMaterials',
							  'rawMaterials1','workInProgressDetails','workInProgress1','finishGoods','finishGoods1','totCreditstoPL','FrighrDetails','rentExpenditure','RepairsBldg','RepairMachdetails','salesWages','BounusDetails',
							  'medicalExpenditureReimb','LeaveEncash','LeaveTravelBenefit','ContToSprAnnualFnd','ContToPFDetails','ContToGratFund','ContToOthFund','OthEmpBenftExpdr','AnyCompPaidToNonRes','AmtPaidToNonRes','MedInsur',
							  'LifeInsur','KeyManInsur','OthInsur','TotInsurances','StaffWelfareExp','Entertainment','Hospitality','Conference','SalePromoExp','Advertisement','NonResOtherCompany','NonResOtherCompany1','NonResOtherCompany2',
							  'NonResOtherCompan3','Others','Others1','Others2','Others3','Total','Total1','Total2','HotelBoardLodge','TravelExp','ForeignTravelExp','ConveyanceExp','TelephoneExp','GuestHouseExp','ClubExp','FestivalCelebExp',
							  'Scholarship','Gift','Donation','CessDetails','AuditFee','OtherExpenses','PAN','Amount','OthersWherePANNotAvlble','OthersAmtLt1Lakh','PBT','ProfitAfterTax','AmtAvlApprDetails','ProprietorAccBalTrf',
							  'NetProfit',,'GrossReceiptPrf','GrossProfitPrf','ExpensesPrf','NetProfitPrf','TotBusinessProfession'];
						var ffcsv = json2csv({data: testf,fields: header});
						const path = path1 + orderNo + path3 + '/' + orderNo + '_' + pullSeqNo + '_' + type + fileEx;
						fs.writeFileSync(path, ffcsv);

							console.log('PLCSV conversion completed');
					}else{
						console.log('there is no data for Bank');
					}
			}
	}
};
