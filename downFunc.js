/* Source Code Header
Program Name	:	downFunc.js
Module Name		:
Description  	:	In this program we are downloading all the files from google drive,
					Moving pdf files into destination and creating the destination folders in google drive.
Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 05/08/2016
Created By		:	Raghu
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		:	Revision Date:		Revised By		Details
1.1		    		12th Aug 2016		Raghu			Modified for fixing logic issues
1.2				:	29th Aug 2016 		Raghu 			Added try and catch blocks in code
1.3				:	30th Aug 2016		Raghu
---------------------------------------------------------------------------------------------*/

// Google drive functions for download and upload

// var sync = require('sync');
const async = require('async');
const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const mkdirp = require('mkdirp');
const rmdir = require('rmdir');
// const path = require('path');
const read = require('./FFEngine.js');
const papertrail = require('./papertrails.js');
const processing = require('./processing1');
const errorRecovery = require('./errorRecoveryFunc.js');
const sync = require('synchronize'); // this is for fiber
// sync(fs, 'readdir', 'stat', 'readFile', 'writeFile')

const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? './googleDownUpload/' : "awsDownUpload/";
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';
// const path4 = '/IT';

// Google drive permissions
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
// process.env.USERPROFILE) + '/.credentials/';
const TOKEN_DIR = './credentials/';
const TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

module.exports = {

    //main(ffOrderNumber, PullSeqNo, dataPullName, trailName) {
		main(ordproc) {
			var ffOrderNumber = ordproc.FFOrderNo;
			var PullSeqNo     = ordproc.PullSeqNo;
			var dataPullName  = ordproc.Datapull;
			var trailName     = ordproc.TrialNumber;
        papertrail.paperTrailFuncSt(ffOrderNumber, PullSeqNo, dataPullName, trailName);
        let counthits = 0;
		let years = '';
		let destinationFolderId = '';
        let sourceFolderId = '';
		let SearchableYrs = '';
        // to access the config years,sourceFolderId,DestinationfolderId from config.json
        const data = fs.readFileSync('./ITAutomationConfig.json', 'UTF-8');
        if (!data) {
            console.log('Error occured while reading ITAutomationconfig.json');
        } else {
            const jsonData = JSON.parse(data);
            years = jsonData.YearsToGenerateCSVOptions;
            for (let i = 0; i < years.length; i++) {
                SearchableYrs = SearchableYrs + 'name contains ' + "'" + years[i] + "'";
                if (i < years.length - 1) {
                    SearchableYrs = SearchableYrs + ' or ';
                }
            }
            // console.log(SearchableYrs);
             destinationFolderId = jsonData.WorkingFolderID;
             sourceFolderId = jsonData.FromSourceFolderID;
             removeLocDir();
            // createLOcDir();
        }
        // TO remove  existing  locally created folders
        function removeLocDir() {
            if (!fs.existsSync(path1 + ffOrderNumber)) {
                console.log(path1 + ffOrderNumber + ' does not exist locally');
                createLOcDir();
            } else {
                rmdir(path1 + ffOrderNumber, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(path1 + ffOrderNumber + ' path removed locally');
                        createLOcDir();
                    }
                });
            }
        }

        function createLOcDir() {
            const uploadPath = path1 + ffOrderNumber + path3;
            const downPath = path1 + ffOrderNumber + path2;

            if (!fs.existsSync(downPath)) {
                mkdirp(downPath, (err) => {
                    if (err) {
                        // errorRecovery.errRecovery(ffOrderNumber, 1, "Error occured while creating download path")
                        console.log('Error occured while creating download Path ' + err);
                    }
					else{
						 if (!fs.existsSync(uploadPath)) {
								mkdirp(uploadPath, (err) => {
									if (err) {
										console.log('Error occured while creating Upload path' + err);
									} else {
										//processing.processResult(ffOrderNumber,'MA', PullSeqNo, dataPullName, trailName, years, (success) => {
											processing.processResult(ordproc, years, (success) => {
											if (success == true) {
												callGD();
											}
										});
									}
								});
							} else {
								//processing.processResult(ffOrderNumber, 'MA',PullSeqNo, dataPullName, trailName, years, (success) => {
									processing.processResult(ordproc, years, (success) => {
									if (success == true) {
										callGD();
									}
								});
							}
					}

                });
            }


        }

        function callGD() {
            fs.readFile('client_secret.json', (err, content) => {
                if (err) {
                    console.log('Error loading client secret file: ' + err);
                    return;
                }
                // Authorize a client with the loaded credentials, then call the
                // Drive API.
                // To call drive fromSource folder

                authorize(JSON.parse(content), delFile);
            });
        }

        /**
         * Create an OAuth2 client with the given credentials, and then execute the
         * given callback function.
         *
         * @param {Object} credentials The authorization client credentials.
         * @param {function} callback The callback to call with the authorized client.
         */
        function authorize(credentials, callback) {
            const clientSecret = credentials.installed.client_secret;
            const clientId = credentials.installed.client_id;
            const redirectUrl = credentials.installed.redirect_uris[0];
            const auth = new googleAuth();
            const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

            // Check if we have previously stored a token.
            fs.readFile(TOKEN_PATH, (err, token) => {
                if (err) {
                    getNewToken(oauth2Client, callback);
                } else {
                    oauth2Client.credentials = JSON.parse(token);
                    callback(oauth2Client);
                }
            });
        }

        /**
         * Get and store new token after prompting for user authorization, and then
         * execute the given callback with the authorized OAuth2 client.
         *
         * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
         * @param {getEventsCallback} callback The callback to call with the authorized
         *     client.
         */
        function getNewToken(oauth2Client, callback) {
            const authUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES,
            });
            console.log('Authorize this app by visiting this url: ', authUrl);
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            rl.question('Enter the code from that page here: ', (code) => {
                rl.close();
                oauth2Client.getToken(code, (err, token) => {
                    if (err) {
                        console.log('Error while trying to retrieve access token', err);
                        return;
                    }
                    oauth2Client.credentials = token;
                    storeToken(token);
                    callback(oauth2Client);
                });
            });
        }

        /**
         * Store token to disk be used in later program executions.
         *
         * @param {Object} token The token to store to disk.
         */
        function storeToken(token) {
            try {
                fs.mkdirSync(TOKEN_DIR);
                // mkdirp(TOKEN_DIR);
            } catch (err) {
                if (err.code != 'EEXIST') {
                    throw err;
                }
            }
            fs.writeFile(TOKEN_PATH, JSON.stringify(token));
            console.log('Token stored to ' + TOKEN_PATH);
        }

        /**
         * Lists the names and IDs of up to 10 files.
         *
         * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
         */

                //Rename old Orders in  google drive Folders if already exists
        try {
            function delFile(auth) {
                var service = google.drive('v3');
                counthits++;
                service.files.list({
                    auth: auth,
                    //fields: "nextPageToken, files(id, name)",
                    q: "'" + destinationFolderId + "'" + " in parents and trashed=false and name contains " + "'" + ffOrderNumber + "'", //quering the google drive with parameter
                }, function (error, response) {
                    if (error) {
                        //return console.log("ERROR", error);
                         errorRecovery.errRecovery(ffOrderNumber, 1, error)
                        //return callback(false);
                    }
                    else {
                        //console.log(response.files.length)
                        if (response.files.length > 0) {
                            for (i = 0; i < response.files.length; i++) {
                                var fileMetadata = {
                                    'name': 'Old' + ffOrderNumber
                                    //parents: [ folderId ]
                                };
                                service.files.update({
                                    auth: auth,
                                    resource: fileMetadata,
                                    fileId: response.files[i].id,
                                }, function (err) {
                                    if (err) {
                                        errorRecovery.errRecovery(ffOrderNumber, 1, err)
                                        // callback(false)
                                    }
                                    else {
                                        if (i == response.files.length) {
                                           getFile(auth);
                                        }
                                    }

                                });
                            }
                        }
                        else {
                            // console.log(ffOrderNumber + ' Not Exists in destination')
                            getFile(auth);
                        }
                    }
                })
            }
        }
        catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err)
        }

        // To filter orderNumber files/folders
        try {
            function getFile(auth) {
				console.log('getFile Started');
                const service = google.drive('v3');
                const orderFoldername = ffOrderNumber; // orderNumber
                counthits++;
                service.files.list({
                    auth,
                    q: "'" + sourceFolderId + "'" + ' in parents and trashed=false and name contains ' + "'" + orderFoldername + "'", //quering the google drive with parameter
                }, (error, response) => {
                    if (error) {
                        // return console.log("ERROR", error);
                        errorRecovery.errRecovery(ffOrderNumber, 1, error);
                    } else {
                        if (response.files.length > 0) {
                            // checking the folder length
                            if (response.files.length > 1) {
                                // console.log("Error source folder contains more than one "+orderFoldername+ " folders")
                                errorRecovery.errRecovery(ffOrderNumber, 2, 'Error source folder contains more than one ordernumber folders');
                            } else {
                                // to create a folder in destination
                                // passing parameters are auth,OderNumber,WorkingFolderId,(dest Order FolderId )
                                CreateFolder(auth, orderFoldername, destinationFolderId, (destOrderFolderID) => {
                                    if (destOrderFolderID != null) {
                                        // passing parameters are auth,orderfolderId,dest Order FolderId
                                        getFile1(auth, response.files[0].id, destOrderFolderID, (success) => {
                                            if (success == true) {
                                                console.log('operation completed');
                                                const uploadPath = path1 + ffOrderNumber + path3;
                                                if (!fs.existsSync(uploadPath)) {
                                                    mkdirp(uploadPath, (err) => {
                                                        if (err) {
                                                            // console.error(err)
                                                            errorRecovery.errRecovery(ffOrderNumber, 1, 'Error occured while creating upload path');
                                                        } else {
                                                            // creating processing result.json
                                                            // processing.processResult(ffOrderNumber,years);
                                                            console.log('call engine - 1 ' + counthits);
                                                            sync.fiber(() => {
                                                                read.CallEngine(auth, ffOrderNumber, PullSeqNo, dataPullName, trailName);
                                                            });
                                                        }
                                                    });
                                                } else {
                                                    // creating processing result.json
                                                    // processing.processResult(ffOrderNumber,years);
                                                    console.log('callengine-2  ' + counthits);
                                                    sync.fiber(() => {
                                                        read.CallEngine(auth, ffOrderNumber, PullSeqNo, dataPullName, trailName);
                                                    });
                                                }
                                            } else {
                                                // console.log("operation failed")
                                                errorRecovery.errRecovery(ffOrderNumber, 1, 'operation failed');
                                            }
                                        });
                                    } else {
                                        errorRecovery.errRecovery(ffOrderNumber, 1, 'Error occured while creating the OrderNo folder in destination');
                                        // console.log('Error occured while creating the '+orderFoldername+ ' folder in destination' + err)
                                    }
                                });
                            }
                        } else {
                            errorRecovery.errRecovery(ffOrderNumber, 2, 'Error OrderNo folder does not exist in source path');
                            // console.log("Error  "+orderFoldername+ " folder is not exists in source folder")
                        }
                    }
                });
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

        // TO filter PullSeqNo  files/folders
        try {
            function getFile1(auth, orderFolderId, destOrderFolderID1, callback) {
                const service = google.drive('v3');
                const orderFolderId1 = orderFolderId; // Order Folder Id
                const pullSeqFolderName = PullSeqNo; // PullSeqNo
                counthits++;
                service.files.list({
                    auth,
                    q: "'" + orderFolderId1 + "'" + ' in parents and trashed=false and name contains ' + "'" + pullSeqFolderName + "'", //quering the google drive with parameter
                }, (error, response) => {
                    if (error) {
                        // return console.log("ERROR", error);
                        errorRecovery.errRecovery(ffOrderNumber, 1, error);
                    } else {
                        if (response.files.length > 0) {
                            // checking the folder length
                            if (response.files.length > 1) {
                                errorRecovery.errRecovery(ffOrderNumber, 2, 'Error Order folder contains more than one pullSeqFolderName folders');
                                // console.log("Error Order folder contains more than one "+pullSeqFolderName+ " folders")
                            } else {
                                CreateFolder(auth, 'IT', destOrderFolderID1, (destITFolderIda) => {
                                    if (destITFolderIda != null) {
                                        // to create a folder in destination
                                        // passing parameters are auth,PullSeqNo,destOrderFolderId ,(dest IT FolderId )
                                        CreateFolder(auth, trailName, destITFolderIda, (destITFolderId) => {
                                            if (destITFolderId != null) {
                                                const downPath = path1 + ffOrderNumber + path2;
                                                if (!fs.existsSync(downPath)) {
                                                    mkdirp(downPath, (err) => {
                                                        if (err) {
                                                            errorRecovery.errRecovery(ffOrderNumber, 1, 'Error occured while creating download path');
                                                            // console.error(err)
                                                        } else {
                                                            // storing the destITFolderId in file
                                                            createFile(downPath, destITFolderId);
                                                        }
                                                    });
                                                } else {
                                                    createFile(downPath, destITFolderId);
                                                }
                                                // passing parameters are auth,pullSeq FolderId

                                                getFile2(auth, response.files[0].id, destOrderFolderID1, (success) => {
                                                    if (success == true) {
                                                        console.log('10');
                                                        return callback(true);
                                                    } else {
                                                        return callback(false);
                                                    }
                                                });
                                            } else {
                                                errorRecovery.errRecovery(ffOrderNumber, 1, 'Error occured while creating the TrailNo folder in destination');
                                                // console.log('Error occured while creating the IT folder in destination'  + err)
                                            }
                                        });
                                    }
                                });
                            }
                        } else {
                            errorRecovery.errRecovery(ffOrderNumber, 2, 'Error pullSeqFolderName folder does not exist in source path');
                            // console.log("Error  "+pullSeqFolderName+ " folder is not exists ")
                        }
                    }
                });
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

        // to create a File(destID)
        try {
            function createFile(downPath, destITFolderId1) {
                fs.writeFile(downPath + '/destID.txt', destITFolderId1, (err) => {
                    console.log(downPath);
                    if (err) {
                        // throw err;
                        errorRecovery.errRecovery(ffOrderNumber, 1, 'Error occured while creating the destID.txt');
                    }
                });
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }
        // to filter dataPullName folder/files
        try {
            function getFile2(auth, pullseqFolderId, destOrderFolderID2, callback) {
                const service = google.drive('v3');
                const pullSeqFolderId1 = pullseqFolderId; // pullseqFolderId
                const dataPullFolderName = dataPullName; // PullSeqNo

                counthits++;
                service.files.list({
                    auth,
                    q: "'" + pullSeqFolderId1 + "'" + ' in parents and trashed=false and name contains ' + "'" + dataPullFolderName + "'", //quering the google drive with parameter
                }, (error, response) => {
                    if (error) {
                        // return console.log("ERROR", error);
                        errorRecovery.errRecovery(ffOrderNumber, 1, error);
                    } else {
                        if (response.files.length > 0) {
                            // checking the folder length
                            if (response.files.length > 1) {
                                errorRecovery.errRecovery(ffOrderNumber, 2, 'Error Order folder contains more than one pullSeqFolderName folders');
                                // console.log("Error Order folder contains more than one "+pullSeqFolderName+ " folders")
                            } else {
                                // passing parameters are auth,DataPull folder Id

                                getFile2a(auth, response.files[0].id, (success1) => {
                                    if (success1 == true) {
                                        console.log('9');
                                        return callback(true);
                                    } else {
                                        return callback(false);
                                    }
                                });
                            }
                        } else {
                            errorRecovery.errRecovery(ffOrderNumber, 2, 'Error trailNumber folder does not exist in source path');
                            // console.log("Error  "+pullSeqFolderName+ " folder is not exists ")
                        }
                    }
                });
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

        // TO filter trailNumber files/folders
        try {
            function getFile2a(auth, dataPullFolderId, callback) {
                const service = google.drive('v3');
                const dataPullFolderId1 = dataPullFolderId; // dataPullFolderId Id
                const trailFolderName = trailName; // trailFolderName
                counthits++;
                service.files.list({
                    auth,
                    q: "'" + dataPullFolderId1 + "'" + ' in parents and trashed=false and name contains ' + "'" + trailFolderName + "'", //quering the google drive with parameter
                }, (error, response) => {
                    if (error) {
                        // return console.log("ERROR", error);
                        errorRecovery.errRecovery(ffOrderNumber, 1, error);
                    } else {
                        if (response.files.length > 0) {
                            // checking the folder length
                            if (response.files.length > 1) {
                                errorRecovery.errRecovery(ffOrderNumber, 2, 'Error Order folder contains more than one trailNo folders');
                                // console.log("Error  contains more than one "+dataPullFolderName+ " folders")
                            } else {
                                // passing parameters are auth,pullSeq FolderId
                                getjsonfiles(auth, response.files[0].id, (success) => {
                                    if (success == true) {

                                        getFile3(auth, response.files[0].id, (success1) => {
                                            if (success1 == true) {
                                                console.log('8');
                                                return callback(true);
                                            } else {
                                                return callback(false);
                                            }
                                        });
                                    } else {
                                        return callback(false);
                                    }
                                });
                            }
                        } else {
                            errorRecovery.errRecovery(ffOrderNumber, 2, 'Error trailNo folder does not exists in source path');
                            // console.log("Error " + dataPullFolderName +" folder is not exists")
                        }
                    }
                });
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

        // to get json files
        try {
            function getjsonfiles(auth, dataPullFolderId, callback) {
                const service = google.drive('v3');
                const dataPullFolderId1 = dataPullFolderId; // Datapull Folder Id
                counthits++;
                service.files.list({
                    auth,
                    fields: 'nextPageToken, files(id, name)',
				q: "'" + dataPullFolderId1 + "'" + " in parents and trashed=false  and  (name contains 'profileinfo' or name contains 'OutStandingDemand' or name contains 'DataPullSummary' or name contains 'DINSearch_ListOfCompanies' or name contains 'DINSearch_NameAndDOBResults' or name contains 'DINSearch_VerifyDINPANMatch' or name contains 'PANSearchResults' or name contains '-2009' or name contains '-2010' or name contains '-2011' or name contains '-2012' or name contains '-2013' or name contains '-2017' or name contains '-2016' or name contains '-2015' or name contains '-2014' or name contains '-2018') and (mimeType contains 'json' or mimeType contains 'text/plain')", //quering the google drive with parameter
                }, (error, response) => {
                    if (error) {
                        // return console.log("ERROR", error);
                        errorRecovery.errRecovery(ffOrderNumber, 1, error);
                    } else {
                        if (response.files.length > 0) {
                            // checking the folder length
                            if (response.files.length > 16) {
                                processing.AppendFile(ffOrderNumber, 'Error  contains more than 7 json and 9 text files');
                                // errorRecovery.errRecovery(ffOrderNumber,2,"Error  contains more than  3 files contain outstanding and profileinfo")
                                // console.log("Error  contains more than  3 files contain outstanding and profileinfo ")
                            } else {
                                let i = 0;
                                response.files.forEach((item) => {
                                    // passing parameters are auth,file Id
                                    getFile9(auth, item.id, item.name, '.json', (success) => {
                                        if (success == true) {
                                            i++;
                                            if (i == response.files.length) {
                                                console.log('1');
                                                return callback(true);
                                            }
                                        } else {
                                            return callback(false);
                                        }
                                    });
                                });
                            }
                        } else {
                             console.log("NO json files  are found")
                            //processing.AppendFile(ffOrderNumber, 'NO json files  are found');
                            return callback(true);
                        }
                    }
                });
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

        // TO filter ReturnFiled  files/folders
        try {
            function getFile3(auth, trailNumFolderId, callback) {
                const service = google.drive('v3');
                const trailNumFolderId1 = trailNumFolderId; // trailNum Folder Id
                const returnFiledFolderName = 'ReturnFiled'; // folder name
                counthits++;
                service.files.list({
                    auth,
                    q: "'" + trailNumFolderId1 + "'" + ' in parents and trashed=false and  name contains ' + "'" + returnFiledFolderName + "'", //quering the google drive with parameter
                }, (error, response) => {
                    if (error) {
                        // return console.log("ERROR", error);
                        errorRecovery.errRecovery(ffOrderNumber, 1, error);
                    } else {
                        if (response.files.length > 0) {
                            // checking the folder length
                            if (response.files.length > 1) {
                                // console.log("Error  contains more than one "+returnFiledFolderName+ " folders")
                                errorRecovery.errRecovery(ffOrderNumber,3,"Error Order folder contains more than one returnFiledFolder folders")
                               // processing.AppendFile(ffOrderNumber, 'Error Order folder contains more than one returnFiledFolderName folders');
                                return callback(true);
                            } else {
                                // passing parameters are auth,ReturnFiled folder Id
                                getFile4(auth, response.files[0].id, (success) => {
                                    if (success == true) {
                                        console.log('7');
                                        return callback(true);
                                    } else {
                                        return callback(false);
                                    }
                                });
                            }
                        } else {
                            // console.log("Error " +returnFiledFolderName +" folder is not exists")
                             errorRecovery.errRecovery(ffOrderNumber,3,'Error returnFiled folder is not exists in source folder')
                            //processing.AppendFile(ffOrderNumber, 'Error returnFiledFolderName folder is not exists in source folder');
                            return callback(true);
                        }
                    }
                });
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

        // To check years like 2015,2014,2013
        try {
            function getFile4(auth, returnFiledFolderId, callback) {
                const service = google.drive('v3');
                const returnFiledFolderId1 = returnFiledFolderId; // ReturnFiled Folder Id
                let i = 0;
                counthits++;

                service.files.list({
                    auth,
                    q: "'" + returnFiledFolderId1 + "'" + ' in parents and trashed=false and ' + '(' + SearchableYrs + ')', //quering the google drive with parameter
                }, (error, response) => {
                    if (error) {
                        // return console.log("ERROR", error);
                        errorRecovery.errRecovery(ffOrderNumber, 1, error);
                        return;
                    } else {
                        if (response.files.length > 0) {
                            const gdYears = response.files;
                            let k = 0;
                            async.whilst(
                                () => {
                                    return i <= years.length - 1;
                                }, (innerCallback) => {
                                    let j = 0;
                                    while (j < gdYears.length) {
                                        if (years[i] == gdYears[j].name) {
                                            getFile5(auth, gdYears[j].id, gdYears[j].name, (success) => {
                                                if (success == true) {
                                                    k++;
                                                    console.log(k, years.length);
                                                    if (k == years.length) {
                                                            return callback(true);
                                                    }
                                                } else {
                                                    return callback(false);
                                                }
                                            });
                                            break;
                                        } else if (j == gdYears.length - 1) {
                                            //console.log(years[i] + ' folder is not there in google drive');
                                            // processing.AppendFile(ffOrderNumber, years[i] + " folder is not there in google drive");
													k++;
													console.log(k, years.length);
													//processing.updateProceFile(ffOrderNumber,20, years[i],'Failure-year folder not exists');
                                                    processing.updateProceFile(ffOrderNumber,20, years[i],'FailureMissingFolder');
													if (k == years.length) {
                                                            return callback(true);
                                                    }

                                        }
                                        j++;
                                    }
                                    setTimeout(() => {
                                        i++;
                                        innerCallback();
                                    }, 2500);
                                });
                        } else {
                             errorRecovery.errRecovery(ffOrderNumber,3,'config years are not exists in source path')
                            // console.log("Error  years  folders are not exists")
                            // processing.AppendFile(ffOrderNumber, 'Error  years  folders are not exists');
                            return callback(true);
                        }
                    }
                });
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

        // TO filter Original and Revised  files/folders Original and Revised
        try {
            function getFile5(auth, yearId, yearName, callback) {
                const service = google.drive('v3');
                const yearId1 = yearId; // year folder id
                const yearName1 = yearName;
                counthits++;
                service.files.list({
                    auth,
                    q: "'" + yearId1 + "'" + " in parents and trashed=false and (name contains 'Original' or name contains 'Revised')", // quering the google drive with parameter
                }, (error, response) => {
                    if (error) {
                        errorRecovery.errRecovery(ffOrderNumber, 1, error);
                        // console.log("ERROR", error);
                        // return;
                    } else {
                        if (response.files.length > 0) {
                            if (response.files.length > 2) {
                                // console.log("Error more folders contain "+yearName1 + " year");
                                //processing.AppendFile(ffOrderNumber, 'Error more than 2 folders contain ' + yearName1 + ' year');
								//processing.updateProceFile(ffOrderNumber,20,yearName,'Failure-multiple Original and Revised foldes are exists');
                                processing.updateProceFile(ffOrderNumber,20,yearName,'FailureOthers');

								return callback(true);
                            } else {
                                let i = 0;
                                let y = 0;
                                // console.log(response.files)
                                async.whilst(
                                    () => {
                                        return i <= response.files.length - 1;
                                    }, (innerCallback) => {

                                        // passing parameters are auth,org/reiv folder Id, org/reiv folder name, yearname ,
                                        getFile6(auth, response.files[i].id, response.files[i].name, yearName1, (success) => {
                                            if (success == true) {
                                                y++;
                                                if (y == response.files.length) {
                                                    console.log('5');
                                                    return callback(true);
                                                }
                                            } else {
                                                return callback(false);
                                            }
                                        });
                                        setTimeout(() => {
                                            i++;
                                            innerCallback();
                                        }, 1500);
                                    });
                            }
                        } else {
                            // console.log("There is no Original and revised folders available in year"+ yearName1);
                            //processing.AppendFile(ffOrderNumber, 'There is no Original and revised folders available in year' + yearName1);
							//processing.updateProceFile(ffOrderNumber,20,yearName,'Failure-Original and Revised folder not exists');
							  processing.updateProceFile(ffOrderNumber,20,yearName,'FailureMissingFolder');
                            return callback(true);
                        }
                    }
                });
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

        // TO filter ITR  files/folders
        try {
            function getFile6(auth, orgRevFolderId, orgRevFoldername, yearName2, callback) {
                const service = google.drive('v3');
                const orgRevFolderId1 = orgRevFolderId;
                const orgRevFoldername1 = orgRevFoldername;
                const yearName3 = yearName2;
                counthits++;
                service.files.list({
                    auth,
                    q: "'" + orgRevFolderId1 + "'" + " in parents and trashed=false and (name contains 'ITR-1' or name contains 'ITR-2' or name contains 'ITR-2A' or name contains 'ITR-3' or name contains 'ITR-4' or name contains 'ITR-4S')" , //quering the google drive with parameter
                }, (error, response) => {
                    if (error) {
                        errorRecovery.errRecovery(ffOrderNumber, 1, error);
                        return;
                        // console.log("ERROR", error);
                    } else {
                        if (response.files.length > 0) {
                            // checking the folder length
                            if (response.files.length > 1) {
                                // console.log("Error  " +orgRevFoldername1+ " conrain more than one ITR form folders")
                                //processing.AppendFile(ffOrderNumber, 'Error  ' + orgRevFoldername1 + ' conrain more than one ITR form folders');
                                // processing.updateProceFile(ffOrderNumber,20,yearName2,'Failure-contains more than one ITR form folders');
								  processing.updateProceFile(ffOrderNumber,20,yearName2,'FailureOthers');
								return callback(true);
                            } else {
                                // passing parameters are auth,ITR folder Id, dest yearfolder id
                                getFile7(auth, response.files[0].id, orgRevFoldername1, yearName3, (success) => {
                                    if (success == true) {
                                        console.log('4');
                                        return callback(true);
                                    } else {
                                        return callback(false);
                                    }
                                });
                            }
                        } else {
                            // console.log("There is no ITR form for "+ yearName3 +" "+ orgRevFoldername1 +" in Google drive")
                            //processing.AppendFile(ffOrderNumber, 'There is no ITR form for ' + yearName3 + ' ' + orgRevFoldername1 + ' in Google drive');
							//processing.updateProceFile(ffOrderNumber,20,yearName2,'Failure-no ITR form folder');
							processing.updateProceFile(ffOrderNumber,20,yearName2,'FailureMissingFolder');
                            return callback(true);
                        }
                    }
                });
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

        // TO filter Date  files/folders
        try {
            function getFile7(auth, itrFolderId, orgRevFoldername2, yearName4, callback) {
                const service = google.drive('v3');
                const itrFolderId1 = itrFolderId; // ITR folder ID
                counthits++;
                service.files.list({
                    auth,
                    fields: 'nextPageToken, files(id, name)',
                        q: "'" + itrFolderId1 + "'" + ' in parents and trashed=false', //quering the google drive with parameter
                }, (error, response) => {
                    if (error) {
                        errorRecovery.errRecovery(ffOrderNumber, 1, error);
                        return;
                        // console.log("ERROR", error);
                    } else {
                        if (response.files.length > 0) {
                            // checking the folder length
                            if (response.files.length > 1) {
                                try {
                                    // console.log('multiple revisiond found')
                                    String.prototype.splice = function (idx, rem, str) {
                                        return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
                                    };
                                    // console.log(response.files[0].name);
                                    const dateOne1 = response.files[0].name.splice(4, 0, ',');
                                    // console.log(dateOne1)
                                    const dateOne2 = dateOne1.splice(7, 0, ',');
                                    // console.log(dateOne2)
                                    let dateOne = new Date(dateOne2);
                                    // console.log(dateOne)
                                    var dateOneId = response.files[0].id;

                                    for (let i = 1; i < response.files.length; ++i) {
                                        const dateTwo1 = response.files[i].name.splice(4, 0, ',');
                                        const dateTwo2 = dateTwo1.splice(7, 0, ',');
                                        const dateTwo = new Date(dateTwo2);
                                        const dateTwoId = response.files[i].id;
                                        if (dateOne < dateTwo) { /* Change < to > if you want to find smallest element*/
                                            dateOne = dateTwo;
                                            dateOneId = dateTwoId;
                                        }
                                    }
                                } catch (err) {
                                    console.log(err);
                                    return;
                                }
                                // console.log(dateOne+','+dateOneId)
                                getFile8A(auth, dateOneId, orgRevFoldername2, yearName4, (success) => {
                                    if (success == true) {
                                        getpdffiles(auth, response.files[0].id,yearName4, (success1) => {
                                            if (success1 == true) {
                                                console.log('3');
                                                return callback(true);
                                            } else {
                                                return callback(false);
                                            }
                                        });
                                    } else {
                                        return callback(false);
                                    }
                                });
                            } else {
                                // passing parameters are auth,date folder Id, dest yearfolder id
                                getFile8A(auth, response.files[0].id, orgRevFoldername2, yearName4, (success) => {
                                    if (success == true) {
                                        getpdffiles(auth, response.files[0].id,yearName4, (success1) => {
                                            if (success1 == true) {
                                                console.log('3');
                                                return callback(true);
                                            } else {
                                                // console.log('error occut')
                                                return callback(false);
                                            }
                                        });
                                    } else {
                                        return callback(false);
                                    }
                                });
                            }
                        } else {
                             //console.log("There is no date folder  in Google drive")
                           // processing.AppendFile(ffOrderNumber, 'There is no date folder  in Google drive');
						   processing.updateProceFile(ffOrderNumber,20,yearName4,'FailureMissingFolder');
                            return callback(true);
                        }
                    }
                });
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

        // Work on  pdf files function
        try {
            function getpdffiles(auth, dateFolderId,yearName, callback) {
                const service = google.drive('v3');
                const dateFolderId1 = dateFolderId; // date folder id
                counthits++;
                service.files.list({
                    auth,
                    fields: 'nextPageToken, files(id, name)',
                        q: "'" + dateFolderId1 + "'" + " in parents and trashed=false and mimeType contains 'PDF'", //quering the google drive with parameter
                }, (error, response) => {
                    if (error) {
                        errorRecovery.errRecovery(ffOrderNumber, 1, error);
                        return;
                        // console.log("ERROR", error);
                    } else {
                        if (response.files.length == 0) {
                            processing.updateProceFile(ffOrderNumber,21,yearName,'FailurePDFFileNotFound');
                            return callback(true);
                        } else {
                            const downPath = path1 + ffOrderNumber + path2;
                            try {
                                fs.readFile(downPath + '/destID.txt', 'utf8', (err, destinationID) => {
                                    if (err) {
                                        // throw err;
                                        errorRecovery.errRecovery(ffOrderNumber, 1, err);
                                        return;
                                    }
                                    const destId = destinationID; // destination folder id
                                    let count = 0;
                                    // console.log(count);
                                    response.files.forEach((item) => {
                                        moveToDest(auth, item.id, item.name, destId, (success) => {
                                            // console.log('count running ' + count + success)
                                            if (success == true) {
                                                count++;
                                                // console.log('count running below' + count);
                                                if (count == response.files.length) {
												processing.updateProceFile(ffOrderNumber,21,yearName,'Success');
                                                    return callback(true);
                                                }
                                            } else {
                                                return callback(false);
                                            }
                                        });
                                    });
                                });
                            } catch (err) {
                                errorRecovery.errRecovery(ffOrderNumber, 1, err);
                            }
                        }
                    }
                });
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

        // copy pdf function
        try {
            function moveToDest(auth, pdfFileId, pdfFilename, destId, callback) {
                const service = google.drive('v3');
                const fileId = pdfFileId;
                const filename = pdfFilename;
                const folderId = destId;
                counthits++;
                // Retrieve the existing parents
                service.files.get({
                    auth,
                    fileId,
                    fields: 'parents',
                }, (err, file) => {
                    if (err) {
                        // Handle error
                        // console.log(err);
                        errorRecovery.errRecovery(ffOrderNumber, 1, err);
                        return;
                    } else {
                        // Move the file to the new folder
                        const fileMetadata = {
                            // 'name' : filename
                            parents: [folderId],
                        };
                        service.files.copy({
                            auth,
                            resource: fileMetadata,
                                fileId,
                                fields: 'id, parents',
                        }, (err, file) => {
                            if (err) {
                                // Handle error
                                // console.log('error while copying pdf')
                                errorRecovery.errRecovery(ffOrderNumber, 1, err);
                                // return callback(false);
                                return;
                            } else {
                                // console.log('completed copying pdf')
                                return callback(true);
                                // File moved.
                            }
                        });
                    }
                });
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }


		//Ak no function
		 // Work on  files function
        try {
            function getFile8A(auth, dateFolderId, orgRevFoldername3, yearName5, callback) {
                const service = google.drive('v3');
                const dateFolderId1 = dateFolderId; // date folder id
                counthits++;
                service.files.list({
                    auth,
                    fields: 'nextPageToken, files(id, name)',
                        q: "'" + dateFolderId1 + "'" + " in parents and trashed=false and mimeType contains 'application/vnd.google-apps.folder'", //quering the google drive with parameter
                }, (error, response) => {
                    if (error) {
                        return console.log('ERROR', error);
                    } else {
						console.log(response.files)
                        if (response.files.length == 0) {
                            // console.log(" No XML files in folder ")
                           // processing.AppendFile(ffOrderNumber, 'No Ak no folder');
						     processing.updateProceFile(ffOrderNumber,20,yearName5,'FailureMissingFolder');
                            return callback(true);
                        } else if (response.files.length > 1) {
							console.log(response.files);
							let one = response.files[0].name;
							let folId = response.files[0].id;
							for (let i=1;i<response.files.length; i++){
								let two = response.files[i].name
								if(one < two){
									one=two;
									folId=response.files[i].id;
								}
							}
							// passing parameters are auth,folder Id, dest yearfolder id
                            getFile8(auth, folId,  orgRevFoldername3, yearName5, (success) => {
                                if (success == true) {
                                    console.log('2');
                                    return callback(true);
                                } else {
                                    console.log('error occured');
                                    return callback(false);
                                }
                            });

                        } else {
                            // passing parameters are auth,folder Id, dest yearfolder id
                            getFile8(auth, response.files[0].id,  orgRevFoldername3, yearName5, (success) => {
                                if (success == true) {
                                    console.log('2');
                                    return callback(true);
                                } else {
                                    console.log('error occured');
                                    return callback(false);
                                }
                            });
                        }
                    }
                });
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }




        // Work on  files function
        try {
            function getFile8(auth, AkFolderId, orgRevFoldername3, yearName5, callback) {
                const service = google.drive('v3');
                const AkFolderId1 = AkFolderId; // date folder id
                counthits++;
                service.files.list({
                    auth,
                    fields: 'nextPageToken, files(id, name)',
                        q: "'" + AkFolderId1 + "'" + " in parents and trashed=false and (mimeType='text/xml' or mimeType='application/xml')", //quering the google drive with parameter
                }, (error, response) => {
                    if (error) {
                        return console.log('ERROR', error);
                    } else {
                        if (response.files.length == 0) {
                            // console.log(" No XML files in folder ")
                           // processing.AppendFile(ffOrderNumber, 'No XML files in folder');
						    processing.updateProceFile(ffOrderNumber,20,yearName5,'FailureXMLFileNotFound');
                            return callback(true);
                        } else if (response.files.length > 1) {
							console.log(response.files);
                            // console.log(" folder contain more then one XML file ")
                             processing.updateProceFile(ffOrderNumber,20,yearName5,'FailureMultipleXMLFiles');
                            return callback(true);
                        } else {
                            // passing parameters are auth,file Id, dest yearfolder id
                            const xml = '.xml';
                            getFile10(auth, response.files[0].id, response.files[0].name, xml, orgRevFoldername3, yearName5, (success) => {
                                if (success == true) {
                                    console.log('2');
                                    return callback(true);
                                } else {
                                    console.log('error occured');
                                    return callback(false);
                                }
                            });
                        }
                    }
                });
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

        try {
            // json file download function
            function getFile9(auth, fileid, filename, format, callback) {
                const service = google.drive('v3');
                const downPath = path1 + ffOrderNumber + path2;
                const dest = fs.createWriteStream(downPath + '/' + filename); // download folder path
                counthits++;
                service.files.get({
                    auth,
                    fileId: fileid,
                        alt: 'media',
                }).on('end', () => {
                    console.log('common');
                    return callback(true);
                }).on('error', (err) => {
                    // console.log('Error during download', err);
                    // return callback(false);
                    errorRecovery.errRecovery(ffOrderNumber, 1, err);
                }).pipe(dest);
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

        // xml file download function
        try {
            function getFile10(auth, fileid, filename, format, orgRevFoldername4, yearName6, callback) {
                const service = google.drive('v3');
                const downPath = path1 + ffOrderNumber + path2;
                const dest = fs.createWriteStream(downPath + '/' + yearName6 + orgRevFoldername4 + format); // download folder path
                counthits++;
                service.files.get({
                    auth,
                    fileId: fileid,
                        alt: 'media',
                }).on('end', () => {
                    console.log('common');
                    return callback(true);
                }).on('error', (err) => {
                    errorRecovery.errRecovery(ffOrderNumber, 1, err);
                    // console.log('Error during download', err);
                    // return callback(false);
                }).pipe(dest);
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

        // common folder create function
        try {
            function CreateFolder(auth, FolderName, ParentFolder, callback) {
                counthits++;
                const service = google.drive('v3');
                const folderId = ParentFolder;
                const fileMetadata = {
                    name: FolderName,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [folderId],
                };
                service.files.create({
                    auth,
                    resource: fileMetadata,
                        // media: media,
                        fields: 'id',
                }, (err, file) => {
                    if (err) {
                        // Handle error
                        errorRecovery.errRecovery(ffOrderNumber, 1, err);
                        // return callback(null);
                        // console.log(err,null);
                    } else {
                        console.log('folder ' + FolderName + 'is created: ');
                        return callback(file.id);
                    }
                });
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }
    },
};
