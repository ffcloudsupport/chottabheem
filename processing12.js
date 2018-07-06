const fs = require('fs');
const path1 = './googleDownUpload';
const path2 = '/downloadedFiles';
const path3 = '/uploadedfiles';

module.exports = {
    processResult(ffOrderNumber, prodCode,pullSeqNo, dataPullName, trialNo, years,callback) {

		const path1 = './googleDownUpload/';
		const path3 = '/uploadedfiles';
		var sucFailStatus ="";
		var failStatus = "";
		var desPath ="/"+ffOrderNumber+"/IT/"+trialNo+"/";
		var formName ="";
		var count =0;
		var fileName = "";
		var FileType ="";
		var ITRResult = [];


    // Removed Config Years
		try{
			var postBack = ('{\n' + '\"Postback\": {\n' + '\t' +'\"FFOrderNo\": ' + '\"'  + ffOrderNumber + '\"' +"," + '\n'+'\t'+'\"FFProdCode\": ' + '\"'  + prodCode + '\"' +"," + '\n'+'\t' + '\"PullSeqNo\": ' + '\"'  + pullSeqNo + '\"' +"," +  '\n'+'\t' + '\"Datapull\": ' + '\"'  + dataPullName + '\"' +"," +  '\n'+'\t' +'\"TrialNumber\": ' + '\"'  + trialNo + '\"' +"," +  '\n'+'\t' +'\"Status\": ' +'\"'  + sucFailStatus + '\"' +"," + '\n'+'\t'+'\"GooglePath\": ' +'\"'  + sucFailStatus + '\"' +"," + '\n'+'\t'+'\"BorrowerName\": ' +'\"'  + sucFailStatus + '\"' +"," + '\n'+'\t'+'\"BorrowerEmailID\": ' +'\"'  + sucFailStatus + '\"' +"," + '\n'+'\t'+'\"BorrowerMobile\": ' +'\"'  + sucFailStatus + '\"'+ '\n'+'},\n' );
			var ITAutomationInfo = ('\"ITAutomationInfo\": {\n' + '\t' + '\"ProcessingResultJsonFileversion\": ' +'\"2.0\" '+","+'\n'+'\t'+'\"CONFIG_YEARS\": ' +'[' + years +']' + ","+'\n' +'\t'+'\"DestinationPath\": ' + '\"'  + desPath + '\"' +'\n'+'},\n');
			var test = postBack+ITAutomationInfo;
			for (let i = 0; i < years.length; i++){

				ITRResult[i] = (  '\"'  + years[i] + '\"' + ":" + '{\n' + '\t' + '\"ITReturnProcessingOptions\": '+'['  + '\n'+'\t'+'\t'+'\"FailureMissingFolder\" '+"," +'\n'+'\t'+'\t' + '\"FailureXMLFileNotFound\" '+","+ '\n'+'\t'+'\t'+'\"FailureXMLFileReadError\" '+","+'\n'+'\t'+'\t'+'\"FailureImproperXML\" '+","+ '\n'+'\t' +'\t'+'\"FailureMultipleXMLFiles\" '+"," + '\n'+'\t' +'\t'+'\"FailureOthers\" '+","+ '\n'+'\t'+'\t' +'\"Success\" '+'\n'+'\t'+']' +"," + '\n'+'\t' +'\"ITReturnProcessingResult\": ' + '\"'  + sucFailStatus + '\"' +"," + '\n'+'\t' +'\"ITReturnCSVFileName\": ' + '\"'  + formName + '\"' +","+'\n' + '\t' +'\"OriginalITRFormName\": ' + '\"'  + sucFailStatus + '\"'+ "," + '\n'+ '\t' +'\"OriginalITRFilingDate\": ' + '\"'  + sucFailStatus + '\"'+"," + '\n'+'\t' +'\"RevisionCount\": ' + '\"'  + count + '\"'+"," + '\n'+'\t' +'\"LastRevisionITRFormName\": ' + '\"'  + fileName + '\"'+"," + '\n'+'\t' +'\"LastRevisionITRFilingDate\": ' + '\"'  + fileName + '\"'+"," + '\n'+'\t' +'\"PDFFileProcessingOptions\": '+'['+'\n'+'\t'+'\t'+ '\"FailurePDFFileNotFound\" '+","+ '\n'+'\t'+'\t'+'\"FailureRenamingError\" '+","+'\n'+'\t'+'\t'+'\"FailureOthers\" '+","+ '\n'+'\t'+'\t' +'\"Success\" '+'\n'+'\t'+']' +"," + '\n'+'\t'+'\"PDFFileProcessingResult\": ' + '\"'  + sucFailStatus + '\"'+"," + '\n'+'\t'+'\"ExtraInfo\": ' + '['  + fileName + ']'+'\n'+'},\n');
			}
			for(let i = 0; i < years.length; i++){

				test = test+ITRResult[i];
			}
			var BankResult = ('\"BankDetails\": {\n' +'\t' + '\"BankDetailsProcessingOptions\": '+'[' +'\n'+'\t'+'\t' + '\"FailureXMLFileNotFound\" '+","+ '\n'+'\t'+'\t'+'\"FailureXMLFileReadError\" '+","+'\n'+'\t'+'\t'+'\"FailureImproperXML\" '+","+ '\n'+'\t'+'\t' +'\"FailureMultipleXMLFiles\" '+"," + '\n'+'\t' +'\t'+'\"FailureOthers\" '+","+ '\n'+'\t'+'\t' +'\"Success\" '+'\n'+'\t'+']' +"," + '\n'+'\t' +'\"BankDetailsProcessingResult\": ' + '\"'  + failStatus + '\"' + "," +  '\n' + '\t' +'\"LatestYear\": ' + '\"' + '\"' + "," + '\n'+ '\t' +'\"FormType\": ' + '\"'  + formName + '\"' + "," + '\n'+ '\t' +'\"FileType\": ' + '\"'  + FileType + '\"' + ","+ '\n'+ '\t' +'\"CSVFileName\": ' + '\"'  + fileName + '\"' + '\n'+'},\n');
			var ITprofile = ('\"ITprofile\": {\n' +'\t' + '\"ITProfileProcessingOptions\": '+'[' +'\n'+'\t'+'\t' + '\"FailureJSONFileNotFound\" '+","+ '\n'+'\t'+'\t'+'\"FailureJSONFileReadError\" '+","+'\n'+'\t'+'\t'+'\"FailureImproperJSON\" '+","+ '\n'+'\t' +'\t'+'\"FailureMultipleJSONFiles\" '+"," + '\n'+'\t'+'\t' +'\"FailureOthers\" '+","+ '\n'+'\t'+'\t' +'\"Success\" '+","+ '\n'+'\t'+'\t' +'\"FailureLastITReturnXMLFileMissing\" '+'\n'+'\t'+']' +"," + '\n'+'\t'  +'\"ITprofileProcessingResult\": ' + '\"'  + failStatus + '\"' + "," +  '\n' +'\t' + '\"LatestYear\": ' + '\"'   + '\"' + "," + '\n'+ '\t' +'\"FormType\": ' + '\"'  + formName + '\"' + "," + '\n'+ '\t' +'\"FileType\": ' + '\"'  + FileType + '\"' + ","+ '\n'+ '\t' +'\"CSVFileName\": ' + '\"'  + fileName + '\"' + '\n'+'},\n');
			var OutStand = ('\"OutstandingTaxDemand\": {\n' +'\t' +'\"OutstandingTaxDemandProcessingOptions\": '+'['+'\n'+'\t'+'\t'  + '\"FailureJSONFileNotFound\" '+","+ '\n'+'\t'+'\t'+'\"FailureJSONFileReadError\" '+","+'\n'+'\t'+'\t'+'\"FailureImproperJSON\" '+","+ '\n'+'\t'+'\t' +'\"FailureMultipleJSONFiles\" '+"," + '\n'+'\t'+'\t' +'\"FailureOthers\" '+","+ '\n'+'\t'+'\t' +'\"Success\"'+'\n'+'\t'+']' +"," + '\n'+'\t'   +'\"OutstandingTaxDemandProcessingResult\": ' + '\"'  + failStatus + '\"' + "," +  '\n' + '\t' +'\"CSVFileName\": ' + '\"'  + fileName + '\"'  +'\n'+'}\n'+'}\n');

			test = test+BankResult+ITprofile+OutStand;
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
		if(no==1 || no == 2 || no==3 || no==4 || no==5 || no==6 || no==7 || no==8 || no==17 || no==20 || no==21 || no==22 ){
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
			//if both files are not exists //
			 case 1:
				ITReturnProcessingResultMsg = 'Failure-both files are not exists';

			 break;
			//if original not exists
			case 2:
				ITReturnProcessingResultMsg = 'Failure-Original file is not exists';

			break;
			//if Revised not exists
			case 3:

			break;
			case 4:
				ITReturnProcessingResultMsg = 'Failure-Error occured while creating CSV';
			break;
			case 5:
				ITReturnProcessingResultMsg = 'Failure-Unclosed Xml tags or tagname is missing or file corrupted';


			break;
			case 6:
				ITReturnProcessingResultMsg = 'Failure-Unclosed Xml tags or tagname is missing or file corrupted';

			break;
			case 7:
				ITReturnProcessingResultMsg = 'Success';
				OriginalITRFormNameMsg = Msg2;
				CSVFileNameMsg = Msg1;
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

				BankDetailsProcessingResultMsg = 'Failure';
			}

			content.BankDetails.BankDetailsProcessingResult = BankDetailsProcessingResultMsg;
			content.BankDetails.LatestYear = LatestYearMsg;
			content.BankDetails.FormType = FormTypeMsg;
			content.BankDetails.FileType = FileTypeMsg;
			content.BankDetails.CSVFileName = CSVFileNameMsg;
		}
		if(no==11 || no==12 ){
			let ITProfileProcessingResultMsg = content.ITprofile.ITprofileProcessingResult;
			let LatestYearMsg = content.ITprofile.LatestYear;
			let FormTypeMsg = content.ITprofile.FormType;
			let FileTypeMsg = content.ITprofile.FileType;
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

			content.ITprofile.ITprofileProcessingResult = ITProfileProcessingResultMsg;
			content.ITprofile.LatestYear = LatestYearMsg;
			content.ITprofile.FormType = FormTypeMsg;
			content.ITprofile.FileType = FileTypeMsg;
			content.ITprofile.CSVFileName = CSVFileNameMsg;


		}
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

			if(no==25 || no==26 || no==27 || no==28){

			let yearstaMsg ;
			let BankResultMsg = content.ProcessingFileResult.BankResult;
			let OtdResultMsg = content.ProcessingFileResult.OtdResult;
			let ProfileResultMsg = content.ProcessingFileResult.ProfileResult;
			if(no==25){

				yearstaMsg = Msg1;
			}
			if(no==26){
				BankResultMsg = Msg1;
			}
			if(no==27){
				OtdResultMsg = Msg1;
			}
			if(no==28){
				ProfileResultMsg = Msg1;
			}
			if(no==25){
			content.ProcessingFileResult[Year] = yearstaMsg
			}
			content.ProcessingFileResult.BankResult = BankResultMsg
			content.ProcessingFileResult.OtdResult = OtdResultMsg
		    content.ProcessingFileResult.ProfileResult = ProfileResultMsg
		}


		fs.writeFileSync(path1 + ffOrderNumber + path3 + '/' + ffOrderNumber + 'ProcessingResult.json',  JSON.stringify(content, null, 2));

    },

}
