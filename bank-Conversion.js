/* Source Code Header
Program Name	:	banks.js
Module Name		:
Description  	:	In this program we are Extracting latest Bank information from XML source file and converting into CSV output files.

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
1.4				:   20th June 2017		sekar			Dropped the bank conversion file
---------------------------------------------------------------------------------------------*/

const fs = require('fs');
// xml2js = require('xml2js');
const json2csv = require('json2csv');
const processing = require('./processing1.js');
// const parser = new xml2js.Parser();
// const XMLSerializer = require('xmldom').XMLSerializer;
const xpath = require('xpath'),
    dom = require('xmldom').DOMParser;


const errorRecovery = require('./errorRecoveryFunc.js');
// const sync = require('synchronize');
const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? 'googleDownUpload/' : "awsDownUpload/";
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';

module.exports = {
    conversion(latFile, orderNo, pullSeqNo,oriRev) {

        const files = path1 + orderNo + path2 + '/' + latFile;
        try {
            var data = fs.readFileSync(files, 'utf-8');
					data = data.replace(/<\s*/g, '<');  // Remove space after >
					data = data.replace(/\s*>/g, '>');  // Remove space before <
            if (data) {
                const doc = new dom().parseFromString(data.toString(), 'text/xml');
                const select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master' });
                const assyear = select('//ITRForm:AssessmentYear/text()', doc)[0].nodeValue;
                const formname = select('//ITRForm:FormName/text()', doc)[0].nodeValue;

                const ifsc = [];
                const acctype = [];
                const banks = [];
                const acc = [];

                const ifscCo = select('//ITRForm:IFSCCode/text()', doc);
                for (let i = 0; i < ifscCo.length; i++) {
                    ifsc[i] = ifscCo[i].nodeValue;
                }

                const bankAcctype = select('//ITRForm:BankAccountType/text()', doc);
                for (let i = 0; i < bankAcctype.length; i++) {
                    acctype[i] = bankAcctype[i].nodeValue;
                }

                if (assyear == 2015 || assyear == 2016) {
                    const bankName = select('//ITRForm:BankName/text()', doc);
                    for (let i = 0; i < bankName.length; i++) {
                        banks[i] = bankName[i].nodeValue;
                    }

                    const bankAccNo = select('//ITRForm:BankAccountNo/text()', doc);
                    for (let i = 0; i < bankAccNo.length; i++) {
                        acc[i] = bankAccNo[i].nodeValue;
                    }
                }
				else if (assyear == 2013 || assyear == 2014) {
                    const bankAccNo = select('//ITRForm:BankAccountNumber/text()', doc);
                    for (let i = 0; i < bankAccNo.length; i++) {
                        acc[i] = bankAccNo[i].nodeValue;
                    }
                    for (let i = 0; i < bankAccNo.length; i++) {
                        banks[i] = '';
                    }
                }

                const bankDtls = [];
                for (let i = 0; i < ifscCo.length; i++) {
                    bankDtls[i] = {
                        BankName__c: banks[i],
                        IFSC_Code__c: ifsc[i],
                        Account_Number__c: acc[i]+"'",
                        AccountType__c: acctype[i],
                    };
                }
                const fileEx = '.csv';
                const type = 'BD';
                const header = ['BankName__c', 'IFSC_Code__c', 'Account_Number__c', 'AccountType__c'];
                try {
                    const ffcsv = json2csv({
                        data: bankDtls,
                        fields: header
                    });
                    if (ffcsv) {
                        fs.writeFileSync(path1 + orderNo + path3 + '/' + orderNo + '_' + pullSeqNo + '_' + type + '_' + assyear + fileEx, ffcsv);
						console.log('bank convertion completed');
						 var banCsvName = orderNo + '_' + pullSeqNo + '_' + type + '_' + assyear + fileEx;
						 processing.updateProceFile(orderNo,9,assyear,banCsvName,formname,oriRev);
						 //processing.updateProceFile(orderNo,26,0,'Success');
                    } else {
                       processing.updateProceFile(orderNo,10,assyear,'FailureOthers');
					   //processing.updateProceFile(orderNo,26,0,'Failure');
                    }
                } catch (e) {
                   // errorRecovery.errRecovery(orderNo, 1, e);
				}
            }
			else {
				processing.updateProceFile(orderNo,10,assyear,'FailureXMLFileReadError');
				//processing.updateProceFile(orderNo,26,0,'Failure');
			}
        } catch (e) {
			processing.updateProceFile(orderNo,10,assyear,'FailureImproperXML');
			//processing.updateProceFile(orderNo,26,0,'Failure');
        }
    },
};
