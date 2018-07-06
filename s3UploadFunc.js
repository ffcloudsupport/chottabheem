require('dotenv').config();

const fs = require('fs');
const async = require('async');
const google = require('googleapis');
const errorRecovery = require('./errorRecoveryFunc.js');
const rmdir = require('rmdir');
const papertrail = require('./papertrails.js');
const mailg = require('./MailGun.js');
const zipfile = require('./zip.js');

const ffOrdStUp = require('./fforderStaUpdate.js');
var glob = require('./glob.js');
const FFSFOrdrUpdate = require('./FFSFOrdrUpdate.js');
const FFITClientFunc = require('./FFITAutomationClient.js');

const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? './googleDownUpload/' : "./awsDownUpload/"; // root path for download and upload files
const path2 = '/downloadedFiles'; // downloaded files folder (contains files downloaded from Drive)
const path3 = '/uploadedfiles'; // Uploaded files ( contains all csv's etc...)

module.exports = {
  main(auth, ffOrderNumber, PullSeqNo, dataPullName, trailName) {
    const downFilesPath = path1 + ffOrderNumber + path2;
    const uploadFilesPath = path1 + ffOrderNumber + path3;
    zipfile.zipConv(ffOrderNumber, PullSeqNo);
    var destFolderId = process.env.S3_UPLOAD_PATH;
    var fileUploadCount = 0;
    const bucketName = process.env.S3_BUCKET_NAME;
    var filePath = ""
    const awsWorker = (rxCallback, results) => {
      // make a local copy as this cannot be used in console.log
      console.log("Slkjlkjljj;", filePath)
      console.log('Starting GDRxWorker -- This is : ' + filePath + ' count : ' + fileUploadCount);
      console.log('Dest Folder ID : ' + destFolderId);
      console.log('File Path : ' + uploadFilesPath + '/' + filePath);

      const bucketParams = {
        Bucket: bucketName,
        Key: destFolderId+"/"+filePath,
        Body: fs.createReadStream(uploadFilesPath + '/' + filePath),
      };
      auth.putObject(bucketParams, function(err, data) {
        if (err) {
          console.log('Ending GDRxWorker (error)-- This is : ' + filePath + ' File count : ' + fileUploadCount + ' Error is: ' + err);
          return rxCallback(err);
        } else {
          console.log('Ending GDRxWorker (success)-- This is : ' + filePath + ' File count : ' + fileUploadCount);
          console.log ('File ID: ', bucketName+"/"+destFolderId);
          rxCallback();
        }
      });
    };

    const awsWorkerWrapper = (item, rxWorkWrappercallback) => {
      console.log('gdrxworkwrapper Starting Work on item : ' + item);
      filePath = item
      async.retry(
          {
              times: 10,
              interval: function (retryCount) {
                  var expdelay = 100 * Math.pow(2, retryCount);
                  console.log('Async retry count :' + retryCount + '  Delay : ' + expdelay + ' Item : ' + item);
                  return expdelay;
              }
          },
          awsWorker,
          function (err, results) {
              if (err) {
                  console.log('Async function finished processing (error)');
                  rxWorkWrappercallback(err);
              }
              else {
                  fileUploadCount++;  // Counter of Files successfully uploaded
                  console.log('File uploaded successfully  ' + fileUploadCount); // + ' of ' + items.length);
                  console.log('Async function finished processing (success)');
                  rxWorkWrappercallback();
              }
          }
      );
    };

    const awsFirstErrorOrFinalDone = (err) => {
      console.log('Inside gdfirstErrorOrFinalDone');
      if (err) {
          console.log('Async.Each -- An Item reported failure : ' + err);
          errorRecovery.errRecovery(ffOrderNumber, 1, err);
      } else {
        console.log('Async.Each -- All Items processed successfully');
        console.log('File uploaded successfully  ' + fileUploadCount);
        mailg.mailgu(ffOrderNumber, PullSeqNo, dataPullName, trailName);
        papertrail.paperTrailFuncCmp(ffOrderNumber);
        FFSFOrdrUpdate.SFUploadFunc(ffOrderNumber, 2);
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
      }
    };

    try {
      console.log("Line of 172 - uploadFunc - inside try ");
      console.log(downFilesPath);
      fs.readFile(downFilesPath + '/destID.txt', 'utf8', (err, data) => {
        if(err) {
          errorRecovery.errRecovery(ffOrderNumber, 1, err);
          console.log("Line of 176 - UploadFunc - error lopp off destination file read");
        }
        destFolderId = data;
        console.log ('DestFolderID[ForThisOrder]: ' + destFolderId);
        try {
          fs.readdir(uploadFilesPath, (error, items) => {
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
                  awsWorkerWrapper,
                  awsFirstErrorOrFinalDone
              );
            }
            else {
              errorRecovery.errRecovery(ffOrderNumber, 2, 'no files in upload folder');
            }
          });
        } catch(err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }
      });
    } catch(err) {
      errorRecovery.errRecovery(ffOrderNumber, 1, err);
    }
  }
}
