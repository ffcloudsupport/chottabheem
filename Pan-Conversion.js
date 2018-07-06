/* Source Code Header
Program Name	:	Pan.js
Module Name		:
Description  	:	In this program we are Extraction all the OutstandingTaxDemand information from Json source file and converting into CSV output files.

Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 24/01/2017
Created By		:	sekar
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		:	Revision Date:		Revised By		Details

---------------------------------------------------------------------------------------------*/

/** *************************************************************************************************************************************
 * node modules
 * *************************************************************************************************************************************/

const fs = require('fs');
const json2csv = require('json2csv');
const processing = require('./processing1.js');
const errorRecovery = require('./errorRecoveryFunc.js');
const JSONPath = require('JSONPath');

const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? './googleDownUpload/' : "./awsDownUpload/";
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';


module.exports = {
	PanjsonConv(panfile, orderNo, pullSeqNo) {
		const jsonfiles = path1 + orderNo + path2 + '/' + panfile;
		console.log('pan started');
		//const jsonfiles = 'PANSearchResults.json';
		const data = fs.readFileSync(jsonfiles);
		if (data) {
			const jsonData = JSON.parse(data);
			const panNo = JSONPath.eval(jsonData, "$..['PAN']");
			const dob = JSONPath.eval(jsonData, "$..['DOBOnPAN']");
			const firstName = JSONPath.eval(jsonData, "$..['FirstName']");
			const middleName = JSONPath.eval(jsonData, "$..['MiddleName']");
			const Surname = JSONPath.eval(jsonData, "$..['Surname']");
			const jurisdict = JSONPath.eval(jsonData, "$..['Jurisdiction']");
			//console.log(jurisdict + '..............47')



			const panArr = [];
			 for (let i = 0; i < panNo.length; i++) {
				var jurisdict1 = jurisdict[i].replace(/,/g,";");
				panArr[i] = {
					Name: panNo[i],
					FF_NameonPAN__c: firstName[i] + '  ' + middleName[i],
					FF_Jurisdiction__c: jurisdict1,
					FF_DOBonPAN__c: dob[i],
					};
			}
			//console.log(panArr);
			const fileEx = '.csv';
			const type = 'panDet';
			const header = ['Name', 'FF_NameonPAN__c','FF_Jurisdiction__c', 'FF_DOBonPAN__c'];

			 try {
				const csv = json2csv({ data: panArr, fields: header });
				if (csv) {
					const path = path1 + orderNo + path3 + '/' + orderNo + '_' + pullSeqNo + '_' + type + fileEx;
					var filName = orderNo + '_' + pullSeqNo + '_' + type + fileEx;
					fs.writeFileSync(path, csv);
					processing.updateProceFile(orderNo,25,0,filName);
				 }
				 else {
					processing.updateProceFile(orderNo,26,0,'FailureOthers');
					// //processing.updateProceFile(orderNo,27,0,'Failure');

			}
		}
			 catch (e) {
				// console.log(e);

			 }
		}
		else {
			processing.updateProceFile(orderNo,26,0,'FailureJSONFileReadError');

		}
	},
};
