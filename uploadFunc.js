    /* Source Code Header
Program Name	:	UploadFunc.js
Module Name		:
Description  	:	In this program we are Uploading all the files from google drive,
Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 05/08/2016
Created By		:	Raghu
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		:	Revision Date:		Revised By		Details
----------			--------------		----------		---------
1.1		    		12th Aug 2016		Raghu			Modified for fixing logic issues

---------------------------------------------------------------------------------------------*/

require('dotenv').config();

const fs = require('fs');
// const readline = require('readline');
const async = require('async');
const google = require('googleapis');
// const googleAuth = require('google-auth-library');
const errorRecovery = require('./errorRecoveryFunc.js');
const rmdir = require('rmdir');
const papertrail = require('./papertrails.js');
const mailg = require('./MailGun.js');
const zipfile = require('./zip.js');

const ffOrdStUp = require('./fforderStaUpdate.js');
var glob = require('./glob.js');
const FFSFOrdrUpdate = require('./FFSFOrdrUpdate.js');
const FFITClientFunc = require('./FFITAutomationClient.js');
// var sync = require('synchronize')
// sync(fs, 'readdir', 'stat', 'readFile','writeFile')

const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? './googleDownUpload/' : "./awsDownUpload/"; // root path for download and upload files
const path2 = '/downloadedFiles'; // downloaded files folder (contains files downloaded from Drive)
const path3 = '/uploadedfiles'; // Uploaded files ( contains all csv's etc...)
// This are the path that will be used for file upload, download and for root path

module.exports = {

    main(auth, ffOrderNumber, PullSeqNo, dataPullName, trailName) {
        const service = google.drive('v3');
        const downFilesPath = path1 + ffOrderNumber + path2;
        const uploFilesPath = path1 + ffOrderNumber + path3;
        zipfile.zipConv(ffOrderNumber, PullSeqNo);
        // Global Variables
        var destFolderId = '0B3X_nzYACVhTTTBscTNZZWdnQmM'; // 0BxS3PhuWzjMON3NFU183dndYWlU
        //var destFolderId; // = '0BxS3PhuWzjMOaWpBS1l6TDVraDQ';
        var fileUploadCount = 0;

        // Helper Functions Start
        // Retryable Google Drive Worker
        var gdrxworker = function (rxcallback, results) {
            var litem = this; // make a local copy as this cannot be used in console.log
            console.log('Starting GDRxWorker -- This is : ' + litem + ' count : ' + fileUploadCount);
            console.log('Dest Folder ID : ' + destFolderId);
            console.log('File Path : ' + uploFilesPath + '/' + litem);
            const fileMetadata = {
                name: litem,
                parents: [destFolderId],
            };
            const media = {
                //mimeType: 'application/zip',
                alt: 'media',
                body: fs.createReadStream(uploFilesPath + '/' + litem),
            };
            service.files.create(
                {
                    auth,
                    resource: fileMetadata,
                    media,
                    fields: 'id',
                    quotaUser: litem
                }, (e, file) => {
                    if (e) {
                        console.log('Ending GDRxWorker (error)-- This is : ' + litem + ' File count : ' + fileUploadCount + ' Error is: ' + e);
                        return rxcallback(e);
                    } else {
                        console.log('Ending GDRxWorker (success)-- This is : ' + litem + ' File count : ' + fileUploadCount);
                        console.log ('File ID: ' + file.id + ' File Name: ' + file.name );
                        rxcallback();
                    }
                }
            );
        };
        // Wrapper for retryable google drive worker
        var gdrxworkwrapper = function (item, rxworkwrappercallback) {
            console.log('gdrxworkwrapper Starting Work on item : ' + item);

            // Retry Async Worker
            async.retry(
                {
                    times: 10,
                    interval: function (retryCount) {
                        var expdelay = 100 * Math.pow(2, retryCount);
                        console.log('Async retry count :' + retryCount + '  Delay : ' + expdelay + ' Item : ' + item);
                        return expdelay;
                    }
                },
                gdrxworker.bind(item),
                function (err, results) {
                    // console.log("===================================")
                    if (err) {
                        console.log('Async function finished processing (error)');
                        rxworkwrappercallback(err);
                    }
                    else {
                        fileUploadCount++;  // Counter of Files successfully uploaded
                        console.log('File uploaded successfully  ' + fileUploadCount); // + ' of ' + items.length);
                        console.log('Async function finished processing (success)');
                        rxworkwrappercallback();
                    }
                }
            );
        };
        // Function for Final Activity
        var gdfirstErrorOrFinalDone = function (err) {
            // This function is called at the
            // first instance of error in the eachLimit list or
            // If there is an error the processing stops
            // when everything is successful
            console.log('Inside gdfirstErrorOrFinalDone');

            if (err) {
                // One of the iterations produced an error.
                // All processing will now stop.
                console.log('Async.Each -- An Item reported failure : ' + err);
                errorRecovery.errRecovery(ffOrderNumber, 1, err);
            } else {
                console.log('Async.Each -- All Items processed successfully');
                // console.log('File Id: ', file.id);
                //k++;   // how to increment the count of files successfully uploaded - need variable before async.eachLimit
                console.log('File uploaded successfully  ' + fileUploadCount); //  + ' of ' + items.length);
                //if (fileUploadCount == items.length) {
                //console.log(i, items.length);
                mailg.mailgu(ffOrderNumber, PullSeqNo, dataPullName, trailName);
                papertrail.paperTrailFuncCmp(ffOrderNumber);
                //Sf update
               FFSFOrdrUpdate.SFUploadFunc(ffOrderNumber, 2)
                //dash board update
               ffOrdStUp.FFOrdUpdateStatus(ffOrderNumber, 'Completed', 'Completed successfully');
                console.log('process completed');
                console.log(' glob before : ' + glob.ordstatus);
                glob.ordstatus=5;
                console.log('glob Before sending ack GCH:'+ glob.gch);
                console.log('glob Before sending ack gorder:'+ JSON.stringify(glob.gorder));
                var lval = glob.gch.ack(glob.gorder);
                console.log('glob Aftersendingack :' + lval);
                console.log(' glob after : ' + glob.ordstatus);
                var file_content = fs.readFileSync(path1 + ffOrderNumber + path3 + '/' + ffOrderNumber + 'ProcessingResult.json', 'utf8');
                var ffPostbankObj = [];
                ffPostbankObj[0] = JSON.parse(file_content);
                FFITClientFunc.FFPostITAuto(ffPostbankObj);
                console.log("The order object has been sent");
                if (!fs.existsSync(path1 + ffOrderNumber)) {
                    // console.log(path1 + ffOrderNumber + 'does not exist locally');
                } else {
                    // rmdir(path1 + ffOrderNumber, (er) => {
                    // if (er) {
                    // // console.log('It has errored out' + er);
                    // } else {
                    // // console.log(path1 + ffOrderNumber + ' path removed locally');
                    // }
                    // });
                }
                // console.log('The path of the folder is ' + path1 + ffOrderNumber);
                //}
                //else {
                // what to do here?
                //}
            }
        };
            console.log("Line of 169 - UploadFunc");
        // Start Actual work here
        try {
            console.log("Line of 172 - uploadFunc - inside try ");
            console.log(downFilesPath);
            fs.readFile(downFilesPath + '/destID.txt', 'utf8', (err, data) => {
                console.log('File read : ' + err);
                console.log("Line of 173 - UploadFunc - destination file read");
                if (err) {
                    errorRecovery.errRecovery(ffOrderNumber, 1, err);
                    console.log("Line of 176 - UploadFunc - error lopp off destination file read");
                    // throw err;
                }
                destFolderId = data;
                console.log ('DestFolderID[ForThisOrder]: ' + destFolderId);
                try {
                    fs.readdir(uploFilesPath, (error, items) => {
                        let k = 0;
                        let i = 0;
                        if (items.length > 0) {

                            var strparallelLimit = process.env.UPLOAD_PARALLEL || '6';
                            console.log ('Str Parallel Limit : ' + strparallelLimit);
                            var intparallelLimit = Number(strparallelLimit);
                            console.log ('Int Parallel Limit: '+ intparallelLimit);

                            async.eachLimit(
                                items,
                                intparallelLimit,
                                gdrxworkwrapper,
                                // Final err call back function of async.each
                                gdfirstErrorOrFinalDone
                            );
                        }
                        else {
                            // console.log('no files in upload folder');
                            errorRecovery.errRecovery(ffOrderNumber, 2, 'no files in upload folder');
                        }
                    });
                } catch (e) {
                    errorRecovery.errRecovery(ffOrderNumber, 1, e);
                }
            });
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }
    },
};
