/* Source Code Header
Program Name	:	bank-Conversion.js
Module Name		:
Description  	:	In this program we are Extracting all the bank information from XML source file and converting into CSV output files.

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
1.4				:	23rd Jan 2017		sekar			modified and changed logics to get all the year bank csv
---------------------------------------------------------------------------------------------*/
/** *** **************************************************************************************************************
Require node  module details
*********************************************************************************************************/
const errorRecovery = require('./errorRecoveryFunc.js');
const processing = require('./processing1.js');
const fs = require('fs'),
    xml2js = require('xml2js');
const json2csv = require('json2csv');
const JSONPath = require('JSONPath');
const unique = require('array-unique');
const parser = new xml2js.Parser();
const xpath = require('xpath'),
    dom = require('xmldom').DOMParser;

const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? './googleDownUpload/' : "awsDownUpload/";
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';
/** *************************************************************************************************************************
 start Mapping
 **************************************************************************************************************************/
module.exports = {
    conversionBank(filename, year, orderNo, pullSeqNo) {
	const FilePaths = [];
		//FilePaths[0] ='2014Orgitest.xml';
        //FilePaths[1] = '2014RevisedTest.xml';

        FilePaths[0] = path1 + orderNo + path2 + '/' + filename;
		console.log(filename + '............................................................................');
       // FilePaths[1] = path1 + orderNo + path2 + '/' + rfilename;
        // console.log(FilePaths[0], FilePaths[1]);

		 const assyear = [];
		 const formname = [];
		 const ifsc = [];
         const acctype = [];
         const banks = [];
         const acc = [];
			for (let i = 0; i < 2; i++) {
				if ((i == 0 && typeof FilePaths[0] != 'undefined') || (i == 1 && typeof FilePaths[1] != 'undefined')) {
					var data = fs.readFileSync(FilePaths[i], 'utf-8'); // reading original file
					data = data.replace(/<\s*/g, '<');  // Remove space after >
					data = data.replace(/\s*>/g, '>');  // Remove space before <
				if(data ){
					try {

							const doc = new dom().parseFromString(data.toString());
							const select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master' });
						// Common Fields for All the ITR Forms
							 assyear[i] = select('//ITRForm:AssessmentYear/text()', doc)[0].nodeValue;
							 formname[i] = select('//ITRForm:FormName/text()', doc)[0].nodeValue;

					try{
							const ifscCo = select('//ITRForm:IFSCCode/text()', doc);
								for (let i = 0; i < ifscCo.length; i++) {
									ifsc[i] = ifscCo[i].nodeValue;

								}
							}
						catch(e){
							console.log(ifsc + 'not found');
						}

					try{
							const bankAcctype = select('//ITRForm:BankAccountType/text()', doc);
								for (let i = 0; i < bankAcctype.length; i++) {
									acctype[i] = bankAcctype[i].nodeValue;

								}
							}
						catch(e){
							console.log(acctype + 'not found');
						}
					try{
						const bankName = select('//ITRForm:BankName/text()', doc);
								for (let i = 0; i < bankName.length; i++) {
									banks[i] = bankName[i].nodeValue;

								}
						}
						catch(e){
							console.log(banks + 'not found');
						}

					try{
						const bankAccNo = select('//ITRForm:BankAccountNo/text()', doc);
								for (let i = 0; i < bankAccNo.length; i++) {
									acc[i] = bankAccNo[i].nodeValue;

								}
							}
							catch(e){
								console.log(BankAccountNo + 'not found');
							}

					try{
								const bankAccNo = select('//ITRForm:BankAccountNumber/text()', doc);
								for (let i = 0; i < bankAccNo.length; i++) {
									acc[i] = bankAccNo[i].nodeValue;

								}

							}
							catch(e){
								console.log(BankAccountNumber + 'not found');
							}

			var unIfsc = unique(ifsc);
			var uAcc = unique(acc);
			var bankInfo = unique(banks);
			var uAcctype = unique(acctype);

		const bankDtls = [];
                for (let i = 0; i < unIfsc.length; i++) {

					bankDtls[i] = {
                        BankName__c: bankInfo[i],
                        IFSC_Code__c: unIfsc[i],
                        Account_Number__c: uAcc[i] +"'",
                        AccountType__c: uAcctype[i],
                    };
                }
			console.log(bankDtls);

				const header = ['BankName__c', 'IFSC_Code__c', 'Account_Number__c', 'AccountType__c'];
                try {
                    const ffcsv = json2csv({
                        data: bankDtls,
                        fields: header
                    });
                    if (ffcsv) {
                        //fs.writeFileSync('bank.csv', ffcsv);
						fs.writeFileSync(path1 + orderNo + path3 + '/' + orderNo + '_' + pullSeqNo + '_' + formname[0] + '_' + assyear[0] + '.csv', ffcsv);
						console.log('bank convertion completed');
                    } else {
                    }
                }
				catch (e) {

				}
			// end of originalfileRetrieved






					}
					catch(e){

						}



					}

				}

			}



	}
};
