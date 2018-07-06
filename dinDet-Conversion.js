/* Source Code Header
Program Name	:	dinDet-Conversion.js
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
	DindetjsonConv(dinfile, orderNo, pullSeqNo) {
		const jsonfiles = path1 + orderNo + path2 + '/' + dinfile;
		//const jsonfiles = 'DINSearch_NameAndDOBResults.json';
		console.log('Din started');


		const data = fs.readFileSync(jsonfiles);
		if (data) {
			const DinList = JSON.parse(data);
			var DinApprovedList = [];
			for(let i=0; i < DinList.length; i++){
				if(DinList[i].DINStatus != 'Lapsed'){
					DinApprovedList.push(DinList[i]);
				}
			}

			var dirName = [];
			var dinNo = [];
			var fatName = [];
			var dinStat = [];
			var dobs = [];
			for(i=0;i<DinApprovedList.length;i++){
				dirName[i] = DinApprovedList[i].DirectorName;
				dinNo[i] = DinApprovedList[i].DIN;
				fatName[i] = DinApprovedList[i].FathersName;
				dobs[i] = DinApprovedList[i].DoB;
				dinStat[i] = DinApprovedList[i].DINStatus;
			}

			var dinDetArr = [];
				for (var j = 0; j < DinApprovedList.length; j++) {
				dinDetArr[j] = {
					Name: dirName[j],
					FF_DIN__c: dinNo[j]+"'",
					FF_FathersName__c: fatName[j],
					FF_DOB__c: dobs[j],
					FF_Status__c: dinStat[j],
					};
			}
			//console.log(dinDetArr);

			const fileEx = '.csv';
			const type = 'DinDet';
			const header = ['Name', 'FF_DIN__c', 'FF_FathersName__c', 'FF_DOB__c', 'FF_Status__c'];

			// try {
				const Dincsv = json2csv({ data: dinDetArr, fields: header });
				if (Dincsv) {
					const path = path1 + orderNo + path3 + '/' + orderNo + '_' + pullSeqNo + '_' + type + fileEx;
					fs.writeFileSync(path, Dincsv);
					// processing.updateProceFile(orderNo,13,0,otdFileName);

				 }
				 // else {
					// // processing.updateProceFile(orderNo,14,0,'FailureOthers');


			// }
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
