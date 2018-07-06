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
const bankcsvPath = 'BankCsvFiles/';
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';
//var files = ['FFTestKR10_1_BDAll_2014.csv','FFTestKR10_1_BDAll_2015.csv','FFTestKR10_1_BDAll_2016.csv'];

var converter = new Converter({});


 module.exports = {
	bankCSVConv(orderNo, pullSeqNo) {
		try{
			var items = fs.readdirSync(path1 + orderNo + "/" +bankcsvPath );
		console.log(items + '.....................................');

			for(i=0;i<items.length;i++){
				var files =[];
				var testf =[];
				files[i] = path1 + orderNo + "/" + bankcsvPath + items[i];
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
						var type = "BankAll";
						var fileEx = ".csv";
						var ifscFields = ['BankName__c', 'IFSC_Code__c','Account_Number__c', 'AccountType__c', 'Year__c' ];
						var ffcsv = json2csv({data: testf,fields: ifscFields});
						const path = path1 + orderNo + path3 + '/' + orderNo + '_' + pullSeqNo + '_' + type + fileEx;
						fs.writeFileSync(path, ffcsv);

							console.log('bankCSV conversion completed');
					}else{
						console.log('there is no data for Bank');
					}
			}
	}
};
