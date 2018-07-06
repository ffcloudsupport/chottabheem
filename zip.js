/* Source Code Header
Program Name	:	zip.js
Module Name		:
Description  	:	Adding all the output files into ZIP folder.

Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 03/07/2017
Created By		:	sekar
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		:	Revision Date:		Revised By		Details

---------------------------------------------------------------------------------------------*/
var fs = require('fs');
var zip = new require('node-zip')();
const path = require('path');

const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? 'googleDownUpload/' : "awsDownUpload/";
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';


 module.exports = {
	zipConv(orderNo, pullSeqNo) {
		try{
			var items = fs.readdirSync(path1 + orderNo + "/" +path3 );
		   console.log(items + '.....................................');

			for(i=0;i<items.length;i++){
				var files =[];
				var testf =[];
				files[i] = path1 + orderNo + "/" + path3 + items[i];
				//console.log(files[i]+ '...................................');
				zip.file(items[i], 'hello there');
				var data = zip.generate({base64:false,compression:'DEFLATE'});
				createZip(data);
				//fs.writeFileSync( orderNo +'.zip', data, 'binary')
				// var fileEx = ".zip";
					// const path = path1 + orderNo + path3 + '/' + orderNo + '_' + fileEx;
					// fs.writeFileSync(path,  data, 'binary');

				}
				function createZip(data){
					var fileEx = ".zip";
					const path = path1 + orderNo + path3 + '/' + orderNo + '_' + fileEx;
					fs.writeFileSync(path,  data, 'binary');
				}
			}
			catch(e){
				console.log( e +'no files');
			}

	}
};
