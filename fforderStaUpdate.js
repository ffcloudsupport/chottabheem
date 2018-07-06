/* Source Code Header
Program Name	:	fforderstaupdate.js
Module Name		:
Description  	:

Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 05/08/2016
Created By		:	sekar
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		:	Revision Date:		Revised By		Details
1.1		    		12th Aug 2016
---------------------------------------------------------------------------------------------*/	// For serving a basic web page.
// const http = require('http');
// const sync = require('synchronize');
// const mongodb = require('mongodb');
// const mongoose = require('mongoose');
// const express = require('express');
// const bodyParser = require('body-parser');

// grab the FFOrder model
const FFOrder = require('./models/ffschema');
const FFDBFunc = require('./ffmongo.js');

// setup middleware
// const ffapp = express();

// Usage of this function
// const FFOrdStUp = require('./fforderStaUpdate.js');
// const ffsord1 = 'FF103';
// var ffNewRemarks1 = "This is just a demo";
// var ffNewStatus1 = "rejected";
// FFOrdStUp.FFOrdUpdateStatus(ffsord1, ffNewStatus1, ffNewRemarks1);

module.exports = {

	// This fetches the record based on order id and updates the order with status and remarks
	FFOrdUpdateStatus(ffsord, ffNewStatus, ffNewRemarks) {
		FFDBFunc.fffindone(FFOrder, ffsord, (err, ffordlist) => {
			// if (err) {
					// console.log('Have reached error on fffindone');
					// return console.error(err);
				// } else {
					// console.log('This is the data from ejs render: ' + ffordlist);
					// //ffordlist.status = ffNewStatus;
					// //ffordlist.remarks = ffNewRemarks;

					// // this function call updates the order
					// FFDBFunc.ffupdate(FFOrder, ffordlist, ffsord, (e, ffUpOut) => {
						// if (e) {
								// console.log(e);
							// } else {
								// console.log('The order has been successfully saved');
							// }
					// });
			// }
		});
	},
};

