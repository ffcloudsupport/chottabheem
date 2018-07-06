/*--------------------------------------------------------------------------------------------
Source Code Header
Program Name	:	papertrails.js
Module Name		:	papertrails
Description  	:	In this program we are processing log details.

Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 05/08/2016
Created By		:	Sekar Raj
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		:	Revision Date:		Revised By		Details

---------------------------------------------------------------------------------------------*/


const fs = require('fs');
const winston = require('winston');
require('winston-papertrail').Papertrail;

const data = fs.readFileSync('./ITAutomationConfig.json', 'UTF-8');
if (!data) {
    console.log('Error occured while reading ITAutomationconfig.json');
}
else {
    const jsonData = JSON.parse(data);
    var paHost = jsonData.papertrialHost;
    var paPort = jsonData.papertrialPort;
    var hostName = jsonData.papertrialHostName;
}


module.exports = {
    paperTrailFuncSt(ffOrderNumber, PullSeqNo, dataPullName, trailName) {
	const logger = new winston.Logger({
    transports: [
        new winston.transports.Papertrail({
            host: paHost,
            port: paPort,
            hostname: hostName,
            logFormat(level, message) {
                return '[' + level + '] ' + message;
            },
        }),
        new winston.transports.Console({
            level: 'console.log',
            timestamp() {
                return new Date().toString();
            },
            colorize: true,
        }),
       
    ],

});
		logger.info('EventType:Overall ITAutomation Process Started' + 'orderNo:' + ffOrderNumber + new Date().toString());
		logger.info('EventType:' + 'orderNo:' + ffOrderNumber);
		logger.info('EventType:' + 'trailNumber:' + trailName);
		logger.info('EventType:' + 'Pull Sequence Number:' + PullSeqNo);
		logger.info('EventType:' + 'Data Pull Name:' + dataPullName);
	},

	paperTrailFuncCmp(ffOrderNumber) {
		const logger = new winston.Logger({
    transports: [
        new winston.transports.Papertrail({
            host: paHost,
            port: paPort,
            hostname: hostName,
            logFormat(level, message) {
                return '[' + level + '] ' + message;
            },
        }),
        new winston.transports.Console({
            level: 'console.log',
            timestamp() {
                return new Date().toString();
            },
            colorize: true,
        }),
       
    ],

});
		logger.info('EventType:Overall ITAutomation Process Completed' + 'orderNo:' + ffOrderNumber + new Date().toString());
	},


};
