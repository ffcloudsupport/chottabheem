/* Source Code Header
Program Name	:	textParser.js
Module Name		:
Description  	:	In this program the 26AS text file will be taken as input parameter and processed
					The output provided will CSV file as per FinFort Requirement
Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 18/12/2016
Created By		:	Sekar
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		:	Revision Date:		Revised By					Details
1.1					19/01/2017			Sekar						Made modifications to existing program
																	to include all sections and sub-sections
																	as requested by FinFort
1.2 				17/7/2017			Sekar						Created taxableInc CSV based on config settings
---------------------------------------------------------------------------------------------*/
//Modules are declared here

const fs = require('fs');
//var join = require('join');
const window = require('window-or-global');
const split = require('split');
const stringSearcher = require('string-search');
const json2csv = require('json2csv');

const sum = require('lodash.sum');
const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? './googleDownUpload/' : "./awsDownUpload/"; // root path for download and upload files
const path2 = '/downloadedFiles'; // downloaded files folder (contains files downloaded from Drive)
const path3 = '/uploadedfiles'; // Uploaded files ( contains all csv's etc...)

//Sections to be parsed from 26AS are configured here

var secSrchObj = [
    {secName:"PART A - Details of Tax Deducted at Source", subSec:"Y", subSecSrch:"Sr. No.", Section: "A"},
	{secName:"PART A1 - Details of Tax Deducted at Source for 15G / 15H", subSec:"Y", subSecSrch:"Sr. No.", Section: "A1"},
	{secName:"PART A2 - Details of Tax Deducted at Source on Sale of Immovable Property", subSec:"N", subSecSrch:"Sr. No.", Section: "A2"},
	{secName:"PART B - Details of Tax Collected at Source", subSec:"N", subSecSrch:"Sr. No.", Section: "B"},
	{secName:"PART C - Details of Tax Paid", subSec:"N", subSecSrch:"", Section: "C"},
	{secName:"PART D - Details of Paid Refund", subSec:"N", subSecSrch:"", Section: "D"},
	{secName:"PART E - Details of AIR Transaction", subSec:"N", subSecSrch:"", Section: "E"},
	{secName:"PART F - Details of Tax Deducted at Source on Sale of Immovable Property", subSec:"Y", subSecSrch:"Sr. No.", Section: "F"},
	{secName:"PART G - TDS Defaults", subSec:"Y", subSecSrch:"Sr. No.", Section: "G"}
];


module.exports = {
	TaxincParser(FFfilename, FFyear, FForderNo, FFpullSeqNo) {

		// Fetching Year from Config.json file
			let jsonData = '';
			let TextASyears = '';
		    const configData = fs.readFileSync('./ITAutomationConfig.json', 'UTF-8');
			 jsonData = JSON.parse(configData);
			 TextASyears = jsonData.Form26LatestYear;

		//Order to be processed only for the following year
		if (FFyear == TextASyears) {

			//Folder path for both source and destination
			const inputPath = path1 + FForderNo + path2 + '/' + FFfilename;
			const outputPath = path1 + FForderNo + path3;
			//variables are initialized here
			var secLineNo = [];
			var secSplice = [];
			var TaxIncFileName = "TaxInc" + FForderNo + FFpullSeqNo + FFyear + ".csv";

			// the text file which needs to be parsed are read here
			console.log('FFtext Parser.js started '+ inputPath + FFyear);
			var data = fs.readFileSync(inputPath, 'utf8');
			if (data) {
					var array26ASLine = (data.toString().split('\n'));
					try{
						var FinYearArr = array26ASLine[3].split("^");
						}
					catch(e){

						}
					var  TaxIncome = 	[{Name:"", FF_Quarter__c:"June", FF_IncomeFromSalary__c:0.00, FF_OtherIncome__c:0.00},
								{Name:"", FF_Quarter__c:"September", FF_IncomeFromSalary__c:0.00, FF_OtherIncome__c:0.00},
								{Name:"", FF_Quarter__c:"December", FF_IncomeFromSalary__c:0.00, FF_OtherIncome__c:0.00},
								{Name:"", FF_Quarter__c:"March", FF_IncomeFromSalary__c:0.00, FF_OtherIncome__c:0.00}];

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
										window["secSplice" + index].splice(0,2);
										window["secSplice" + index].pop();

										if (window["secSplice" + index]) {

											subSecSplit(window["secSplice" + index], secSrchObj[index-1].subSecSrch, secSrchObj[index-1].Section,FinYearArr[4], function(result){
												if (index == 1 && secSrchObj[index-1].Section == 'A') {

												} else if (index == 2 && secSrchObj[index-1].Section == 'A1' ) {
													var TaxYear = FinYearArr[4];
													var taYear = TaxYear.substring(0, 4);
													 if(taYear == TextASyears){
														var TaxIncFields = ['Name', 'FF_Quarter__c', 'FF_IncomeFromSalary__c', 'FF_OtherIncome__c'];
														ffSaveCSV(TaxIncFields, result, TaxIncFileName, function(resultSave){
															//console.log(resultSave + "Saved Sucessfully..................115 " );
														});
													 }
													//console.log(TaxIncome);
												}
											});

										}
								   } else {

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
			//});

			//function to split sections and store in a array
			function secSplitLineNo(data, searchSecName, SubSection, callback) {
				stringSearcher.find(data, searchSecName)
				.then(function(resultArr) {
					if (resultArr.length = 1) {
						try{
							var secFLineNo = resultArr[0].line;
							console.log(secFLineNo + '......135');
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

			//function to split main and subsection and form an array and parse them into JSON Object
			function subSecSplit(subSecArr, subSrchString, AS26Section,FinYearArr, callback) {
				var subSecData = subSecArr.join('\n');
				var mainSec = [];
				var subSec = [];
				mainSec[0] = subSecArr[0];
				stringSearcher.find(subSecData, subSrchString)
				.then(function(resultArr1) {
					resultArr1.forEach (function (item, count, array) {
						if (count > 0 && count < resultArr1.length) {
							mainSec[count] = subSecArr[resultArr1[count].line-2];
							var countrec = count-1;
							window["subSec" + countrec] = subSecArr.slice(resultArr1[count-1].line-1, resultArr1[count].line-3);
							//console.log(window["subSec" + countrec] + '......163');
						}
						if ( count == resultArr1.length - 1) {
							window["subSec" + count] = subSecArr.slice(resultArr1[count].line-1, subSecArr.length-1);
							//console.log(window["subSec" + count] + '......167');
						}
					});

					//console.log(resultArr1 + '......168');

					//This does formatting for any data which has section and sub-section
					var subYear = FinYearArr;
					var startYear = subYear.substring(0, 4);
					TaxIncome[0].Name = TaxIncome[1].Name = TaxIncome[2].Name = TaxIncome[3].Name = startYear;

					if (AS26Section == 'A' && startYear == TextASyears)
					{

						mainSec.forEach(function (item1, count1, array1) {
							var mainSecArr = mainSec[count1].split("^");


						if(window["subSec" + count1] != undefined){
						    window["subSec" + count1].forEach (function (item2, count2, array2) {
								//console.log(item2, count2, array2 + '....182');
								var subSecArr = window["subSec" + count1][count2].split("^");
								if (count2 > 0) {
									try{
										var QtrYearArr = subSecArr[3].split("-");
									}
									catch(e){
										//console.log(e+'............................split');
									}

									if (subSecArr[2] == 192 ) {
										if (QtrYearArr[1] == 'Jan' || QtrYearArr[1] == 'Feb' || QtrYearArr[1] == 'Mar')  {
											TaxIncome[3].FF_IncomeFromSalary__c += parseFloat(subSecArr[7]);
											console.log(TaxIncome[3].FF_IncomeFromSalary__c  +'............................split');
										}
										if (QtrYearArr[1] == 'Apr' || QtrYearArr[1] == 'May' || QtrYearArr[1] == 'Jun')  {
											TaxIncome[0].FF_IncomeFromSalary__c += parseFloat(subSecArr[7]);
										}

										if (QtrYearArr[1] == 'Jul' || QtrYearArr[1] == 'Aug' || QtrYearArr[1] == 'Sep')  {
											TaxIncome[1].FF_IncomeFromSalary__c += parseFloat(subSecArr[7]);
										}

										if (QtrYearArr[1] == 'Oct' || QtrYearArr[1] == 'Nov' || QtrYearArr[1] == 'Dec')  {
											TaxIncome[2].FF_IncomeFromSalary__c += parseFloat(subSecArr[7]);
										}
									} else  {
										if(QtrYearArr[1] != undefined ){

											if ((QtrYearArr[1] == 'Jan' || QtrYearArr[1] == 'Feb' || QtrYearArr[1] == 'Mar') && (startYear == 2017))  {
												TaxIncome[3].FF_OtherIncome__c += parseFloat(subSecArr[7]);
												//console.log(TaxIncome[3].FF_OtherIncome__c + '......215');
											} else if (QtrYearArr[1] == 'Apr' || QtrYearArr[1] == 'May' || QtrYearArr[1] == 'Jun')  {
												TaxIncome[0].FF_OtherIncome__c += parseFloat(subSecArr[7]);
											} else if (QtrYearArr[1] == 'Jul' || QtrYearArr[1] == 'Aug' || QtrYearArr[1] == 'Sep')  {
												TaxIncome[1].FF_OtherIncome__c += parseFloat(subSecArr[7]);
											} else if (QtrYearArr[1] == 'Oct' || QtrYearArr[1] == 'Nov' || QtrYearArr[1] == 'Dec')  {
												TaxIncome[2].FF_OtherIncome__c += parseFloat(subSecArr[7]);
											}
										}
									}

								}
							});
							}
							else {
								console.log('There is no data for scetion A..................................');
							}
						});

					}

					if (AS26Section == 'A1' && startYear == TextASyears) {
						mainSec.forEach (function (itemA1, countA1, arrayA1) {
						 if(window["subSec" + countA1] != undefined){
							window["subSec" + countA1].forEach (function (itemSSA1, countSSA1, arraySSA1) {
								var subSecArrA1 = window["subSec" + countA1][countSSA1].split("^");
								console.log(subSecArrA1+ '...............255' + startYear);
								if (countSSA1 > 0 ) {
									try{
										var QtrYearArrA1 = subSecArrA1[3].split("-");
									}
									catch(e){
										//console.log(e+'........................298');
									}
							if(QtrYearArrA1[1] != undefined) {
								if(subSecArrA1 != 192){
									if ((QtrYearArrA1[1] == 'Jan' || QtrYearArrA1[1] == 'Feb' || QtrYearArrA1[1] == 'Mar') && (startYear ==2017))  {
										 var othInc3 = "";
											 othInc3 += parseFloat(subSecArrA1[6]);

										  if(isNaN(othInc3)){
											  TaxIncome[3].FF_OtherIncome__c  = 0.0;
											 // console.log(TaxIncome[3].FF_OtherIncome__c + '.......March260'  + startYear);
										 }
										  else{
											  TaxIncome[3].FF_OtherIncome__c += parseFloat(othInc3);
										}


									} else if ((QtrYearArrA1[1] == 'Apr' || QtrYearArrA1[1] == 'May' || QtrYearArrA1[1] == 'Jun'))  {
										var othInc0 ="";
										othInc0 += parseFloat(subSecArrA1[6]);
										if(isNaN(othInc0)){
											TaxIncome[0].FF_OtherIncome__c = 0.0;
										}
										else {
											TaxIncome[0].FF_OtherIncome__c += parseFloat(othInc0);
										}

									} else if ((QtrYearArrA1[1] == 'Jul' || QtrYearArrA1[1] == 'Aug' || QtrYearArrA1[1] == 'Sep'))  {
										var othInc1 = "";
										othInc1 += parseFloat(subSecArrA1[6]);
										if(isNaN(othInc1)){
											TaxIncome[1].FF_OtherIncome__c = 0.0;
										}
										else {
											TaxIncome[1].FF_OtherIncome__c += parseFloat(othInc1);
										}


									} else if ((QtrYearArrA1[1] == 'Oct' || QtrYearArrA1[1] == 'Nov' || QtrYearArrA1[1] == 'Dec'))  {
										var othInc2 = "";
										othInc2 += parseFloat(subSecArrA1[6]);
										if(isNaN(othInc2)){
											TaxIncome[2].FF_OtherIncome__c = 0.0;
										}
										else {
											TaxIncome[2].FF_OtherIncome__c += parseFloat(othInc2);
										}
									}
										}
										else{

										}
									}

							}
								});
							}
							else {
								console.log('There is no data For section A1......................');
							}
						});
						if (callback) {
							callback(TaxIncome);
							console.log(TaxIncome);
						}
					}
				});
			}

			//function to split main section and form an array and parse them into JSON Object
			function mainSecSplit(mainSecArr, mainSection,finYear, callback) {



			}

			//Generic function to save json objects data to CSV file, it expects fields, data and filename as input arguments
			function ffSaveCSV( objFields, objData,  csvfilename, callback) {
				var csvStore = json2csv({ data: objData, fields: objFields });
				console.log(csvStore);
				fs.writeFileSync(path1 + FForderNo + path3 + '/' + FForderNo + '_' + FFpullSeqNo + '_' + csvfilename, csvStore);
					// if (err) throw err;
					// if (callback) {
						// console.log("File Saved - " + csvfilename);
					// }
				//});

			}



		}
		// if (callback) {
				// callback("Completed text parsing ");
			// }
	}
}
