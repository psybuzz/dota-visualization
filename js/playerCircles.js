/**
 * This file contains logic related to the rendering of the player circles on
 * the overview in the main page.
 */

var playerToPictureMap = {
	"Mushi": "Mushi.jpg",
	"LaNm": "LaNm.png",
	"iceiceice": "iceiceice.png",
	"BurNIng": "burNing.png",
	"MMY": "mmy.png",
	"ppd": "ppd.png",
	"Eternal Envy": "EternalEnvy.jpg",
	"Universe": "Universe.jpg",
	"zai": "zai.png",
	"Arteezy": "Arteezy.jpg",
}

var currentPlayer = null;

function loadOverview (data){
	var radius = 35;
	var thickness = 15;
	var arc = profileArcGenerator(radius, thickness);

	// Add circles for the first team.
	$('.firstTeamLabel').text("Team " + teamNames[0]);
	var firstTeamGraphics = addTeamCircleGraphics(firstTeam, 1, arc);

	// Add circles for the second team.
	$('.secondTeamLabel').text("Team " + teamNames[1]);
	var secondTeamGraphics = addTeamCircleGraphics(secondTeam, 2, arc);
}

/**
 * Creates and adds the circle profile graphics for a team into either the first
 * or second team container.
 * 
 * @param {Array.Object} teamData      	The team data to use.
 * @param {Number} firstOrSecond 		Either '1' or '2', the team to render.
 * @param {d3.svg.arc} arc           	The d3 arc generator to render arcs.
 *
 * @return {d3.select} 					The graphics object.
 */
function addTeamCircleGraphics (teamData, firstOrSecond, arc){
	firstOrSecond = firstOrSecond === 2 ? 'second' : 'first';
	var offset = firstOrSecond === 'first' ? 0 : 80*4+80;
	var delay = 90;

	var arcGraphics = d3.select('#'+firstOrSecond+'Team')
			.selectAll("svg")
			.data(teamData)
			.enter().append("svg").attr('class', 'userCircle')
			.append('g')
	arcGraphics.transition()
			.delay(function(d,i){ return delay*i })
			.duration(400)
			.attr('transform', function(d,i){ return 'translate('+arc.radius+','+(arc.radius)+')' })
	arcGraphics.append("path")
			.attr("d", arc.player)
			.attr("class", "clickable")
			.on('mouseover', function (d){
				d3.select(this).style("fill", "gray");
				showPlayerOverview(d);
			})
			.on('mouseout', function (d){
				d3.select(this).style("fill", "whitesmoke");
				// hidePlayerOverview();
			})
			.on('click', function (d){
				hidePlayerOverview();
				openPlayerView(d);
			})
			.style("fill", function(d) { return 'white'; })
			.transition()
			.delay(function(d,i){ return delay*i+offset })
			.duration(1000)
			.style("fill", function(d) { return 'whitesmoke'; })
	arcGraphics.append("path")
			.on('mouseover', function (d){
				d3.select(this).style("fill", "gray");
			})
			.on('mouseout', function (d){
				d3.select(this).style("fill", "blue");
			})
			.on('click', function (d){
				showKDAStats(d, 'kills');
			})
			.attr("d", arc.kill)
			.style("fill", function(d) { return 'whitesmoke'; })
			.transition()
			.delay(function(d,i){ return delay*i+offset })
			.duration(1000)
			.style("fill", function(d) { return 'blue'; })
	arcGraphics.append("path")
			.on('mouseover', function (d){
				d3.select(this).style("fill", "gray");
			})
			.on('mouseout', function (d){
				d3.select(this).style("fill", "red");
			})
			.on('click', function (d){
				showKDAStats(d, 'deaths');
			})
			.attr("d", arc.death)
			.style("fill", function(d) { return 'whitesmoke'; })
			.transition()
			.delay(function(d,i){ return delay*i+100+offset })
			.duration(1000)
			.style("fill", function(d) { return 'red'; })
	arcGraphics.append("path")
			.on('mouseover', function (d){
				d3.select(this).style("fill", "gray");
			})
			.on('mouseout', function (d){
				d3.select(this).style("fill", "green");
			})
			.on('click', function (d){
				showKDAStats(d, 'assists');
			})
			.attr("d", arc.assist)
			.style("fill", function(d) { return 'whitesmoke'; })
			.transition()
			.delay(function(d,i){ return delay*i+200+offset })
			.duration(1000)
			.style("fill", function(d) { return 'green'; })
	arcGraphics.append("text")
			.on('mouseover', function (d){
				var circle = this.previousElementSibling
						.previousElementSibling
						.previousElementSibling
						.previousElementSibling;
				d3.select(circle).style("fill", "gray");
			})
			.on('mouseout', function (d){
				var circle = this.previousElementSibling
						.previousElementSibling
						.previousElementSibling
						.previousElementSibling;
				d3.select(circle).style("fill", "whitesmoke");
			})
			.on('click', function (d){
				hidePlayerOverview();
				openPlayerView(d);
			})
			.transition()
			.delay(function(d,i){ return delay*i+200+offset })
			.duration(200)
			.text(function(d){ return d.Player; })
			.attr("transform", function(d){ return "translate(-"+(d.Player.length*3)+",0)" })
			.attr("class", "clickable");
	arcGraphics.append("text")
			.text(function(d){ return heroToRoleMap[d.Hero]; })
			.attr("transform", function(d){ return "translate(-"+(arc.radius+10)+",64)" });

	return arcGraphics;
}

/**
 * Returns an object containing generators for arcs in the player's profile
 * circle.
 * 
 * @param  {Number} radius    The inner radius of the arcs.
 * @param  {Number} thickness The thickness of the arcs.
 * 
 * @return {Object}           The D3 generators.
 */
function profileArcGenerator (radius, thickness){
	return {
		radius: radius,
		kill: d3.svg.arc()
				.startAngle(function(d) { return 0; })
				.endAngle(function(d) { return 2*Math.PI*d.K / (d.K+d.D+d.A); })
				.innerRadius(function(d) { return radius; })
				.outerRadius(function(d) { return radius + thickness; }),
		death: d3.svg.arc()
				.startAngle(function(d) { return 2*Math.PI*d.K / (d.K+d.D+d.A); })
				.endAngle(function(d) { return 2*Math.PI*(d.K+d.D) / (d.K+d.D+d.A); })
				.innerRadius(function(d) { return radius; })
				.outerRadius(function(d) { return radius + thickness; }),
		assist: d3.svg.arc()
				.startAngle(function(d) { return 2*Math.PI*(d.K+d.D) / (d.K+d.D+d.A); })
				.endAngle(function(d) { return 2*Math.PI; })
				.innerRadius(function(d) { return radius; })
				.outerRadius(function(d) { return radius + thickness; }),
		player: d3.svg.arc()
				.startAngle(function(d) { return 0; })
				.endAngle(function(d) { return 2*Math.PI; })
				.innerRadius(function(d) { return 0; })
				.outerRadius(function(d) { return radius + thickness/2; }),
		lower: d3.svg.arc()
				.startAngle(function(d) { return 0; })
				.endAngle(function(d) { return 2*Math.PI; })
				.innerRadius(function(d) { return 0; })
				.outerRadius(function(d) { return radius; })
	};
}

/**
 * Shows the player's profile picture in the overview screen.
 * 
 * @param  {Object} player The selected player.
 */
function showPlayerOverview (player){
	if (currentPlayer === player) return;
	currentPlayer = player;

	var image = 'assets/' + playerToPictureMap[player.Player];
	$('#profilePicHolder').hide();
	$('#profilePic').attr('src', image);
	$('#profilePicHolder').css({
				'right': '-20px',
				'opacity': '0'
			})
			.show()
			.animate({
				'right': '0px',
				'opacity': '0.9'
			}, 200);

	// var statsHTML = '<h3>Kills: ' + player.K + '</h3>' +
	// 		'<h3>Deaths: ' + player.D + '</h3>' +
	// 		'<h3>Assists: ' + player.A + '</h3>';
	// $('#overviewStats').html(statsHTML)
	// 		.fadeIn();
}

/**
 * Hides the player overview stats.
 */
function hidePlayerOverview (){
	$('#overviewStats').fadeOut();
}

function showKDAStats (player, kda){
	if (kda === 'kills'){

	} else if (kda === 'deaths'){

	} else if (kda === 'assists'){

	}
}

function hideKDAStats (){

}
