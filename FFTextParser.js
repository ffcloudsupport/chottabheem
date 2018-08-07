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
1.2 				17/7/2017			Sekar						Creating CSV Files based on config settings
																	AdvanceTax,TaxableInc based on  Form26LatestYear config
																	For Employee,AirInfo for all years
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
	{secName:"PART A2 - Details of Tax Deducted at Source on Sale of Immovable Property", subSec:"Y", subSecSrch:"Sr. No.", Section: "A2"},
	{secName:"PART B - Details of Tax Collected at Source", subSec:"Y", subSecSrch:"Sr. No.", Section: "B"},
	{secName:"PART C - Details of Tax Paid", subSec:"N", subSecSrch:"", Section: "C"},
	{secName:"PART D - Details of Paid Refund", subSec:"N", subSecSrch:"", Section: "D"},
	{secName:"PART E - Details of AIR Transaction", subSec:"N", subSecSrch:"", Section: "E"},
	{secName:"PART F - Details of Tax Deducted at Source on Sale of Immovable Property", subSec:"Y", subSecSrch:"Sr. No.", Section: "F"},
	{secName:"PART G - TDS Defaults", subSec:"Y", subSecSrch:"Sr. No.", Section: "G"}
];


module.exports = {
	FFAS26TextParser(FFfilename, FFyear, FForderNo, FFpullSeqNo,callback) {
		console.log('FFtext Parser.js started '+FFyear);
		//Order to be processed only for the following year
		if (FFyear == 2014 || FFyear == 2015 || FFyear == 2016 || FFyear == 2017 || FFyear == 2018 || FFyear == 2019) {

		// Fetching Year from Config.json file
			let jsonData = '';
			let TextASyears = '';
		    const configData = fs.readFileSync('./ITAutomationConfig.json', 'UTF-8');
			 jsonData = JSON.parse(configData);
			 TextASyears = jsonData.Form26LatestYear;

			//Folder path for both source and destination
			const inputPath = path1 + FForderNo + path2 + '/' + FFfilename;
			const outputPath = path1 + FForderNo + path3;
			// var FForderNo ="FFF-001";
			// var FFpullSeqNo ="001";
			// var FFyear ="2017";
			//variables are initialized here
			var secLineNo = [];
			var secSplice = [];
			var employeeCSVFileName = "AS26Employee" + FForderNo + FFpullSeqNo + FFyear + ".csv";
			var AdvTaxCSVFileName = "AdvTax" + FForderNo + FFpullSeqNo + FFyear + ".csv";
			var FinDiscFileName = "FinDisc" + FForderNo + FFpullSeqNo + FFyear + ".csv";
			var TaxIncFileName = "TaxInc" + FForderNo + FFpullSeqNo + FFyear + ".csv";
			global.Disclosure = [{Name:"", FF_Sale_Of_Immovable_Property__c:0.00, FF_Purchase_Of_Immovable_Property__c:0.00, FF_Details_Of_AIR_Transaction__c:0.00, SRC:"AS26"}];
			global.TaxIncome = [{Name:"", FF_Quarter__c:"June", FF_IncomeFromSalary__c:0.00, FF_OtherIncome__c:0.00},
								{Name:"", FF_Quarter__c:"September", FF_IncomeFromSalary__c:0.00, FF_OtherIncome__c:0.00},
								{Name:"", FF_Quarter__c:"December", FF_IncomeFromSalary__c:0.00, FF_OtherIncome__c:0.00},
								{Name:"", FF_Quarter__c:"March", FF_IncomeFromSalary__c:0.00, FF_OtherIncome__c:0.00}];

			// the text file which needs to be parsed are read here

			//fs.readFile('ATIPK7807J-2017.txt', 'utf8', function(err, data) {
			var data = fs.readFileSync(inputPath, 'utf8');
			//fs.readFile('TextFiles\\Sample26AS-all fields.txt', 'utf8', function(err, data) {
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
										window["secSplice" + index].splice(0,2);
										window["secSplice" + index].pop();

										if (window["secSplice" + index]) {

											subSecSplit(window["secSplice" + index], secSrchObj[index-1].subSecSrch, secSrchObj[index-1].Section,FinYearArr[4], function(result){
												if (index == 1 && secSrchObj[index-1].Section == 'A') {
													var employeeFields = ['FF_Company_Name__c', 'Name', 'FF_Q1__c', 'FF_Q2__c', 'FF_Q3__c', 'FF_Q4__c'];
													ffSaveEmpCSV(employeeFields, result, employeeCSVFileName, function(resultSave){
														//console.log(index + "Saved Sucessfully " + resultSave);
													});
												} else if (index == 2 && secSrchObj[index-1].Section == 'A1') {
													var TaxYear = FinYearArr[4];
													var taYear = TaxYear.substring(0, 4);
													if(taYear == TextASyears){
														var TaxIncFields = ['Name', 'FF_Quarter__c', 'FF_IncomeFromSalary__c', 'FF_OtherIncome__c'];
														ffSaveCSV(TaxIncFields, result, TaxIncFileName, function(resultSave){
															//console.log(index + "Saved Sucessfully " + resultSave);
														});
													}
													//console.log(global.TaxIncome);
												} else if (index == 3 && secSrchObj[index-1].Section == 'A2') {
													var SIPAmount = result;
													var saleYear = FinYearArr[4];
													var saleStaYear = saleYear.substring(0, 4);
													if(isNaN(SIPAmount)){
														global.Disclosure[0].FF_Sale_Of_Immovable_Property__c = 0.0;
														global.Disclosure[0].Name = saleStaYear;
													}
													else{
														if(saleStaYear == TextASyears){
															global.Disclosure[0].FF_Sale_Of_Immovable_Property__c = SIPAmount;
															global.Disclosure[0].Name = saleStaYear;
														} else{
															global.Disclosure[0].FF_Sale_Of_Immovable_Property__c = 0.0;
															global.Disclosure[0].Name = saleStaYear;
														}

													}

												} else if (index == 8 && secSrchObj[index-1].Section == 'F') {
													var PIPAmount = result;
													var disYear = FinYearArr[4];
													var disCloYear = disYear.substring(0, 4);
													if(isNaN(PIPAmount)){
														global.Disclosure[0].FF_Purchase_Of_Immovable_Property__c = 0.0;
														global.Disclosure[0].Name = disCloYear;
													}
													else{
														global.Disclosure[0].FF_Purchase_Of_Immovable_Property__c = PIPAmount;
														global.Disclosure[0].Name = disCloYear;
													}
													var DiscFields = ['Name', 'FF_Sale_Of_Immovable_Property__c', 'FF_Purchase_Of_Immovable_Property__c', 'FF_Details_Of_AIR_Transaction__c', 'SRC'];
													ffSaveCSV(DiscFields, global.Disclosure, FinDiscFileName, function(resultFDiscSave){
														//console.log(global.Disclosure);
													});
												}

											});

										}
								   } else {
										if (index == 5 && secSrchObj[index-1].Section == 'C') {
											var AdvTaxFields = ['Quarter','Name', 'FF_TaxAmount__c'];
											mainSecSplit(window["secSplice" + index], secSrchObj[index-1].Section,FinYearArr[4], function(ATResult){
												var advTaxYear = FinYearArr[4];
												var advYear = advTaxYear.substring(0, 4);
												if(advYear == TextASyears){
													ffSaveCSV(AdvTaxFields, ATResult, AdvTaxCSVFileName, function(resultSave){
														//console.log(secSrchObj[index-1].Section, resultSave);
													});
												}
											});

										} else if (index == 7 && secSrchObj[index-1].Section == 'E') {
											mainSecSplit(window["secSplice" + index], secSrchObj[index-1].Section,FinYearArr[4], function(AIRTResult){
												var AIRTOut = AIRTResult;
												global.Disclosure[0].FF_Details_Of_AIR_Transaction__c = 0;
												var disAYear = FinYearArr[4];
												var disACloYear = disAYear.substring(0, 4);
													var airValue = {
														Name : disACloYear,
														FF_Sale_Of_Immovable_Property__c: 0,
														FF_Purchase_Of_Immovable_Property__c: 0,
														FF_Details_Of_AIR_Transaction__c: AIRTOut,
														SRC:'AS26AIR',
													};
												var fileEx = '.csv';
												var type = 'AirInfo';
												var headerValue = ['Name', 'FF_Sale_Of_Immovable_Property__c', 'FF_Purchase_Of_Immovable_Property__c', 'FF_Details_Of_AIR_Transaction__c', 'SRC'];
												var Aircsv = json2csv({ data: airValue, fields: headerValue });
												var path = path1 + FForderNo + path3 + '/' + FForderNo + '_' + FFpullSeqNo + '_' + type +'_'+ disACloYear + fileEx;
												fs.writeFileSync(path, Aircsv);
											});
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
			//});

			//function to split sections and store in a array
			function secSplitLineNo(data, searchSecName, SubSection, callback) {
				stringSearcher.find(data, searchSecName)
				.then(function(resultArr) {
					if (resultArr.length = 1) {
						try{
							var secFLineNo = resultArr[0].line;
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
				var EmployeeOut = [{FF_Company_Name__c:"No Data", Name:"", FF_Q1__c:"-", FF_Q2__c:"-", FF_Q3__c:"-", FF_Q4__c:"-"}];
				mainSec[0] = subSecArr[0];
				stringSearcher.find(subSecData, subSrchString)
				.then(function(resultArr1) {
					resultArr1.forEach (function (item, count, array) {
						if (count > 0 && count < resultArr1.length) {
							mainSec[count] = subSecArr[resultArr1[count].line-2];
							var countrec = count-1;
							window["subSec" + countrec] = subSecArr.slice(resultArr1[count-1].line-1, resultArr1[count].line-3);
						}
						if ( count == resultArr1.length - 1) {
							window["subSec" + count] = subSecArr.slice(resultArr1[count].line-1, subSecArr.length-1);
						}
					});

					if (AS26Section == 'A2' || AS26Section == 'F') {
						var sipAmt = 0.00;
						mainSec.forEach (function (itemA2, countA2, arrayA2) {
							mainSecA2Arr = mainSec[countA2].split("^");
							sipAmt += parseFloat(mainSecA2Arr[5]);
							//console.log(sipAmt);
							if (callback) {
								callback(sipAmt);
							}
						});
					}

					//This does formatting for any data which has section and sub-section
					var subYear = FinYearArr;
					var startYear = subYear.substring(0, 4);
					global.TaxIncome[0].Name = global.TaxIncome[1].Name = global.TaxIncome[2].Name = global.TaxIncome[3].Name = startYear;

					if (AS26Section == 'A')
					{
						mainSec.forEach(function (item1, count1, array1) {
							var mainSecArr = mainSec[count1].split("^");
							if (count1 == 0) {
								if(mainSecArr[1]){
									EmployeeOut[count1].FF_Company_Name__c = mainSecArr[1];
							}
								else {
									EmployeeOut[count1].FF_Company_Name__c = "No Data";

								}

							}
							if (count1 > 0 ) {
								EmployeeOut.push({FF_Company_Name__c: mainSecArr[1], Name:"", FF_Q1__c:"-", FF_Q2__c:"-", FF_Q3__c:"-", FF_Q4__c:"-"});
							}

						if(window["subSec" + count1] != undefined){
						window["subSec" + count1].forEach (function (item2, count2, array2) {
								var subSecArr = window["subSec" + count1][count2].split("^");
							//	console.log('subsectionArr :' , subSecArr);
								if (count2 > 0) {
									try{
										var QtrYearArr = subSecArr[3].split("-");
									}
									catch(e){
										//console.log(e+'............................split');
									}

										EmployeeOut[count1].Name = startYear;

									if (subSecArr[2] == 192) {
										if (QtrYearArr[1] == 'Jan' || QtrYearArr[1] == 'Feb' || QtrYearArr[1] == 'Mar')  {
											global.TaxIncome[3].FF_IncomeFromSalary__c += parseFloat(subSecArr[7]);
											EmployeeOut[count1].FF_Q4__c = "Y";
										}
										if (QtrYearArr[1] == 'Apr' || QtrYearArr[1] == 'May' || QtrYearArr[1] == 'Jun')  {
											EmployeeOut[count1].FF_Q1__c = "Y";
											global.TaxIncome[0].FF_IncomeFromSalary__c += parseFloat(subSecArr[7]);
										}

										if (QtrYearArr[1] == 'Jul' || QtrYearArr[1] == 'Aug' || QtrYearArr[1] == 'Sep')  {
											EmployeeOut[count1].FF_Q2__c = "Y";
											global.TaxIncome[1].FF_IncomeFromSalary__c += parseFloat(subSecArr[7]);
										}

										if (QtrYearArr[1] == 'Oct' || QtrYearArr[1] == 'Nov' || QtrYearArr[1] == 'Dec')  {
											EmployeeOut[count1].FF_Q3__c = "Y";
											global.TaxIncome[2].FF_IncomeFromSalary__c += parseFloat(subSecArr[7]);
										}
									} else  {
										try{
											if(QtrYearArr[1] != undefined){

												if (QtrYearArr[1] == 'Jan' || QtrYearArr[1] == 'Feb' || QtrYearArr[1] == 'Mar')  {
													global.TaxIncome[3].FF_OtherIncome__c += parseFloat(subSecArr[7]);
												} else if (QtrYearArr[1] == 'Apr' || QtrYearArr[1] == 'May' || QtrYearArr[1] == 'Jun')  {
													global.TaxIncome[0].FF_OtherIncome__c += parseFloat(subSecArr[7]);
												} else if (QtrYearArr[1] == 'Jul' || QtrYearArr[1] == 'Aug' || QtrYearArr[1] == 'Sep')  {
													global.TaxIncome[1].FF_OtherIncome__c += parseFloat(subSecArr[7]);
												} else if (QtrYearArr[1] == 'Oct' || QtrYearArr[1] == 'Nov' || QtrYearArr[1] == 'Dec')  {
													global.TaxIncome[2].FF_OtherIncome__c += parseFloat(subSecArr[7]);
												}
											}
										}
										catch(e){

										}
									}

								}
							});
							}
							else {
								//console.log('There is no data for scetion A..................................');
							}
						});
						if (callback) {
							callback(EmployeeOut);
						}
					}

					if (AS26Section == 'A1') {
						mainSec.forEach (function (itemA1, countA1, arrayA1) {
						if(window["subSec" + countA1] != undefined){
							window["subSec" + countA1].forEach (function (itemSSA1, countSSA1, arraySSA1) {
								var subSecArrA1 = window["subSec" + countA1][countSSA1].split("^");
								//console.log(subSecArrA1[6]);
								if (countSSA1 > 0) {
									try{
										var QtrYearArrA1 = subSecArrA1[3].split("-");
									}
									catch(e){
										//console.log(e+'........................298');
									}
								//if(QtrYearArrA1[1] != undefined) {
									if (QtrYearArrA1[1] == 'Jan' || QtrYearArrA1[1] == 'Feb' || QtrYearArrA1[1] == 'Mar')  {
										 var othInc3 = "";
										othInc3 += parseFloat(subSecArrA1[6]);
										  if(isNaN(othInc3)){
											  //global.TaxIncome[3].FF_OtherIncome__c  = 0.0;
										 }
										  else{
											  global.TaxIncome[3].FF_OtherIncome__c += parseFloat(othInc3);
										}


									} else if (QtrYearArrA1[1] == 'Apr' || QtrYearArrA1[1] == 'May' || QtrYearArrA1[1] == 'Jun')  {
										var othInc0 ="";
										othInc0 += parseFloat(subSecArrA1[6]);
										if(isNaN(othInc0)){
											//global.TaxIncome[0].FF_OtherIncome__c = 0.0;
										}
										else {
											global.TaxIncome[0].FF_OtherIncome__c += parseFloat(othInc0);
										}

									} else if (QtrYearArrA1[1] == 'Jul' || QtrYearArrA1[1] == 'Aug' || QtrYearArrA1[1] == 'Sep')  {
										var othInc1 = "";
										othInc1 += parseFloat(subSecArrA1[6]);
										if(isNaN(othInc1)){
											//global.TaxIncome[1].FF_OtherIncome__c = 0.0;
										}
										else {
											global.TaxIncome[1].FF_OtherIncome__c += parseFloat(othInc1);
										}


									} else if (QtrYearArrA1[1] == 'Oct' || QtrYearArrA1[1] == 'Nov' || QtrYearArrA1[1] == 'Dec')  {
										var othInc2 = "";
										othInc2 += parseFloat(subSecArrA1[6]);
										if(isNaN(othInc2)){
											//global.TaxIncome[2].FF_OtherIncome__c = 0.0;
										}
										else {
											global.TaxIncome[2].FF_OtherIncome__c += parseFloat(othInc2);
										}
									}
								//}
								}
							});
						}
						else {
							//console.log('There is no data For section A1......................');
						}
						});
						if (callback) {
							callback(global.TaxIncome);
							//console.log(global.TaxIncome);
						}
					}
				});
			}

			//function to split main section and form an array and parse them into JSON Object
			function mainSecSplit(mainSecArr, mainSection,finYear, callback) {
				if (mainSection == 'C') {
					var Q1 = Q2 = Q3 = Q4 = 0;
					mainSecArr.forEach (function (item4, count4, array4) {
						if (count4 > 1 && count4 < mainSecArr.length-2) {
							var mainSecArrVal = mainSecArr[count4].split("^");
							try{
								var QtrYearArr1 = mainSecArrVal[9].split("-");

							}
							catch(e){
								//console.log(e + 'split........................');
							}
						if(QtrYearArr1 != undefined){
							if (QtrYearArr1[1] == 'Jan' || QtrYearArr1[1] == 'Feb' || QtrYearArr1[1] == 'Mar')  {
								Q4 += parseFloat(mainSecArrVal[7]);
							} else if (QtrYearArr1[1] == 'Apr' || QtrYearArr1[1] == 'May' || QtrYearArr1[1] == 'Jun')  {
								Q1 += parseFloat(mainSecArrVal[7]);
							} else if (QtrYearArr1[1] == 'Jul' || QtrYearArr1[1] == 'Aug' || QtrYearArr1[1] == 'Sep')  {
								Q2 += parseFloat(mainSecArrVal[7]);
							} else if (QtrYearArr1[1] == 'Oct' || QtrYearArr1[1] == 'Nov' || QtrYearArr1[1] == 'Dec')  {
								Q3 += parseFloat(mainSecArrVal[7]);
							}
						}
						else {
							//console.log('QtrYearArr1 not defined ........................');
						}
						}
						if (count4 == mainSecArr.length-1) {
							var adYear = finYear;
							var advYear = adYear.substring(0, 4);
							var AdvTaxOut = [{Quarter:advYear, Name:"June", FF_TaxAmount__c:Q1},
											 {Quarter:advYear, Name:"September", FF_TaxAmount__c:Q2},
											 {Quarter:advYear, Name:"December", FF_TaxAmount__c:Q3},
											 {Quarter:advYear, Name:"March", FF_TaxAmount__c:Q4},
											];
							if (callback) {
								callback(AdvTaxOut);
							}
						}
					});
				}

				if (mainSection == 'E') {
					var ETransAmt = 0;
					mainSecArr.forEach (function (itemEN, countEN, arrayEN) {
						if (countEN > 1 && countEN < mainSecArr.length-2) {
							var SecEArrVal = mainSecArr[countEN].split("^");
							if (SecEArrVal[6]) {
								ETransAmt += parseFloat(SecEArrVal[6]);

							}
							else{
								ETransAmt =0;
							}
						}
						if (countEN == mainSecArr.length-1) {
							var EAirTransOut = ETransAmt;
							if (callback) {
								callback(ETransAmt);

							}

						}
					});
				}
			}

			//Generic function to save json objects data to CSV file, it expects fields, data and filename as input arguments
			function ffSaveCSV( objFields, objData,  csvfilename, callback) {
				var csvStore = json2csv({ data: objData, fields: objFields });
				fs.writeFileSync(path1 + FForderNo + path3 + '/' + FForderNo + '_' + FFpullSeqNo + '_' + csvfilename, csvStore);
					// if (err) throw err;
					// if (callback) {
						console.log("File Saved - " + csvfilename);
					// }
				//});

			}


			function ffSaveEmpCSV( objFields, objData,  csvfilename, callback) {
				var result = objData.map(function(a) {return a.FF_Company_Name__c;});
				var jsonArrayData = objData;
				var dataArray = [];
				for(i=0;i<jsonArrayData.length;i++){
					if(jsonArrayData[i].FF_Q3__c == '-' && jsonArrayData[i].FF_Q2__c == '-' && jsonArrayData[i].FF_Q4__c == '-' && jsonArrayData[i].FF_Q1__c == '-'){
					}
					else{
						dataArray.push(jsonArrayData[i]);
					}

				}
				if((dataArray.length>0) && result != 'No Data' ){
					var csvStore = json2csv({ data: dataArray, fields: objFields });
					fs.writeFile(path1 + FForderNo + path3 + '/' + FForderNo + '_' + FFpullSeqNo + '_' + csvfilename, csvStore, function(err) {
						//fs.writeFile('test.csv', csvStore, function(err) {
						if (err) throw err;
						if (callback) {
							callback("File Saved - " + csvfilename);
						}
					});
				}
				else{
					//console.log(result + '..... no 481');
				}
			}
		}
		if (callback) {
				callback("Completed text parsing ");
			}
	}
}
