/**
 * This file contains logic related to the rendering of the player circles on
 * the overview in the main page.
 */


var overallKda = d3.csv('overall_kda_617956329.csv', function (data){
	// Convert KDA strings to numbers.
	data.forEach(function (el){
		el.K = parseInt(el.K, 10);
		el.D = parseInt(el.D, 10);
		el.A = parseInt(el.A, 10);
	});
	console.log(data)

	// Split into two teams.
	var teamNames = _.uniq(data.map(function (el){ return el.Team; }));
	var firstTeam = data.filter(function (el){ return el.Team === teamNames[0] });
	var secondTeam = data.filter(function (el){ return el.Team !== teamNames[0] });

	var radius = 50;
	var thickness = 20;
	var arc = profileArcGenerator(radius, thickness);

	// Add circles for the first team.
	$('#firstTeamLabel').text("Team " + teamNames[0]);
	var firstTeamGraphics = addTeamCircleGraphics(firstTeam, 1, arc);

	// Add circles for the second team.
	$('#secondTeamLabel').text("Team " + teamNames[1]);
	var secondTeamGraphics = addTeamCircleGraphics(secondTeam, 2, arc);

});

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
	var offset = firstOrSecond === 'first' ? 0 : 200*4+200;
	var delay = 100;

	var arcGraphics = d3.select('#'+firstOrSecond+'Team')
			.selectAll("svg")
			.data(teamData)
			.enter().append("svg").attr('class', 'userCircle')
			.append('g')
			.attr('transform', function(d,i){ return 'translate('+arc.radius+','+arc.radius+')' });
	arcGraphics.append("path")
			.attr("d", arc.player)
			.attr("class", "clickable")
			.style("fill", function(d) { return 'whitesmoke'; })
			.on('mouseover', function (d){
				d3.select(this).style("fill", "gray");
			})
			.on('mouseout', function (d){
				d3.select(this).style("fill", "whitesmoke");
			})
			.on('click', function (d){
				openPlayerView(d.Player);
			});
	arcGraphics.append("path")
			.attr("d", arc.kill)
			.transition()
			.delay(function(d,i){ return delay*i+offset })
			.duration(1000)
			.style("fill", function(d) { return 'blue'; });
	arcGraphics.append("path")
			.attr("d", arc.death)
			.transition()
			.delay(function(d,i){ return delay*i+100+offset })
			.duration(1000)
			.style("fill", function(d) { return 'red'; });
	arcGraphics.append("path")
			.attr("d", arc.assist)
			.transition()
			.delay(function(d,i){ return delay*i+200+offset })
			.duration(1000)
			.style("fill", function(d) { return 'green'; });
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
				openPlayerView(d.Player);
			})
			.transition()
			.delay(function(d,i){ return delay*i+200+offset })
			.duration(200)
			.text(function(d){ return d.Player; })
			.attr("transform", function(d){ return "translate(-"+(d.Player.length*4)+",0)" })
			.attr("class", "clickable");

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
