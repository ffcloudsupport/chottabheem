/* Source Code Header
Program Name	:	itr-Conversion.js
Module Name		:
Description  	:	In this program we are Extracting all the itreturn information from XML source file and converting into CSV output files.

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
1.4             :	6th Oct 2016		sekar			Added ExtraFields
1.5             :	20th Oct 2016		sekar			Added Comments & else Condition for All ITR Mappings
1.6 			:	4th Nov 2016		sekar			Added extra additional mapping fields
1.7				:   20th june 2017		sekar			Added 2017 year extraction details
---------------------------------------------------------------------------------------------*/
/** *** **************************************************************************************************************
Require node  module details
********************************************************************************************************************/
const errorRecovery = require('./errorRecoveryFunc.js');
const processing = require('./processing1.js');
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
/** *************************************************************************************************************************
 start Mapping
 **************************************************************************************************************************/
module.exports = {
    conversionItp(ofilename, rfilename, year, orderNo, pullSeqNo) {
		const dapullsumfilepath = path1 + orderNo + path2 + '/' + 'DataPullSummary.json';
		const FilePaths = [];
        FilePaths[0] = path1 + orderNo + path2 + '/' + ofilename;
        FilePaths[1] = path1 + orderNo + path2 + '/' + rfilename;
         console.log(ofilename, rfilename, pullSeqNo);

		var originalfileRetrieved = true;
		var revisedfileRetrieved = true;
        // declaring variables for csv 1 st row of data
        const assyear = [];
        const formname = [];
        const latest = [];


        const actualfilingdt = [0, '01/01/2099'];
        const advaTax = [0, 0];
        const broghtfwd = [0, 0];
        const busPro = [0, 0];
        const capgains = [0, 0];
        const cyloss = [0, 0];
        const educ = [0, 0];
        const houseproperty = [0, 0];
        const incTax = [0, 0];
        const int234A = [0, 0];
        const int234B = [0, 0];
        const int234C = [0, 0];
        const netAgri = [0, 0];
        const rebateAgri = [0, 0];
        const rebate87A = [0, 0];
        const salary = [0, 0];
        const sec89 = [0, 0];
        const sec90 = [0, 0];
        const sec91 = [0, 0];
        const otherinc = [0, 0];
        const selfAssTax = [0, 0];
        const surcharge = [0, 0];
        const taxAtNor = [0, 0];
        const taxAtSpl = [0, 0];
        const tds = [0, 0];
        const totIncOs = [0, 0];
        const via = [0, 0];
		const overAllSection44AB = ['N', 'N'];
		const sec92E =['N', 'N'];
		const revenue = [0, 0];
		const proBfIncTax = [0, 0];
		const depreAmrt = [0, 0];
		const interest = [0, 0];
		const proBfrTax = [0, 0];
		const deduc10A = [0, 0];
		const tcs =[0, 0];
		const revCounts = [0, 0];
		const firmName = [0, 0];
		const ExIncome = [0, 0];
		const statusITR = [0, 0];
		const StatusItr = [0, 0];
		const Assets = [0, 0];
		const Liability = [0, 0];


		var extFileName =[];
        for (let i = 0; i < 2; i++) {
            if ((i == 0 && typeof ofilename != 'undefined') || (i == 1 && typeof rfilename != 'undefined')) {

                var data = fs.readFileSync(FilePaths[i], 'utf-8'); // reading original file
					data = data.replace(/<\s*/g, '<');  // Remove space after >
					data = data.replace(/\s*>/g, '>');  // Remove space before <
					//var configYears = year;
				if (data) {
					try {
					console.log('itreturn conversion started');
                    const doc = new dom().parseFromString(data.toString());
                    const select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master' , 'ITR4FORM': 'http://incometaxindiaefiling.gov.in/ITR4'});

		// Common Fields for All the ITR Forms
					assyear[i] = checkFieldAvl('//ITRForm:AssessmentYear/text()',0)
                    formname[i] = checkFieldAvl('//ITRForm:FormName/text()', 0);
					int234A[i] = checkFieldAvl('//ITRForm:IntrstPayUs234A/text()', 0);
                    int234B[i] = checkFieldAvl('//ITRForm:IntrstPayUs234B/text()', 0);
                    int234C[i] = checkFieldAvl('//ITRForm:IntrstPayUs234C/text()', 0);
                    advaTax[i] = checkFieldAvl('//ITRForm:AdvanceTax/text()', 0);
                    tds[i] = checkFieldAvl('//ITRForm:TDS/text()', 0);
					selfAssTax[i] = checkFieldAvl('//ITRForm:SelfAssessmentTax/text()', 0);
					console.log(assyear,formname);
					let extraInfo = '';
                    if (i == 0) {
                        latest[i] = 'TRUE';
                        latest[i + 1] = 'FALSE';
                        assyear[i + 1] = assyear[i];
                        extraInfo = 'ExtraInfo_Orig';
                    } else {
                        latest[i - 1] = 'False';
                        latest[i] = 'TRUE';
                        extraInfo = 'ExtraInfo_Rev';
					}

                    parser.parseString(data, (err, result) => {
                        const jds = JSON.stringify(result);

                        fs.writeFileSync(path1 + orderNo + path3 + '/' + extraInfo + '_' + orderNo + '_' + pullSeqNo + '_' + formname[i] + '_' + assyear[i] + '.json', jds);

						extFileName[i] = extraInfo + '_' + orderNo + '_' + pullSeqNo + '_' + formname[i] + '_' + assyear[i] + '.json';

                    });

					// Getting Actual date of filling & RevisionCount from Json File
					try{
						var pulldata = fs.readFileSync(dapullsumfilepath, 'utf-8');
							var jsonData = JSON.parse(pulldata);
							var allYearDtls = jsonData.ReturnData;
							var fitype = '';
							if(i==0){
							     fitype = 'Original'
							}
							else{
								 fitype = 'Revised';
							}
							var fileyear = assyear[i];
							var x1=0;

							var AckNos =[];
							let filingDates =[];
							let ItRstat = [];
							let revcount = 0;
							for(let l = 0; l < allYearDtls.length; l++){

									let AYyear = JSONPath.eval(allYearDtls[l], "$..['A.Y.']");
									let Filingtype  = JSONPath.eval(allYearDtls[l], "$..'Filing Type'");
									let FilingDate = JSONPath.eval(allYearDtls[l], "$..'Filing Date'");
									let FormType = JSONPath.eval(allYearDtls[l], "$..'ITR/Form'");
									let ItrStatus = JSONPath.eval(allYearDtls[l], "$..['Status']");
									let ackNo = JSONPath.eval(allYearDtls[l], "$..['Ack. No.']");
									let AllFormTypes = ['ITR-1','ITR-2','ITR-2A','ITR-3','ITR-4','ITR-4S'];
									let year   =  AYyear[0].substring(0, 4);
								if(fileyear == year  && Filingtype[0] == fitype  && (AllFormTypes.indexOf(FormType[0])  > -1)){
											filingDates[x1] = FilingDate[0];
											ItRstat[x1] = ItrStatus[0];
											AckNos[x1] = ackNo[0];
											x1++;
											if(Filingtype[0] == 'Revised'){
												revcount++;
											}

										}
							}
							revCounts[i] = revcount;

							var grtAkno = '';
							var lastFiDate = '';
							var itrStatusDet = '';
							if(AckNos.length == 0){

							}
							else{
								let one = AckNos[0];
								lastFiDate = filingDates[0];
								itrStatusDet = ItRstat[0];
								for (let k = 1; k < AckNos.length; k++) {
								 const Two = AckNos[k];
									 if (one < Two) {
										   one = Two;
										   lastFiDate = filingDates[k];
										   itrStatusDet = ItRstat[k];
									  }
								 }
								 grtAkno = one;
							}
							if(i==0){
							     processing.updateProceFile(orderNo,1,year,lastFiDate);
							}
							else{
								  processing.updateProceFile(orderNo,3,year,lastFiDate);
							}
							actualfilingdt[i] = lastFiDate;
							statusITR[i] = itrStatusDet;
							console.log(statusITR[i] + '..........................')
					}
						catch(e){
							if(i==0){
									originalfileRetrieved =false ;
									processing.updateProceFile(orderNo,4,year);
													//processing.updateProceFile(orderNo,25,year,'Failure');
									}
									else if(i==1){
										revisedfileRetrieved  = false ;
										processing.updateProceFile(orderNo,4,year);
										//processing.updateProceFile(orderNo,25,year,'Failure');
										}
						}

                        // ITR-1 year 2013,2014,2015,2016,2017 && Commented mapping fields are not available for the particular file type
                        if (formname[i] == 'ITR-1' && (assyear[i] == 2017 || assyear[i] == 2016 || assyear[i] == 2015 || assyear[i] == 2014 || assyear[i] == 2013)) {
                            salary[i] = checkFieldAvl('//ITRForm:IncomeFromSal/text()', 0);
							houseproperty[i] = checkFieldAvl('//ITRForm:TotalIncomeOfHP/text()', 0);
                            //busPro[i] = checkFieldAvl('//ITRForm:TotProfBusGain/text()', 0);
							//capgains[i] = checkFieldAvl('//ITRForm:TotalCapGains/text()', 0);
							totIncOs[i] = checkFieldAvl('//ITRForm:IncomeOthSrc/text()', 0);
                            //cyloss[i] = checkFieldAvl('//ITRForm:CurrentYearLoss/text()', 0);
							//broghtfwd[i] = checkFieldAvl('//ITRForm:BroughtFwdLossesSetoff/text()', 0);
							//incTax[i] = checkFieldAvl('//ITRForm:IncChargeableTaxSplRates/text()', 0);
							via[i] = checkFieldAvl('//ITRForm:TotalChapVIADeductions/text()', 0);
                            //netAgri[i] = checkFieldAvl('//ITRForm:NetAgricultureIncomeOrOtherIncomeForRate/text()', 0);
							taxAtNor[i] = checkFieldAvl('//ITRForm:TotalTaxPayable/text()', 0);
                            //taxAtSpl[i] = checkFieldAvl('//ITRForm:TaxAtSpecialRates/text()', 0);
							//rebateAgri[i] = checkFieldAvl('//ITRForm:RebateOnAgriInc/text()', 0);
							rebate87A[i] = checkFieldAvl('//ITRForm:Rebate87A/text()', 0);
                            //surcharge[i] = checkFieldAvl('//ITRForm:SurchargeOnAboveCrore/text()', 0);
                            //revenue[i] = checkFieldAvl('//ITRForm:TotRevenueFrmOperations/text()', 0);
                            educ[i] = checkFieldAvl('//ITRForm:EducationCess/text()', 0);
                            sec89[i] = checkFieldAvl('//ITRForm:Section89/text()', 0);
							//sec90[i] = checkFieldAvl('//ITRForm:Section90/text()', 0);
                            //sec91[i] = checkFieldAvl('//ITRForm:Section91/text()', 0);
							//proBfIncTax[i] = checkFieldAvl('//ITRForm:PBIDTA/text()', 0);
							//depreAmrt[i] = checkFieldAvl('//ITRForm:DepreciationAmort/text()', 0);
							//interest[i] = checkFieldAvl('//ITRForm:InterestExpdr/text()', 0);
							//proBfrTax[i] = checkFieldAvl('//ITRForm:PBT/text()', 0);
							//deduc10A[i] = checkFieldAvl('//ITRForm:DeductionsUnder10Aor10AA/text()', 0);
							tcs[i] = checkFieldAvl('//ITRForm:TCS/text()', 0);
							ExIncome[i] = checkFieldAvl('//ITR1FORM:TaxExmpIntInc/text()', 0);
							StatusItr[i] = checkFieldAvl('//ITRForm:Status/text()', 0);
							if(assyear[i] == 2016 ||  assyear[i] == 2015 || assyear[i] == 2014 || assyear[i] == 2013){
							   surcharge[i] = checkFieldAvl('//ITRForm:SurchargeOnAboveCrore/text()', 0);
							}

                        }


						// ITR-2   year 2013,2014,2015,2016,2017 && Commented mapping fields are not available for the particular file type
						else if (formname[i] == 'ITR-2' && (assyear[i] == 2017 || assyear[i] == 2016 || assyear[i] == 2015 || assyear[i] == 2014 || assyear[i] == 2013)) {
							salary[i] = checkFieldAvl('//ITRForm:Salaries/text()', 0);
							houseproperty[i] = checkFieldAvl('//ITRForm:IncomeFromHP/text()', 0);
                            //busPro[i] = checkFieldAvl('//ITRForm:TotProfBusGain/text()', 0);
							capgains[i] = checkFieldAvl('//ITRForm:TotalCapGains/text()', 0);
							totIncOs[i] = checkFieldAvl('//ITRForm:TotIncFromOS/text()', 0);
                            cyloss[i] = checkFieldAvl('//ITRForm:CurrentYearLoss/text()', 0);
							broghtfwd[i] = checkFieldAvl('//ITRForm:BroughtFwdLossesSetoff/text()', 0);
							//incTax[i] = checkFieldAvl('//ITRForm:IncChargeableTaxSplRates/text()', 0);
							//via[i] = checkFieldAvl('//ITRForm:TotalChapVIADeductions/text()', 1);
							netAgri[i] = checkFieldAvl('//ITRForm:NetAgricultureIncomeOrOtherIncomeForRate/text()', 0);
							taxAtNor[i] = checkFieldAvl('//ITRForm:TaxAtNormalRatesOnAggrInc/text()', 0);
                            taxAtSpl[i] = checkFieldAvl('//ITRForm:TaxAtSpecialRates/text()', 0);
                            rebateAgri[i] = checkFieldAvl('//ITRForm:RebateOnAgriInc/text()', 0);
                            rebate87A[i] = checkFieldAvl('//ITRForm:Rebate87A/text()', 0);
                            surcharge[i] = checkFieldAvl('//ITRForm:SurchargeOnAboveCrore/text()', 0);
                            // revenue[i] = checkFieldAvl('//ITRForm:TotRevenueFrmOperations/text()', 0);
                            educ[i] = checkFieldAvl('//ITRForm:EducationCess/text()', 0);
                            sec89[i] = checkFieldAvl('//ITRForm:Section89/text()', 0);
                            sec90[i] = checkFieldAvl('//ITRForm:Section90/text()', 0);
                            sec91[i] = checkFieldAvl('//ITRForm:Section91/text()', 0);
							//proBfIncTax[i] = checkFieldAvl('//ITRForm:PBIDTA/text()', 0);
							//depreAmrt[i] = checkFieldAvl('//ITRForm:DepreciationAmort/text()', 0);
							//interest[i] = checkFieldAvl('//ITRForm:InterestExpdr/text()', 0);
							//proBfrTax[i] = checkFieldAvl('//ITRForm:PBT/text()', 0);
							//deduc10A[i] = checkFieldAvl('//ITRForm:DeductionsUnder10Aor10AA/text()', 0);
							tcs[i] = checkFieldAvl('//ITRForm:TCS/text()', 0);
							ExIncome[i] = checkFieldAvl('//ITRForm:TotalExemptInc/text()', 0);
							StatusItr[i] = checkFieldAvl('//ITRForm:Status/text()', 0);
                            Liability[i] = checkFieldAvl('//ITRForm:LiabilityInRelatAssets/text()', 0);

							if(assyear[i] == 2017){
							   busPro[i] = checkFieldAvl('//ITRForm:TotProfBusGain/text()', 0);
							   sec92E[i] = checkFieldAvl('//ITRForm:Sec92EFirmFlag/text()', 0);
							   incTax[i] = checkFieldAvl('//ITRForm:IncChargeTaxSplRate111A112/text()', 0);
							   via[i] = checkFieldAvl('//ITRForm:DeductionsUnderScheduleVIA/text()', 0);
							   var amt =0;
							parser.parseString(data, function (err, result) {
									var test =[];
									try{
										var amtTagCount = result['ITRETURN:ITR']['ITR2FORM:ITR2'][0]['ITRForm:ScheduleAL'][0]['ITRForm:ImmovableDetails'];
										}
										catch(e){

										}
									var amtAll =[];
								try{
									for(let i=0;i<amtTagCount.length;i++){
										try{
										amtAll[i] = result['ITRETURN:ITR']['ITR2FORM:ITR2'][0]['ITRForm:ScheduleAL'][0]['ITRForm:ImmovableDetails'][i]['ITRForm:Amount'];
										amt += parseFloat(amtAll[i]);

										}
										catch(e){

										}
									}
								}
								catch(e){
									console.log('there is  no AMount');
								}
							});

								let depInBank;
								   depInBank = checkFieldAvl('//ITRForm:DepositsInBank/text()', 0);
								let sharenSec;
								   sharenSec = checkFieldAvl('//ITRForm:SharesAndSecurities/text()', 0);
								let insPolicy;
								   insPolicy = checkFieldAvl('//ITRForm:InsurancePolicies/text()', 0);
								let lnandAdv;
								   lnandAdv = checkFieldAvl('//ITRForm:LoansAndAdvancesGiven/text()', 0);
								let cashinHand;
								   cashinHand = checkFieldAvl('//ITRForm:CashInHand/text()', 0);
								let jewlBul;
								   jewlBul = checkFieldAvl('//ITRForm:JewelleryBullionEtc/text()', 0);
								let arcDraw;
								   arcDraw = checkFieldAvl('//ITRForm:ArchCollDrawPaintSulpArt/text()', 0);
								let vehBoat;
								   vehBoat = checkFieldAvl('//ITRForm:VehiclYachtsBoatsAircrafts/text()', 0);
								try{
									var assInvAll = select('//ITRForm:AssesseInvestment/text()', doc);
									const assInvestment = [];
									var assInv =0;
									for (let i = 0; i < assInvAll.length; i++) {
										assInvestment[i] = assInvAll[i].nodeValue;
										assInv += parseFloat(assInvestment[i]);

									}
									console.log(assInv+'................................498');
								}
								catch(e){
									console.log('AssesseInvestment not found  '+'................................474');
								}
								assetsDet = parseFloat(amt) + parseFloat(depInBank)+parseFloat(sharenSec)+parseFloat(insPolicy)+parseFloat(lnandAdv)+parseFloat(cashinHand)+parseFloat(jewlBul)+parseFloat(arcDraw)+parseFloat(vehBoat)+parseFloat(assInv);
							    Assets[i] = assetsDet;
								console.log(assetsDet + '....................................329');

							}
							else if(assyear[i] == 2016 || assyear[i] == 2015 || assyear[i] == 2014 || assyear[i] == 2013){
								incTax[i] = checkFieldAvl('//ITRForm:IncChargeableTaxSplRates/text()', 0);
								via[i] = checkFieldAvl('//ITRForm:TotalChapVIADeductions/text()', 1);
								Assets[i] = checkFieldAvl('//ITRForm:TotalImmovablMovablAssets/text()', 0);

							}

                        }

                        // ITR-2A  year 2016,2015 && Commented mapping fields are not available for the particular file type
                        else if ( formname[i] == 'ITR-2A' && (assyear[i] == 2016 || assyear[i] == 2015 )) {
							salary[i] = checkFieldAvl('//ITRForm:Salaries/text()', 0);
							houseproperty[i] = checkFieldAvl('//ITRForm:IncomeFromHP/text()', 0);
                            //busPro[i] = checkFieldAvl('//ITRForm:TotProfBusGain/text()', 0);
							//capgains[i] = checkFieldAvl('//ITRForm:TotalCapGains/text()', 0);
							totIncOs[i] = checkFieldAvl('//ITRForm:TotIncFromOS/text()', 0);
                            cyloss[i] = checkFieldAvl('//ITRForm:CurrentYearLoss/text()', 0);
                            broghtfwd[i] = checkFieldAvl('//ITRForm:BroughtFwdLossesSetoff/text()', 0);
                            incTax[i] = checkFieldAvl('//ITRForm:IncChargeableTaxSplRates/text()', 0);
                            //via[i] = checkFieldAvl('//ITRForm:TotalChapVIADeductions/text()', 0);
                            netAgri[i] = checkFieldAvl('//ITRForm:NetAgricultureIncomeOrOtherIncomeForRate/text()', 0);
                            taxAtNor[i] = checkFieldAvl('//ITRForm:TaxAtNormalRatesOnAggrInc/text()', 0);
                            taxAtSpl[i] = checkFieldAvl('//ITRForm:TaxAtSpecialRates/text()', 0);
                            rebateAgri[i] = checkFieldAvl('//ITRForm:RebateOnAgriInc/text()', 0);
                            rebate87A[i] = checkFieldAvl('//ITRForm:Rebate87A/text()', 0);
                            surcharge[i] = checkFieldAvl('//ITRForm:SurchargeOnAboveCrore/text()', 0);
                            // revenue[i] = checkFieldAvl('//ITRForm:TotRevenueFrmOperations/text()', 0);
                            educ[i] = checkFieldAvl('//ITRForm:EducationCess/text()', 0);
                            sec89[i] = checkFieldAvl('//ITRForm:Section89/text()', 0);
                            //sec90[i] = checkFieldAvl('//ITRForm:Section90/text()', 0);
                            //sec91[i] = checkFieldAvl('//ITRForm:Section91/text()', 0);
							//proBfIncTax[i] = checkFieldAvl('//ITRForm:PBIDTA/text()', 0);
							//depreAmrt[i] = checkFieldAvl('//ITRForm:DepreciationAmort/text()', 0);
							//interest[i] = checkFieldAvl('//ITRForm:InterestExpdr/text()', 0);
							//proBfrTax[i] = checkFieldAvl('//ITRForm:PBT/text()', 0);
							//deduc10A[i] = checkFieldAvl('//ITRForm:DeductionsUnder10Aor10AA/text()', 0);
							tcs[i] = checkFieldAvl('//ITRForm:TCS/text()', 0);
							ExIncome[i] = checkFieldAvl('//ITRForm:TotalExemptInc/text()', 0);
							StatusItr[i] = checkFieldAvl('//ITRForm:Status/text()', 0);
							//revenue[i] = 'NA';

							if( formname[i] == 'ITR-2A' && assyear[i] == 2015){
								via[i] = checkFieldAvl('//ITRForm:DeductionsUnderScheduleVIA/text()', 0);

							}
							else if(assyear[i] == 2016){
								via[i] = checkFieldAvl('//ITRForm:TotalChapVIADeductions/text()', 1);
								Assets[i] = checkFieldAvl('//ITRForm:TotalImmovablMovablAssets/text()', 0);
								Liability[i] = checkFieldAvl('//ITRForm:LiabilityInRelatAssets/text()', 0);
							}


                        }


						// ITR-3  year 2013,2014,2015,2016,2017 && Commented mapping fields are not available for the particular file type
						else if(formname[i] == 'ITR-3' && (assyear[i] == 2017 || assyear[i] == 2016 ||  assyear[i] == 2015 || assyear[i] == 2014 || assyear[i] == 2013 )) {
							salary[i] = checkFieldAvl('//ITRForm:Salaries/text()', 0);
							houseproperty[i] = checkFieldAvl('//ITRForm:IncomeFromHP/text()', 0);
						    busPro[i] = checkFieldAvl('//ITRForm:TotProfBusGain/text()', 0);
							capgains[i] = checkFieldAvl('//ITRForm:TotalCapGains/text()', 0);
                            totIncOs[i] = checkFieldAvl('//ITRForm:TotIncFromOS/text()', 0);
                            cyloss[i] = checkFieldAvl('//ITRForm:CurrentYearLoss/text()', 0);
							broghtfwd[i] = checkFieldAvl('//ITRForm:BroughtFwdLossesSetoff/text()', 0);
                            //incTax[i] = checkFieldAvl('//ITRForm:IncChargeableTaxSplRates/text()', 0);
                            //via[i] = checkFieldAvl('//ITRForm:TotalChapVIADeductions/text()', 1);
                            netAgri[i] = checkFieldAvl('//ITRForm:NetAgricultureIncomeOrOtherIncomeForRate/text()', 0);
                            taxAtNor[i] = checkFieldAvl('//ITRForm:TaxAtNormalRatesOnAggrInc/text()', 0);
                            taxAtSpl[i] = checkFieldAvl('//ITRForm:TaxAtSpecialRates/text()', 0);
                            rebateAgri[i] = checkFieldAvl('//ITRForm:RebateOnAgriInc/text()', 0);
                            rebate87A[i] = checkFieldAvl('//ITRForm:Rebate87A/text()', 0);
							surcharge[i] = checkFieldAvl('//ITRForm:SurchargeOnAboveCrore/text()', 0);
							// revenue[i] = checkFieldAvl('//ITRForm:TotRevenueFrmOperations/text()', 0);
                            educ[i] = checkFieldAvl('//ITRForm:EducationCess/text()', 0);
                            sec89[i] = checkFieldAvl('//ITRForm:Section89/text()', 0);
                            sec90[i] = checkFieldAvl('//ITRForm:Section90/text()', 0);
                            sec91[i] = checkFieldAvl('//ITRForm:Section91/text()', 0);
							//proBfIncTax[i] = checkFieldAvl('//ITRForm:PBIDTA/text()', 0);
							//depreAmrt[i] = checkFieldAvl('//ITRForm:DepreciationAmort/text()', 0);
							//interest[i] = checkFieldAvl('//ITRForm:InterestExpdr/text()', 0);
							//proBfrTax[i] = checkFieldAvl('//ITRForm:PBT/text()', 0);
							//deduc10A[i] = checkFieldAvl('//ITRForm:DeductionsUnder10Aor10AA/text()', 0);
							tcs[i] = checkFieldAvl('//ITRForm:TCS/text()', 0);
							firmName[i] = checkFieldAvl('//ITRForm:FirmName/text()', 0);
							ExIncome[i] = checkFieldAvl('//ITRForm:TotalExemptInc/text()', 0);
							StatusItr[i] = checkFieldAvl('//ITRForm:Status/text()', 0);
							Assets[i] = checkFieldAvl('//ITRForm:TotalImmovablMovablAssets/text()', 0);
							Liability[i] = checkFieldAvl('//ITRForm:LiabilityInRelatAssets/text()', 0);
							//revenue[i] = 'NA';

							if(assyear[i] == 2016 ||  assyear[i] == 2015 || assyear[i] == 2014){
								incTax[i] = checkFieldAvl('//ITRForm:IncChargeableTaxSplRates/text()', 0);
								via[i] = checkFieldAvl('//ITRForm:TotalChapVIADeductions/text()', 1);
								// Extracting overAllSection44AB
											try{
												var isadit = select('//ITRForm:IsLiableToAudit/text()', doc);
												let parSec44AB1 = [];
												for(let k=0; k< isadit.length;k++){
															parSec44AB1[k] = isadit[k].nodeValue;
														}
													if (parSec44AB1.indexOf('Y') > -1){
														overAllSection44AB[i] = 'Y';
													}
													else{
														overAllSection44AB[i] = 'N';
													}
											}
											catch(e){
												overAllSection44AB[i] = 'N';
											}
								//  Extracting Report u/s 92E
											try{
												var firmFlag = select('//ITRForm:Sec92EFirmFlag/text()', doc);
												let firmSec82 = [];
												for(let l=0; l< firmFlag.length;l++){
															firmSec82[l] = firmFlag[l].nodeValue;
														}
													if (firmSec82.indexOf('Y') > -1){
														sec92E[i] = 'Y';
													}
													else{
														sec92E[i] = 'N';
													}
											}
											catch(e){
												sec92E[i] = 'N';
											}
							}
							else if(assyear[i] == 2017){

								incTax[i] = checkFieldAvl('//ITRForm:IncChargeTaxSplRate111A112/text()', 0);
								via[i] = checkFieldAvl('//ITRForm:TotDeductUndSchVIA/text()', 0);
								//overAllSection44AB[i] = checkFieldAvl('//ITRForm:LiableSec44ABflg/text()', 0);
								//sec92E[i] = checkFieldAvl('//ITRForm:Sec92EFirmFlag/text()', 0);
								revenue[i] = checkFieldAvl('//ITRForm:TotRevenueFrmOperations/text()', 0);
								depreAmrt[i] = checkFieldAvl('//ITRForm:DepreciationAmort/text()', 0);
								interest[i] = checkFieldAvl('//ITRForm:InterestExpdr/text()', 0);
								// New changes for profit before tax (17-7-2017)
								    var net = checkFieldAvl('//ITRForm:NetProfit/text()', 0);
									var pbidtaDet = checkFieldAvl('//ITRForm:PBIDTA/text()', 0);
									proBfIncTax[i] = parseFloat(pbidtaDet) + parseFloat(net);
								// Extracting Revenue from PBT or NetProfit
									//var pbt = checkFieldAvl('//ITRForm:PBT/text()',0);
									proBfrTax[i] = proBfIncTax[i] - (parseFloat(depreAmrt[i]) + parseFloat(interest[i]));

								//proBfrTax[i] = checkFieldAvl('//ITRForm:PBT/text()', 0);
								deduc10A[i] = checkFieldAvl('//ITRForm:DeductionsUnder10Aor10AA/text()', 0);
								var amt1 =0;
							parser.parseString(data, function (err, result) {
									var test =[];
									try{
										var amtTagCount = result['ITRETURN:ITR']['ITR3FORM:ITR3'][0]['ITRForm:ScheduleAL'][0]['ITRForm:ImmovableDetails'];
										//console.log(amtTagCount.length);
										}
										catch(e){
											console.log('No Amount');
										}
									var amtAllDet =[];
								try{
									for(let i=0;i<amtTagCount.length;i++){
										try{
										amtAllDet[i] = result['ITRETURN:ITR']['ITR3FORM:ITR3'][0]['ITRForm:ScheduleAL'][0]['ITRForm:ImmovableDetails'][i]['ITRForm:Amount'];
										amt1 += parseFloat(amtAllDet[i]);

										}
										catch(e){

										}
									}
								}
								catch(e){
									console.log('there is  no Amount for Immovable');
								}
							});

								let depInBank1;
								   depInBank1 = checkFieldAvl('//ITRForm:DepositsInBank/text()', 0);
								let sharenSec1;
								   sharenSec1 = checkFieldAvl('//ITRForm:SharesAndSecurities/text()', 0);
								let insPolicy1;
								   insPolicy1 = checkFieldAvl('//ITRForm:InsurancePolicies/text()', 0);
								let lnandAdv1;
								   lnandAdv1 = checkFieldAvl('//ITRForm:LoansAndAdvancesGiven/text()', 0);
								let cashinHand1;
								   cashinHand1 = checkFieldAvl('//ITRForm:CashInHand/text()', 0);
								let jewlBul1;
								   jewlBul1 = checkFieldAvl('//ITRForm:JewelleryBullionEtc/text()', 0);
								let arcDraw1;
								   arcDraw1 = checkFieldAvl('//ITRForm:ArchCollDrawPaintSulpArt/text()', 0);
								let vehBoat1;
								   vehBoat1 = checkFieldAvl('//ITRForm:VehiclYachtsBoatsAircrafts/text()', 0);
								try{
									var assInvAll = select('//ITRForm:AssesseInvestment/text()', doc);
									const assInvestment = [];
									var assInv1 =0;
									for (let i = 0; i < assInvAll.length; i++) {
										assInvestment[i] = assInvAll[i].nodeValue;
										assInv1 += parseFloat(assInvestment[i]);

									}
									console.log(assInv1+'................................498');
								}
								catch(e){
									console.log('AssesseInvestment not found  '+'................................474');
								}
								var Asset = parseFloat(amt1) + parseFloat(depInBank1)+parseFloat(sharenSec1)+parseFloat(insPolicy1)+parseFloat(lnandAdv1)+parseFloat(cashinHand1)+parseFloat(jewlBul1)+parseFloat(arcDraw1)+parseFloat(vehBoat1)+parseFloat(assInv1);
								 Assets[i] = Asset;
								//for dirSec44AB
										let dirSec44AB;
										try{
											 dirSec44AB = select('//ITRForm:LiableSec44ABflg/text()', doc)[0].nodeValue;
										}
										catch(e){
											console.log(e)
											dirSec44AB = 'N';
										}
									//for parSec44AB
											let parSec44AB;
											try{
												var parSec44ABarr = select('//ITRForm:IsLiableToAudit/text()', doc);
												let parSec44ABarr1 = [];
												for (let m=0;m<parSec44ABarr.length;m++){
													parSec44ABarr1[m] = parSec44ABarr[m].nodeValue;
												}
												if ( parSec44ABarr1.indexOf('Y') > -1){
													parSec44AB = 'Y';
												}
												else{
													parSec44AB = 'N';
													}
											}
											catch(e){
												//console.log(e)
												parSec44AB = 'N';
											}
											if(dirSec44AB == parSec44AB){
												//console.log('equal' + dirSec44AB);
												overAllSection44AB[i] = dirSec44AB;
											   }
											   else{
												//console.log('not equal ');
												overAllSection44AB[i] ='Y';
											   }

									  /*************************************************/
									//for auditSec
										let auditSec;
										try{
											var auditSection = select('//ITRForm:AuditedSection/text()', doc);
											let auditSec92E = [];
											for(let n=0;n< auditSection.length;n++){
												auditSec92E[n] = auditSection[n].nodeValue;
											}
											if(auditSec92E.indexOf('92E') > -1){
												auditSec = 'Y';
											}
											else if(auditSec92E.indexOf('Y') > -1){
												auditSec = 'Y';
											}
											else{
												auditSec = 'N';
											}


										}
										catch(e){
											auditSec = 'N';
										}
										//for firmSec
										let firmSec;
										try{
											var firmFlag92 = select('//ITRForm:Sec92EFirmFlag/text()', doc);
											let firmSectionFlag92 = [];
											for (let m=0;m<firmFlag92.length;m++){
												firmSectionFlag92[m] = firmFlag92[m].nodeValue;
											}
											if ( firmSectionFlag92.indexOf('Y') > -1){
												firmSec = 'Y';
											}
											else{
												firmSec = 'N';
												}
										}
										catch(e){
											firmSec = 'N';
										}

										if(auditSec == firmSec){
											sec92E[i] = auditSec;
										   }
										   else{
											//console.log('not equal ');
											sec92E[i] ='Y';
										   }
							  }

						}
						// ITR-4  year 2013,2014,2015,2016,2017  && Commented mapping fields are not available for the particular file type
						else if (formname[i] == 'ITR-4' && (assyear[i] == 2017 || assyear[i] == 2016 ||  assyear[i] == 2015 || assyear[i] == 2014 || assyear[i] == 2013 )) {
							//salary[i] = checkFieldAvl('//ITRForm:Salaries/text()', 0);
                            //houseproperty[i] = checkFieldAvl('//ITRForm:IncomeFromHP/text()', 0);
							//busPro[i] = checkFieldAvl('//ITRForm:TotProfBusGain/text()', 0);
                            //capgains[i] = checkFieldAvl('//ITRForm:TotalCapGains/text()', 0);
                            //totIncOs[i] = checkFieldAvl('//ITRForm:TotIncFromOS/text()', 0);
                            // cyloss[i] = checkFieldAvl('//ITRForm:CurrentYearLoss/text()', 0);
							// broghtfwd[i] = checkFieldAvl('//ITRForm:BroughtFwdLossesSetoff/text()', 0);
							//incTax[i] = checkFieldAvl('//ITRForm:IncChargeableTaxSplRates/text()', 0);
							via[i] = checkFieldAvl('//ITRForm:TotalChapVIADeductions/text()', 1);
							//netAgri[i] = checkFieldAvl('//ITRForm:NetAgricultureIncomeOrOtherIncomeForRate/text()', 0);
                            //taxAtNor[i] = checkFieldAvl('//ITRForm:TaxAtNormalRatesOnAggrInc/text()', 0);
                            //taxAtSpl[i] = checkFieldAvl('//ITRForm:TaxAtSpecialRates/text()', 0);
                            //rebateAgri[i] = checkFieldAvl('//ITRForm:RebateOnAgriInc/text()', 0);
                            rebate87A[i] = checkFieldAvl('//ITRForm:Rebate87A/text()', 0);
                            surcharge[i] = checkFieldAvl('//ITRForm:SurchargeOnAboveCrore/text()', 0);
							//revenue[i] = checkFieldAvl('//ITRForm:TotRevenueFrmOperations/text()', 0);
						    //educ[i] = checkFieldAvl('//ITRForm:EducationCess/text()', 1);
							sec89[i] = checkFieldAvl('//ITRForm:Section89/text()', 0);
							// sec90[i] = checkFieldAvl('//ITRForm:Section90/text()', 0);
							// sec91[i] = checkFieldAvl('//ITRForm:Section91/text()', 0);
							// proBfIncTax[i] = checkFieldAvl('//ITRForm:PBIDTA/text()', 0);
							// depreAmrt[i] = checkFieldAvl('//ITRForm:DepreciationAmort/text()', 0);
							// interest[i] = checkFieldAvl('//ITRForm:InterestExpdr/text()', 0);
							//proBfrTax[i] = checkFieldAvl('//ITRForm:PBT/text()', 0);
							// deduc10A[i] = checkFieldAvl('//ITRForm:DeductionsUnder10Aor10AA/text()', 0);
							tcs[i] = checkFieldAvl('//ITRForm:TCS/text()', 0);
							firmName[i] = checkFieldAvl('//ITRForm:FirmName/text()', 0);
							StatusItr[i] = checkFieldAvl('//ITRForm:Status/text()', 0);
							Liability[i] = checkFieldAvl('//ITRForm:LiabilityInRelatAssets/text()', 0);



                           if(assyear[i] == 2016 ||  assyear[i] == 2015 || assyear[i] == 2014){
							    salary[i] = checkFieldAvl('//ITRForm:Salaries/text()', 0);
								houseproperty[i] = checkFieldAvl('//ITRForm:IncomeFromHP/text()', 0);
								busPro[i] = checkFieldAvl('//ITRForm:TotProfBusGain/text()', 0);
								capgains[i] = checkFieldAvl('//ITRForm:TotalCapGains/text()', 0);
								totIncOs[i] = checkFieldAvl('//ITRForm:TotIncFromOS/text()', 0);
								cyloss[i] = checkFieldAvl('//ITRForm:CurrentYearLoss/text()', 0);
								broghtfwd[i] = checkFieldAvl('//ITRForm:BroughtFwdLossesSetoff/text()', 0);
								educ[i] = checkFieldAvl('//ITRForm:EducationCess/text()', 1);
								incTax[i] = checkFieldAvl('//ITRForm:IncChargeableTaxSplRates/text()', 0);
								netAgri[i] = checkFieldAvl('//ITRForm:NetAgricultureIncomeOrOtherIncomeForRate/text()', 0);
								taxAtNor[i] = checkFieldAvl('//ITRForm:TaxAtNormalRatesOnAggrInc/text()', 0);
								taxAtSpl[i] = checkFieldAvl('//ITRForm:TaxAtSpecialRates/text()', 0);
								rebateAgri[i] = checkFieldAvl('//ITRForm:RebateOnAgriInc/text()', 0);
								sec90[i] = checkFieldAvl('//ITRForm:Section90/text()', 0);
								sec91[i] = checkFieldAvl('//ITRForm:Section91/text()', 0);

								depreAmrt[i] = checkFieldAvl('//ITRForm:DepreciationAmort/text()', 0);
								interest[i] = checkFieldAvl('//ITRForm:InterestExpdr/text()', 0);
								ExIncome[i] = checkFieldAvl('//ITRForm:TotalExemptInc/text()', 0);
								deduc10A[i] = checkFieldAvl('//ITRForm:DeductionsUnder10Aor10AA/text()', 0);
								Assets[i] = checkFieldAvl('//ITRForm:TotalImmovablMovablAssets/text()', 0);

								// New changes for profit before tax (17-7-2017)
								    var net = checkFieldAvl('//ITRForm:NetProfit/text()', 0);
									var pbidtaDet = checkFieldAvl('//ITRForm:PBIDTA/text()', 0);
									proBfIncTax[i] = parseFloat(pbidtaDet) + parseFloat(net);

								/* Extracting Revenue from TotCreditsToPL or GrossReceipt for 2017 added by sekar
									previously only for 2014-2016*/
									var rec = checkFieldAvl('//ITRForm:GrossReceipt/text()', 0);
									var rev = checkFieldAvl('//ITRForm:TotCreditsToPL/text()',0);
									console.log(rec,rev);
									revenue[i] = parseFloat(rec) + parseFloat(rev);
									console.log('revenue'+ revenue[i]);

								// Extracting Revenue from PBT or NetProfit
									var pbt = checkFieldAvl('//ITRForm:PBT/text()',0);
									console.log(pbt,net);
									//proBfrTax[i] = parseFloat(pbt) + parseFloat(net);
									proBfrTax[i] = proBfIncTax[i] - (parseFloat(depreAmrt[i]) + parseFloat(interest[i]));
									console.log('pbt'+ proBfrTax[i]);

								//for dirSec44AB
									let dirSec44AB;
									try{
										 dirSec44AB = select('//ITRForm:LiableSec44ABflg/text()', doc)[0].nodeValue;
									}
									catch(e){
										console.log(e);
										dirSec44AB = 'N';
									}
								//for parSec44AB
										let parSec44AB;
										try{
											var parSec44ABarr = select('//ITRForm:IsLiableToAudit/text()', doc);
											let parSec44ABarr1 = [];
											for (let m=0;m<parSec44ABarr.length;m++){
												parSec44ABarr1[m] = parSec44ABarr[m].nodeValue;
											}
											if ( parSec44ABarr1.indexOf('Y') > -1){
												parSec44AB = 'Y';
											}
											else{
												parSec44AB = 'N';
												}
										}
										catch(e){
											//console.log(e)
											parSec44AB = 'N';
										}
										if(dirSec44AB == parSec44AB){
											//console.log('equal' + dirSec44AB);
											overAllSection44AB[i] = dirSec44AB;
										   }
										   else{
											//console.log('not equal ');
											overAllSection44AB[i] ='Y';
										   }

								  /*************************************************/
								//for auditSec
									let auditSec;
									try{
										var auditSection = select('//ITRForm:AuditedSection/text()', doc);
										let auditSec92E = [];
										for(let n=0;n< auditSection.length;n++){
											auditSec92E[n] = auditSection[n].nodeValue;
										}
										if(auditSec92E.indexOf('92E') > -1){
											auditSec = 'Y';
										}
										else if(auditSec92E.indexOf('Y') > -1){
											auditSec = 'Y';
										}
										else{
											auditSec = 'N';
										}


									}
									catch(e){
										auditSec = 'N';
									}
									//for firmSec
									let firmSec;
									try{
										var firmFlag92 = select('//ITRForm:Sec92EFirmFlag/text()', doc);
										let firmSectionFlag92 = [];
										for (let m=0;m<firmFlag92.length;m++){
											firmSectionFlag92[m] = firmFlag92[m].nodeValue;
										}
										if ( firmSectionFlag92.indexOf('Y') > -1){
											firmSec = 'Y';
										}
										else{
											firmSec = 'N';
											}
									}
									catch(e){
										firmSec = 'N';
									}

									if(auditSec == firmSec){
										sec92E[i] = auditSec;
									   }
									   else{
										//console.log('not equal ');
										sec92E[i] ='Y';
									   }

							}
							else if(assyear[i] == 2017){
								salary[i] = checkFieldAvl('//ITRForm:IncomeFromSal/text()', 0);
								houseproperty[i] = checkFieldAvl('//ITRForm:TotalIncomeOfHP/text()', 0);
								busPro[i] = checkFieldAvl('//ITRForm:IncomeFromBusinessProf/text()', 0);
								totIncOs[i] = checkFieldAvl('//ITRForm:IncomeOthSrc/text()', 0);
								taxAtNor[i] = checkFieldAvl('//ITRForm:TotalTaxPayable/text()', 0);
								educ[i] = checkFieldAvl('//ITRForm:EducationCess/text()', 0);
							    ExIncome[i] = checkFieldAvl('//ITR4FORM:TaxExmpIntInc/text()', 0);
								var amt2 =0;
							parser.parseString(data, function (err, result) {
									var test =[];
									try{
										var amtTagCount = result['ITRETURN:ITR']['ITR4FORM:ITR4'][0]['ITRForm:ScheduleAL'][0]['ITRForm:ImmovableDetails'];
										}
										catch(e){

										}
									var amtAll =[];
								try{
									for(let i=0;i<amtTagCount.length;i++){
										try{
										amtAll[i] = result['ITRETURN:ITR']['ITR4FORM:ITR4'][0]['ITRForm:ScheduleAL'][0]['ITRForm:ImmovableDetails'][i]['ITRForm:Amount'];
										amt2 += parseFloat(amtAll[i]);

										}
										catch(e){

										}
									}
								}
								catch(e){
									console.log('there is  no AMount');
								}
							});

								let depInBank2;
								   depInBank2 = checkFieldAvl('//ITRForm:DepositsInBank/text()', 0);
								let sharenSec2;
								   sharenSec2 = checkFieldAvl('//ITRForm:SharesAndSecurities/text()', 0);
								let insPolicy2;
								   insPolicy2 = checkFieldAvl('//ITRForm:InsurancePolicies/text()', 0);
								let lnandAdv2;
								   lnandAdv2 = checkFieldAvl('//ITRForm:LoansAndAdvancesGiven/text()', 0);
								let cashinHand2;
								   cashinHand2 = checkFieldAvl('//ITRForm:CashInHand/text()', 0);
								let jewlBul2;
								   jewlBul2 = checkFieldAvl('//ITRForm:JewelleryBullionEtc/text()', 0);
								let arcDraw2;
								   arcDraw2 = checkFieldAvl('//ITRForm:ArchCollDrawPaintSulpArt/text()', 0);
								let vehBoat2;
								   vehBoat2 = checkFieldAvl('//ITRForm:VehiclYachtsBoatsAircrafts/text()', 0);
								try{
									var assInvAll = select('//ITRForm:AssesseInvestment/text()', doc);
									const assInvestment = [];
									var assInv2 =0;
									for (let i = 0; i < assInvAll.length; i++) {
										assInvestment[i] = assInvAll[i].nodeValue;
										assInv2 += parseFloat(assInvestment[i]);

									}
									console.log(assInv2+'................................498');
								}
								catch(e){
									console.log('AssesseInvestment not found  '+'................................474');
								}

								var Asset2 = parseFloat(amt2) + parseFloat(depInBank2)+parseFloat(sharenSec2)+parseFloat(insPolicy2)+parseFloat(lnandAdv2)+parseFloat(cashinHand2)+parseFloat(jewlBul2)+parseFloat(arcDraw2)+parseFloat(vehBoat2)+parseFloat(assInv2);
							    Assets[i] = Asset2;
							    console.log(Asset2 + '....................................767');
							}

                        }


                     // ITR-4S year 2013,2014,2015,2016 && Commented mapping fields are not available for the particular file type
                        else if (formname[i] == 'ITR-4S' && (assyear[i] == 2016 || assyear[i] == 2015 || assyear[i] == 2014 || assyear[i] == 2013)) {
                            salary[i] = checkFieldAvl('//ITRForm:IncomeFromSal/text()', 0);
							houseproperty[i] = checkFieldAvl('//ITRForm:TotalIncomeOfHP/text()', 0);
							busPro[i] = checkFieldAvl('//ITRForm:IncomeFromBusinessProf/text()', 0);
							//capgains[i] = checkFieldAvl('//ITRForm:TotalCapGains/text()', 0);
                            totIncOs[i] = checkFieldAvl('//ITRForm:IncomeOthSrc/text()', 0);
                            //cyloss[i] = checkFieldAvl('//ITRForm:CurrentYearLoss/text()', 0);
						    //broghtfwd[i] = checkFieldAvl('//ITRForm:BroughtFwdLossesSetoff/text()', 0);
                            //incTax[i] = checkFieldAvl('//ITRForm:IncChargeableTaxSplRates/text()', 0);
							via[i] = checkFieldAvl('//ITRForm:TotalChapVIADeductions/text()', 1);
							//netAgri[i] = checkFieldAvl('//ITRForm:NetAgricultureIncomeOrOtherIncomeForRate/text()', 0);
							taxAtNor[i] = checkFieldAvl('//ITRForm:TotalTaxPayable/text()', 0);
                            //taxAtSpl[i] = checkFieldAvl('//ITRForm:TaxAtSpecialRates/text()', 0);
							//rebateAgri[i] = checkFieldAvl('//ITRForm:RebateOnAgriInc/text()', 0);
							rebate87A[i] = checkFieldAvl('//ITRForm:Rebate87A/text()', 0);
							surcharge[i] = checkFieldAvl('//ITRForm:SurchargeOnAboveCrore/text()', 0);
							revenue[i] = checkFieldAvl('//ITRForm:GrsTrnOverOrReceipt/text()', 0);
							educ[i] = checkFieldAvl('//ITRForm:EducationCess/text()', 0);
							sec89[i] = checkFieldAvl('//ITRForm:Section89/text()', 0);
                            //sec90[i] = checkFieldAvl('//ITRForm:Section90/text()', 0);
                            //sec91[i] = checkFieldAvl('//ITRForm:Section91/text()', 0);
							//proBfIncTax[i] = checkFieldAvl('//ITRForm:PBIDTA/text()', 0);
							//depreAmrt[i] = checkFieldAvl('//ITRForm:DepreciationAmort/text()', 0);
							//interest[i] = checkFieldAvl('//ITRForm:InterestExpdr/text()', 0);
							proBfrTax[i] = checkFieldAvl('//ITRForm:IncomeFromBusinessProf/text()', 0);
							//deduc10A[i] = checkFieldAvl('//ITRForm:DeductionsUnder10Aor10AA/text()', 0);
							tcs[i] = checkFieldAvl('//ITRForm:TCS/text()', 0);
							ExIncome[i] = checkFieldAvl('//ITR4SFORM:TaxExmpIntInc/text()', 0);
							StatusItr[i] = checkFieldAvl('//ITRForm:Status/text()', 0);
							Assets[i] = checkFieldAvl('//ITRForm:TotalImmovablMovablAssets/text()', 0);
							Liability[i] = checkFieldAvl('//ITRForm:LiabilityInRelatAssets/text()', 0);

						   // if(assyear[i] == 2016 ||  assyear[i] == 2015 || assyear[i] == 2014){
								// rebate87A[i] = checkFieldAvl('//ITRForm:Rebate87A/text()', 0);
                                // surcharge[i] = checkFieldAvl('//ITRForm:SurchargeOnAboveCrore/text()', 0);
							// }

                        }
						else {
							console.log('greater than 2016 ITR Forms are not Applicable to Process');
						}



                    } catch (e) {

						if(i==0){
							originalfileRetrieved =false ;
							processing.updateProceFile(orderNo,5,year);
							//processing.updateProceFile(orderNo,25,year,'Failure');
						}
						else if(i==1){
							revisedfileRetrieved  = false ;
							processing.updateProceFile(orderNo,5,year);
							//processing.updateProceFile(orderNo,25,year,'Failure');
						}
                        console.log('error'+ e);
                    }
                } else {
					if(i==0){
							originalfileRetrieved =false ;
							processing.updateProceFile(orderNo,6,year);
							//processing.updateProceFile(orderNo,25,year,'Failure');
						}
						else if(i==1){
							revisedfileRetrieved  = false ;
							processing.updateProceFile(orderNo,6,year);
							//processing.updateProceFile(orderNo,25,year,'Failure');
						}
						console.log( "This is to test the logic");
                }








            }
			else{
				if(i==0){
					originalfileRetrieved = false;

				}
			   else if(i==1){
					//processing.updateProceFile(orderNo,3,year,'File not  found');
				}

			}
        }
		processing.updateProceFile(orderNo,8,year,extFileName);
        // Original Completed

		function checkFieldAvl(FieldName,integer){
			try{
				const doc = new dom().parseFromString(data.toString());
				const select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master' ,'ITR4FORM': 'http://incometaxindiaefiling.gov.in/ITR4' });
				let value = select(FieldName, doc)[integer].nodeValue
				//console.log(value);
				return value;
			}
			catch(e){
				//console.log('error in field ' + e)
				let value = 0;
				return value;
			}

		}


	if(originalfileRetrieved ==true && revisedfileRetrieved==true){
        const jsonData = [];
		const saleImmov = [];
		let origRetu = '';
        for (let j = 0; j <= 1; j++) {
			//console.log('     ' + overAllSection44AB[j]);
            if (j == 0) {
                origRetu = 'Original';
            } else {
                origRetu = 'Revised';
			}
            jsonData[j] = {
                Year__c: assyear[j],
                ActualDateOfFilling__c: actualfilingdt[j],
                LatestReturn__c: latest[j],
                OrigReturn__c: origRetu,
                ITRFormUsed__c: formname[j],
                Salaries__c: salary[j],
                HouseProperty__c: houseproperty[j],
                BusinessProfession__c: busPro[j],
                CapitalGains__c: capgains[j],
                OtherIncome__c: totIncOs[j],
                CYLossesSetOff__c: cyloss[j],
                BroughtForwardLoss__c: broghtfwd[j],
                IncomeTobeTaxedAtSpecialRates__c: incTax[j],
                DeductionsChapterVIA__c: via[j],
                NetAgriIncome__c: netAgri[j],
                TaxAtNormalRate__c: taxAtNor[j],
                TaxAtSpecialRate__c: taxAtSpl[j],
                RebateAgriculturalIncome__c: rebateAgri[j],
                Rebate87A__c: rebate87A[j],
                Surcharge__c: surcharge[j],
                EducationFess__c: educ[j],
                Rebate89__c: sec89[j],
                Rebate90_90A__c: sec90[j],
                Rebate91__c: sec91[j],
                InterestPayable234A__c: int234A[j],
                InterestPayable234B__c: int234B[j],
                InterestPayable234C__c: int234C[j],
                AdvanceTax__c: advaTax[j],
                TDS__c: tds[j],
                SelfAssessmentTax__c: selfAssTax[j],
				OverAllSection44AB__c: overAllSection44AB[j],
				OverAllFirmSec92E__c: sec92E[j],
				FFRevenue__c: revenue[j],
				FF_Profit_Before_Dep_Int_Tax__c: proBfIncTax[j],
				FF_Depreciation__c: depreAmrt[j],
				FF_Interest__c: interest[j],
				FF_Profit_Before_Tax__c : proBfrTax[j],
				FF_Deduction_u_s_10A_or_10AA__c: deduc10A[j],
				FF_TCS__c: tcs[j],
				FF_Number_of_Revisions__c: revCounts[j],
				FF_Exempt_Inc : ExIncome[j],
				FF_Status: statusITR[j],
				FF_Assets__c: Assets[j],
				FF_Liability__c: Liability[j],

            };


        }


        // to create csv file
        const header = ['Year__c', 'ActualDateOfFilling__c', 'LatestReturn__c', 'OrigReturn__c', 'ITRFormUsed__c', 'Salaries__c', 'HouseProperty__c', 'BusinessProfession__c', 'CapitalGains__c', 'OtherIncome__c', 'CYLossesSetOff__c', 'BroughtForwardLoss__c', 'IncomeTobeTaxedAtSpecialRates__c', 'DeductionsChapterVIA__c', 'NetAgriIncome__c', 'TaxAtNormalRate__c', 'TaxAtSpecialRate__c', 'RebateAgriculturalIncome__c', 'Rebate87A__c', 'Surcharge__c', 'EducationFess__c', 'Rebate89__c', 'Rebate90_90A__c', 'Rebate91__c', 'InterestPayable234A__c', 'InterestPayable234B__c', 'InterestPayable234C__c', 'AdvanceTax__c', 'TDS__c', 'SelfAssessmentTax__c','OverAllSection44AB__c','OverAllFirmSec92E__c','FFRevenue__c','FF_Profit_Before_Dep_Int_Tax__c','FF_Depreciation__c','FF_Interest__c','FF_Profit_Before_Tax__c','FF_Deduction_u_s_10A_or_10AA__c','FF_TCS__c','FF_Number_of_Revisions__c','FF_Exempt_Inc','FF_Status','FF_Assets__c','FF_Liability__c'];
        try {
            const csvData = json2csv({ data: jsonData, fields: header });
            if (csvData) {
                fs.writeFileSync(path1 + orderNo + path3 + '/' + orderNo + '_' + pullSeqNo + '_' + formname[0] + '_' + assyear[0] + '.csv', csvData);
				var csvfileName = orderNo + '_' + pullSeqNo + '_' + formname[0] + '_' + assyear[0] + '.csv';

				if(formname.length==1){
					processing.updateProceFile(orderNo,100,year,csvfileName,formname[0]);
				}else{
					processing.updateProceFile(orderNo,7,year,csvfileName,formname[0],formname[1]);
				}


            } else {
					console.log('error')
				}
        } catch (e) {
			//console.log(e)
			processing.updateProceFile(orderNo,4,year);
		}
	}

    }
};
