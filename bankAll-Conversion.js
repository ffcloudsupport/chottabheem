/* Source Code Header
Program Name	:	bankAll-Conversion.js
Module Name		:
Description  	:	In this program we are Extracting  Bank information from XML source file and converting into CSV output files.

Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 05/08/2016
Created By		:	sekar
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		:	Revision Date:		Revised By		Details
1.1				:	24th Jan 2017		sekar			Adding New Logic to extract all the bank information
1.2				:	20th June 2017		sekar			Added Logic to extract 2017 bank details
---------------------------------------------------------------------------------------------*/
const fs = require('fs');
const json2csv = require('json2csv');
const processing = require('./processing1.js');
const unique = require('array-unique');
const mkdirp = require('mkdirp');
const xpath = require('xpath'),
    dom = require('xmldom').DOMParser;


const errorRecovery = require('./errorRecoveryFunc.js');
const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? './googleDownUpload/' : "./awsDownUpload/";
const bankcsvPath = 'BankCsvFiles/';
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';

module.exports = {
    bankConversion(latFile, orderNo, pullSeqNo,oriRev) {

        const files = path1 + orderNo + path2 + '/' + latFile;
        try {
            var data = fs.readFileSync(files, 'utf-8');
					data = data.replace(/<\s*/g, '<');  // Remove space after >
					data = data.replace(/\s*>/g, '>');  // Remove space before <
            if (data) {
                const doc = new dom().parseFromString(data.toString(), 'text/xml');
                const select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master' });

				const ifsc = [];
                const acctype = [];
                const banks = [];
                const acc = [];

				const assyear = select('//ITRForm:AssessmentYear/text()', doc)[0].nodeValue;
                const formname = select('//ITRForm:FormName/text()', doc)[0].nodeValue;

                const ifscCo = select('//ITRForm:IFSCCode/text()', doc);
                for (let i = 0; i < ifscCo.length; i++) {
                    ifsc[i] = ifscCo[i].nodeValue;
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
					const bankAcctype = select('//ITRForm:BankAccountType/text()', doc);
					for (let i = 0; i < bankAcctype.length; i++) {
						acctype[i] = bankAcctype[i].nodeValue;
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
					const bankAcctype = select('//ITRForm:BankAccountType/text()', doc);
					for (let i = 0; i < bankAcctype.length; i++) {
						acctype[i] = bankAcctype[i].nodeValue;
					}
                }
				else if(assyear == 2017){
					const bankAccNo = select('//ITRForm:BankAccountNo/text()', doc);
                    for (let i = 0; i < bankAccNo.length; i++) {
                        acc[i] = bankAccNo[i].nodeValue;
                    }
                    const bankName = select('//ITRForm:BankName/text()', doc);
                    for (let i = 0; i < bankName.length; i++) {
                        banks[i] = bankName[i].nodeValue;
                    }
					for (let i = 0; i < bankAccNo.length; i++) {
						acctype[i] = '';
					}
				}

			//var unIfsc = unique(ifsc);
			var uAcc = unique(acc);

                const bankDtls = [];
                for (let i = 0; i < uAcc.length; i++) {
                    bankDtls[i] = {
                        BankName__c: banks[i],
                        IFSC_Code__c: ifsc[i],
                        Account_Number__c: uAcc[i] + "'",
                        AccountType__c: acctype[i],
						Year__c: assyear,
                    };

                }
				console.log(bankDtls);
                const fileEx = '.csv';
                const type = 'BDAll';
                const header = ['BankName__c', 'IFSC_Code__c', 'Account_Number__c', 'AccountType__c','Year__c'];
                try {
                    const ffcsv = json2csv({
                        data: bankDtls,
                        fields: header
                    });
                    if (ffcsv) {
						try{
							mkdirp.sync(path1 + orderNo + "/"+ bankcsvPath);
							// , (err) => {
									// if (err) {
										// console.log('Error occured while creating CSV FIle Folders path' + err);
									// } else {

									// }
								// });
						}
						catch(e){
							console.log('error'+e);
						}
                        fs.writeFileSync(path1+ orderNo + "/" + bankcsvPath +'/' + orderNo +'_'+type + '_' + assyear + fileEx, ffcsv);
						console.log('bank convertion completed');
						// var banCsvName = orderNo + '_' + pullSeqNo + '_' + type + '_' + assyear + fileEx;
						// processing.updateProceFile(orderNo,9,assyear,banCsvName,formname,oriRev);
                    } else {
                       //processing.updateProceFile(orderNo,10,assyear,'FailureOthers');
                    }
                } catch (e) {

				}
            }
			else {
				//processing.updateProceFile(orderNo,10,assyear,'FailureXMLFileReadError');
			}
        } catch (e) {
			//processing.updateProceFile(orderNo,10,assyear,'FailureImproperXML');
        }
    },
};
