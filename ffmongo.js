/* Source Code Header
Program Name	:	ffmongo.js
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
1.1		    		12th Aug 2016		sekar
---------------------------------------------------------------------------------------------*/
// const mongodb = require('mongodb');
const mongoose = require('mongoose');
// const JSONPath = require('JSONPath');
const fs = require('fs');
// var JSONPath = require('JSONPath');

// Here we find an appropriate database to connect to, defaulting to
// Obtaining all the database configuration information from json file
const data = fs.readFileSync('ITAutomationConfig.json', 'UTF-8');
const jsonData = JSON.parse(data);
const uristring = jsonData.FFDBConnection;

// Alternate way of configuring MongoDB
// var uristring = 'mongodb://heroku_29dwj789:6mrdll1l8u1mbbildq2osou2uu@ds017726.mlab.com:17726/heroku_29dwj789';
// "FFDBConnection":	"mongodb://finfort:finfort@ds019746.mlab.com:19746/ffit",
// "FFDBConnection":	'mongodb://heroku_29dwj789:6mrdll1l8u1mbbildq2osou2uu@ds017726.mlab.com:17726/heroku_29dwj789',
// var uristring =
// process.env.MONGOLAB_URI ||
// process.env.MONGOHQ_URL ||
// 'mongodb://localhost/FFOrderDB';
// mongo ds017726.mlab.com:17726/heroku_29dwj789 -u heroku_29dwj789 -p 6mrdll1l8u1mbbildq2osou2uu

// The http server will listen to an appropriate port, or default to
// port 5000.
// var theport = process.env.PORT || 5000;

// grab the FFOrder model
// const FFOrder = require('./models/ffschema');

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.Promise = global.Promise;
mongoose.connect(uristring);
const db = mongoose.connection;


module.exports = {

	// This function is used for saving object in MongoDB
	ffsave(ffObj) {
		db.on('error', console.error.bind(console, 'connection error:'));
		ffObj.save((err, OrderObj) => {
		  if (err) {
			console.log(err);
		  } else {
			console.log('saved successfully:', OrderObj);
		  }
	  });
	},

	// This function is used for finding object in MongoDB
	fffind(ffFindObj, callback) {
		db.on('error', console.error.bind(console, 'connection error:'));
		ffFindObj.find({}, (err, fforders) => {
		  if (err) {
			console.log(err);
		  } else {
			console.log('saved successfully:', fforders);
			return callback(null, fforders);
		  }
	  });
	},

	// This function is used for findone object in MongoDB
	fffindone(ffObj, orderid, callback) {
		db.on('error', console.error.bind(console, 'connection error:'));
		ffObj.findOne({ orderno: orderid }, (err, fforder) => {
		 if (err) {
				console.log(err);
			} else {
				console.log('The selected order is: ', fforder);
				return callback(null, fforder);
			}
		});
	},

	// This function is used for updating object in MongoDB
	ffupdate(ffObj, ffOrdUpdate, orderid, callback) {
		db.on('error', console.error.bind(console, 'connection error:'));
		ffObj.update({ orderno: orderid }, ffOrdUpdate, { upsert: true }, (err, ffresult) => {
			if (err) {
						console.log(err);
					 } else {
						console.log('The order has been successfully saved' + ffresult);
						return callback(null, ffresult);
					 }
		});
	},

	// This function is used for closing database connectivity in MongoDB
	ffdbClose() {
		mongoose.connection.close(() => {
			console.log('Mongoose default connection with DB :' + db_server + ' is disconnected through app termination');
			process.exit(0);
		});
	},

};
