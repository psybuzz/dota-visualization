/**
 * This file contains logic regarding switching between UI views: the main
 * overview and the detailed player view.
 */

$overview = $('#overview');
$playerView = $('#playerView');
$('#leader').click(openOverview);
var app = {
	injected: false,
	view: 'main'
}

// Onload, direct us to the detailed view if there is a hash specified.
if (window.location.hash.length > 1){
	var x = window.location.hash;
	x = x.replace('#', '').split(',');
	var playerName = x[0];
	var hero = x[1];

	// Open the player view.
	openPlayerView({
		Player: x[0],
		Hero: x[1]
	});
}

function openPlayerView (player){
	if (!app.injected){
		var script = document.createElement('script');
		script.src = "http://x3dom.org/x3dom/dist/x3dom-full.js";
		document.body.appendChild(script);

		app.injected = true;
	} else {
		// Do a janky hash-directed refresh.
		window.location.href = '#'+player.Player+','+player.Hero;
		window.location.reload();
	}

	// Launch 3D plot.
	$('#plot').html('');
	launch3DPlot(player.Player);

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

	// Launch graph.
	$('#movementContainer').html('');
	drawGraph(player.Hero,heroToSideMap[player.Hero]);

	$('#title').text(player.Player + ' - ' + player.Hero);
	$('#leader').text('back');

	$overview.fadeOut(function (){
		$playerView.fadeIn();
		app.view = 'player';
	});

}

function openOverview (){
	$('#title').text('Some dota visualization');
	$('#leader').text('CS467')

	$playerView.fadeOut(function (){
		$overview.fadeIn();
		app.view = 'main';
	});

}
