/**
 * Initial setup.
 */

var overallKda = d3.csv('overall_kda_617956329.csv', function (data){
	// Convert KDA strings to numbers.
	data.forEach(function (el){
		el.K = parseInt(el.K, 10);
		el.D = parseInt(el.D, 10);
		el.A = parseInt(el.A, 10);
	});

	var radius = 100;
	var svg = d3.select('#content')
			.append('svg')
			.attr('width', window.innerWidth)
			.attr('height', window.innerHeight)
			.append('g')
			.attr('transform', 'translate(200, 200)');
	var arc = d3.svg.arc()
			.startAngle(function(d) { return 0; })
			.endAngle(function(d) { return 2*Math.PI*d.K / (d.K+d.D+d.A); })
			.innerRadius(function(d) { return radius; })
			.outerRadius(function(d) { return radius + 10; });
	var path = svg.selectAll("path")
			.data(data)
			.enter().append("path")
			.attr("d", arc)
			.style("fill", function(d) { return 'blue'; })
			// .each(function(d) { this._current = updateArc(d); })
			// .on("click", zoomIn);

});
