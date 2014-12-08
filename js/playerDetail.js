$("#chartsTab").click(function(){
	$("#roleDiv").fadeOut();
	$("#teamDiv").fadeOut();
	$("#graphDiv").fadeIn();
});

$("#roleTab").click(function(){
	$("#graphDiv").fadeOut();
	$("#teamDiv").fadeOut();
	$("#roleDiv").fadeIn();
});

$("#teamTab").click(function(){
	$("#graphDiv").fadeOut();
	$("#roleDiv").fadeOut();
	$("#teamDiv").fadeIn();
});

