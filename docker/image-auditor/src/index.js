var protocol = require('./orchestra-protocol');
var dgram = require('dgram');
var express = require('express');
var app = express();
var moment = require('moment');
app.get('/', function(req, res) {
        res.format({
                'application/json': function(){
                        console.log("Sending musicians to client");
                        res.send( getMusicians() );
                }
        })

});

app.listen(2205, function () {
        console.log("Accepting HTTP requests on port ".concat(protocol.PROTOCOL_PORT_LISTENING_FOR_CLIENT));
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
        return JSON.stringify([...musicians]);
	//return Object.fromEntries(musicians);
}

s.on('message', function(msg, source){
        console.log("datagramme received from a musician "
        + msg + ". Source port: " + source.port);

        const obj = JSON.parse(msg);

        // Verifie si le uuid est deja dans la map
        var alreadyRegisteredMusician = musicians.has(obj.id);


                musicians.set(obj.id, moment());




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
