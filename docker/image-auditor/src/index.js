var dgram = require('dgram');
var express = require('express');
var app = express();
var ORCHESTRA_MULTICAST_GROUP = '224.224.224.224';
var ORCHESTRA_UDP_PORT = 50000;

app.get('/', function(req, res) {
	res.format({
		'application/json': function(){
			console.log("Sending musicians to client");
			res.send( getMusicians() );
		}
	})

});

app.listen(2205, function () {
	console.log('Accepting HTTP requests on port 2205!');
});

//Ajout au groupe multicast pour communication avec les musiciens
var udpSocket = dgram.createSocket('udp4', receivedMessage);

udpSocket.bind(ORCHESTRA_UDP_PORT, function() {
  console.log("Joining multicast group");
  s.addMembership(ORCHESTRA_MULTICAST_GROUP);
});

receivedMessage(){
	//si uuid déjà dans tableau --> remettre activeSince à heure courante
	//sinon addMusician
}

//ajoute un musicien
function addMusician(uuid, instrument, activeSince){
	var musician;
}

//supprime un musicien
function removeMusician(uuid){

}

//Retourne les musiciens actifs
function getMusicians() {

	var musicians = [];
	

	for(var i = 0; i < numberOfMembers; i++) {
		var gender = chance.gender();
		var firstName = chance.first({gender: gender});
		var lastName = chance.last({gender: gender});
		var birthDate = chance.date({string: true, american: false});

		var presences = [];;
		
		for(var j = 0; j < numberOfPresences; j++) {
			presences.push({
				date: chance.date({string: true, american:false}),
				eventLocation: chance.city()
			});
		}
	
		musicians.push({
				firstName: firstName,
				lastName: lastName,
				gender: gender,
				birthDate: birthDate,
				presences: presences
			});
	}	
	return musicians;

}

