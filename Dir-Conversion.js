/* Source Code Header
Program Name	:	Dir-Conversion.js
Module Name		:
Description  	:	In this program we are Extraction all the DIN information from Json source file and converting into CSV output files.

Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 27/01/2017
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

const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? './googleDownUpload/' : "awsDownUpload/";
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';

module.exports = {
	DinjsonConv(dinfile, orderNo, pullSeqNo) {
		const jsonfiles = path1 + orderNo + path2 + '/' + dinfile;
		//const jsonfiles = 'DINSearch_ListOfCompanies.json';
		console.log('Directorship started');
		const data = fs.readFileSync(jsonfiles);
		if (data) {
			const jsonData = JSON.parse(data);
			const dirName = JSONPath.eval(jsonData, "$..['DirectorName']");
			const appDin = JSONPath.eval(jsonData, "$..['ApprovedDIN']");
			const comName = JSONPath.eval(jsonData, "$..['CompanyLLPName']");
			const cinPin = JSONPath.eval(jsonData, "$..['CIN_LLPIN']");
			const beginDate = JSONPath.eval(jsonData, "$..['BeginDate']");
			const OrganiType = JSONPath.eval(jsonData, "$..['OrgType']");


			const dinArr = [];
			 for (let i = 0; i < dirName.length; i++) {
				dinArr[i] = {
					Year__c : '-',
					Name__c: dirName[i],
					Din__c: appDin[i],
					comName__c: comName[i],
					CIN__c: cinPin[i],
					DateFrom__c: beginDate[i],
					compType: OrganiType[i],
					Source: 'JSON',
					};
			}
			//console.log(dinArr);
			const fileEx = '.csv';
			const type = 'DirLiaPartDet';
			const header = ['Year__c','Name__c', 'Din__c', 'comName__c', 'CIN__c', 'DateFrom__c','compType','Source'];

			// try {
				const Dincsv = json2csv({ data: dinArr, fields: header });
				if (Dincsv) {
					const path = path1 + orderNo + path3 + '/' + orderNo + '_' + pullSeqNo + '_' + type + fileEx;
					fs.writeFileSync(path, Dincsv);
					// processing.updateProceFile(orderNo,13,0,otdFileName);

				 }
				 else {
					// processing.updateProceFile(orderNo,14,0,'FailureOthers');


			}
		// }
			// catch (e) {
				// console.log(e);

			// }
		}
		else {
			//processing.updateProceFile(orderNo,14,0,'FailureJSONFileReadError');

		}
	},
};
