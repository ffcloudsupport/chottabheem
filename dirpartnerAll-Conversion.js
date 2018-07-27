/* Source Code Header
Program Name	:	Partner-Conversion.js
Module Name		:
Description  	:	In this program we are Extraction all the OutstandingTaxDemand information from Json source file and converting into CSV output files.

Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 25/01/2017
Created By		:	sekar
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		:	Revision Date:		Revised By		Details
1.1					25-01-2017			sekar
---------------------------------------------------------------------------------------------*/
const fs = require('fs'),
    xml2js = require('xml2js');
const json2csv = require('json2csv');
const JSONPath = require('JSONPath');
const mkdirp = require('mkdirp');
const parser = new xml2js.Parser();
const xpath = require('xpath'),
    dom = require('xmldom').DOMParser;

const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? './googleDownUpload/' : "awsDownUpload/";
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';
const BscsvPath = 'BsCsvFiles/';
//var files = ['2014Orgitest.xml','2014RevisedTest.xml'];
module.exports = {
    conversionDirPartAll(ofilename, rfilename, year, orderNo, pullSeqNo) {
		const FilePaths = [];
		//var FilePaths = path1 + orderNo + path2 + '/' + filename;
		FilePaths[0] = path1 + orderNo + path2 + '/' + ofilename;
        FilePaths[1] = path1 + orderNo + path2 + '/' + rfilename;
		//var FilePaths = '2016Original.xml';
    var firmName = [];
	var panNumber = [];
	var assyear = [];
		if( typeof rfilename != 'undefined'){
			console.log('revised file found');
		    var data = fs.readFileSync(FilePaths[1], 'utf-8'); // reading original file
				data = data.replace(/<\s*/g, '<');  // Remove space after >
				data = data.replace(/\s*>/g, '>');  // Remove space before >
				//console.log(data);
			if (data) {
					try {
						var doc = new dom().parseFromString(data.toString());
						var select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master' })
						assyear = checkFieldAvl('//ITRForm:AssessmentYear/text()',0)
						var formname1 = checkFieldAvl('//ITRForm:FormName/text()', 0);
							if((formname1 == 'ITR-3' || formname1 == 'ITR-4') && (assyear == 2014 ||assyear == 2015||assyear == 2016 || assyear == 2018)){
									var firstName = checkFieldAvl('//ITRForm:FirstName/text()', 0);
									var middleName = checkFieldAvl('//ITRForm:MiddleName/text()', 0);
									var lastName = checkFieldAvl('//ITRForm:SurNameOrOrgName/text()', 0);
									var firm = select('//ITRForm:FirmName/text()', doc);
									if(firm.length>0){
										for (let i = 0; i < firm.length; i++) {
												firmName[i] = firm[i].nodeValue;
										}
									}
									else{
										firmName = 0;
									}
								 var panNo = select('//ITRForm:FirmPAN/text()', doc);
									if(panNo.length>0){
										for (let i = 0; i < panNo.length; i++) {
													panNumber[i] = panNo[i].nodeValue;
										}
									}
									else{
										panNumber = 0;
									}
							}
												 //changed ItR-3 to ITR-1 (Manoj 27th july 2018)

							else if((formname1 == 'ITR-2' || formname1 == 'ITR-1') && (assyear == 2017 || assyear == 2018)){
									var firstName = checkFieldAvl('//ITRForm:FirstName/text()', 0);
									var middleName = checkFieldAvl('//ITRForm:MiddleName/text()', 0);
									var lastName = checkFieldAvl('//ITRForm:SurNameOrOrgName/text()', 0);
									var firm = select('//ITRForm:FirmName/text()', doc);
									if(firm.length>0){
										for (let i = 0; i < firm.length; i++) {
												firmName[i] = firm[i].nodeValue;
										}
									}
									else{
										firmName = 0;
									}
									var panNo = select('//ITRForm:FirmPAN/text()', doc);
									if(panNo.length>0){
										for (let i = 0; i < panNo.length; i++) {
													panNumber[i] = panNo[i].nodeValue;
										}
									}
									else{
										panNumber = 0;
									}
							}
					}
					catch(e){

					}
			}
			else{
				console.log('there is no File');
			}
		}
		else {
			console.log('Original file found');
		    var data = fs.readFileSync(FilePaths[0], 'utf-8'); // reading original file
				data = data.replace(/<\s*/g, '<');  // Remove space after >
				data = data.replace(/\s*>/g, '>');  // Remove space before >
				//console.log(data);
			if (data) {
					try {
						var doc = new dom().parseFromString(data.toString());
						var select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master' })
						assyear = checkFieldAvl('//ITRForm:AssessmentYear/text()',0)
						var formname1 = checkFieldAvl('//ITRForm:FormName/text()', 0);
							if((formname1 == 'ITR-3' || formname1 == 'ITR-4') && (assyear == 2014 ||assyear == 2015||assyear == 2016 || assyear == 2018)){
									var firstName = checkFieldAvl('//ITRForm:FirstName/text()', 0);
									var middleName = checkFieldAvl('//ITRForm:MiddleName/text()', 0);
									var lastName = checkFieldAvl('//ITRForm:SurNameOrOrgName/text()', 0);
									var firm = select('//ITRForm:FirmName/text()', doc);
									if(firm.length>0){
										for (let i = 0; i < firm.length; i++) {
												firmName[i] = firm[i].nodeValue;
										}
									}
									else{
										firmName = 0;
									}
								 var panNo = select('//ITRForm:FirmPAN/text()', doc);
									if(panNo.length>0){
										for (let i = 0; i < panNo.length; i++) {
													panNumber[i] = panNo[i].nodeValue;
										}
									}
									else{
										panNumber = 0;
									}
							}
												 //changed ItR-3 to ITR-1 (Manoj 27th july 2018)

							else if((formname1 == 'ITR-2' || formname1 == 'ITR-1') && (assyear == 2017 || assyear == 2018)){
									var firstName = checkFieldAvl('//ITRForm:FirstName/text()', 0);
									var middleName = checkFieldAvl('//ITRForm:MiddleName/text()', 0);
									var lastName = checkFieldAvl('//ITRForm:SurNameOrOrgName/text()', 0);
									var firm = select('//ITRForm:FirmName/text()', doc);
									if(firm.length>0){
										for (let i = 0; i < firm.length; i++) {
												firmName[i] = firm[i].nodeValue;
										}
									}
									else{
										firmName = 0;
									}
									var panNo = select('//ITRForm:FirmPAN/text()', doc);
									if(panNo.length>0){
										for (let i = 0; i < panNo.length; i++) {
													panNumber[i] = panNo[i].nodeValue;
										}
									}
									else{
										panNumber = 0;
									}
							}

						}
						catch(e){

						}
			}
			else{
				console.log('there is no File');
			}
		}
		var name = firstName +' ' + middleName +'  ' +lastName;
			if(firmName.length>0){
				var parDtls = [];
					for (let i = 0; i < firmName.length; i++) {
						parDtls[i] = {
							Year__c: assyear,
							Name__c: name,
							Din__c: '-',
							comName__c: firmName[i],
							CIN__c: panNumber[i],
							DateFrom__c: '-',
							compType: 'PartnerShip',
							Source: 'ITR',
						};
					}


				//console.log(parDtls);
				const fileEx = '.csv';
                const type = 'DirDetPart';
                const header = ['Year__c','Name__c','Din__c','comName__c','CIN__c', 'DateFrom__c', 'compType','Source'];
                try {
                    const ffcsv = json2csv({
                        data: parDtls,
                        fields: header
                    });
                    if (ffcsv) {
						try{
							mkdirp.sync(path1 + orderNo + "/"+ partcsvPath);
						}
						catch(e){
							console.log('error'+e);
						}
                        //fs.writeFileSync('test.csv', ffcsv);
						fs.writeFileSync(path1 + orderNo + "/"+ partcsvPath + '/' + orderNo + '_' + pullSeqNo + '_' + type + '_' + assyear + fileEx, ffcsv);
						console.log('partnerDir convertion completed');
                    } else {
                       //processing.updateProceFile(orderNo,10,assyear,'FailureOthers');
                    }
                } catch (e) {

				}
			}
			else {
				var parDtlsZero =[];
					parDtlsZero = [{
							Year__c: assyear,
							Name__c: name,
							Din__c: '-',
							comName__c: '-',
							CIN__c: '-',
							DateFrom__c: '-',
							compType: 'PartnerShip',
							Source: 'ITR',
						}];
				//console.log(parDtlsZero);
				const fileEx = '.csv';
                const type = 'DirDetPart';
                const header = ['Year__c','Name__c','Din__c','comName__c','CIN__c', 'DateFrom__c', 'compType','Source'];
                try {
                    const ffcsv = json2csv({
                        data: parDtlsZero,
                        fields: header
                    });
                    if (ffcsv) {
						try{
							mkdirp.sync(path1 + orderNo + "/"+ partcsvPath);
						}
						catch(e){
							console.log('error'+e);
						}
                     	  fs.writeFileSync(path1 + orderNo + "/"+ partcsvPath + '/' + orderNo + '_' + pullSeqNo + '_' + type + '_' + assyear + fileEx, ffcsv);
						console.log('partnerDir convertion completed');
                    } else {
                       //processing.updateProceFile(orderNo,10,assyear,'FailureOthers');
                    }
                } catch (e) {

				}
			}

	function checkFieldAvl(FieldName,integer){
			try{
				const doc = new dom().parseFromString(data.toString());
				const select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master' });
				let value = select(FieldName, doc)[integer].nodeValue
				console.log(value);
				return value;
			}
			catch(e){
				//console.log('error in field ' + e)
				let value = ' ';
				return value;
			}

		}
	}
};
