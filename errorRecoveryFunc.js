/* Source Code Header
Program Name	:	ErrorRecoveryFunc.js
Module Name		:
Description  	:	In this program we are receiving the all errors and processing it.
Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 28/08/2016
Created By		:	Raghu
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		:	Revision Date:		Revised By		Details

---------------------------------------------------------------------------------------------*/

const fs = require('fs');
// const readline = require('readline');
// var rmdir = require('rmdir');
const path1 = './/';
// const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';
const MailGun = require('./MailGun.js');
const FFOrdStUp = require('./fforderStaUpdate.js');

module.exports = {

	errRecovery(ffOrderNumber, No, Error) {
		if (No == 1) { // unknown error occured we need to start order once again
		console.log('Some unknown error occured');
		console.log('Order no is : ' + ffOrderNumber);
		console.log('The error is : ' + Error);
		//fs.appendFileSync(path1 + ffOrderNumber + path3 + '/' + ffOrderNumber + 'ProcessingResult.json', JSON.stringify({ 'ErrorList': Error }));
		}
		else if (No == 2) { // known error occured stop the execution..
		console.log('Some known error occured');
		console.log('Order no is : ' + ffOrderNumber);
		console.log('The error is : ' + Error);
		MailGun.mailgunFunc(ffOrderNumber, Error);
		FFOrdStUp.FFOrdUpdateStatus(ffOrderNumber, 'Rejected', Error);
		}
		else if (No==3){
			console.log('Some known error occured');
			console.log('Order no is : ' + ffOrderNumber);
			console.log('The error is : ' + Error);
			MailGun.mailgunFunc(ffOrderNumber, Error);
		}
		//fs.appendFileSync(path1 + ffOrderNumber + path3 + '/' + ffOrderNumber + 'ProcessingResult.json', JSON.stringify({ 'ErrorList': Error }));
		// process.exit()
		// rmdir('./'+path1+'/'+ffOrderNumber, function (err) {
			// });
			
			// var file_content = fs.readFileSync(path1 + ffOrderNumber + path3 + '/' + ffOrderNumber + 'ProcessingResult.json');
			// var content = JSON.parse(file_content);
			// console.log(content);
		
	},
};

