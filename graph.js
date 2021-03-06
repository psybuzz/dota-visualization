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
    return element["X Pos."] > baseThreshold || element["Y Pos."] > baseThreshold
  }
  else {
    baseThreshold = 165;
    return element["X Pos."] < baseThreshold || element["Y Pos."] < baseThreshold
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
      .text("Movement");

  var path = svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

  if (color){
    path.style("stroke", color);
  }
}


function drawOtherGraph(hero, team, data, container, color, text) {
    console.log(data);
    var margin = {top: 5, right: 50, bottom: 30, left: 25},
        width = window.innerWidth * 0.75 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    var prev, cur = 0;
    var graphData = [], graphDataGold = [];
    //graphData["Time"] = data.Time;

    for(var i = 0; i < data.Time.length; i++) {
        graphData[i] = {};
        graphData[i].Time = data.Time[i];
    }
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
        .x(function(d) { return x(d.Time); })
        .y(function(d) { return y(d.Data); });

    var svg = d3.select(container || "#movementContainer").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("font-size", 10)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function (d) {
        if(d.Hero == hero) {
            data.Time.forEach(function (t) {
                prev = cur;
                cur = parseFloat(d[t]);
                graphData[t/5].Data = cur;
                //graphDataGold[t/5 - 1] = cur;
            });
        }
    });
    //graphData["Data"] = graphDataGold;
    console.log(graphData);

    x.domain(d3.extent(graphData, function(d) { return parseFloat(d.Time); }));
    y.domain(d3.extent(graphData, function(d) { return parseFloat(d.Data); }));

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
        .text(text);

    var path = svg.append("path")
        .datum(graphData)
        .attr("class", "line")
        .attr("d", line);

    if (color){
        path.style("stroke", color);
    }
}

function loadGraphDescriptions (player){
  var playerName = player.Player;
  $('#moveText').html(playerName + " moved around quite a bit throughout the game.  Times when "+playerName+" returned to the base were excluded, so all of the major spikes in this graph indicate points when "+playerName+" teleported.  Such feats can be accomplished with a teleport (TP) scroll.");
  $('#goldText').html(getActionText('earned gold at rate of', playerToGPMMap[playerName]));
  $('#killText').html(getActionText('killed enemies', playerToKPMMap[playerName]));
  $('#deathText').html(getActionText('died', playerToDPMMap[playerName]));
  $('#assistText').html(getActionText('assisted allies', playerToAPMMap[playerName]));
}

function getActionText (actioned, avg) {
  var avg = Math.floor(avg * 100) / 100;
  var html = 'This player '+actioned+' <span class="emphasis">'+avg+'</span> per minute, on average at any given minute of gameplay.';
  return html;
}

