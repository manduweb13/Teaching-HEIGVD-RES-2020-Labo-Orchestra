var protocol = require('./orchestra-protocol');
var dgram = require('dgram');
var moment = require('moment');

var net = require('net');

var tcpsrv = net.createServer();

var listSounds=new Map();
listSounds.set('ti-ta-ti', 'piano');
listSounds.set('pouet', 'trumpet');
listSounds.set('trulu', 'flute');
listSounds.set('gzi-gzi', 'violin');
listSounds.set('boum-boum', 'drum');

tcpsrv.listen(protocol.PROTOCOL_PORT_LISTENING_FOR_CLIENT);
console.log("Accepting HTTP requests on port ".concat(protocol.PROTOCOL_PORT_LISTENING_FOR_CLIENT));

tcpsrv.on('connection', function(socket){
	socket.write( getMusicians() );
	socket.end();
});

//Ajout au groupe multicast pour communication avec les musiciens
var s = dgram.createSocket('udp4');

s.bind(protocol.PROTOCOL_PORT_LISTENING_FOR_MUSICIANS, function() {
  console.log("Joining multicast group ".concat(protocol.PROTOCOL_MULTICAST_ADDRESS));
  s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

var musicians = new Map();
//Retourne les musiciens actifs
function getMusicians() {

	var array = [];

	musicians.forEach(function(value,key){
		array.push({ uuid: key, instrument: value.instrument, activeSince: value.activeSince});
	});

	return JSON.stringify(array);
}

s.on('message', function(msg, source){
        console.log("datagramme received from a musician "
        + msg + ". Source port: " + source.port);

        const obj = JSON.parse(msg);

        musicians.set(obj.id, {"instrument": listSounds.get(obj.sound), "activeSince" : moment()});

});

function killDeadMusicians(){
        musicians.forEach(function(value, key) {
                if(moment.duration((moment().diff(value))).asSeconds() >= 5){
                        musicians.delete(key);
                        console.log("Musician is dead : " + key);
                }
        });
}
setInterval(killDeadMusicians, 5000);
