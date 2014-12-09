var overallKdaData, positionData, gpmData, killData, deathData, assistData;

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
};

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
};

var roleToColorMap = {
	"Offlane": "rgba(20, 190, 80, 0.4)",
	"Support": "rgba(200, 10, 80, 0.4)",
	"Carry": "rgba(100, 10, 110, 0.4)",
	"Mid": "rgba(80, 80, 180, 0.4)",
	"Jungle/Support": "rgba(50, 150, 80, 0.4)",
};

// Make requests for data.
function loadMatchData (callback){
	d3.csv('overall_kda_617956329.csv', function (data){
		overallKdaData = data;

		// Convert KDA strings to numbers.
		data.forEach(function (el){
			el.K = parseInt(el.K, 10);
			el.D = parseInt(el.D, 10);
			el.A = parseInt(el.A, 10);
		});
		console.log(data)

		// Split into two teams.
		teamNames = _.uniq(data.map(function (el){ return el.Team; }));
		firstTeam = data.filter(function (el){ return el.Team === teamNames[0] });
		secondTeam = data.filter(function (el){ return el.Team !== teamNames[0] });

		d3.csv("datdotaMatch617956329.csv", function (error, data){
			positionData = data;

            d3.csv("GPMFivesData.csv", function (error, data) {
                gpmData = data;
                gpmData.Time = [5, 10, 15, 20, 25, 30, 35];

                d3.csv("KillsFivesData.csv", function(error, data) {
                    killData = data;
                    killData.Time = [5, 10, 15, 20, 25, 30, 35];

                    d3.csv("DeathesFivesData.csv", function(error, data) {
                        deathData = data;
                        deathData.Time = [5, 10, 15, 20, 25, 30, 35];

                        d3.csv("AssistsFivesData.csv", function(error, data) {
                            assistData = data;
                            assistData.Time = [5, 10, 15, 20, 25, 30, 35];
                            callback();
                        });
                    });
                });
            });
		});
	});
}
