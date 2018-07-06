module.exports = {
	postcall: function () {
var amqp = require('amqplib/callback_api');
var winston = require('winston');
var papertrail = require('winston-papertrail');
var server = require ('./server.js');
require('dotenv').config();
var FF = require('./FFEngine.js');
var sale = require('./saleOfImm-conversion.js');
        //var sendq = sale.que;
 var sendq= FF.que || sale.que ;
 console.log('sending to a que :' , sendq);
const papertrailhost = process.env.Papertrail_URL || "logs4.papertrailapp.com";
const papertrailport = process.env.Papertrail_PORT || 45421;

const sendingurl = process.env.REC_URL1 || "amqp://qbgyxnjv:B3DC8N6VYS00fsfPMLhHvEgifXvjJFSC@sidewinder.rmq.cloudamqp.com/qbgyxnjv";

const sendingq = sendq

var winstonPapertrail = new winston.transports.Papertrail({
    host: papertrailhost,
    port: papertrailport
})
console.log('creossed winston');
winstonPapertrail.on('error', function (err) {
    if (err) {
        // error in s3 get Object
        console.log(err, err.stack); // an error occurred
    } else {
        console.log("papertrail logging started");
    }

});

var logger = new winston.Logger({
    transports: [winstonPapertrail]
});

console.log(sendingurl);
amqp.connect(sendingurl, function (err, conn) {
    console.log(err);
    console.log('amqp started');
    if (err) {
        console.log(err)
    }
    console.log('Point one is reached');
    conn.createChannel(function (err, ch) {
        console.log('Point 2 is reached');
	var serverjson = (server.data) ;
		console.log(serverjson);		
        var jsonObj = serverjson;			
        console.log(jsonObj);
                            var msg = JSON.stringify(jsonObj);    
              ch.sendToQueue(sendingq, new Buffer(msg));
                    
                    console.log('Point 4 is reached');
                    console.log(" Order successfully placed in [Q] %s", msg);
                    var logmsg = ("The order successfully placed in" + sendq + "[Q]" + msg);
                    logger.info(logmsg, function () {
                        //console.log("Login completed");
                    });
                });
		                setTimeout(function () {
                    conn.close();
                    // process.exit(0)
                 }, 10000);
            });
        }
    }
