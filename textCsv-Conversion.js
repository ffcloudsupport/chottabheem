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
const JSONPath = require('JSONPath');

const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? 'googleDownUpload/' : "awsDownUpload/";
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';
const path4 = './textFileCsv/';
const TextcsvPath = 'TextCsvFiles/';
//var items = ['FFText_TextSec_2015.csv','FFText_TextSec_2016.csv','FFText_TextSec_2009.csv'];

var converter = new Converter({});
//var tmp;


module.exports = {
	textCSVConv(orderNo, pullSeqNo) {
	//try{
		try{
		var pathd = path1 + orderNo + "/" +TextcsvPath ;
					fs.readdir(pathd, function(err, items) {
							//console.log(items + '..........45');

							for (var i=0; i<items.length; i++) {
								//console.log(items[i]);
							}
						});

				var items = fs.readdirSync(pathd);
				 //console.log(items + '.....................................44');
					if (fs.existsSync(items)) {

					}
					else{

					}

					for(i=0;i<items.length;i++){
								var files =[];
								var testf =[];
								files[i] = path1 + orderNo + "/"+ TextcsvPath + items[i];
								//console.log(files[i]+ '...................................79');
								const csv=require('csvtojson')
								csv()
								.fromFile(files[i])
								.on('json',(jsonObj)=>{
									testf.push(jsonObj);
									//console.log(testf);
									createCSV(testf)

									}).on('done',(error)=>{

											//console.log('end')
								})


				}
			}
			catch(e){
				console.log(e);
			}

			function createCSV(testf){

				var panNo = JSONPath.eval(testf, "$..['FF_Year__c']");
				//console.log(panNo);
				var test = [];
				var syear = '';
				if(panNo.length > 1){
					var initValue = panNo[0];

					for(let j=1;j<panNo.length;j++){
						if (panNo[j] < initValue) {
							initValue = panNo[j];
						 }

					}

					syear = initValue;
				}
				else{
						syear = panNo[0];
					}
				//console.log(syear);
				var syear1 = syear.toString().substring(2,4);
				var test = {
						FF_Year__c : syear + '-' + (parseInt(syear1)+1),
						FF_Pan_Table_Description__c : 'TRUE'

					};
					//console.log(test);
					var type = 'TextSection';
					var fileEx = ".csv";
					var ifscFields = ['FF_Year__c', 'FF_Pan_Table_Description__c'];
					var ffcsv = json2csv({data: test,fields: ifscFields});
					var path = path1 + orderNo + path3 + '/' + orderNo + '_' + pullSeqNo + '_' + type + fileEx;
					fs.writeFileSync(path, ffcsv);
					//console.log('textCsv Section convertion completed');
					rmdir(path4 + orderNo);

			}
	}
};
