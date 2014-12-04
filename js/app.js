/**
 * This file contains logic regarding switching between UI views: the main
 * overview and the detailed player view.
 */

$overview = $('#overview');
$playerView = $('#playerView');
$('#leader').click(openOverview);

function openPlayerView (player){
	var script = document.createElement('script');
	script.src = "http://x3dom.org/x3dom/dist/x3dom-full.js";
	document.body.appendChild(script);

	// Launch 3D plot.
	launch3DPlot(playerName);

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
	drawGraph(player.Hero,heroToSideMap[player.Hero]);

	$('#title').text(player.Player + ' - ' + player.Hero);
	$('#leader').text('back');

	$overview.fadeOut(function (){
		$playerView.fadeIn();
	});
}

function openOverview (){
	$('#title').text('Some dota visualization');
	$('#leader').text('CS467')

	$playerView.fadeOut(function (){
		$overview.fadeIn();
	});
}
