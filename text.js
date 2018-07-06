/* Source Code Header
Program Name	:	textParser.js
Module Name		:
Description  	:	In this program the 26AS text file will be taken as input parameter and processed
					The output provided will CSV file as per FinFort Requirement
Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 23/03/2017
Created By		:	Sekar Raj
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		:	Revision Date:		Revised By					Details
1.1					23/03/2017			Sekar	Raj
---------------------------------------------------------------------------------------------*/
//Modules are declared here

const fs = require('fs');
const mkdirp = require('mkdirp');
//var join = require('join');
const window = require('window-or-global');
const split = require('split');
const stringSearcher = require('string-search');
const json2csv = require('json2csv');

const sum = require('lodash.sum');
const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? './googleDownUpload/' : "./awsDownUpload/"; // root path for download and upload files
const path2 = '/downloadedFiles'; // downloaded files folder (contains files downloaded from Drive)
const path3 = '/uploadedfiles'; // Uploaded files ( contains all csv's etc...)
const teCsv = require('./textCsv-Conversion.js');
//Sections to be parsed from 26AS are configured here

var secSrchObj = [
    {secName:"PART A - Details of Tax Deducted at Source", subSec:"N", subSecSrch:"Sr. No.", Section: "A"},
	{secName:"PART A1 - Details of Tax Deducted at Source for 15G / 15H", subSec:"N", subSecSrch:"Sr. No.", Section: "A1"},
	{secName:"PART A2 - Details of Tax Deducted at Source on Sale of Immovable Property", subSec:"N", subSecSrch:"Sr. No.", Section: "A2"},
	{secName:"PART B - Details of Tax Collected at Source", subSec:"N", subSecSrch:"Sr. No.", Section: "B"},
	{secName:"PART C - Details of Tax Paid", subSec:"N", subSecSrch:"", Section: "C"},
	{secName:"PART D - Details of Paid Refund", subSec:"N", subSecSrch:"", Section: "D"},
	{secName:"PART E - Details of AIR Transaction", subSec:"N", subSecSrch:"", Section: "E"},
	{secName:"PART F - Details of Tax Deducted at Source on Sale of Immovable Property", subSec:"N", subSecSrch:"Sr. No.", Section: "F"},
	{secName:"PART G - TDS Defaults", subSec:"N", subSecSrch:"Sr. No.", Section: "G"}
];

const path4 = './textFileCsv/';
const TextcsvPath = 'TextCsvFiles/';


module.exports = {
	AS26Section(FFfilename, FFyear,orderNo, pullSeqNo) {

			//Folder path for both source and destination
			var inputPath = path1 + orderNo + path2 + '/' + FFfilename;

			//variables are initialized here
			var secLineNo = [];
			var secSplice = [];


			var data = fs.readFileSync(inputPath, 'utf8');
				if (data) {
					var array26ASLine = (data.toString().split('\n'));

					try{
						var FinYearArr = array26ASLine[3].split("^");

						}
					catch(e){

						}
					// section line nos. are found and split into sections and stored in a variable


					secSrchObj.forEach (function (item, index, array) {

						secSplitLineNo(data, secSrchObj[index].secName, secSrchObj[index].subSec, function(res){

							if (res) {
								secLineNo[index] = res;

								if (index > 0)
								{
								    window["secSplice" + index] = array26ASLine.slice(secLineNo[index-1]-1, secLineNo[index]-1);
								if ((secSrchObj[index-1].subSec) == 'Y')
								   {
										// for Subsection
								   }
								   else {
									   if (index == 1 && secSrchObj[index-1].Section == 'A') {
											mainSecSplit(window["secSplice" + index], secSrchObj[index-1].Section,FinYearArr[4]);
										}
										else if (index == 2 && secSrchObj[index-1].Section == 'A1') {
											mainSecSplit(window["secSplice" + index], secSrchObj[index-1].Section,FinYearArr[4]);

										}
										else if (index == 3 && secSrchObj[index-1].Section == 'A2') {
											mainSecSplit(window["secSplice" + index], secSrchObj[index-1].Section,FinYearArr[4]);

										}
										else if (index == 4 && secSrchObj[index-1].Section == 'B') {
											mainSecSplit(window["secSplice" + index], secSrchObj[index-1].Section,FinYearArr[4]);

										}

										else if (index == 5 && secSrchObj[index-1].Section == 'C') {
											mainSecSplit(window["secSplice" + index], secSrchObj[index-1].Section,FinYearArr[4]);
										}
										else if (index == 6 && secSrchObj[index-1].Section == 'D') {
											mainSecSplit(window["secSplice" + index], secSrchObj[index-1].Section,FinYearArr[4]);
										}


										else if (index == 7 && secSrchObj[index-1].Section == 'E') {
											mainSecSplit(window["secSplice" + index], secSrchObj[index-1].Section,FinYearArr[4]);
										}
										else if (index == 8 && secSrchObj[index-1].Section == 'F') {
											mainSecSplit(window["secSplice" + index], secSrchObj[index-1].Section,FinYearArr[4]);
										}

								   }
								}
							} else {
								//console.log(err);
							}
						});

					});
				} else {
					//console.log(err)
				}

			//function to split sections and store in a array
			function secSplitLineNo(data, searchSecName, SubSection, callback) {
				stringSearcher.find(data, searchSecName)
				.then(function(resultArr) {
					if (resultArr.length = 1) {
						try{
							var secFLineNo = resultArr[0].line;
							//console.log(resultArr.length);
						}
						catch(e){
							//console.log(e + '.....201')
						}

					} else {
						console.log("Incorrect format of the 26AS Text file");
					}
					if (callback) {
						callback(secFLineNo);
					}
				});
			}

			//function to split main section and form an array and parse them into JSON Object
			function mainSecSplit(mainSecArr, mainSection,finYear) {
				var FileYear = finYear.substring(0, 4);
				if(mainSection == 'A' || mainSection == 'A1' || mainSection == 'A2' || mainSection == 'B' || mainSection == 'C' || mainSection == 'D' || mainSection == 'E' || mainSection == 'F' )
				{
					if(mainSecArr[2][0] == 1){
						//console.log('Section '+ mainSection + finYear+ ' Available');
						var test = {
						FF_Year__c : FileYear,
						FF_Pan_Table_Description__c : 'TRUE'
						};
						//console.log(test);

						const fileEx = '.csv';
						const type = 'TextSec';
						const header = ['FF_Year__c','FF_Pan_Table_Description__c'];
						const csv = json2csv({ data: test, fields: header });
						try{
							mkdirp.sync(path1 + orderNo + "/"+ TextcsvPath);
							//console.log(path1 + orderNo + "/"+ TextcsvPath + '......176');
						}
						catch(e){
							console.log('error'+e);
						}
						fs.writeFileSync(path1+ orderNo + "/" + TextcsvPath +'/' + orderNo +'_'+type + '_' + FileYear + fileEx, csv);
						//console.log('text convertion completed');
						teCsv.textCSVConv(orderNo, pullSeqNo);

					}
					else {
						//console.log('Section '+ mainSection +finYear +'Not Available');


					}
				}
				else{

				}

			}

				var pathd = path1 + orderNo + "/" +TextcsvPath ;
					fs.readdir(pathd, function(err, items) {
						if(err){
							//console.log('File Not Available .............200');
							//console.log('Create CSV for No value');
							var test = {
								FF_Year__c : '2022',
								FF_Pan_Table_Description__c : 'FALSE'
							};
							//console.log(test);
							var type = 'TextSection';
							var fileEx = ".csv";
							var ifscFields = ['FF_Year__c','FF_Pan_Table_Description__c'];
							var ffcsv = json2csv({data: test,fields: ifscFields});
							var path = path1 + orderNo + path3 + '/' + orderNo + '_' + pullSeqNo + '_' + type + fileEx;
							fs.writeFileSync(path, ffcsv);
						}else{
							//console.log(items + '..........45');
						}

					});

	}
}
