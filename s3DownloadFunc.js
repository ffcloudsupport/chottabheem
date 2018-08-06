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
const AWS = require('aws-sdk');
const uuid = require('node-uuid');
const mkdirp = require('mkdirp');
const rmdir = require('rmdir');
// const path = require('path');
const read = require('./FFEngine.js');
const papertrail = require('./papertrails.js');
const processing = require('./processing1');
const errorRecovery = require('./errorRecoveryFunc.js');
const sync = require('synchronize'); // this is for fiber
// sync(fs, 'readdir', 'stat', 'readFile', 'writeFile')

const path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? 'googleDownUpload/' : "awsDownUpload/";;
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';
// const path4 = '/IT';

// Google drive permissions
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
// process.env.USERPROFILE) + '/.credentials/';
const TOKEN_DIR = './credentials/';
const TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';
AWS.config.loadFromPath('./AwsConfig.json');

module.exports = {

    //main(ffOrderNumber, PullSeqNo, dataPullName, trailName) {
		main(ordproc) {
			const ffOrderNumber = ordproc.FFOrderNo;
			var PullSeqNo     = ordproc.PullSeqNo;
			var dataPullName  = ordproc.Datapull;
			var trailName     = ordproc.TrialNumber;
			const bucketName = process.env.S3_BUCKET_NAME;
			//For Logging
      papertrail.paperTrailFuncSt(ffOrderNumber, PullSeqNo, dataPullName, trailName);
      let counthits = 0;
			let years = '';
			let destinationFolderId = '';
      let sourceFolderId = '';
			let searchableYrs = '';
        // to access the config years,sourceFolderId,DestinationfolderId from config.json
        const data = fs.readFileSync('./ITAutomationConfig.json', 'UTF-8');
        if (!data) {
            console.log('Error occured while reading ITAutomationconfig.json');
        } else {
            const jsonData = JSON.parse(data);
            years = jsonData.YearsToGenerateCSVOptions;
            for (let i = 0; i < years.length; i++) {
                searchableYrs = searchableYrs + 'name contains ' + "'" + years[i] + "'";
                if (i < years.length - 1) {
                    searchableYrs = searchableYrs + ' or ';
                }
            }
            // console.log(searchableYrs);
           destinationFolderId = "extract";
           sourceFolderId = "datapull/";
           removeLocDir();
            // createLocDir();
        }
        // TO remove  existing  locally created folders
        function removeLocDir() {
            if (!fs.existsSync(path1 + ffOrderNumber)) {
                console.log(path1 + ffOrderNumber + ' does not exist locally');
                createLocDir();
            } else {
                rmdir(path1 + ffOrderNumber, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(path1 + ffOrderNumber + ' path removed locally');
                        createLocDir();
                    }
                });
            }
        }

        function createLocDir() {
          const uploadPath = path1 + ffOrderNumber + path3;
          const downPath = path1 + ffOrderNumber + path2;
          if (!fs.existsSync(downPath)) {
            mkdirp(downPath, (err) => {
              if (err) {
								console.log("in error")
                  // errorRecovery.errRecovery(ffOrderNumber, 1, "Error occured while creating download path")
								console.log('Error occured while creating download Path ' + err);
              }
							else {
								if (!fs.existsSync(uploadPath)) {
									mkdirp(uploadPath, (err) => {
										if (err) {
											console.log('Error occured while creating Upload path' + err);
										} else {
											//processing.processResult(ffOrderNumber,'MA', PullSeqNo, dataPullName, trailName, years, (success) => {
											processing.processResult(ordproc, years, (success) => {
												if (success == true) {
													callAWS();
												}
											}, "s3");
										}
									});
								} else {
								//processing.processResult(ffOrderNumber, 'MA',PullSeqNo, dataPullName, trailName, years, (success) => {
									processing.processResult(ordproc, years, (success) => {
										if (success == true) {
											callAWS();
										}
									}, "s3");
								}
							}

            });
          }
        }

        function callAWS() {
						var s3 = new AWS.S3();
						delFile(s3)
        }

        //Rename old Orders in  google drive Folders if already exists
        try {
            function delFile(s3) {
                counthits++;
								const oldPrefix = "extract/"+ffOrderNumber
								const bucketParams = {Bucket: bucketName, Prefix: oldPrefix, MaxKeys: 1};

								s3.listObjects(bucketParams,function(err, data) {
									if (err) {
										errorRecovery.errRecovery(ffOrderNumber, 1, err)
									} else {
										const contentLength = data.Contents.length
										if (contentLength) {
											for (i = 0; i < contentLength; i++) {
												const newPrefix =  "extract/"+"Old"+ffOrderNumber
												const contentKey = data.Contents[i].Key
												var params = {
													Bucket: bucketName,
													CopySource: bucketName + '/' + contentKey,
													Key: contentKey.replace(oldPrefix, newPrefix)
												};
												s3.copyObject(params, function(copyErr, copyData){
													if (copyErr) {
														errorRecovery.errRecovery(ffOrderNumber, 1, copyErr)
													}
													else {
													//	console.log('Copied: ', params.Key);
														getFile(s3);
													}
												});
											}
										}
										else {
											getFile(s3)
										}
									}
								});
            }
        }
        catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err)
        }

				try {
					function getFile(s3) {
						//console.log("Inside s3 file ",s3);
						const orderFoldername = ffOrderNumber;
						const prefix = "datapull/"+ffOrderNumber+"/";
						console.log("Bucket :" , bucketName);
						console.log("prefix : " , prefix);
						const bucketParams = {Bucket: bucketName, Delimiter:"/", Prefix: prefix};
					//	console.log("bucketParams : " , bucketParams);
						s3.listObjects(bucketParams,function(err, data) {
							if (err) {
								//errorRecovery.errRecovery(ffOrderNumber, 1, err)
								console.log(err);

							} else {
								const contentLength = data.Contents.length
							//	console.log("contentLength",contentLength);
							//	console.log("data" , data);
								if(contentLength > 2) {
									errorRecovery.errRecovery(ffOrderNumber, 2, 'Error source folder contains more than one ordernumber folders');
								} else {
									const  callback = (destOrderFolderID) => {
										console.log("destinationfolderid :" , destinationFolderId);
										if (destOrderFolderID != null) {
											getFile1(s3, data.Prefix, destOrderFolderID, (success) => {
											//	console.log("success :" , success);
												if (success == true) {
													const uploadPath = path1 + ffOrderNumber + path3;
													console.log(uploadPath);
													if (!fs.existsSync(uploadPath)) {
														mkdirp(uploadPath, (err) => {
															if (err) {
																errorRecovery.errRecovery(ffOrderNumber, 1, 'Error occured while creating upload path');
															} else {
																console.log('call engine - 1 ' + counthits);
																sync.fiber(() => {
																		read.CallEngine(s3, ffOrderNumber, PullSeqNo, dataPullName, trailName);
																});
															}
														});
													} else {
															console.log('callengine-2  ' + counthits);
															sync.fiber(() => {
																	read.CallEngine(s3, ffOrderNumber, PullSeqNo, dataPullName, trailName);
															});
													}
												} else {
														errorRecovery.errRecovery(ffOrderNumber, 1, 'operation failed');
														console.log("operation failed");
												}
											});
										} else {
											errorRecovery.errRecovery(ffOrderNumber, 1, 'Error occured while creating the OrderNo folder in destination');
													console.log("Error occured while creating folder");
										}
									}
									CreateFolder(s3, orderFoldername, destinationFolderId, callback)
									console.log("Folder is creted");
								}
							}
						})
					}
				}
				catch(err) {
					 errorRecovery.errRecovery(ffOrderNumber, 1, err);
					 console.log(err)
				}

				try {
					function getFile1(s3, orderFolderId, destOrderFolderID1, callback = null) {
						const orderFolderId1 = orderFolderId; // Order Folder Id
						const pullSeqFolderName = PullSeqNo; // PullSeqNo
						const prefix = orderFolderId+pullSeqFolderName+"/";
						const bucketParams = {Bucket: bucketName, Delimiter:"/", Prefix: prefix};
					//	console.log("get file1 : " , bucketParams);
						s3.listObjects(bucketParams,function(err, data) {
							if (err) {
								errorRecovery.errRecovery(ffOrderNumber, 1, err)
							} else {
								const contentLength = data.Contents.length
								//console.log( "contentlengthgetfile1", contentLength);
								if(contentLength > 1) {
									errorRecovery.errRecovery(ffOrderNumber, 2, 'Error source folder contains more than one ordernumber folders');
								} else {
									CreateFolder(s3, 'IT', destOrderFolderID1, (destITFolderIda) => {
										if (destITFolderIda != null) {
											// to create a folder in destination
											// passing parameters are auth,PullSeqNo,destOrderFolderId ,(dest IT FolderId )
											CreateFolder(s3, trailName, destITFolderIda, (destITFolderId) => {
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

													getFile2(s3, data.Prefix, destOrderFolderID1, (success) => {
															if (success == true) {
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
							}
						});
					}
				}
				catch(err) {
					 errorRecovery.errRecovery(ffOrderNumber, 1, err);
				}

				try {
            function getFile2(s3, pullseqFolderId, destOrderFolderID2, callback) {
							const dataPullFolderName = dataPullName; // PullSeqNo
							const pullSeqFolderId1 = pullseqFolderId;  // PullSeqNo
							const prefix = pullSeqFolderId1+dataPullFolderName+"/";
							const bucketParams = {Bucket: bucketName, Delimiter:"/", Prefix: prefix};
			  counthits++;
					//console.log("listobjects get file 2 :" , bucketParams);
							s3.listObjects(bucketParams, function(err,data){
								if(err) {
									errorRecovery.errRecovery(ffOrderNumber, 1, err)
								} else {
									const contentLength = data.Contents.length
								//	console.log("get file 2 data;" , data);

								//	console.log("ctentonlength get file 2: " , contentLength);
									if(contentLength >= 0) {
										getFile2a(s3, data.Prefix, (success1) => {
											if (success1 == true) {
													return callback(true);
											} else {
													return callback(false);
											}
										});
									}else{
										console.log("unknown error occured while checking");
									}
								}
							});
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

				try {
            function getFile2a(s3, dataPullFolderId, callback) {
	            const dataPullFolderId1 = dataPullFolderId; // dataPullFolderId Id
	            const trailFolderName = trailName; // trailFolderName
							const prefix = dataPullFolderId1+trailFolderName+'/';
							const bucketParams = {Bucket: bucketName, Delimiter:"/", Prefix: prefix};
	            counthits++;
							s3.listObjects(bucketParams, function(err, data){
								if(err) {
									errorRecovery.errRecovery(ffOrderNumber, 1, error);
								} else {
									const contentLength = data.Contents.length
									if(contentLength > 0) {
										getJsonFiles(s3, data.Prefix, (success) => {
											if (success == true) {
												getFile3(s3, data.Prefix, (success1) => {
														if (success1 == true) {
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
										errorRecovery.errRecovery(ffOrderNumber, 2, 'Error trailNo folder does not exists in source path');
										// console.log("Error " + dataPullFolderName +" folder is not exists")
									}
								}
						});
          }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

				try {
            function getFile3(s3, trailNumFolderId, callback) {
							const trailNumFolderId1 = trailNumFolderId; // trailNum Folder Id
							const returnFiledFolderName = 'ReturnFiled'; // folder name
							counthits++;
							const prefix = trailNumFolderId1+returnFiledFolderName+'/';
							const bucketParams = {Bucket: bucketName, Delimiter:"/", Prefix: prefix};
              counthits++;
							s3.listObjects(bucketParams, function(err,data){
								if(err) {
									errorRecovery.errRecovery(ffOrderNumber, 1, err)
								} else {
									// console.log(data)
									//in s3 you can't have multiple sub-folder with same name
									const contentLength = data.Contents.length
									if(contentLength > 0) {
										getFile4(s3, data.Prefix, (success) => {
												if (success == true) {
														return callback(true);
												} else {
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
            function getFile4(s3, returnFiledFolderId, callback) {
							const returnFiledFolderId1 = returnFiledFolderId; // ReturnFiled Folder Id
							let i = 0;
							counthits++;
							const prefix = returnFiledFolderId1;
							const bucketParams = {Bucket: bucketName, Delimiter:"/", Prefix: prefix};
						//	console.log("getFile4 : " , bucketParams);
	            s3.listObjects(bucketParams, function(err,data){
								if(err) {
									errorRecovery.errRecovery(ffOrderNumber, 1, error);
	                return;
								} else {
								//	console.log("datavalue in get file 4 :" , data);
									//console.log(data.Contents.length , ": get file 4 data");
									if(data.Contents.length > 0) {
										const gdYears = data.CommonPrefixes;
										let k = 0;
										async.whilst(
												() => {
														return i <= years.length - 1;
												}, (innerCallback) => {
														let j = 0;
														while (j < gdYears.length) {
																var components=gdYears[j].Prefix.split('/');
																console.log(components)
																var name=components[components.length-2];
																if (years[i] == name) {

																	console.log(name);
																	getFile5(s3, gdYears[j].Prefix, name, (success) => {
																			if (success == true) {
																				k++;
																				if (k == years.length) {
																					return callback(true);
																				}
																			} else {
																				return callback(false);
																			}
																	});
																	break;
																} else if (j == gdYears.length - 1) {
																	k++;
																	//processing.updateProceFile(ffOrderNumber,20, years[i],'FailureMissingFolder');
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
											return callback(true);
									}
								}
							})
						}
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

				try {
            function getFile5(s3, yearId, yearName, callback) {
                const yearId1 = yearId; // year folder id
                const yearName1 = yearName;
                counthits++;
								const prefix = yearId1;
								const bucketParams = {Bucket: bucketName, Delimiter:"/", Prefix: prefix};
							//	console.log("get file 5 : " , bucketParams);
		            s3.listObjects(bucketParams, function(err,data){
									if (err) {
										errorRecovery.errRecovery(ffOrderNumber, 1, err);
									} else {
										const contentLength = data.Contents.length;
									//	console.log("get file 5 " , data );
									//	console.log("get file 5 " , contentLength) ;
										if(contentLength >= 0) {
											if(data.CommonPrefixes.length > 2){
												processing.updateProceFile(ffOrderNumber,20,yearName,'FailureOthers');
												return callback(true);
											} else {
												let i = 0;
												let y = 0;
												async.whilst(
														() => {
																return i <= data.CommonPrefixes.length - 1;
														}, (innerCallback) => {
																var components=data.CommonPrefixes[i].Prefix.split('/');
																var name=components[components.length-2];
                                console.log("name", name)
																// passing parameters are auth,org/reiv folder Id, org/reiv folder name, yearname ,
																getFile6(s3, data.Prefix, name, yearName1, (success) => {
																		if (success == true) {
																				y++;
																				if (y == data.CommonPrefixes.length ) {
																						//console.log('5');
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
										}else {
											console.log("Failed in accessing the Original folder");
										}
									}
								})
            }  
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

				try {
            function getFile6(s3, orgRevFolderId, orgRevFoldername, yearName2, callback) {
                const orgRevFolderId1 = orgRevFolderId;
                const orgRevFoldername1 = orgRevFoldername;
                const yearName3 = yearName2;
                counthits++;
								const prefix = orgRevFolderId1+orgRevFoldername1+"/";
								const bucketParams = {Bucket: bucketName, Delimiter:"/", Prefix: prefix};
								s3.listObjectsV2(bucketParams, function(err,data){
									if(err) {
										errorRecovery.errRecovery(ffOrderNumber, 1, error);
									 	return;
									} else {
										const commonPrefixes = data.CommonPrefixes;
									//	console.log("get file 6 :" , commonPrefixes);
									//	console.log("get file 6  : " , data);
										let result = []
										for(let i=0;i<commonPrefixes.length;i++){
											var components=commonPrefixes[i].Prefix.split('/');
											var name=components[components.length-2];
											console.log("ITR name :" , name);
											if(
												name.includes("ITR-1")
												|| name.includes("ITR-2")
												|| name.includes("ITR-2A")
												|| name.includes("ITR-4")
												|| name.includes("ITR-4s")
												|| name.includes("ITR-3")
											) {
												result.push({
													name: name,
													prefix: commonPrefixes[i].Prefix,
												})
											}
										}
									//	console.log( "get file 6" +result)
									//	console.log("get file 6 "+result.length);
										if(result.length > 0) {
											if(result.length > 1) {
												getFile7(s3, result[0].prefix, orgRevFoldername1, yearName3, (success) => {
													if (success == true) {
														return callback(true);
													} else {
														return callback(false);
													}
														 });
											} else {
												getFile7(s3, result[0].prefix, orgRevFoldername1, yearName3, (success) => {
	                          if (success == true) {
	                              return callback(true);
	                          } else {
	                              return callback(false);
	                          }
					               });
											}

										} else {
											processing.updateProceFile(ffOrderNumber,20,yearName2,'FailureMissingFolder');
			                return callback(true);
			              }
									}
								})
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

				try {
            function getFile7(s3, itrFolderId, orgRevFoldername2, yearName4, callback) {
                const itrFolderId1 = itrFolderId; // ITR folder ID
                counthits++;
								const prefix = itrFolderId1;
								const bucketParams = {Bucket: bucketName, Delimiter:"/", Prefix: prefix};
								s3.listObjects(bucketParams, function(err,data){
									if(err){
										errorRecovery.errRecovery(ffOrderNumber, 1, err);
										return;
									} else {
									//	console.log("get file 7 : " , data.Contents.length );
									//	console.log("get file 7  : " , data.CommonPrefixes);
										if(data.Contents.length >= 0) {
											if (data.CommonPrefixes.length > 1) {
												try {
												   String.prototype.splice = function (idx, rem, str) {
												       return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
												   };
													 const components = data.CommonPrefixes[0].Prefix.split("/")
													 const name = components[components.length - 2];
												   const dateOne1 = name.splice(4, 0, ',');
												   const dateOne2 = dateOne1.splice(7, 0, ',');
												   let dateOne = new Date(dateOne2);
												    console.log(dateOne)
												   var dateOneId =  data.CommonPrefixes[0].Prefix;

												   for (let i = 1; i < data.CommonPrefixes.length; ++i) {
															const components = data.CommonPrefixes[i].Prefix.split("/")
															const name = components[components.length - 2];
															const dateTwo1 = name.splice(4, 0, ',');
															const dateTwo2 = dateTwo1.splice(7, 0, ',');
															const dateTwo = new Date(dateTwo2);
															const dateTwoId = data.CommonPrefixes[i].Prefix;
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
												getFile8A(s3, dateOneId, orgRevFoldername2, yearName4, (success) => {
												   if (success == true) {
												       getpdffiles(s3, data.CommonPrefixes[0].Prefix,yearName4, (success1) => {
												           if (success1 == true) {
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
												getFile8A(s3, data.CommonPrefixes[0].Prefix, orgRevFoldername2, yearName4, (success) => {
												   if (success == true) {
												       getpdffiles(s3, data.CommonPrefixes[0].Prefix,yearName4, (success1) => {
												           if (success1 == true) {
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
	 						   			processing.updateProceFile(ffOrderNumber,20,yearName4,'FailureMissingFolder');
	                    return callback(true);
		                }
									}
								})
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

				try {
            function getFile8(s3, AkFolderId, orgRevFoldername3, yearName5, callback) {
                const AkFolderId1 = AkFolderId; // date folder id
								const prefix = AkFolderId1;
								const bucketParams = {Bucket: bucketName, Delimiter:"/", Prefix: prefix};
                counthits++;
								s3.listObjects(bucketParams, function(err,data){
									if(err) {
										return console.log('ERROR', error);
									} else {
										const contentLength = data.Contents.length;
										const XMLFiles = [];
										for(let i=0;i<contentLength;i++) {
											const components = data.Contents[i].Key.split("/");
											const fileName = components[components.length - 1];
											const fileNameSplit = fileName.split(".");
											const filePrefix = fileNameSplit[fileNameSplit.length - 1];
											if(filePrefix == "xml") {
												XMLFiles.push({
													name: fileName,
													key: data.Contents[i].Key
												})
											}
										}
										if (XMLFiles.length == 0) {
											 processing.updateProceFile(ffOrderNumber,20,yearName5,'FailureXMLFileNotFound');
											 return callback(true);
										} else if (XMLFiles.length > 1) {
												// console.log(" folder contain more then one XML file ")
												processing.updateProceFile(ffOrderNumber,20,yearName5,'FailureMultipleXMLFiles');
												return callback(true);
										} else {
												// passing parameters are auth,file Id, dest yearfolder id
												const xml = '.xml';
												getFile10(s3, XMLFiles[0].key, XMLFiles[0].name, xml, orgRevFoldername3, yearName5, (success) => {
														if (success == true) {
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

				//Ak no function
				// Work on  files function
		    try {
	            function getFile8A(s3, dateFolderId, orgRevFoldername3, yearName5, callback) {
	                const dateFolderId1 = dateFolderId; // date folder id
									const prefix = dateFolderId1;
									const bucketParams = {Bucket: bucketName, Delimiter: "/", Prefix: prefix};
	                counthits++;
									s3.listObjectsV2(bucketParams, function(err,data){
										if(err) {
											return console.log('ERROR', error);
										} else {
											if (data.CommonPrefixes.length == 0) {
							     		 		processing.updateProceFile(ffOrderNumber,20,yearName5,'FailureMissingFolder');
	                        return callback(true);
	                     	} else if (data.CommonPrefixes.length > 1) {
													const components = data.CommonPrefixes[0].Prefix.split("/")
													let one = components[components.length - 2];
													let folId =  data.CommonPrefixes[0].Prefix;
													//14th0618 Revisied folder have been fixed issue in undefined error ---Manoj
												for (let i=1;i<data.CommonPrefixes.length; i++){ 
														const components = data.CommonPrefixes[i].Prefix.split("/")
														let two = components[components.length - 2];
														if(one < two){
															one=two;
															folId=data.CommonPrefixes[i].Prefix;
														}
												}
												// passing parameters are auth,folder Id, dest yearfolder id
                        getFile8(s3, folId,  orgRevFoldername3, yearName5, (success) => {
                            if (success == true) {
                                return callback(true);
                            } else {
                                console.log('error occured');
                                return callback(false);
                            }
                        });

	                     } else {
                          // passing parameters are auth,folder Id, dest yearfolder id
                          getFile8(s3, data.CommonPrefixes[0].Prefix,  orgRevFoldername3, yearName5, (success) => {
                              if (success == true) {
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


				// json file download function
				try {
          function getFile9(s3, filePath, fileName, format, callback) {
            console.log(filePath)
            console.log(fileName)
              const downPath = path1 + ffOrderNumber + path2;
              const dest = fs.createWriteStream(downPath + '/' + fileName+"."+format, { mode : 0o755 }); // download folder path
              counthits++;
							var params = {Bucket: bucketName, Key: filePath};
							s3.getObject(params)
							.createReadStream()
              .on('end', () => {
                  return callback(true);
              }).on('error', (err) => {
                  errorRecovery.errRecovery(ffOrderNumber, 1, err);
              }).pipe(dest);
          }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }
				// xml file download function
        try {
            function getFile10(s3, filePath, filename, format, orgRevFoldername4, yearName6, callback) {
                const downPath = path1 + ffOrderNumber + path2;
                const dest = fs.createWriteStream(downPath + '/' + yearName6 + orgRevFoldername4+format, { mode : 0o755 }); // download folder path
                counthits++;
								var params = {Bucket: bucketName, Key: filePath};
								console.log(params)
								s3.getObject(params)
								.createReadStream()
	              .on('end', () => {
	                  return callback(true);
	              }).on('error', (err) => {
	                  errorRecovery.errRecovery(ffOrderNumber, 1, err);
	              }).pipe(dest);
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

		
				// Work on  pdf files function
        try {
            function getpdffiles(s3, dateFolderId,yearName, callback) {
                const dateFolderId1 = dateFolderId; // date folder id
                counthits++;
								const prefix = dateFolderId1;
								const bucketParams = {Bucket: bucketName, Prefix: prefix }
								s3.listObjects(bucketParams, function(error, data) {
									if(error) {
										errorRecovery.errRecovery(ffOrderNumber, 1, error);
										return;
									} else {
										const contentLength = data.Contents.length;
										const PDFFiles = [];
										for(let i=0;i<contentLength;i++) {
											const components = data.Contents[i].Key.split("/");
											const fileName = components[components.length - 1];
											const fileNameSplit = fileName.split(".");
											const filePrefix = fileNameSplit[fileNameSplit.length - 1];
											if(filePrefix == "pdf") {
												PDFFiles.push({
													name: fileName,
													key: data.Contents[i].Key
												})
											}
										}
										if (PDFFiles.length == 0) {
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
															//Commented copying pdf function to destination on  14thjune2018 updated on gitv1.0.1 --- Manoj
															/*
															PDFFiles.forEach((item) => {
																	moveToDest(s3, item.key, item.name, destId, (success) => {
																			// console.log('count running ' + count + success)
																			if (success == true) {
																					count++;
																					// console.log('count running below' + count);
																					if (count == PDFFiles.length) {
																							processing.updateProceFile(ffOrderNumber,21,yearName,'Success');
																							return callback(true);
																					}
																			} else {
																					return callback(false);
																			}
																	});
															});
														*/	
														return callback(true);
													});
											} catch (err) {
													errorRecovery.errRecovery(ffOrderNumber, 1, err);
											}
											
									}
								}
							})
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }
			//Commented copying pdf function to destination on  14thjune2018 updated on gitv1.0.1 --- Manoj
		// copy pdf function
		
		/*
        try {
            function moveToDest(s3, pdfFileId, pdfFilename, destId, callback) {
                const fileId = pdfFileId;
                const filename = pdfFilename;
                const folderId = destId;
                counthits++;
								const prefix = fileId;
								var params = {Bucket: bucketName, Key: folderId+"/"+filename, CopySource: "/"+bucketName + "/" +prefix};
								s3.copyObject(params, function(err, file) {
									if(err) {
										errorRecovery.errRecovery(ffOrderNumber, 1, err);
										return;
									} else {
										  return callback(true);
									}
								});
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
		}
		*/


				try {
            function getJsonFiles(s3, dataPullFolderId, callback) {
								counthits++;
                const dataPullFolderId1 = dataPullFolderId; // Datapull Folder Id
								const prefix = dataPullFolderId1;
								const bucketParams = {Bucket: bucketName, Delimiter:"/", Prefix: prefix};
								s3.listObjectsV2(bucketParams, function(error, data){
									if (error) {	
                    errorRecovery.errRecovery(dataPullFolderId1, 1, error);
					        } else {
										let results = [];
										for (var index in data.Contents) {
	                    var bucket = data.Contents[index];
	                    if(bucket.Size>0) {// check if file not empty
	                        var Key=bucket.Key;
	                        var components=bucket.Key.split('/');
	                        var name=components[components.length-1];
                         // console.log(name)
													if(
														name.includes("ProfileInfo")
														|| name.includes("OutstandingDemand")
													 	|| name.includes("DataPullSummary")
														|| name.includes("DINSearch_ListOfCompanies")
														|| name.includes("DINSearch_NameAndDOBResults")
														|| name.includes("DINSearch_VerifyDINPANMatch")
													 	|| name.includes("PANSearchResults")
														|| name.includes("-2009")
													  || name.includes("-2010")
														|| name.includes("-2011")
														|| name.includes("-2012")
														|| name.includes("-2013")
														|| name.includes("-2014")
														|| name.includes("-2015")
														|| name.includes("-2016")
														|| name.includes("-2017")
														|| name.includes("-2018")
														|| name.includes("-2019")
													)
	                        results.push({
	                            name: name.split(".")[0],
                              format: name.split(".")[1],
	                            prefix: bucket.Key,
	                        });
	                    }
	                	}
										if (results.length > 0) {
                      if (results.length > 16) {
                        processing.AppendFile(ffOrderNumber, 'Error  contains more than 7 json and 9 text files');
                      } else {
                        let i = 0;
                        results.forEach((item) => {
                            // passing parameters are auth,file Id
                          getFile9(s3, item.prefix, item.name, item.format, (success) => {
                              if (success == true) {
                                i++;
                                if (i == results.length) {
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
								})
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

				try {
          function createFile(downPath, destITFolderId1) {
            fs.writeFile(downPath + '/destID.txt', destITFolderId1, (err) => {
                if (err) {
                    // throw err;
                    errorRecovery.errRecovery(ffOrderNumber, 1, 'Error occured while creating the destID.txt');
                }
            });
          }
        } catch (err) {
          errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }

				try {
            function CreateFolder(s3, FolderName, ParentFolder, callback = null) {
              counthits++;
              const folderId = ParentFolder;
							var params = {Bucket: bucketName, Key: ParentFolder+"/"+FolderName+"/"};
						  s3.putObject(params, function(err, data) {
								if (err) {
									errorRecovery.errRecovery(ffOrderNumber, 1, err);
								} else {
									if(callback) {
										return callback(ParentFolder+"/"+FolderName);
									}
								}
						  });
            }
        } catch (err) {
            errorRecovery.errRecovery(ffOrderNumber, 1, err);
        }
    },
};
