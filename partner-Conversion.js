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

const parser = new xml2js.Parser();
const xpath = require('xpath'),
    dom = require('xmldom').DOMParser;

const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? './googleDownUpload/' : "./awsDownUpload/";
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';

//var files = ['2014Orgitest.xml','2014RevisedTest.xml'];
module.exports = {
    conversionPartner(ofilename, rfilename, year, orderNo, pullSeqNo) {
		const FilePaths = [];
        FilePaths[0] = path1 + orderNo + path2 + '/' + ofilename;
        FilePaths[1] = path1 + orderNo + path2 + '/' + rfilename;
		// FilePaths[0] = ofilename;
		// FilePaths[1] = rfilename;


	var firmName1 = [];
	var profit = [];
	var profitAmt = [];
	var panNumber =[];
	var FirmCapBalOnMar = [];
	var FirmSalComRen = [];
	var intFirmCap = [];
	var totIncome = [];
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
					assyear = checkFieldAvl('//ITRForm:AssessmentYear/text()',0);
                    var formname1 = checkFieldAvl('//ITRForm:FormName/text()', 0);
					var firstName = checkFieldAvl('//ITRForm:FirstName/text()', 0);
					var middleName = checkFieldAvl('//ITRForm:MiddleName/text()', 0);
					var lastName = checkFieldAvl('//ITRForm:SurNameOrOrgName/text()', 0);
				if(formname1 == 'ITR-3'|| formname1 == 'ITR-4'){
					var firm = select('//ITRForm:FirmName/text()', doc);
					if(firm.length>0){
						for (let i = 0; i < firm.length; i++) {
									firmName1[i] = firm[i].nodeValue;
						}
					}
					else{
						firmName1 = 0;
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
					var profitShare = select('//ITRForm:ProfitSharePercent/text()', doc);
					if(profitShare.length>0){
						for (let i = 0; i < profitShare.length; i++) {
							profit[i] = profitShare[i].nodeValue;

						}
					}
					else{
						profit =0;
					}
					//console.log(profitShare);
					console.log(profit);
					var proShAmt = select('//ITRForm:ProfitShareAmt/text()', doc);
					if(proShAmt.length>0){
						for (let i = 0; i < proShAmt.length; i++) {
							profitAmt[i] = proShAmt[i].nodeValue;
						}
					}
					else{
						profitAmt =0;
					}
					var FirmCapBal = select('//ITRForm:FirmCapBalOn31Mar/text()', doc);
					if(FirmCapBal.length>0){
						for (let i = 0; i < FirmCapBal.length; i++) {
							FirmCapBalOnMar[i] = FirmCapBal[i].nodeValue;
						}
					}
					else{
						FirmCapBalOnMar =0;
					}
				if(formname1 == 'ITR-3'){

					//if(assyear != 2017){
						console.log('hi');
						var FirmSalCom = select('//ITRForm:FirmSalBonComRen/text()', doc);
						if(FirmSalCom.length>0){
							for (let i = 0; i < FirmSalCom.length; i++) {
								FirmSalComRen[i] = FirmSalCom[i].nodeValue;
							}
						}
						else{
							FirmSalComRen = 0;
						}
					// } else{
						// FirmSalComRen = 0;
						// console.log(FirmSalComRen);
					// }

					//if(assyear != 2017){
						var FirmCap = select('//ITRForm:IntFirmCap/text()', doc);
						if(FirmCap.length>0){
							for (let i = 0; i < FirmCap.length; i++) {
								intFirmCap[i] = FirmCap[i].nodeValue;
							}
						}
						else{
							intFirmCap =0;
						}

					// } else{
						// intFirmCap =0;
					// }
					var totInc = select('//ITRForm:TotalIncome/text()', doc);
					if(totInc.length>0){
						for (let i = 0; i < totInc.length; i++) {
							totIncome[i] = totInc[i].nodeValue;
						}
					}
					else{
						totIncome =0;
					}
				}
				else{
					totIncome = 0;
					intFirmCap =0;
					FirmSalComRen =0;
				}

			}

				}
					catch(e){

					}
			}
			else{

			}
	}
	else{
		console.log('Original file found');
		var data = fs.readFileSync(FilePaths[0], 'utf-8'); // reading original file
				data = data.replace(/<\s*/g, '<');  // Remove space after >
				data = data.replace(/\s*>/g, '>');  // Remove space before >
				//console.log(data);
			if (data) {
					try {
					const doc = new dom().parseFromString(data.toString());
                    const select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master' })
					assyear = checkFieldAvl('//ITRForm:AssessmentYear/text()',0)
                    var formname1 = checkFieldAvl('//ITRForm:FormName/text()', 0);
					var firstName = checkFieldAvl('//ITRForm:FirstName/text()', 0);
					var middleName = checkFieldAvl('//ITRForm:MiddleName/text()', 0);
					var lastName = checkFieldAvl('//ITRForm:SurNameOrOrgName/text()', 0);
				if(formname1 == 'ITR-3'|| formname1 == 'ITR-4' ){
					var firm = select('//ITRForm:FirmName/text()', doc);
					if(firm.length>0){
						for (let i = 0; i < firm.length; i++) {
							firmName1[i] = firm[i].nodeValue;
						}
					}
					else{
						firmName1 =0;
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
					var profitShare = select('//ITRForm:ProfitSharePercent/text()', doc);
					if(profitShare.length>0){
						for (let i = 0; i < profitShare.length; i++) {
							profit[i] = profitShare[i].nodeValue;
						}
					}else{
						profit =0;
					}

					var proShAmt = select('//ITRForm:ProfitShareAmt/text()', doc);
					if(proShAmt.length>0){
						for (let i = 0; i < proShAmt.length; i++) {
							profitAmt[i] = proShAmt[i].nodeValue;
						}
					}
					else{
						profitAmt =0;
					}

					var FirmCapBal = select('//ITRForm:FirmCapBalOn31Mar/text()', doc);
					if(FirmCapBal.length>0){
						for (let i = 0; i < FirmCapBal.length; i++) {
							FirmCapBalOnMar[i] = FirmCapBal[i].nodeValue;
						}
					}
					else{
						FirmCapBalOnMar=0;
					}
				if(formname1 == 'ITR-3'){
					//if(assyear != 2017){
						var FirmSalCom = select('//ITRForm:FirmSalBonComRen/text()', doc);
						if(FirmSalCom.length>0){
								for (let i = 0; i < FirmSalCom.length; i++) {
									FirmSalComRen[i] = FirmSalCom[i].nodeValue;
								}
							}
							else{
								FirmSalComRen = 0;
							}
					// } else{
						// FirmSalComRen = 0;
						// console.log(FirmSalComRen + '.......250');
					// }



					//if(assyear != 2017){
							var FirmCap = select('//ITRForm:IntFirmCap/text()', doc);
							if(FirmCap.length>0){
								for (let i = 0; i < FirmCap.length; i++) {
									intFirmCap[i] = FirmCap[i].nodeValue;
								}
							}
							else{
								intFirmCap = 0;
							}
					// } else{
						// intFirmCap = 0;
					// }

					var totInc = select('//ITRForm:TotalIncome/text()', doc);
					if(totInc.length>0){
						for (let i = 0; i < totInc.length; i++) {
							totIncome[i] = totInc[i].nodeValue;
						}
					}
					else {

						//totIncome.push(0);
					}
				}
				else{
					FirmSalComRen = 0;
					intFirmCap = 0;
					totIncome =0;
				}
			}
		}
					catch(e){

					}
			}
			else{

			}
	}
		if(firmName1.length>0){
			if(formname1 == 'ITR-3'){
				 var parDtls = [];

					for (let i = 0; i < firmName1.length; i++) {

						var salBOnComm = [];
						var inte = [];
						if(FirmSalComRen[i] == undefined){
							salBOnComm[i] = 0;
						}else{
							salBOnComm[i] = FirmSalComRen[i];
						}
						if(intFirmCap[i] == undefined){
							inte[i] = 0;
						}else{
							inte[i] = intFirmCap[i];
						}
						console.log(inte[i]);
						parDtls[i] = {
							FormName__c: formname1,
							Year__c: assyear,
							FirmName__c: firmName1[i],
							ShareOfProfit__c: profit[i],
							AmtShareOfProfit__c: profitAmt[i],
							ShareInCap__c: FirmCapBalOnMar[i],
							SalBonComm__c: salBOnComm[i],
							Interest__c: inte[i],
							NetInc__c: totIncome[i],

						};
					}
				}
				if(formname1 == 'ITR-4' ){
				 var parDtls = [];
					for (let i = 0; i < firmName1.length; i++) {
						parDtls[i] = {
							FormName__c: formname1,
							Year__c: assyear,
							FirmName__c: firmName1[i],
							ShareOfProfit__c: profit[i],
							AmtShareOfProfit__c: profitAmt[i],
							ShareInCap__c: FirmCapBalOnMar[i],
							SalBonComm__c: 0,
							Interest__c: 0,
							NetInc__c: 0,

						};
					}
				}
				console.log(parDtls);
				const fileEx = '.csv';
                const type = 'Partner';
                const header = ['FormName__c','Year__c','FirmName__c', 'ShareOfProfit__c', 'AmtShareOfProfit__c', 'ShareInCap__c','SalBonComm__c','Interest__c','NetInc__c'];
                try {
                    const ffcsv = json2csv({
                        data: parDtls,
                        fields: header
                    });
					if (ffcsv) {
							fs.writeFileSync(path1 + orderNo + path3 + '/' + orderNo + '_' + pullSeqNo + '_' + type + '_' + assyear + fileEx, ffcsv);
							console.log('partner convertion completed');
						} else {
						   //processing.updateProceFile(orderNo,10,assyear,'FailureOthers');
						}
				} catch (e) {

				}
			}
			else{
				var parDtlsZero =[];
					parDtlsZero = [{
							FormName__c: formname1,
							Year__c: assyear,
							FirmName__c: 0,
							ShareOfProfit__c: 0,
							AmtShareOfProfit__c: 0,
							ShareInCap__c: 0,
							SalBonComm__c: 0,
							Interest__c: 0,
							NetInc__c: 0,

						}];
				console.log(parDtlsZero);
				const fileEx = '.csv';
                const type = 'Partner';
                const header = ['FormName__c','Year__c','FirmName__c', 'ShareOfProfit__c', 'AmtShareOfProfit__c', 'ShareInCap__c','SalBonComm__c','Interest__c','NetInc__c'];
                try {
                    const ffcsv = json2csv({
                        data: parDtlsZero,
                        fields: header
                    });
                    if (ffcsv) {
                        fs.writeFileSync(path1 + orderNo + path3 + '/' + orderNo + '_' + pullSeqNo + '_' + type + '_' + assyear + fileEx, ffcsv);
						console.log('partner convertion completed');
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
				let value = 0;
				return value;
			}

		}
	}
};
