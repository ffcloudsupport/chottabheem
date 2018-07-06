const fs = require('fs');
const path1 = 'awsDownUpload/';
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';

module.exports = {
    //processResult(ffOrderNumber, prodCode,pullSeqNo, dataPullName, trialNo, years,callback) {
		processResult(ordproc, years,callback) {
		var ffOrderNumber = ordproc.FFOrderNo;
		let path1 = process.env.DOWNLOAD_REPO_PATH == "google" ? './googleDownUpload/' : "./awsDownUpload/";
		const path3 = '/uploadedfiles';
		var sucFailStatus ="";
		var failStatus = "";
		var desPath ="/"+ffOrderNumber+"/IT/"+ordproc.TrialNumber+"/";
		var formName ="";
		var count =0;
		var fileName = "";
		var FileType ="";
		var ITRResult = [];
		var passKey ="";


    // Removed Config Years
		try{
			var postBack = ('{\n' + '\"Postback\": {\n' + '\t' +'\"FFOrderNo\": ' + '\"'  + ffOrderNumber + '\"' +"," + '\n'+'\t'+'\"FFProdCode\": ' + '\"'  + ordproc.FFProdCode + '\"' +"," + '\n'+'\t' + '\"PullSeqNo\": ' + '\"'  + ordproc.PullSeqNo + '\"' +"," +  '\n'+'\t' + '\"Datapull\": ' + '\"'  + ordproc.Datapull + '\"' +"," +  '\n'+'\t' +'\"TrialNumber\": ' + '\"'  + ordproc.TrialNumber + '\"' +"," +  '\n'+'\t' +'\"Status\": ' +'\"'  + ordproc.Status + '\"' +"," + '\n'+'\t'+'\"GooglePath\": ' +'\"'  + ordproc.GooglePath + '\"' +"," + '\n'+'\t'+'\"BorrowerName\": ' +'\"'  + ordproc.BorrowerName + '\"' +"," + '\n'+'\t'+'\"BorrowerEmailID\": ' +'\"'  + ordproc.BorrowerEmailID + '\"' +"," + '\n'+'\t'+'\"BorrowerMobile\": ' +'\"'  + ordproc.BorrowerMobile + '\"'+ '\n'+'},\n' );
			var ITAutomationInfo = ('\"ITAutomationInfo\": {\n' + '\t' + '\"ProcessingResultJsonFileversion\": ' +'\"2.0\" '+","+'\n'+'\t'+'\"CONFIG_YEARS\": ' +'[' + years +']' + ","+'\n' +'\t'+'\"DestinationPath\": ' + '\"'  + desPath + '\"' +'\n'+'},\n');
			var test = postBack+ITAutomationInfo;
			for (let i = 0; i < years.length; i++){

				ITRResult[i] = (  '\"'  + years[i] + '\"' + ":" + '{\n' + '\t' + '\"ITReturnProcessingOptions\": '+'['  + '\n'+'\t'+'\t'+'\"FailureMissingFolder\" '+"," +'\n'+'\t'+'\t' + '\"FailureXMLFileNotFound\" '+","+ '\n'+'\t'+'\t'+'\"FailureXMLFileReadError\" '+","+'\n'+'\t'+'\t'+'\"FailureImproperXML\" '+","+ '\n'+'\t' +'\t'+'\"FailureMultipleXMLFiles\" '+"," + '\n'+'\t' +'\t'+'\"FailureOthers\" '+","+ '\n'+'\t'+'\t' +'\"Success\" '+'\n'+'\t'+']' +"," + '\n'+'\t' +'\"ITReturnProcessingResult\": ' + '\"'  + sucFailStatus + '\"' +"," + '\n'+'\t' +'\"ITReturnCSVFileName\": ' + '\"'  + formName + '\"' +","+'\n' + '\t' +'\"OriginalITRFormName\": ' + '\"'  + sucFailStatus + '\"'+ "," + '\n'+ '\t' +'\"OriginalITRFilingDate\": ' + '\"'  + sucFailStatus + '\"'+"," + '\n'+'\t' +'\"RevisionCount\": ' + '\"'  + count + '\"'+"," + '\n'+'\t' +'\"LastRevisionITRFormName\": ' + '\"'  + fileName + '\"'+"," + '\n'+'\t' +'\"LastRevisionITRFilingDate\": ' + '\"'  + fileName + '\"'+"," + '\n'+'\t' +'\"PDFFileProcessingOptions\": '+'['+'\n'+'\t'+'\t'+ '\"FailurePDFFileNotFound\" '+","+ '\n'+'\t'+'\t'+'\"FailureRenamingError\" '+","+'\n'+'\t'+'\t'+'\"FailureOthers\" '+","+ '\n'+'\t'+'\t' +'\"Success\" '+'\n'+'\t'+']' +"," + '\n'+'\t'+'\"PDFFileProcessingResult\": ' + '\"'  + sucFailStatus + '\"'+"," + '\n'+'\t'+'\"ExtraInfo\": ' + '['  + fileName + ']'+'\n'+'},\n');
			}
			for(let i = 0; i < years.length; i++){

				test = test+ITRResult[i];
			}
			var BankResult = ('\"BankDetails\": {\n' +'\t' + '\"BankDetailsProcessingOptions\": '+'[' +'\n'+'\t'+'\t' + '\"FailureXMLFileNotFound\" '+","+ '\n'+'\t'+'\t'+'\"FailureXMLFileReadError\" '+","+'\n'+'\t'+'\t'+'\"FailureImproperXML\" '+","+ '\n'+'\t'+'\t' +'\"FailureMultipleXMLFiles\" '+"," + '\n'+'\t' +'\t'+'\"FailureOthers\" '+","+ '\n'+'\t'+'\t' +'\"Success\" '+'\n'+'\t'+']' +"," + '\n'+'\t' +'\"BankDetailsProcessingResult\": ' + '\"'  + failStatus + '\"' + "," +  '\n' + '\t' +'\"LatestYear\": ' + '\"' + '\"' + "," + '\n'+ '\t' +'\"FormType\": ' + '\"'  + formName + '\"' + "," + '\n'+ '\t' +'\"FileType\": ' + '\"'  + FileType + '\"' + ","+ '\n'+ '\t' +'\"CSVFileName\": ' + '\"'  + fileName + '\"' + '\n'+'},\n');
			var ITprofile = ('\"ITprofile\": {\n' +'\t' + '\"ITProfileProcessingOptions\": '+'[' +'\n'+'\t'+'\t' + '\"FailureJSONFileNotFound\" '+","+ '\n'+'\t'+'\t'+'\"FailureJSONFileReadError\" '+","+'\n'+'\t'+'\t'+'\"FailureImproperJSON\" '+","+ '\n'+'\t' +'\t'+'\"FailureMultipleJSONFiles\" '+"," + '\n'+'\t'+'\t' +'\"FailureOthers\" '+","+ '\n'+'\t'+'\t' +'\"Success\" '+","+ '\n'+'\t'+'\t' +'\"FailureLastITReturnXMLFileMissing\" '+'\n'+'\t'+']' +"," + '\n'+'\t'  +'\"ITprofileProcessingResult\": ' + '\"'  + failStatus + '\"' + "," +  '\n' +'\t' + '\"LatestYear\": ' + '\"'   + '\"' + "," + '\n'+ '\t' +'\"FormType\": ' + '\"'  + formName + '\"' + "," + '\n'+ '\t' +'\"FileType\": ' + '\"'  + FileType + '\"' + ","+ '\n'+ '\t' +'\"ITRPassword\": ' + '\"'  + passKey + '\"' + ","+ '\n'+ '\t' +'\"CSVFileName\": ' + '\"'  + fileName + '\"' + '\n'+'},\n');
			var OutStand = ('\"OutstandingTaxDemand\": {\n' +'\t' +'\"OutstandingTaxDemandProcessingOptions\": '+'['+'\n'+'\t'+'\t'  + '\"FailureJSONFileNotFound\" '+","+ '\n'+'\t'+'\t'+'\"FailureJSONFileReadError\" '+","+'\n'+'\t'+'\t'+'\"FailureImproperJSON\" '+","+ '\n'+'\t'+'\t' +'\"FailureMultipleJSONFiles\" '+"," + '\n'+'\t'+'\t' +'\"FailureOthers\" '+","+ '\n'+'\t'+'\t' +'\"Success\"'+'\n'+'\t'+']' +"," + '\n'+'\t'  +'\"OutstandingTaxDemandProcessingResult\": ' + '\"'  + failStatus + '\"' + "," +  '\n' + '\t' +'\"CSVFileName\": ' + '\"'  + fileName + '\"'  +'\n'+'},\n');
			var dwnLdTimeStamp = ('\"DownloadCompletionTimestamp\": {\n' +'\t' +'\"DownloadCompletionTimestampUpdationOptions\": '+'['+'\n'+'\t'+'\t'  + '\"Success\" '+","+ '\n'+'\t'+'\t'+'\"LoginFailure\" '+","+'\n'+'\t'+'\t'+'\"UpdationFailure\" '+","+ '\n'+'\t'+'\t' +'\"UnknownFailure\" '+'\n'+'\t'+']' +"," + '\n'+'\t'  +'\"DownloadCompletionTimeStampUpdationStatus\": ' + '\"'  + failStatus + '\"' + '\n'+'}\n'+'}\n');
			var panDet = ('\"PanDetails\": {\n' +'\t' +'\"PanDetailsProcessingOptions\": '+'['+'\n'+'\t'+'\t'  + '\"FailureJSONFileNotFound\" '+","+ '\n'+'\t'+'\t'+'\"FailureJSONFileReadError\" '+","+'\n'+'\t'+'\t'+'\"FailureImproperJSON\" '+","+ '\n'+'\t'+'\t' +'\"FailureMultipleJSONFiles\" '+"," + '\n'+'\t'+'\t' +'\"FailureOthers\" '+","+ '\n'+'\t'+'\t' +'\"Success\"'+'\n'+'\t'+']' +"," + '\n'+'\t'  +'\"PanDetailsProcessingResult\": ' + '\"'  + failStatus + '\"' + "," +  '\n' + '\t' +'\"CSVFileName\": ' + '\"'  + fileName + '\"'  +'\n'+'},\n');
			test = test+BankResult+ITprofile+OutStand+panDet+dwnLdTimeStamp;
			fs.writeFileSync(path1 + ffOrderNumber + path3 + '/' + ffOrderNumber + 'ProcessingResult.json', test);
			return callback(true);
		}
		catch(err){
			console.log(err);
		}
	},

	// updateProceFile(ffOrderNumber,no, data,ExtFileName,csvfilName,forName,assyear,banCsvName,bankformname,profileName,latAssyear,otdFileName,revcount) {
     updateProceFile(ffOrderNumber,no, Year,Msg1,Msg2,Msg3) {
	   console.log(ffOrderNumber,no, Year,Msg1,Msg2,Msg3)

		var file_content = fs.readFileSync(path1 + ffOrderNumber + path3 + '/' + ffOrderNumber + 'ProcessingResult.json','utf8');
		var content = JSON.parse(file_content);
		//console.log(content)
		if(no==1 || no == 2 || no==3 || no==4 || no==5 || no==6 || no==7 || no==8 || no==17 || no==20 || no==21 || no==22 || no==100 ){
			let ITReturnProcessingResultMsg = content[Year].ITReturnProcessingResult;
			let CSVFileNameMsg              = content[Year].ITReturnCSVFileName;
			let OriginalITRFormNameMsg	    = content[Year].OriginalITRFormName;
			let OriginalITRFilingDateMsg    = content[Year].OriginalITRFilingDate;
			let RevisionCountMsg            = content[Year].RevisionCount;
			let LastRevisionITRFormNameMsg  = content[Year].LastRevisionITRFormName;
			let LastRevisionITRFilingDateMsg= content[Year].LastRevisionITRFilingDate;
			let PDFFileProcessingResultMsg  = content[Year].PDFFileProcessingResult;
			let ExtraInfoMsg                = content[Year].ExtraInfo;

			switch(no){
			//Original filing date
			 case 1:
				OriginalITRFilingDateMsg = Msg1;

			 break;
			//if original not exists
			case 2:
				ITReturnProcessingResultMsg = 'FailureXMLFileNotFound';

			break;
			//Rev filing date
			case 3:
				LastRevisionITRFilingDateMsg = Msg1;
			break;
			case 4:
				//ITReturnProcessingResultMsg = 'Failure-Error occured while creating CSV';
				ITReturnProcessingResultMsg = 'FailureOthers';
			break;
			case 5:
				//ITReturnProcessingResultMsg = 'Failure-Unclosed Xml tags or tagname is missing or file corrupted';
				ITReturnProcessingResultMsg = 'FailureImproperXML';

			break;
			case 6:
				//ITReturnProcessingResultMsg = 'Failure-Unclosed Xml tags or tagname is missing or file corrupted';
				ITReturnProcessingResultMsg = 'FailureXMLFileReadError';

			break;
			case 7:
				ITReturnProcessingResultMsg = 'Success';
				CSVFileNameMsg = Msg1;
				OriginalITRFormNameMsg = Msg2;
				LastRevisionITRFormNameMsg = Msg3;
			break;
			case 100:
				ITReturnProcessingResultMsg = 'Success';
				CSVFileNameMsg = Msg1;
				OriginalITRFormNameMsg = Msg2;

			break;
			case 8:
				ExtraInfoMsg =  Msg1;
			break;
			case 17:
				RevisionCountMsg = Msg1;
			break;
			case 20:
				ITReturnProcessingResultMsg = Msg1;
			break;
			case 21:
				PDFFileProcessingResultMsg = Msg1;
			break;
			case 22:
				OriginalFileMsg = Msg1;
			break;

			}
			content[Year].ITReturnProcessingResult = ITReturnProcessingResultMsg;
			content[Year].ITReturnCSVFileName 	   = CSVFileNameMsg;
			content[Year].OriginalITRFormName 	   = OriginalITRFormNameMsg;
			content[Year].OriginalITRFilingDate    = OriginalITRFilingDateMsg;
			content[Year].RevisionCount			   = RevisionCountMsg;
			content[Year].LastRevisionITRFormName  = LastRevisionITRFormNameMsg
			content[Year].LastRevisionITRFilingDate= LastRevisionITRFilingDateMsg;
			content[Year].PDFFileProcessingResult  = PDFFileProcessingResultMsg;
			content[Year].ExtraInfo 			   = ExtraInfoMsg;

		}
		//bank
		if(no==9 || no==10){
			let BankDetailsProcessingResultMsg = content.BankDetails.BankDetailsProcessingResult;
			let LatestYearMsg 				   = content.BankDetails.LatestYear;
			let FormTypeMsg                    = content.BankDetails.FormType;
			let FileTypeMsg                    = content.BankDetails.FileType;
			let CSVFileNameMsg                 = content.BankDetails.CSVFileName;


			if(no==9){
				BankDetailsProcessingResultMsg = 'Success';
				LatestYearMsg                  = Year;
				FormTypeMsg                    = Msg2;
				FileTypeMsg                    = Msg3;
				CSVFileNameMsg                 = Msg1;
			}
			if(no==10){

				BankDetailsProcessingResultMsg = Msg1;
			}

			content.BankDetails.BankDetailsProcessingResult = BankDetailsProcessingResultMsg;
			content.BankDetails.LatestYear = LatestYearMsg;
			content.BankDetails.FormType = FormTypeMsg;
			content.BankDetails.FileType = FileTypeMsg;
			content.BankDetails.CSVFileName = CSVFileNameMsg;
		}

		//Profile
		if(no==11 || no==12 || no ==101){
			let ITProfileProcessingResultMsg = content.ITprofile.ITprofileProcessingResult;
			let LatestYearMsg = content.ITprofile.LatestYear;
			let FormTypeMsg = content.ITprofile.FormType;
			let FileTypeMsg = content.ITprofile.FileType;
			let ITRPasswordMsg = content.ITprofile.ITRPassword;
			let CSVFileNameMsg = content.ITprofile.CSVFileName;

			if(no==11){

				ITProfileProcessingResultMsg = 'Success';
				LatestYearMsg = Year;
				FormTypeMsg = Msg2;
				FileTypeMsg = Msg3;
				CSVFileNameMsg = Msg1;
			}
			if(no==12){
				ITProfileProcessingResultMsg = Msg1;
			}
			if(no==101){
				ITRPasswordMsg = Msg1;
			}
			content.ITprofile.ITprofileProcessingResult = ITProfileProcessingResultMsg;
			content.ITprofile.LatestYear = LatestYearMsg;
			content.ITprofile.FormType = FormTypeMsg;
			content.ITprofile.FileType = FileTypeMsg;
			content.ITprofile.CSVFileName = CSVFileNameMsg;
			content.ITprofile.ITRPassword = ITRPasswordMsg;

		}
		//OTD
		if(no==13 || no==14 ){

			let OutstandingTaxDemandProcessingResultMsg = content.OutstandingTaxDemand.OutstandingTaxDemandProcessingResult;
			let CSVFileNameMsg = content.OutstandingTaxDemand.CSVFileName;
			if(no==13){
				OutstandingTaxDemandProcessingResultMsg = 'Success';
				CSVFileNameMsg = Msg1;
			}
			if(no==14){
				OutstandingTaxDemandProcessingResultMsg = Msg1;
			}
			content.OutstandingTaxDemand.OutstandingTaxDemandProcessingResult = OutstandingTaxDemandProcessingResultMsg;
			content.OutstandingTaxDemand.CSVFileName = CSVFileNameMsg;
		}

		if(no==102){

			 content.DownloadCompletionTimestamp.DownloadCompletionTimeStampUpdationStatus = Msg1;
		}
	// Pan Details
		if(no==25 || no==26){
			let PanDetailsProcessingResultMsg = content.PanDetails.PanDetailsProcessingResult;
			let CSVFileNameMsg = content.PanDetails.CSVFileName;
			if(no==25){
				PanDetailsProcessingResultMsg = 'Success';
				CSVFileNameMsg = Msg1;
			}
			if(no==26){
				PanDetailsProcessingResultMsg = Msg1;
			}
			content.PanDetails.PanDetailsProcessingResult = PanDetailsProcessingResultMsg;
			content.PanDetails.CSVFileName = CSVFileNameMsg;
		}


		fs.writeFileSync(path1 + ffOrderNumber + path3 + '/' + ffOrderNumber + 'ProcessingResult.json',  JSON.stringify(content, null, 2));

    },

}
