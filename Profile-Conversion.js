/* Source Code Header
Program Name	:	profile.js
Module Name		:
Description  	:	In this program we are Extracting personal information from json source file and address from latest ITR XML file
					and converting into CSV output files.

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

/** *** **************************************************************************************************************
Require node  module details
********************************************************************************************************************/
const fs = require('fs');
const where = require("lodash.where");
//xml2js = require('xml2js');
const json2csv = require('json2csv');
const processing = require('./processing1.js');
// const parser = new xml2js.Parser();
const xpath = require('xpath'),
   dom = require('xmldom').DOMParser;

const errorRecovery = require('./errorRecoveryFunc.js');

const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? 'googleDownUpload/' : "awsDownUpload/";
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';

// var sync = require('synchronize');
// sync(fs, 'readdir', 'stat', 'readFile', 'writeFile')


module.exports = {
    itpConc(jsonname, filename, orderNo, pullSeqNo,oriRev) {  // this is for itprofile
        const files1 = path1 + orderNo + path2 + '/' + filename;
		const files2 = path1 + orderNo + path2 + '/' + jsonname;
		const data = fs.readFileSync(files2, 'utf-8');
		let pan = '';
		let name = '';
		let dob = '';
		let gender = '';
		let stat = '';
		let address = '';
		let mobile = '';
		let email = '';
		let pan1 ='';
		let dob1 ='';
		var passWord='';
	try {
        if (data) {
            console.log('profile has started');
			const jsonData = JSON.parse(data);
			 pan = (jsonData.PanDetails[0].PAN);
			 pan1 = pan.toLowerCase();
			 dob = (jsonData.PanDetails[0]['Date of Birth']);
			 dob1 = dob.replace(/\//g,"");
		// Added password to processingResult.json file
			 passWord = pan1+dob1;
			 processing.updateProceFile(orderNo,101,0,passWord);
			 name = (jsonData.PanDetails[0]['Name of Assessee']);
			 gender = (jsonData.PanDetails[0].Gender);
             stat = (jsonData.PanDetails[0].Status);
             address = (jsonData.PanDetails[0]['Address of Assessee']);
			 address = address.replace(/,/g,";");
			 mobile = (jsonData.Contact[0]['Mobile Number *']);
			 email = (jsonData.Contact[0]['Email ID *']);



        }
        else {
			processing.updateProceFile(orderNo,12,0,'FailureJSONFileReadError');
        }
	}
		catch (e) {
			processing.updateProceFile(orderNo,12,0,'FailureImproperJSON');
		}

        var data1 = fs.readFileSync(files1, 'utf-8');
					data1 = data1.replace(/<\s*/g, '<');  // Remove space after >
					data1 = data1.replace(/\s*>/g, '>');  // Remove space before <
		if (data1) {
            var doc = new dom().parseFromString(data1.toString());
            var select = xpath.useNamespaces({ 'ITRForm': 'http://incometaxindiaefiling.gov.in/master' });
            var formname = select('//ITRForm:FormName/text()', doc)[0].nodeValue;
			var assyear = select('//ITRForm:AssessmentYear/text()', doc)[0].nodeValue;
			var resAdd = '';

			var resNo = select('//ITRForm:ResidenceNo/text()', doc)[0].nodeValue;
			var locArea = select('//ITRForm:LocalityOrArea/text()', doc)[0].nodeValue;
			locArea = locArea.replace(/,/g,";");
			//const resName = select('//ITRForm:ResidenceName/text()', doc)[0].nodeValue;
			//const roadorStreet = select('//ITRForm:RoadOrStreet/text()', doc)[0].nodeValue;
			var cityTown = select('//ITRForm:CityOrTownOrDistrict/text()', doc)[0].nodeValue;
			var pinCode = select('//ITRForm:PinCode/text()', doc)[0].nodeValue;
			var stateCode = select('//ITRForm:StateCode/text()', doc)[0].nodeValue;
			var counCode = select('//ITRForm:CountryCode/text()', doc)[0].nodeValue;
			var resName = null;
			var roadorStreet = null;
			try{
				 resName = select('//ITRForm:ResidenceName/text()', doc)[0].nodeValue;
			}
			catch(e){
				console.log('resName' + e)
			}
			try{
				 roadorStreet = select('//ITRForm:RoadOrStreet/text()', doc)[0].nodeValue;
			}
			catch(e){
				console.log('roadorStreet' + e)
			}
			console.log(resNo+'---'+resName+'---'+roadorStreet)
			resAdd = resNo + " ";
			resAdd = resAdd.replace(/,/g,";");
			if(resName!= null){
			    resAdd = resAdd+resName + " " ;
				resAdd = resAdd.replace(/,/g,";");
			}
			if(roadorStreet!=null){
				resAdd = resAdd+roadorStreet;
				resAdd = resAdd.replace(/,/g,";");
			}


			// State and Country name based on XML Extraction code
			var states = fs.readFileSync('StateCodes.json');
			var staDetails = JSON.parse(states);
			var stateFilter = where(staDetails, {"ITStateCode": stateCode});
			var state = stateFilter[0].StateText;
			var countries = fs.readFileSync('CountryCodes.json');
			var counDet = JSON.parse(countries);
			var countFilter = where(counDet, {"ITCountryCode": counCode});
			var country = countFilter[0].CountryText;

			var itpro = [{
                PAN__c: pan,
                Name_of_Assessee__c: name,
                DateOfBirth__c: dob,
                Gender__c: gender,
                Status: stat,
                AddressofAssessee_As_per_PAN__c: address,
                Flat_Door_Building__c: resAdd,
                Area_Locality__c: locArea,
                Town_City_District__c: cityTown,
                PINCODE__c: pinCode,
                State__c: state,
                Country__c: country,
                Mobile_Number__c: mobile,
                Email__c: email,
            }];

			const fileEx = '.csv';
            const type = 'ITP';
            const header = ['PAN__c', 'Name_of_Assessee__c', 'DateOfBirth__c', 'Gender__c', 'AddressofAssessee_As_per_PAN__c', 'Flat_Door_Building__c', 'Area_Locality__c', 'Town_City_District__c', 'PINCODE__c', 'State__c', 'Country__c', 'Mobile_Number__c', 'Email__c'];
            try {
                const csv = json2csv({ data: itpro, fields: header });
                if (csv) {
                    fs.writeFileSync(path1 + orderNo + path3 + '/' + orderNo + '_' + pullSeqNo + '_' + type + '_' + assyear + fileEx, csv);
                    var profileName = orderNo + '_' + pullSeqNo + '_' + type + '_' + assyear + fileEx;
					processing.updateProceFile(orderNo,11,assyear,profileName,formname,oriRev);
					console.log('profile completed');

                }
                else {
					processing.updateProceFile(orderNo,12,0,'FailureOthers');
                }
            }
            catch (e) {
				//processing.updateProceFile(orderNo,12);
             }
        }
        else {
			processing.updateProceFile(orderNo,12,0,'FailureOthers');
        }
    },

};
