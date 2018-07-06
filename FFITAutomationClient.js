
/* Source Code Header
Program Name	:	FFITAutomationClient.js
Module Name		:   Client
Description  	:	In this program post completion of IT Automation you will send the processing JSON
					Object which can be used for further processing.
Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com					
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 22/10/2016
Created By		:	Sekar Raj
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		Revision Date		Revised By		Details

---------------------------------------------------------------------------------------------*/
// Client
'use strict';

// All the libraries 
require('events').EventEmitter.defaultMaxListeners = Infinity;
const express = require('express');
var async = require('async');
var request = require('request');
const fs = require('fs');

//The port on which the server is running
const PORT = process.env.PORT || 3505;

//Obtain the server address from config for postback post IT automation completion
const data = fs.readFileSync('./ITAutomationConfig.json', 'UTF-8');
if (!data) {
    console.log('Error occured while reading ITAutomationconfig.json');
} else {
    const jsonData = JSON.parse(data);
    var saddr = jsonData.saddr;
}

//var saddr = 'https://ffpostit.herokuapp.com';
//var saddr = 'http://localhost:3505';

module.exports = {
	// This function is used for send object to upstream of FF IT Automation
	FFPostITAuto(FFPostObj) {
		var i = 0;
		async.whilst(
			// test to perform next iteration
			function () { return i <= FFPostObj.length - 1; },
			// iterated function
			// call `innerCallback` when the iteration is done
			function (innerCallback) {
				//console.log('Order No: ' + JSON.stringify(FFPostObj[i]));
				request({
					url: saddr, //URL to hit
					//qs: {from: 'blog example', time: +new Date()}, //Query string data
					method: 'PUT',
					//Lets post the following key/values as form
					json: FFPostObj[i]
				}, function(error, response, body){
					if(error) {
						console.log(error);
					} else {
						console.log(response.statusCode, body);
					}
				});
				setTimeout(function() { i++; innerCallback();}, 10);
			}
		);
	}
}
