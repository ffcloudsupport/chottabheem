
const FFSFDBFunc = require('./FFAutoSF.js');
const fs = require('fs');

//per year details
const Order   = 'Order__c';
//const orderExtcolName = 'External_id_for_Order__c';
const orderExtcolName = 'FF_Order__c'


module.exports = {

   SFUploadFunc(ffOrderNumber,no) {
	   var FFOrder = [];
	   //var ffOrderNumber = 'FF00000222'
	   var colName;
	   if(no==1){
		   colName = 'FF_Datapull_Completion__c';
	   }
	   else if(no==2){
		   colName = 'FFIT_Completion__c' ;
	   }
		 try {
				 var obj = {};			
				 obj[orderExtcolName] = ffOrderNumber;	
				 obj[colName] = Date.now()		 
				FFOrder.push(obj)
				FFSFDBFunc.SFUpdate(Order, orderExtcolName, FFOrder)
			}
		catch (e) {
			console.log(e);
		}
   }
}

		
		
	
			
		
	
		
		
	

	


	
		
		

				
				












