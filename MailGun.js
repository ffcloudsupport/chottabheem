/* Source Code Header
Program Name	:	MailGun.js
Module Name		:
Description  	:	In this program we are Sending emails for successful orders.

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
1.2				:	31th Aug 2016		sekar			Getting api and domain name from config files
---------------------------------------------------------------------------------------------*/

const fs = require('fs');
// const JSONPath = require('JSONPath');
const data = fs.readFileSync('ITAutomationConfig.json', 'UTF-8');
const jsonData = JSON.parse(data);
const fromMail = jsonData.emailFrom;
const toEmail = jsonData.emailNotificationTO;
const ccEmail = jsonData.emailNotificationCC;
const api_Key = jsonData.emailServerAPIKey;
const domain = jsonData.emailServerDomain;
const mailgun = require('mailgun-js')({ apiKey: api_Key, domain });

module.exports = {
    mailgu(orderNo, pullSeqNo, dataPullName, TrialNum) {
        // console.log(toEmail);
        const maildata = { from: fromMail, to: toEmail, cc: ccEmail, subject: 'Order Status', text: 'Order Number: ' + orderNo + ' PullSequenceNumber:' + pullSeqNo + ' DataPullName:' + dataPullName + ' TrialNumber:' + TrialNum + ' Process Completed Sucessfully' };
        mailgun.messages().send(maildata, (error, body) => {
			if (error) {
				console.log(' error occured while sending success mail' + error);
			}
			else {
				console.log(' mail sent Sucessfully');
			}
		});
	},
    mailgunFunc(orderNo, Error) {
        const mailinfo = {
            from: fromMail,
			to: toEmail,
			cc: ccEmail,
			subject: ' Error: ' + orderNo,
            text: 'Order Number: ' + orderNo + ' ErrorList:' + Error,
        };
        mailgun.messages().send(mailinfo, (error, body) => {});
	},
	//introduced to send email for zero kb file  --Manoj --- 20-06-2018
	mailgunFunczero(orderNo, filesize) {
        const mailinfo = {
            from: fromMail,
			to: toEmail,
			cc: ccEmail,
			subject: ' Error: - zero KB file or large file found ; Attention required ' + orderNo,
            text: 'Order Number: ' + orderNo + ' filesize:' + filesize,
        };
        mailgun.messages().send(mailinfo, (error, body) => {});
	},
		//introduced to send email for error file  --Manoj --- 20-06-2018
	mailgunFuncerr(orderNo, err , message) {
        const mailinfo = {
            from: fromMail,
			to: toEmail,
			cc: ccEmail,
			subject: 'Error - xml DOM error Found; Attention required ' + orderNo,
            text: 'Order Number: ' + orderNo  + err + 'Message :' + message , 
        };
        mailgun.messages().send(mailinfo, (error, body) => {});
	},
};
