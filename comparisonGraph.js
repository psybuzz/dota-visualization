function drawComparisonGraph(hero1, hero2, data, container, radiantColor, direColor) {
    var opposingPlayer = overallKdaData.filter(function(element){
        return element["Hero"]==hero2
    })[0];
    $("#comparisonHeader").text("Movement data compared against " + opposingPlayer.Team + " " + opposingPlayer.Player + "'s " + opposingPlayer.Hero); 
  var radiantThreshold = 90;
  var direThreshold = 165;
  var margin = {top: 5, right: 50, bottom: 30, left: 25},
      width = window.innerWidth * 0.75 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

  var preX = 0, preY = 0, curX = 0, curY = 0;

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

    hero1Data = data.filter(function(element){
    return element["Hero"] == hero1
  });

  hero2Data = data.filter(function(element){
    return element["Hero"] == hero2
  })

  hero1Data = hero1Data.sort(function(a,b){
    return parseFloat(a["Time"])-parseFloat(b["Time"]);
  });

  hero2Data = hero2Data.sort(function(a,b){
    return parseFloat(a["Time"])-parseFloat(b["Time"]);
  });
      console.log(heroToSideMap[hero1Data[0].Hero])

  if (heroToSideMap[hero1Data[0].Hero]=="Radiant") {
      hero1Data = hero1Data.filter(function(element){
        return ((element["Visible to"]==("Radiant only") || element["Visible to"]=="Both sides")  && parseFloat(element["Time"])>.5);
      });
      hero1Data = hero1Data.filter(function(element){
        return element["X Pos."] > radiantThreshold || element["Y Pos."] > radiantThreshold
      });

  hero2Data = hero2Data.filter(function(element){
    return ((element["Visible to"]==("Dire only") || element["Visible to"]=="Both sides")  && parseFloat(element["Time"])>.5);
  });
  hero2Data = hero2Data.filter(function(element){
    return element["X Pos."] < direThreshold || element["Y Pos."] < direThreshold
  });
    }
    else{
         hero2Data = hero2Data.filter(function(element){
        return ((element["Visible to"]==("Radiant only") || element["Visible to"]=="Both sides")  && parseFloat(element["Time"])>.5);
      });
      hero2Data = hero2Data.filter(function(element){
        return element["X Pos."] > radiantThreshold || element["Y Pos."] > radiantThreshold
      });

  hero1Data = hero1Data.filter(function(element){
    return ((element["Visible to"]==("Dire only") || element["Visible to"]=="Both sides")  && parseFloat(element["Time"])>.5);
  });
  hero1Data = hero1Data.filter(function(element){
    return element["X Pos."] < direThreshold || element["Y Pos."] < direThreshold
  });
    }

  data = hero1Data.concat(hero2Data);

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
  data = data.slice(1); // ignore the first.

  x.domain(d3.extent(data, function(d) { return parseFloat(d.Time); }));
  y.domain(d3.extent(data, function(d) { return d.distance; }));

  var dataNest = d3.nest()
        .key(function(d) {return d.Hero;})
        .entries(data);
        // console.log('**', dataNest)
    // Loop through each symbol / key
    dataNest.forEach(function(d) {
       console.log(d.values)
        var path = svg.append("path")
            .attr("class", "line")
            .attr("d", line(d.values));
        if (heroToSideMap[d.key] == "Radiant"){
            path.style("stroke", radiantColor);
        }
        else
            path.style("stroke", direColor); 

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