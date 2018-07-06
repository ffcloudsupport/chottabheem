var fs = require('fs'),
    xml2js = require('xml2js');

var prettyjson = require('prettyjson');

const xpath = require('xpath'),
    dom = require('xmldom').DOMParser;
var myxpath = require('xpath')
    , mydom = require('xmldom').DOMParser;
const json2csv = require('json2csv');
const MailGun = require('./MailGun.js');
var parser = new xml2js.Parser();
var smallparser = new xml2js.Parser();
var path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? 'googleDownUpload/' : "awsDownUpload/";
var path2 = '/downloadedFiles';
var path3 = '/uploadedfiles';
var send= require('./send.js');


module.exports = {
    saleOfimmovConversion(ofilename, rfilename, year, orderNo, pullSeqNo) {
		//console.log('slaee.....................................');
		const FilePaths = [];
		FilePaths[0] = path1 + orderNo + path2 + '/' + ofilename;
        FilePaths[1] = path1 + orderNo + path2 + '/' + rfilename;
         //console.log(ofilename, rfilename,year, orderNo,pullSeqNo);
		//FilePaths[0] = '2016Original.xml';
		//FilePaths[1] = '2016Original.xml';
	var shrtTermFullConsider = "";
	var longTermFullConsider = "";
	if( typeof rfilename != 'undefined'){
				fs.readFile(FilePaths[1], function(err, data) {
					parser.parseString(data, function (err, result) {

					//const doc = new dom().parseFromString(data.toString());


			if(data){
					var  select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master' });
					var doc = new mydom().parseFromString(data.toString());
				var formname = select('//ITRForm:FormName/text()', doc)[0].nodeValue;
				var assyear = select('//ITRForm:AssessmentYear/text()', doc)[0].nodeValue;
			// for ITR-2
			if(formname == 'ITR-2'){
					try{
						var shortTermFull = result['ITRETURN:ITR']['ITR2FORM:ITR2'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:ShortTermCapGainFor23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:FullConsideration'][0];
					if(shortTermFull == 0){
						 try{
							 var shortTermProp = result['ITRETURN:ITR']['ITR2FORM:ITR2'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:ShortTermCapGainFor23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:PropertyValuation'][0];
							 shrtTermFullConsider = shortTermProp;
								}
							catch(e){
								console.log('shortTerm Property not found');
								shrtTermFullConsider = 0;
							}
					}
					 else{
							shrtTermFullConsider = shortTermFull;
					}
					}
					catch(e){
						console.log('shortTermFull not found');
						shrtTermFullConsider = 0;
					}
					console.log(shrtTermFullConsider);
					try{
						var longTermFull = result['ITRETURN:ITR']['ITR2FORM:ITR2'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:LongTermCapGain23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:FullConsideration'][0];
						if(longTermFull == 0){
							try{
								var longTermProp = result['ITRETURN:ITR']['ITR2FORM:ITR2'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:LongTermCapGain23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:PropertyValuation'][0];
								longTermFullConsider = longTermProp;
							}
							catch(e){
								console.log('LongTermProp not found');
								longTermFullConsider = 0;
							}
						}
							else{
								longTermFullConsider = longTermFull;
							}
					}
					catch(e){
						console.log('shortTermProp not found');
						longTermFullConsider = 0;

					}
					console.log(longTermFullConsider);
					var saleOfImmovProp = 0;
					saleOfImmovProp = parseFloat(shrtTermFullConsider) + parseFloat(longTermFullConsider);
					console.log(saleOfImmovProp);
			}
			else{
				console.log('not ITR-2');
			}
			// for ITR-4
			if(formname == 'ITR-4'){
					try{
						var shortTermFull = result['ITRETURN:ITR']['ITR4FORM:ITR4'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:ShortTermCapGainFor23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:FullConsideration'][0];
					if(shortTermFull == 0){
						 try{
							 var shortTermProp = result['ITRETURN:ITR']['ITR4FORM:ITR4'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:ShortTermCapGainFor23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:PropertyValuation'][0];
							 shrtTermFullConsider = shortTermProp;
								}
							catch(e){
								console.log('shortTerm Property not found');
								shrtTermFullConsider = 0;
							}
					}
					 else{
							shrtTermFullConsider = shortTermFull;
					}
					}
					catch(e){
						console.log('shortTermFull not found');
						shrtTermFullConsider = 0;
					}
					console.log(shrtTermFullConsider);
					try{
						var longTermFull = result['ITRETURN:ITR']['ITR4FORM:ITR4'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:LongTermCapGain23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:FullConsideration'][0];
						if(longTermFull == 0){
							try{
								var longTermProp = result['ITRETURN:ITR']['ITR4FORM:ITR4'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:LongTermCapGain23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:PropertyValuation'][0];
								longTermFullConsider = longTermProp;
							}
							catch(e){
								console.log('LongTermProp not found');
								longTermFullConsider = 0;
							}
						}
							else{
								longTermFullConsider = longTermFull;
							}
					}
					catch(e){
						console.log('shortTermProp not found');
						longTermFullConsider = 0;

					}
					console.log(longTermFullConsider);
					var saleOfImmovProp = 0;
					saleOfImmovProp = parseFloat(shrtTermFullConsider) + parseFloat(longTermFullConsider);
					console.log(saleOfImmovProp);
			}
			else{
				console.log('not ITR-4');
			}
			// for Itr-3
			if(formname == 'ITR-3'){
					try{
						var shortTermFull = result['ITRETURN:ITR']['ITR3FORM:ITR3'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:ShortTermCapGainFor23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:FullConsideration'][0];
					if(shortTermFull == 0){
						 try{
							 var shortTermProp = result['ITRETURN:ITR']['ITR3FORM:ITR3'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:ShortTermCapGainFor23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:PropertyValuation'][0];
							 shrtTermFullConsider = shortTermProp;
								}
							catch(e){
								console.log('shortTerm Property not found');
								shrtTermFullConsider = 0;
							}
					}
					 else{
							shrtTermFullConsider = shortTermFull;
					}
					}
					catch(e){
						console.log('shortTermFull not found');
						shrtTermFullConsider = 0;
					}
					console.log(shrtTermFullConsider);
					try{
						var longTermFull = result['ITRETURN:ITR']['ITR3FORM:ITR3'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:LongTermCapGain23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:FullConsideration'][0];
						if(longTermFull == 0){
							try{
								var longTermProp = result['ITRETURN:ITR']['ITR3FORM:ITR3'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:LongTermCapGain23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:PropertyValuation'][0];
								longTermFullConsider = longTermProp;
							}
							catch(e){
								console.log('LongTermProp not found');
								longTermFullConsider = 0;
							}
						}
							else{
								longTermFullConsider = longTermFull;
							}
					}
					catch(e){
						console.log('shortTermProp not found');
						longTermFullConsider = 0;

					}
					console.log(longTermFullConsider);
					var saleOfImmovProp = 0;
					saleOfImmovProp = parseFloat(shrtTermFullConsider) + parseFloat(longTermFullConsider);
					console.log(saleOfImmovProp);
			}
			else{
				console.log('not ITR-3');
			}
		if(formname == 'ITR-2' || formname == 'ITR-3' || formname == 'ITR-4'){
			var saleOfImmov = [];
			salDtls = {
					Year__c: assyear,
					FF_Sale_Of_Immovable_Property__c: saleOfImmovProp,
					FF_Purchase_Of_Immovable_Property__c: 0,
					FF_Details_Of_AIR_Transaction__c: 0,
					Source: 'ITR'
				};

			var header = ['Year__c','FF_Sale_Of_Immovable_Property__c','FF_Purchase_Of_Immovable_Property__c','FF_Details_Of_AIR_Transaction__c', 'Source'];
				try {
                    var ffcsv1 = json2csv({
                        data: salDtls,
                        fields: header
                    });
					const fileEx = '.csv';
					const type = 'SaleOfImmov';
						if (ffcsv1) {
                        //fs.writeFileSync('taxplw.csv', ffcsv1);
						fs.writeFileSync(path1 + orderNo + path3 + '/' + orderNo + '_' + pullSeqNo + '_' + type + '_' + assyear + fileEx, ffcsv1);
						console.log('sale of immovable convertion completed');
                    } else {

                    }
                } catch (e) {

				}
			}
		}
    });
});
	}
	else{
		fs.readFile(FilePaths[0], function(err, data) {
					parser.parseString(data, function (err, result) {
							if (err){
								console.log(err)    
								var message = "there is a unclosed xml tag please check and clear the error"                       
								 MailGun.mailgunFuncerr(orderNo, err , message);
								 var q=process.env.REC_Q1 || "manual-ind-s3"
								 module.exports.que= q;
									send.postcall();
							}else{
					var doc = new mydom().parseFromString(data.toString());

					var shrtTermFullConsider = "";
					var longTermFullConsider = "";
				//	console.log('saleofimmovable'  ,data.toString());
				
				if(data){
					var  select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master' });
					var doc = new mydom().parseFromString(data.toString());
					console.log('docvcaloe' , doc);
					if (doc == 'undefined' || null || '0'){
						console.log('zero KB file');
				}else{
				var formname = select('//ITRForm:FormName/text()', doc)[0].nodeValue;
				var assyear = select('//ITRForm:AssessmentYear/text()', doc)[0].nodeValue;
				// for ITR-2
			if(formname == 'ITR-2'){
					try{
						var shortTermFull = result['ITRETURN:ITR']['ITR2FORM:ITR2'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:ShortTermCapGainFor23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:FullConsideration'][0];
					if(shortTermFull == 0){
						 try{
							 var shortTermProp = result['ITRETURN:ITR']['ITR2FORM:ITR2'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:ShortTermCapGainFor23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:PropertyValuation'][0];
							 shrtTermFullConsider = shortTermProp;
								}
							catch(e){
								console.log('shortTerm Property not found');
								shrtTermFullConsider = 0;
							}
					}
					 else{
							shrtTermFullConsider = shortTermFull;
					}
					}
					catch(e){
						console.log('shortTermFull not found');
						shrtTermFullConsider = 0;
					}
					console.log(shrtTermFullConsider);
					try{
						var longTermFull = result['ITRETURN:ITR']['ITR2FORM:ITR2'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:LongTermCapGain23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:FullConsideration'][0];
						if(longTermFull == 0){
							try{
								var longTermProp = result['ITRETURN:ITR']['ITR2FORM:ITR2'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:LongTermCapGain23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:PropertyValuation'][0];
								longTermFullConsider = longTermProp;
							}
							catch(e){
								console.log('LongTermProp not found');
								longTermFullConsider = 0;
							}
						}
							else{
								longTermFullConsider = longTermFull;
							}
					}
					catch(e){
						console.log('shortTermProp not found');
						longTermFullConsider = 0;

					}
					console.log(longTermFullConsider);
					var saleOfImmovProp = 0;
					saleOfImmovProp = parseFloat(shrtTermFullConsider) + parseFloat(longTermFullConsider);
					console.log(saleOfImmovProp);
			}
			else{
				console.log('not ITR-2');
			}
				// for ITR-4
				if(formname == 'ITR-4'){
					try{
						var shortTermFull = result['ITRETURN:ITR']['ITR4FORM:ITR4'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:ShortTermCapGainFor23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:FullConsideration'][0];
					if(shortTermFull == 0){
						 try{
							 var shortTermProp = result['ITRETURN:ITR']['ITR4FORM:ITR4'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:ShortTermCapGainFor23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:PropertyValuation'][0];
							 shrtTermFullConsider = shortTermProp;
								}
							catch(e){
								console.log('shortTerm Property not found');
								shrtTermFullConsider = 0;
							}
					}
					 else{
							shrtTermFullConsider = shortTermFull;
					}
					}
					catch(e){
						console.log('shortTermFull not found');
						shrtTermFullConsider = 0;
					}
					console.log(shrtTermFullConsider);
					try{
						var longTermFull = result['ITRETURN:ITR']['ITR4FORM:ITR4'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:LongTermCapGain23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:FullConsideration'][0];
						if(longTermFull == 0){
							try{
								var longTermProp = result['ITRETURN:ITR']['ITR4FORM:ITR4'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:LongTermCapGain23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:PropertyValuation'][0];
								longTermFullConsider = longTermProp;
							}
							catch(e){
								console.log('LongTermProp not found');
								longTermFullConsider = 0;
							}
						}
							else{
								longTermFullConsider = longTermFull;
							}
					}
					catch(e){
						console.log('shortTermProp not found');
						longTermFullConsider = 0;

					}
					console.log(longTermFullConsider);
					var saleOfImmovProp = 0;
					saleOfImmovProp = parseFloat(shrtTermFullConsider) + parseFloat(longTermFullConsider);
					console.log(saleOfImmovProp);
				}
				// for Itr-3
			if(formname == 'ITR-3'){
					try{
						var shortTermFull = result['ITRETURN:ITR']['ITR3FORM:ITR3'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:ShortTermCapGainFor23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:FullConsideration'][0];
					if(shortTermFull == 0){
						 try{
							 var shortTermProp = result['ITRETURN:ITR']['ITR3FORM:ITR3'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:ShortTermCapGainFor23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:PropertyValuation'][0];
							 shrtTermFullConsider = shortTermProp;
								}
							catch(e){
								console.log('shortTerm Property not found');
								shrtTermFullConsider = 0;
							}
					}
					 else{
							shrtTermFullConsider = shortTermFull;
					}
					}
					catch(e){
						console.log('shortTermFull not found');
						shrtTermFullConsider = 0;
					}
					console.log(shrtTermFullConsider);
					try{
						var longTermFull = result['ITRETURN:ITR']['ITR3FORM:ITR3'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:LongTermCapGain23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:FullConsideration'][0];
						if(longTermFull == 0){
							try{
								var longTermProp = result['ITRETURN:ITR']['ITR3FORM:ITR3'][0]['ITRForm:ScheduleCGFor23'][0]['ITRForm:LongTermCapGain23'][0]['ITRForm:SaleofLandBuild'][0]['ITRForm:PropertyValuation'][0];
								longTermFullConsider = longTermProp;
							}
							catch(e){
								console.log('LongTermProp not found');
								longTermFullConsider = 0;
							}
						}
							else{
								longTermFullConsider = longTermFull;
							}
					}
					catch(e){
						console.log('shortTermProp not found');
						longTermFullConsider = 0;

					}
					console.log(longTermFullConsider);
					var saleOfImmovProp = 0;
					saleOfImmovProp = parseFloat(shrtTermFullConsider) + parseFloat(longTermFullConsider);

					}
					else{
						console.log('not ITR-3');
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

			if(formname == 'ITR-2' || formname == 'ITR-3' || formname == 'ITR-4'){
			var saleOfImmov = [];
			salDtls = {
					Year__c: assyear,
					FF_Sale_Of_Immovable_Property__c: saleOfImmovProp,
					FF_Purchase_Of_Immovable_Property__c: 0,
					FF_Details_Of_AIR_Transaction__c: 0,
					Source: 'ITR'
				};

			var header = ['Year__c','FF_Sale_Of_Immovable_Property__c','FF_Purchase_Of_Immovable_Property__c','FF_Details_Of_AIR_Transaction__c', 'Source'];
				try {
                    var ffcsv1 = json2csv({
                        data: salDtls,
                        fields: header
                    });
					const fileEx = '.csv';
					const type = 'SaleOfImmov';
						if (ffcsv1) {
                        //fs.writeFileSync('taxplw.csv', ffcsv1);
						fs.writeFileSync(path1 + orderNo + path3 + '/' + orderNo + '_' + pullSeqNo + '_' + type + '_' + assyear + fileEx, ffcsv1);
						console.log('sale of immovable  convertion completed');
                    } else {

                    }
                } catch (e) {

				}
			}
		}
		}
	}
	}
);
});
	}
	}
}
