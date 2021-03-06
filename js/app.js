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

// Load all match data before starting up visualization.
loadMatchData(function (){
	// Onload, direct us to the detailed view if there is a hash specified.
	if (window.location.hash.length > 1){
		var x = window.location.hash;
		x = x.replace('#', '').split(',');
		var playerName = x[0];
		var hero = x[1];

		// Open the player view.
		if (playerName.length && hero.length){
			openPlayerView(overallKdaData.filter(function (el){
				return el.Player === playerName;
			})[0], true);
		}
	}

	loadOverview(overallKdaData);
});

function openPlayerView (player, fromHash){
	// Put the player name in the title.
	$('#title').text(player.Player + ' - ' + player.Hero + ' - ' + heroToRoleMap[player.Hero]);
	$('#leader').text('back');

	// Transition to new view.
	var duration = fromHash ? 0 : 400;
	$overview.fadeOut(duration, function (){
		window.location.href = '#'+player.Player+','+player.Hero;
		if (!app.injected){
			// var script = document.createElement('script');
			// script.src = "http://x3dom.org/x3dom/dist/x3dom-full.js";
			// document.body.appendChild(script);

			app.injected = true;

			// This actually just shows the profile picture.
			showPlayerOverview(player);
		} else {
			// If we've already injected, we need a fresh context.  Do a janky
			// hash-directed refresh.
			// window.location.href = '#'+player.Player+','+player.Hero;
			// window.location.reload();

			// return;
		}

		// Set the huge name.
		$('#hugename').text(player.Player);

		// Launch 3D plot.
		launch3DPlot(player);
		
		// Launch graph.
		$('.graphContainer').html('');
		drawGraph(player.Hero, heroToSideMap[player.Hero], positionData, "#movementContainer");
		drawComparisonGraph(player.Hero, heroToOpposingHero[player.Hero], positionData, "#comparisonContainer", "green", "red")
		drawOtherGraph(player.Hero, heroToSideMap[player.Hero], gpmData, "#goldContainer", "gold", "Gold(g)");
		drawOtherGraph(player.Hero, heroToSideMap[player.Hero], killData, "#killContainer", "blue", "Kills");
		drawOtherGraph(player.Hero, heroToSideMap[player.Hero], deathData, "#deathContainer", "red", "Deaths");
		drawOtherGraph(player.Hero, heroToSideMap[player.Hero], assistData, "#assistContainer", "green", "Assists");

		// Load graph descriptions.
		loadGraphDescriptions(player);

		$playerView.fadeIn();
		app.view = 'player';
	});
}

function openOverview (){
	$('#title').text('Defense of the Ancients 2 Match Visualization');
	$('#leader').text('CS467')

	// Reset the hasher.
	window.location.href = '#';

	$playerView.fadeOut(function (){
		$overview.fadeIn();
		app.view = 'main';
	});

}
