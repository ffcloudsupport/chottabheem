/* Source Code Header
Program Name	:	otd.js
Module Name		:
Description  	:	In this program we are Extraction all the OutstandingTaxDemand information from Json source file and converting into CSV output files.

Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 05/08/2016
Created By		:	sekar
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		:	Revision Date:		Revised By		Details
1.1		    		12th Aug 2016		sekar			Modified for fixing logic issues
1.2				:	24th Aug 2016 		sekar 			Added Missed field for ITR1 &ITR2 &ITR3
1.3				:	30th Aug 2016		sekar			Adding try and Catch Error
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
	jsonConv(otdfile, orderNo, pullSeqNo) {
		const jsonfiles = path1 + orderNo + path2 + '/' + otdfile;
		console.log('otd started');

		const data = fs.readFileSync(jsonfiles);
		if (data) {
			const jsonData = JSON.parse(data);
			const assyear = JSONPath.eval(jsonData, "$..['A.Y.']");
			const sec = JSONPath.eval(jsonData, '$..Section Code');
			const demand = JSONPath.eval(jsonData, '$..Demand Identification Number (DIN)');
			const date = JSONPath.eval(jsonData, '$..Date on which demand is raised');
			const out = JSONPath.eval(jsonData, '$..Outstanding demand amount (?)');
			const upload = JSONPath.eval(jsonData, '$..Uploaded By');
			const rec = JSONPath.eval(jsonData, '$..Rectification Rights');

			const otdArr = [];
			 for (let i = 0; i < assyear.length; i++) {
				otdArr[i] = {
					AssessmentYear: assyear[i],
					Section__c: sec[i],
					Demand_Number__c: demand[i],
					Date__c: date[i],
					O_S_Amount__c: out[i],
					Uploaded_By__c: upload[i],
					Rectification_Rights__c: rec[i] 	};
			}

			const fileEx = '.csv';
			const type = 'OTD';
			const header = ['AssessmentYear', 'Section__c', 'Demand_Number__c', 'Date__c', 'O_S_Amount__c', 'Uploaded_By__c', 'Rectification_Rights__c'];

			try {
				const csv = json2csv({ data: otdArr, fields: header });
				if (csv) {
					const path = './' + path1 + orderNo + path3 + '/' + orderNo + '_' + pullSeqNo + '_' + type + fileEx;
					fs.writeFileSync(path, csv);
					var otdStatus = "Success";
					var otdFileName = orderNo + '_' + pullSeqNo + '_' + type + fileEx;
					processing.updateProceFile(orderNo,13,0,otdFileName);
					//processing.updateProceFile(orderNo,27,0,'Success');
					console.log('otd completed');
				}
				else {
					processing.updateProceFile(orderNo,14,0,'FailureOthers');
					//processing.updateProceFile(orderNo,27,0,'Failure');

			}
		}
			catch (e) {
				console.log(e);

			}
		}
		else {
			processing.updateProceFile(orderNo,14,0,'FailureJSONFileReadError');
			//processing.updateProceFile(orderNo,27,0,'Failure');
		}
	},
};
