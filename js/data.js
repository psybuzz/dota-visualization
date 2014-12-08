var overallKdaData;
var positionData;

var heroToSideMap = {
	"Puck": "Radiant",
	"Keeper of the Light": "Radiant",
	"Lycan": "Radiant",
	"Morphling": "Radiant",
	"Io": "Radiant",
	"Natures Prophet": "Dire",
	"Dazzle": "Dire",
	"Lone Druid": "Dire",
	"Enigma": "Dire",
	"Ember Spirit": "Dire",
}

var heroToRoleMap = {
	"Puck": "Offlane",
	"Keeper of the Light": "Support",
	"Lycan": "Carry",
	"Morphling": "Mid",
	"Io": "Support",
	"Natures Prophet": "Offlane",
	"Dazzle": "Support",
	"Lone Druid": "Carry",
	"Enigma": "Jungle/Support",
	"Ember Spirit": "Mid",
}

// Make requests for data.
function loadMatchData (callback){
	d3.csv('overall_kda_617956329.csv', function (data){
		overallKdaData = data;

		d3.csv("datdotaMatch617956329.csv", function (error, data){
			positionData = data;
			callback();
		});
	});
}
