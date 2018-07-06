/* Source Code Header
Program Name	:	ffengine.js
Module Name		:
Description  	:	In this program we are Fetching source files form local folder and calling the convertion functions

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
1.2				:	24th Aug 2016 		sekar 			Added Missed field for ITR1 &ITR2 &ITR3
1.3				:	30th Aug 2016		sekar			Adding try and Catch Error
1.4				:	5th  Oct 2016		Raghu
1.5				:	27th jan 2017		sekar
1.6             :   18-7-2017			sekar			Added Config logic for Text File Extraction
---------------------------------------------------------------------------------------------*/

/** *** **************************************************************************************************************
Require node  module details
********************************************************************************************************************/
const fs = require('fs');
const path = require('path');
 require('dotenv').config();
const itre = require('./ITR-Conversion.js');
//const banks = require('./bank-Conversion.js');
const otd = require('./OTD-Conversion.js');
const profile = require('./Profile-Conversion.js');
const bankAll = require('./bankAll-Conversion.js');
const partner = require('./partner-Conversion.js');
const partDirLat = require('./dirpartner-Conversion.js');
const MailGun = require('./MailGun.js');
//const partDir = require('./dirpartnerAll-Conversion.js');
const pan = require('./Pan-Conversion.js');
const din = require('./Dir-Conversion.js');
const dinDet  = require('./dinDet-Conversion.js');
const textParser = require('./FFTextParser.js');
const bankcsv = require('./bankCsv-Conversion.js');
const plCon = require('./plcsv-conversion.js');
const plcsv = require('./plcsvAll-conversion.js');
const bscsv = require('./bscsvAll-conversion.js');
const bsCon = require('./bs-conversion.js');
//const zipfile = require('./zip.js');
const sale = require('./saleOfImm-conversion.js');
const te = require('./text.js');
const teCsv = require('./textCsv-Conversion.js');
const textSec = require('./26Asyear.js');
const revCount = require('./revCount.js');
const errorRecovery = require('./errorRecoveryFunc.js');
const processing = require('./processing1.js');
const CorpBs34 = require('./CorpBS34-conversion.js');
const corpPl34 = require('./corporateConvertionITR34.js');
const s3UploadFunc = require('./s3UploadFunc.js');
const uploadFunc = require('./uploadFunc.js');
var send = require('./send.js');
var sleep= require('system-sleep');
const ffOrdStUp = require('./fforderStaUpdate.js');
var glob = require('./glob.js');
const FFSFOrdrUpdate = require('./FFSFOrdrUpdate.js');
const FFITClientFunc = require('./FFITAutomationClient.js');
const papertrail = require('./papertrails.js');


const path1 =  process.env.DOWNLOAD_REPO_PATH == "google" ? './googleDownUpload/' : "./awsDownUpload/"; // root path for download and upload files
const path2 = '/downloadedFiles'; // downloaded files folder (contains files downloaded from Drive)
const path3 = '/uploadedfiles'; // Uploaded files ( contains all csv's etc...)



module.exports = {

    CallEngine(auth, orderNo, pullSeqNo, dataPullName, trailName, uploadIn) {
      console.log('Engine Started , the order no is: ', orderNo);

      let items = fs.readdirSync(path1 + orderNo + path2);
      let years = '';
      let jsonData = '';
      let TextASYears = [];
      var ASyears = [];
      try {
        const data = fs.readFileSync('./ITAutomationConfig.json', 'UTF-8');
            if (data) {
                jsonData = JSON.parse(data);
                years = jsonData.YearsToGenerateCSVOptions;
                ASyears = jsonData.ASyears;
                TextASYears = jsonData.AS26YearsToExtract;
                console.log(TextASYears)
                console.log(years)
                const fstyearorg = [];
                const fstyearrev = [];
                const textFiles = [];
                const txtFiles = [];
                const txtFiles1 = [];
                let latestfound = false;
                let latestTxt = false;
                let length = years.length;
                let TextASYear = TextASYears.length;

                for( var  y=0; y<ASyears.length ; y++){
                  for (let i = 0; i < items.length; i++) {
                  	var endName = items[i].slice(-8,-4);
                  	if (path.extname(items[i]) == '.txt' && endName == ASyears[y] ) {
                  			textFiles[y] = items[i];
                  			console.log(textFiles[y] + '.........................');
                  			te.AS26Section(textFiles[y],ASyears[y],orderNo, pullSeqNo);
                  			//console.log(textFiles[y] + ' file...................');
                  	}

                  }
                }
      // For Text File Extraction
      for(let y = TextASYears.length; y > 0; y--){
        const ASyear = TextASYears[TextASYear-1];
        console.log(ASyear + '..............107');
        for (let i = 0; i < items.length; i++) {
        	const endName = items[i].slice(-8,-4);
        	if (path.extname(items[i]) == '.txt' && endName == ASyear ) {
        			txtFiles[y] = items[i];
        			//console.log(txtFiles[y] + '   2017 file...................');
          }
        }
      // Text Files

      	if (txtFiles[y]){
      		textParser.FFAS26TextParser(txtFiles[y],ASyear, orderNo, pullSeqNo, function(resultSave){

      		});
      	}
      	else{
      		console.log('text Files are not Found');
      	}
        TextASYear --;

      }

      for (let y = years.length; y > 0; y--) {
        const year = years[length - 1];
        console.log(year + '..............133');
        for (let i = 0; i < items.length; i++) {
            console.log('All items :' , items);
          const startname = items[i].substring(0, 4);
          const middlename = items[i].substring(4, 8);
        	if (path.extname(items[i]) == '.xml' && startname == year) {
        		if (middlename == 'Orig') {
                    var filepath = path1 + '/' + orderNo + '/' + path2 + '/' + items[i] 
                    console.log(filepath);
                    var statsori = fs.statSync(filepath)
                    console.log('original file size :', items[i],statsori.size); 
                    var filesize = statsori.size ; 
                    var largefilesize = process.env.LARGEFILESIZE || 100000
                        if (filesize == 0){
                            MailGun.mailgunFunczero(orderNo, filesize);
                            var q=process.env.REC_Q1 || "manual-ind-s3"
                            module.exports.que= q;
                            sleep(5000)
                            send.postcall();
                            console.log(send);
                            console.log('process completed');
                            /*
                            console.log(' glob before : ' + glob.ordstatus);
                            glob.ordstatus=5;
                            console.log('glob Before sending ack GCH:'+ glob.gch);
                            console.log('glob Before sending ack gorder:'+ JSON.stringify(glob.gorder));
                            var lval = glob.gch.ack(glob.gorder);
                            console.log('glob Aftersendingack :' + lval);
                            console.log(' glob after : ' + glob.ordstatus);
                           // process.exit(0);
                           */
                        }
                         if (largefilesize <= filesize){
                            MailGun.mailgunFunczero(orderNo, filesize);
                            var q=process.env.REC_Q2 || "largexml"
                            module.exports.que= q;
                            send.postcall();
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
              fstyearorg[y] = items[i];
            } else if (middlename == 'Revi' && startname == year) {
                var filepath = path1 + '/' + orderNo + '/' + path2 + '/' + items[i]
                var statsori = fs.statSync(filepath)
                console.log('revisied file size :', items[i],statsori.size);

                fstyearrev[y] = items[i];
                /*
                var statsrev = fs.statSync("myfile.txt")
                var fileSizeInBytesrev = statsrev["size"]
                console.log('revised file size :' , fileSizeInBytesrev);
                */


            }
          }

        }

      //if original found
                  if (fstyearorg[y]) {
  
                   
      	itre.conversionItp(fstyearorg[y], fstyearrev[y], year, orderNo, pullSeqNo);
      	sale.saleOfimmovConversion(fstyearorg[y], fstyearrev[y], year, orderNo, pullSeqNo);
      	partner.conversionPartner(fstyearorg[y], fstyearrev[y], year, orderNo, pullSeqNo);
      	bankAllFunc(fstyearorg[y], fstyearrev[y]);
      	plCon.PLConversion(fstyearorg[y], fstyearrev[y], year, orderNo, pullSeqNo);
      	bsCon.BSConversion(fstyearorg[y], fstyearrev[y], year, orderNo, pullSeqNo);
      	CorpBs34.CorpBSConversion(fstyearorg[y], fstyearrev[y], year, orderNo, pullSeqNo);
      	corpPl34.CorpPLConversion(fstyearorg[y], fstyearrev[y], year, orderNo, pullSeqNo);
                      if (latestfound == false) {
                          bankFunc(fstyearorg[y], fstyearrev[y]);
                          profileFunc(fstyearorg[y], fstyearrev[y]);
                          latestfound = true;
                      }
                  }

      //if original not found

      else {
      	//processing.updateProceFile(orderNo,2,year)
      }

                  length--;

              }

      //Bank
      bankcsv.bankCSVConv(orderNo, pullSeqNo);
      plcsv.plCSVAllConv(orderNo, pullSeqNo);
      bscsv.BSCSVAllConv(orderNo, pullSeqNo);
      textSec.TextPart(orderNo, pullSeqNo, dataPullName);

      //if no xml files
      if(latestfound == false){
       processing.updateProceFile(orderNo,10,'year','FailureXMLFileNotFound');
       processing.updateProceFile(orderNo,12,0,'FailureLastITReturnXMLFileMissing');
      }
          } else {
              errorRecovery.errRecovery(orderNo, 2, 'Error occured while reading config.json');
          }
      } catch (err) {
      console.log(err);
      }

      const osdFilePath = path1 + orderNo + path2 +'/'+ 'OutstandingDemand.json';
      try {
      // if (!fs.statSync(osdFilePath)) {
      fs.statSync(osdFilePath)
             otd.jsonConv('OutstandingDemand.json', orderNo, pullSeqNo);
      // }
      } catch (err) {
      console.log('otd '+err)
          processing.updateProceFile(orderNo,14,0,'FailureJSONFileNotFound');

      }

      const sumFilePath = path1 + orderNo + path2 +'/'+ 'DataPullSummary.json';
      try {
         // if (!fs.existsSync(sumFilePath)) {
      fs.statSync(sumFilePath)
              revCount.revCounts('DataPullSummary.json', orderNo, years);
         // }
      } catch (err) {
      console.log('sumFile'+err)

      }

      const panFilePath = path1 + orderNo + path2 +'/'+ 'PANSearchResults.json';
      try {
      // if (!fs.statSync(osdFilePath)) {
      fs.statSync(panFilePath)
            pan.PanjsonConv('PANSearchResults.json', orderNo, pullSeqNo);
      // }
      } catch (err) {
      console.log('pan '+err);
          processing.updateProceFile(orderNo,26,0,'FailureJSONFileNotFound');

      }

      const dinFilePath = path1 + orderNo + path2 +'/'+ 'DINSearch_ListOfCompanies.json';
      try {
      console.log(dinFilePath)
         // if (!fs.statSync(osdFilePath)) {
      fs.statSync(dinFilePath)
             din.DinjsonConv('DINSearch_ListOfCompanies.json', orderNo, pullSeqNo);
      // }
      } catch (err) {
      console.log('din '+err)
      }

      const dinDetFilePath = path1 + orderNo + path2 +'/'+ 'DINSearch_NameAndDOBResults.json';
      try {
      console.log(dinDetFilePath)
         // if (!fs.statSync(osdFilePath)) {
      fs.statSync(dinDetFilePath)
            dinDet.DindetjsonConv('DINSearch_NameAndDOBResults.json', orderNo, pullSeqNo);
      // }
      } catch (err) {
      //console.log('dinDet '+err)

      }





      console.log('all Engine operations done');
      try {
          if(process.env.DOWNLOAD_REPO_PATH == "google") {
            uploadFunc.main(auth, orderNo, pullSeqNo, dataPullName, trailName);
          } else {
            s3UploadFunc.main(auth, orderNo, pullSeqNo, dataPullName, trailName);
          }

      } catch (err) {
          console.log('Upload failed');
          errorRecovery.errRecovery(orderNo, 2, err);
      }




      // Profile function
      function profileFunc(orig, rev) {
        console.log("In Profile Func")
          const profileFilePath = path1 + orderNo + path2 + "/" + 'ProfileInfo';
          console.log(profileFilePath)
          console.log(!fs.existsSync(profileFilePath))
          if (rev) {
              try {
                  if (!fs.existsSync(profileFilePath)) {
                      profile.itpConc('ProfileInfo.json', rev, orderNo, pullSeqNo,'Revised');
                  }
      else {
      	processing.updateProceFile(orderNo,12,0,'FailureJSONFileNotFound');
      }
              } catch (err) {
                  console.log('Profile.json not found');
      processing.updateProceFile(orderNo,12,0,'FailureJSONFileNotFound');

              }
          } else if (orig) {
              try {
                  if (!fs.existsSync(profileFilePath)) {
                      profile.itpConc('ProfileInfo.json', orig, orderNo, pullSeqNo,'Original');
                  }
      else {
      	processing.updateProceFile(orderNo,12,0,'FailureJSONFileNotFound');
      }
              } catch (err) {
                  console.log('Profile.json not found');
      processing.updateProceFile(orderNo,12,0,'FailureJSONFileNotFound');
              }
          }
      }




      // bank function
      function bankFunc(orig, rev) {
          if (rev) {
              //banks.conversion(rev, orderNo, pullSeqNo,'Revised');
      partDirLat.conversionDirPart(rev, orderNo, pullSeqNo,'Revised');
          } else if (orig) {
              //banks.conversion(orig, orderNo, pullSeqNo,'Original');
      partDirLat.conversionDirPart(orig, orderNo, pullSeqNo,'Original');
          }
      }

      // bankAllFunc
      function bankAllFunc(orig, rev) {
          if (rev) {
              bankAll.bankConversion(rev, orderNo, pullSeqNo,'Revised');
      } else if (orig) {
              bankAll.bankConversion(orig, orderNo, pullSeqNo,'Original');
          }
      }


	}

};
