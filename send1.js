var amqp = require('amqplib/callback_api');

var argv = require('yargs').argv;
if (!argv.q) {
	argv.q = 'sftobpintg';
}
if (!argv.ampq) {
	argv.ampq = '';
}
console.log('Target:', argv.q, argv.amqp);


amqp.connect(argv.amqp, function (err, conn) {
	console.log(conn)
	if (err) {
		console.log(err)
	}
	console.log('Point one is reached');
	conn.createChannel(function (err, ch) {
		console.log('Point 2 is reached');

			var jsonObj =  {
  "Status": "Success",
  "FFOrderNo": "BP-21Jul-002",
  "GooglePath": "BP-21Jul-002/1/IncTax/001",
  "S3BucketPath": "BP-21Jul-002/1/IncTax/001",
  "PullSeqNo": "1",
  "Datapull": "IncTax",
  "FFProdCode": "IT_SEM_INF_100",
  "TrialNumber": "001"
}
		var msg = JSON.stringify(jsonObj);
		// Note: on Node 6 Buffer.from(msg) should be used

		ch.sendToQueue(argv.q, new Buffer(msg));

		console.log('Point 4 is reached');
		console.log(" Order successfully placed in [Q] %s", msg);
	});

	setTimeout(function () { conn.close(); process.exit(0) }, 500);
 });
