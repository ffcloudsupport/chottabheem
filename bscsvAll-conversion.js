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

const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? './googleDownUpload/' : "awsDownUpload/";
const BscsvPath = 'BsCsvFiles/';
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';

var converter = new Converter({});


 module.exports = {
	BSCSVAllConv(orderNo, pullSeqNo) {
		try{
			var items = fs.readdirSync(path1 + orderNo + "/" +BscsvPath );
		console.log(items + '.....................................');

			for(i=0;i<items.length;i++){
				var files =[];
				var testf =[];
				files[i] = path1 + orderNo + "/" + BscsvPath + items[i];
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
						var type = "BSAll";
						var fileEx = ".csv";
						const header = ['Year__c','PropCap', 'TotResrnSyrf', 'foreignCurLoan', 'FromOthers','DeferredTax','GrossBlock','Depreciation','CapWorkProgram','TotLongTermInvest','TotalTradeInvest','TotalInventries','SyndryDebtors','TotalCashOrBankBal','OtherCurAsset','TotalLoanAdv','SundryCred','LiableForLeasedAsset','AccIncLeasedAsset','AccIntNotDue','TotalProvisions','MiscExpenditure','DefTaxAsset','AccumulatedLosses','TotalSundryDebitAmt','TotalSundryCreAmt','TotalSktTradeAmt','CashBalAmount','SecureLoanBank','UnSecLoanBank','UnSecureLnFromOthers',
							  'RevaluationReserve','CapitalReserve', 'StatutoryReserve','AnyOtherReserve','TotalProprietorFund','TotalRupeeLoans','TotalSecuredLoan','TotalUnsecureLoan',
							   'TotalLoanFunds','Sourcesoffunds','Netblock','TotalFixedAssets','GovtAndOtherSecuritiesQuoted','GovtAndOtherSecuritiesUnQuoted','EquityShares','PreferShares',
							   'Debenture','Totalinvestments','StoresConsumables','RawMaterials','StockinProcess','FinishedGoodsorTradedGoods','CashinHand','BalanceWithBank','TotalCurrentAssets','AdvRecoverable',
							   'Deposits','BalWithRevAuth','TotCurrAssetLoanAdv','TotCurrLiabilities','ITProvision','WTProvision','ELSuperAnnGratProvision',
							   'OthProvision','TotCurrLiabilitiesProvision','NetCurrAsset','TotMiscAdjust','TotalFundApply'];
						var ffcsv = json2csv({data: testf,fields: header});
						const path = path1 + orderNo + path3 + '/' + orderNo + '_' + pullSeqNo + '_' + type + fileEx;
						fs.writeFileSync(path, ffcsv);

							console.log('PLCSV conversion completed');
					}else{
						console.log('there is no data for BSConversion');
					}
			}
	}
};
