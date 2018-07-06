const fs = require('fs');
// Connection to Salesforce to upload
'use strict';

//Libraries required to load the IT Automated data
const sf = require('node-salesforce');
const processing = require('./processing1.js');


//Object Information to transfer the data to Salesforce

//Connection Information to load data into Salesforce
 
const conn = new sf.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env. 
 
   loginUrl : 'https://test.salesforce.com'
});


//Credentials for logging into Salesforce, password is also concatenated with security token
//const username = 'force@itssrc.com';
//const password = 'ITSS!@#123hpxWOumK51KmV1tLP5QkkcL3';

module.exports = {
	SFSave(SFObj, FFOrdData) {
		const data = fs.readFileSync('./ITAutomationConfig.json', 'UTF-8');
		if (!data) {
            console.log('Error occured while reading ITAutomationconfig.json');
        } else {
		const jsonData = JSON.parse(data);
		conn.login(jsonData.sfusername, jsonData.sfpassword, function(err, userInfo) {
		  if (err) { return console.error(err); }
		  // Now you can get the access token and instance URL information. 
		  // Save them to establish connection next time. 
		  else {
			  console.log("The connection details of accessToken : " + conn.accessToken);
			  console.log(conn.instanceUrl);
			  // logged in user property 
			  console.log("User ID: " + userInfo.id);
			  console.log("Org ID: " + userInfo.organizationId);
			  conn.sobject(SFObj).create(FFOrdData, function(err, ret) {
				  if (err || !ret.success) { return console.error(err, ret); }
				  console.log("Created record id : " + ret.id);
				  
				  conn.logout(function(err) {
					if (err) { return console.error(err); }
					// now the session has been expired. 
					console.log("The connection has been logged out. ");
				  });
				});
			}
		});
	  }
    },
	
	SFUpdate(SFObj, SFExtId, FFOrdUpdData) {
		const data = fs.readFileSync('./ITAutomationConfig.json', 'UTF-8');
		if (!data) {
            console.log('Error occured while reading ITAutomationconfig.json');
        } else {
		const jsonData = JSON.parse(data);
		conn.login(jsonData.sfusername, jsonData.sfpassword, function(err, userInfo) {
		  if (err) { 
			processing.updateProceFile(FFOrdUpdData[0].FF_Order__c,102,0,'LoginFailure');
			return console.error('FFAutoSFUpdate login Error '+err);
}
		  // Now you can get the access token and instance URL information. 
		  // Save them to establish connection next time. 
		  else {
			  console.log("The connection details of accessToken : " + conn.accessToken);
			  console.log(conn.instanceUrl);
			  // logged in user property 
			  console.log("User ID: " + userInfo.id);
			  console.log("Org ID: " + userInfo.organizationId);
			  conn.sobject(SFObj).upsert(FFOrdUpdData, SFExtId, function(err, ret) {
				  if (err) {
						 if ('FF_Datapull_Completion__c' in FFOrdUpdData[0]){
							processing.updateProceFile(FFOrdUpdData[0].FF_Order__c,102,0,'UpdationFailure');
				         }	
					     console.log('FFAutoSFUpdate update Error '+err);
						 return console.error(err, ret); 
				  }
					console.log('Upserted Successfully');
					if ('FF_Datapull_Completion__c' in FFOrdUpdData[0]){
							processing.updateProceFile(FFOrdUpdData[0].FF_Order__c,102,0,'Success');
				         }	
					conn.logout(function(err) {
						if (err) { return console.error(err); }
						// now the session has been expired. 
						console.log("The connection has been logged out. ");
					});
				});
			}
		});
	}
	}
	
}

  

