function distance(preX, preY, curX, curY) {
  return Math.sqrt(Math.pow(preX-curX,2) + Math.pow(preY-curY,2));
}

function drawGraph(hero, team, data, container, color) {
  var baseThreshold;
  if (team == "Radiant")
    baseThreshold == 90;
  else
    baseThreshold == 160;
  var margin = {top: 5, right: 50, bottom: 30, left: 25},
      width = window.innerWidth * 0.75 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

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

  var svg = d3.select(container || "#movementContainer").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("font-size", 10)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  data = data.filter(function(element){
    return ((element["Visible to"]==("Radiant only") || element["Visible to"]=="Both sides") && (element["Hero"]=="Keeper of the Light" || element["Hero"]=="Io") && parseFloat(element["Time"])>.5);
  });
  var baseThreshold;
  data = data.filter(function(element){
    baseThreshold = 90;
    return element["X Pos."] > baseThreshold && element["Y Pos."] > baseThreshold
  });

  dataHero1 = data.filter(function(element){
    return element["Hero"] == "Keeper of the Light"
  });

  dataHero2 = data.filter(function(element){
    return element["Hero"] == "Io"
  })

  dataHero1 = dataHero1.sort(function(a,b){
    return parseFloat(a["Time"])-parseFloat(b["Time"]);
  });

  dataHero2 = dataHero2.sort(function(a,b){
    return parseFloat(a["Time"])-parseFloat(b["Time"]);
  });

  data = dataHero1.concat(dataHero2);
    data.forEach(function(d) {
    var time = parseFloat(d.Time);
    if (time < .5) {
      curX = parseFloat(d["X Pos."]);
      curY = parseFloat(d["Y Pos."]);
      d["distance"] = 0;
    }

    if (time >= .50){
      preX = curX;
      preY = curY;
      curX = parseFloat(d["X Pos."]);
      curY = parseFloat(d["Y Pos."]);
      d["distance"]=distance(preX, preY, curX, curY);
    }
  });

  x.domain(d3.extent(data, function(d) { return parseFloat(d.Time); }));
  y.domain(d3.extent(data, function(d) { return d.distance; }));

  var dataNest = d3.nest()
        .key(function(d) {return d.Hero;})
        .entries(data);
    // Loop through each symbol / key
    dataNest.forEach(function(d) {
      console.log(d.values[0])
        var path = svg.append("path")
            .attr("class", "line")
            .attr("d", line(d.values));
        path.style("stroke", color); 

    });

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
      .text("Movement");

  /*var path = svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

  if (color){
    path.style("stroke", color);
  }*/
}
