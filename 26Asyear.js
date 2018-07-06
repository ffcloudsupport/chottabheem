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
---------------------------------------------------------------------------------------------*/

/** *** **************************************************************************************************************
Require node  module details
********************************************************************************************************************/
const fs = require('fs');
const path = require('path');
const te = require('./taxInc.js');


const uploadFunc = require('./uploadFunc.js');
// const sync = require('synchronize');
// sync(fs, 'readdir', 'stat', 'readFile', 'writeFile');

const path1 = './awsDownUpload/'; // root path for download and upload files
const path2 = '/downloadedFiles'; // downloaded files folder (contains files downloaded from Drive)
const path3 = '/uploadedfiles'; // Uploaded files ( contains all csv's etc...)

module.exports = {

    TextPart(orderNo, pullSeqNo, dataPullName) {
            // // console.log('Engine Started , the order no is: ', orderNo);
            let items1 = fs.readdirSync(path1 + orderNo + path2);
			//console.log(items1);
            var ASyears = [];
            let jsonData = '';
            let TextASyears = '';
                const data = fs.readFileSync('./ITAutomationConfig.json', 'UTF-8');
                if (data) {
                    jsonData = JSON.parse(data);
                    ASyears = jsonData.YearsToGenerateCSVOptions;
					TextASyears = jsonData.Form26LatestYear;
					let length = ASyears.length;
					const txtFiles1 = [];
					var initvaluesf = ASyears[0];
					var syear = '';

					for( var  y=1; y<ASyears.length ; y++){
						if(ASyears[y]>initvaluesf){
							initvaluesf = ASyears[y];
							//console.log(initvaluesf + '..........57');
						}
						syear = initvaluesf;
						for (let i = 0; i < items1.length; i++) {
							var endName = items1[i].slice(-8,-4);
							if (path.extname(items1[i]) == '.txt' && endName == syear ) {
									txtFiles1[y] = items1[i];

                            }
						}
						if(syear == TextASyears){
							te.TaxincParser(txtFiles1[y],syear,orderNo, pullSeqNo);
							//console.log(txtFiles1[y] + syear + ' file1dsfsd...................');
						}
					}


            }

        },

};
