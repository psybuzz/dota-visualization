function distance(preX, preY, curX, curY) {
  return Math.sqrt(Math.pow(preX-curX,2) + Math.pow(preY-curY,2));
}

function drawGraph(hero, team) {
  var baseThreshold;
  if (team == "Radiant")
    baseThreshold == 90;
  else
    baseThreshold == 160;
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var preX, preY, curX, curY = 0;

  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .x(function(d) { return x(parseFloat(d.Time)); })
      .y(function(d) { return y(d.distance); });

  var svg = d3.select("#movementContainer").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("font-size", 10)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("datdotaMatch617956329.csv", function(error, data) {
    data.forEach(function(d) {
      var time = parseFloat(d.Time);
      if (time < .5) {
        curX = parseFloat(d["X Pos."]);
        curY = parseFloat(d["Y Pos."]);
        d["distance"] = 0;
      }
      if (d.Hero == hero && time >= .50){
        preX = curX;
        preY = curY;
        curX = parseFloat(d["X Pos."]);
        curY = parseFloat(d["Y Pos."]);
        d["distance"]=distance(preX, preY, curX, curY);
      }
    });


    data = data.filter(function(element){
      return ((element["Visible to"]==(team+" only") || element["Visible to"]=="Both sides") && element["Hero"]==hero && parseFloat(element["Time"])>.5);
    });
    var baseThreshold;
    data = data.filter(function(element){
    if (team == "Radiant") {
      baseThreshold = 90;
      return element["X Pos."] > baseThreshold && element["Y Pos."] > baseThreshold
    }
    else {
      baseThreshold = 165;
      return element["X Pos."] < baseThreshold && element["Y Pos."] < baseThreshold
    }});

    data = data.sort(function(a,b){
      return parseFloat(a["Time"])-parseFloat(b["Time"]);
    });

    x.domain(d3.extent(data, function(d) { return parseFloat(d.Time); }));
    y.domain(d3.extent(data, function(d) { return d.distance; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Units Moved");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
  });
}
