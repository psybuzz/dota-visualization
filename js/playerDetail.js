$("#chartsTab").click(function(){
	$("#roleDiv").fadeOut();
	$("#teamDiv").fadeOut(function (){
		$("#graphDiv").fadeIn();
	});
	$(".tab").removeClass("selected");
	$(this).addClass("selected");
});

$("#roleTab").click(function(){
	$("#graphDiv").fadeOut();
	$("#teamDiv").fadeOut(function (){
		$("#roleDiv").fadeIn();
	});
	$(".tab").removeClass("selected");
	$(this).addClass("selected");
});

$("#teamTab").click(function(){
	$("#graphDiv").fadeOut();
	$("#roleDiv").fadeOut(function (){
		$("#teamDiv").fadeIn();
	});
	$(".tab").removeClass("selected");
	$(this).addClass("selected");
});

