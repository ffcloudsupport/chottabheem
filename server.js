
/* Source Code Header
Program Name	:	server.js
Module Name		:   Server
Description  	:	In this program we are inserting record in mongo and calling the downFunc.
                    This also listens for the datapull program to recieve datapull JSON for
                    order processing.

Company Name	:	ITSS Research and Consultancy Pvt. Ltd.
Address			: 	#458, 38th Cross, Rajajinagar, Bangalore-560010, Karnataka, India.
					Ph.(080)23423069, www.itssrc.com, E-mail: info@itssrc.com
Client Name 	:	FinFort
Initial Ver&Date:   1.0, 05/08/2016
Created By		:	Sekar Raj
---------------------------------------------------------------------------------------------
REVISION HISTORY
Version No		Revision Date		Revised By		Details
1.1				10 Sep 2016			Vinaya/Murali	Obtained from put instead of emit
---------------------------------------------------------------------------------------------*/

'use strict';

require('dotenv').config();
// All the libraries
require('events').EventEmitter.defaultMaxListeners = Infinity;
const express = require('express');
const bodyParser = require('body-parser');

//const socketIO = require('socket.io');
// const path = require('path');
const s3DownFunc = require('./s3DownloadFunc.js');
const downFunc = require('./downFunc.js');
const FFSFOrdrUpdate = require('./FFSFOrdrUpdate.js');
// grab the FFOrder model
const FFOrder = require('./models/ffschema');
//var nackdelay = process.env.ACKDELAY || 1500;
const FFDBFunc = require('./ffmongo.js');
var glob = require('./glob.js');
var recurl = process.env.REC_URL;
var recq = process.env.REC_Q;

const sync = require('synchronize');
//sync(downFunc);
const server = express()
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json());
const Remarks = ('Order has been created');

var amqp = require('amqplib/callback_api');
//var sackdelay = process.env.ACKDELAY || '1500';
//var nackdelay = process.env.ACKDELAY || 900000;
amqp.connect(recurl, function (err, conn) {
  console.log(conn)
    conn.createChannel(function (err, ch) {
        var q = recq;
        ch.assertQueue(q, {
            durable: true
        });
        ch.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function (OrderJson) {
            console.log(" [x] Received %s", OrderJson.content.toString());
            glob.ordstatus = 1;
            glob.gch = ch;
            glob.gorder = OrderJson;
            console.log('glob serverjs file ' + glob.ordstatus);
            const OrdProc = JSON.parse(OrderJson.content);
            exports.data = OrdProc ;
            console.log('This is stored into OrdProc: ' + JSON.stringify(OrdProc));
            console.log(OrdProc.FFOrderNo);
            FFDBFunc.fffindone(FFOrder, OrdProc.FFOrderNo, (err, ffordlist) => {
                if (err) {
                    return console.error(err);
                } else {
                    if (ffordlist != null) {
                        console.log('This is the data from ejs render: ' + ffordlist);
                        ffordlist.orderno = 'Old' + OrdProc.FFOrderNo;
                        FFDBFunc.ffupdate(FFOrder, ffordlist, OrdProc.FFOrderNo, (error, ffUpOut) => {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('The order has been successfully Renamed');
                                const newOrder = new FFOrder({
                                    orderno: OrdProc.FFOrderNo,
                                    pullno: OrdProc.PullSeqNo,
                                    pullname: OrdProc.Datapull,
                                    status: 'Created',
                                    remarks: Remarks,
                                });
                                FFDBFunc.ffsave(newOrder);
                                console.log('Order created');
                              //  FFSFOrdrUpdate.SFUploadFunc(OrdProc.FFOrderNo, 1)
                                if(process.env.DOWNLOAD_REPO_PATH=="google") {
                                  downFunc.main(OrdProc);
                                } else {
                                  s3DownFunc.main(OrdProc);
                                }

                            }
                        });
                    }
                    else {
                        const newOrder = new FFOrder({
                            orderno: OrdProc.FFOrderNo,
                            pullno: OrdProc.PullSeqNo,
                            pullname: OrdProc.Datapull,
                            status: 'Created',
                            remarks: Remarks,
                        });
                        FFDBFunc.ffsave(newOrder);
                        console.log('Order created', OrdProc.PullSeqNo);
                        if(process.env.DOWNLOAD_REPO_PATH=="google") {
                          downFunc.main(OrdProc);
                        } else {
                          s3DownFunc.main(OrdProc);
                        }
                    }
                }
            });
            /*
            setTimeout(function () {
                console.log(' glob timer fired   : ' + glob.ordstatus);
                console.log(" [x] Ack of Message - After Delay of " + nackdelay);
                // ch.ack(OrderJson);
            }, nackdelay);
            */
        }, {
                noAck: false
            });

    })
});
