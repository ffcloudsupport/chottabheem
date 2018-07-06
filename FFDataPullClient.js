// Client
'use strict';

// All the libraries 
require('events').EventEmitter.defaultMaxListeners = Infinity;
const express = require('express');
var async = require('async');
var ioOut = require('socket.io-client');
var request = require('request');

//The port on which the server is running
const PORT = process.env.PORT || 23405;

var FFOrder = [{
   "FFOrderNo": "FF00000105",
   "FFProdCode": "MA001",
   "PullSeqNo": "1",
   "Datapull": "IncTax",
   "TrialNumber": "001",
   "Status": "Success",
   "GooglePath": "FFF001\/MD001\/IncTax\/003",
   "BorrowerName": "Rama Krishna",
   "BorrowerEmailID": "a@b.com",
   "BorrowerMobile": "9845098450"
}];


// var FFOrder = [{
    // "FFOrderNo": "FF001",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// },
// {
    // "FFOrderNo": "FF002",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// },
// {
    // "FFOrderNo": "FF003",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// },
// {
    // "FFOrderNo": "FF004",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// },
// {
    // "FFOrderNo": "FF005",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// },
// {
    // "FFOrderNo": "FF006",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// },
// {
    // "FFOrderNo": "FF007",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// },
// {
    // "FFOrderNo": "FF008",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// },
// {
    // "FFOrderNo": "FF009",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// },
// {
    // "FFOrderNo": "FF101",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// },
// {
    // "FFOrderNo": "FF102",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// },
// {
    // "FFOrderNo": "FF103",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// },
// {
    // "FFOrderNo": "FF104",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// },
// {
    // "FFOrderNo": "FF105",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// },
// {
    // "FFOrderNo": "FF106",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// },
// {
    // "FFOrderNo": "FF107",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// },
// {
    // "FFOrderNo": "FF108",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// },
// {
    // "FFOrderNo": "FF109",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// },
// {
    // "FFOrderNo": "FF500",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// },
// {
    // "FFOrderNo": "FF501",
    // "FFProdCode": "MA001",
    // "PullSeqNo": "001",
    // "Datapull": "IncTax",
    // "TrialNumber": "001",
    // "Status": "Success",
    // "GooglePath": "FFF001\/MD001\/IncTax\/003",
    // "BorrowerName": "Rama Krishna",
    // "BorrowerEmailID": "a@b.com",
    // "BorrowerMobile": "9845098450"
// }];

//var FFOrderJSON = JSON.parse(FFOrder);

//var PullSeqNo = "001";
//var DataPullName = "IncTax";
//var OrdRemarks = ("Order has been created");
//var socketOut = ioOut.connect('https://ffittest.herokuapp.com/');
// var socketOut = ioOut.connect('http://localhost:3501');
// var i = 0;
// async.whilst(
    // // test to perform next iteration
    // function () { return i <= FFOrder.length - 1; },
    // // iterated function
    // // call `innerCallback` when the iteration is done
    // function (innerCallback) {
        // console.log('Order No: ' + JSON.stringify(FFOrder[i]));
        // socketOut.emit('clntorder', FFOrder[i]);
        // //console.log('Order No: ' + FFOrder[i] + ' Pull No: ' + PullSeqNo + ' Pull Name: ' + DataPullName + ' Remarks: ' + OrdRemarks);
        // console.log('Order No: ' + JSON.stringify(FFOrder[i]));
        // // wait 10 secs to run the next iteration
        // setTimeout(function() { i++; innerCallback();}, 12000);
        // }
// );

//var saddr = 'https://ffopsauto.herokuapp.com';
var saddr = 'https://ffittest.herokuapp.com';
//var saddr = 'http://localhost:3501';
var i = 0;
async.whilst(
    // test to perform next iteration
    function () { return i <= FFOrder.length - 1; },
	// iterated function
    // call `innerCallback` when the iteration is done
    function (innerCallback) {
		console.log('Order No: ' + JSON.stringify(FFOrder[i]));
		request({
			url: saddr, //URL to hit
			//qs: {from: 'blog example', time: +new Date()}, //Query string data
			method: 'PUT',
			//Lets post the following key/values as form
			json: FFOrder[i]
		}, function(error, response, body){
			if(error) {
				console.log(error);
			} else {
				console.log(response.statusCode, body);
		    }
        });
		setTimeout(function() { i++; innerCallback();}, 12000);
	}
);

