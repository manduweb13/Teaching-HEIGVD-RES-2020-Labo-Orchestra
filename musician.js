/*
 * Il faut mettre dans ce fichier l'adresse et le port
 */
var protocol = require('./orchestra-protocol');

/*
 * We use a standard Node.js module to work with UDP
 */
var dgram = require('dgram');

/*
 * Let's create a datagram socket. We will use it to send our UDP datagrams 
 */
var s = dgram.createSocket('udp4');

var listInstruments={
	"piano": "ti-ta-ti",
	"trumpet": "pouet",
	"flute": "trulu",
	"violin": "gzi-gzi",
	"drum": "boum-boum"
};

/*
 * Let's define a javascript class for our musician. The constructor 
 * defines his instrument
 */
function Musician(instru) {

	this.instrument= listInstruments[instru];

	var payload = JSON.stringify(instrument[1]);

/*
	   * Finally, let's encapsulate the payload in a UDP datagram, which we publish on
	   * the multicast address. All subscribers to this address will receive the message.
	   */
		message = new Buffer(payload);
		s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
			console.log("Sending payload: " + payload + " via port " + s.address().port);
		});

	}

/*
	 * Let's take and send a measure every 500 ms
	 */
	setInterval(this.update.bind(this), 1000);

}

/*
 * Let's get the thermometer properties from the command line attributes
 * Some error handling wouln't hurt here...
 */
var instrument = process.argv[2];

/*
 * Let's create a new thermoter - the regular publication of measures will
 * be initiated within the constructor
 */
var t1 = new Musician(instrument);