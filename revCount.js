/* Source Code Header
Program Name	:	revisionCount.js
Module Name		:
Description  	:

Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 05/08/2016
Created By		:	sekar
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		:	Revision Date:		Revised By		Details

---------------------------------------------------------------------------------------------*/

const fs = require('fs');
// const json2csv = require('json2csv');
const JSONPath = require('JSONPath');

const processing = require('./processing1.js');
const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? 'googleDownUpload/' : "awsDownUpload/";
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';

module.exports = {
    revCounts(file, orderNo, configYears) {
        const summaryFilePath = path1 + orderNo + path2 + '/' + file;
        const data = fs.readFileSync(summaryFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
		const allYearDtls = jsonData.ReturnData;
		//console.log(allYearDtls)
	    const years = configYears;
		for (let i = 0; i < years.length; i++){
			let revcount = 0;
			for(let j = 0; j < allYearDtls.length; j++){
				let AYyear = JSONPath.eval(allYearDtls[j], "$..['A.Y.']");
				let Filingtype  = JSONPath.eval(allYearDtls[j], "$..'Filing Type'");
				let FormType = JSONPath.eval(allYearDtls[j], "$..'ITR/Form'");
				let AllFormTypes = ['ITR-1','ITR-2','ITR-2A','ITR-3','ITR-4','ITR-4S'];
				let year   =  AYyear[0].substring(0, 4)
				//console.log(years[i], year, Filingtype[0],FormType[0])
				if(years[i] == year  && Filingtype[0] == 'Revised' && (AllFormTypes.indexOf(FormType[0])  > -1)){
					revcount++;
				}

			}
			//console.log('--'+years[i],revcount )
			processing.updateProceFile(orderNo,17,years[i],revcount);

		}
    },
};
