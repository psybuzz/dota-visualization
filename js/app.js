/**
 * This file contains logic regarding switching between UI views: the main
 * overview and the detailed player view.
 */

$overview = $('#overview');
$playerView = $('#playerView');

function openPlayerView (playerName){
	var script = document.createElement('script');
	script.src="http://x3dom.org/x3dom/dist/x3dom-full.js";
	document.body.appendChild(script);

	// Launch 3D plot.
	launch3DPlot();

	// Launch graph.
	drawGraph("Natures Prophet","Dire");


	$overview.fadeOut(function (){
		$playerView.fadeIn();
	});
}
