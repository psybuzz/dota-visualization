/**
 * This file contains logic regarding switching between UI views: the main
 * overview and the detailed player view.
 */

$overview = $('#overview');
$playerView = $('#playerView');

function openPlayerView (playerName){
	// Launch graph.
	drawGraph("Natures Prophet","Dire");

	// Launch 3D plot.
	d3.select('html').style('height','100%').style('width','100%');
	d3.select('body').style('height','100%').style('width','100%');
	d3.select('#plot').style('width', "600px").style('height', "600px")
	plot3d(d3.select('#plot'));

	$overview.fadeOut(function (){
		$playerView.fadeIn();
	});
}
