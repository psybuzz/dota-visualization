function plot3d(parent) {
    var x3d = parent
        .append("x3d")
        .attr( "width", parseInt(parent.style("width"))+"px" )
        .attr( "height", parseInt(parent.style("height"))+"px" )
        .style( "border", "none" )

    var scene = x3d.append("scene")

    scene.append("orthoviewpoint")
        .attr( "centerOfRotation", [5, 5, 5])
        .attr( "fieldOfView", [-10, -10, 20, 25])
        .attr( "orientation", [-0.5, 1, 0.2, 1.12*Math.PI/4])
        .attr( "position", [8, 4, 15])

    var rows = initializeDataGrid();
    var axisRange = [0, 20];
    var scales = [];
    var initialDuration = 0;
    var defaultDuration = 800;
    var ease = 'linear';
    var time = 0;
    var axisKeys = ["Deaths", "Kills", "Assists"]

    // Helper functions for initializeAxis() and drawAxis()
    function axisName( name, axisIndex ) {
        return ['Deaths','Kills','Assists'][axisIndex] + name;
    }

    function constVecWithAxisValue( otherValue, axisValue, axisIndex ) {
        var result = [otherValue, otherValue, otherValue];
        result[axisIndex] = axisValue;
        return result;
    }

    // Used to make 2d elements visible
    function makeSolid(selection, color) {
        selection.append("appearance")
            .append("material")
            .attr("diffuseColor", color||"black")
        return selection;
    }

    // Initialize the axes lines and labels.
    function initializePlot() {
        initializeAxis(0, 15);
        initializeAxis(1, 20);
        initializeAxis(2, 15);
    }

    function initializeAxis( axisIndex, axisLength )
    {
        var key = axisKeys[axisIndex];
        drawAxis( axisIndex, key, initialDuration, axisLength );

        var scaleMin = axisRange[0];
        var scaleMax = axisRange[1];

        // the axis line
        var newAxisLine = scene.append("transform")
            .attr("class", axisName("Axis", axisIndex))
            .attr("rotation", ([[0,0,0,0],[0,0,1,Math.PI/2],[0,1,0,-Math.PI/2]][axisIndex]))
            .append("shape")
        newAxisLine
            .append("appearance")
            .append("material")
            .attr("emissiveColor", "lightgray")
        newAxisLine
            .append("polyline2d")
            // Line drawn along y axis does not render in Firefox, so draw one
            // along the x axis instead and rotate it (above).
            .attr("lineSegments", "0 0," + scaleMax + " 0")

        // axis labels
        var newAxisLabel = scene.append("transform")
            .attr("class", axisName("AxisLabel", axisIndex))
            .attr("translation", constVecWithAxisValue( 0, scaleMin + 1.1 * (scaleMax-scaleMin), axisIndex ))

        var newAxisLabelShape = newAxisLabel
            .append("billboard")
            .attr("axisOfRotation", "0 0 0") // face viewer
            .append("shape")
            .call(makeSolid)

        var labelFontSize = 0.6;

        newAxisLabelShape
            .append("text")
            .attr("class", axisName("AxisLabelText", axisIndex))
            .attr("solid", "true")
            .attr("string", key)
            .append("fontstyle")
            .attr("size", labelFontSize)
            .attr("family", "SANS")
            .attr("justify", "END MIDDLE" )
    }

    // Assign key to axis, creating or updating its ticks, grid lines, and labels.
    function drawAxis( axisIndex, key, duration, axisLength ) {

        var scale = d3.scale.linear()
            .domain( [0,axisLength] ) // demo data range
            .range( axisRange )

        scales[axisIndex] = scale;

        var numTicks = 8;
        var tickSize = 0.1;
        var tickFontSize = 0.5;

        // ticks along each axis
        var ticks = scene.selectAll( "."+axisName("Tick", axisIndex) )
            .data( scale.ticks( numTicks ));
        var newTicks = ticks.enter()
            .append("transform")
            .attr("class", axisName("Tick", axisIndex));
        newTicks.append("shape").call(makeSolid)
            .append("box")
            .attr("size", tickSize + " " + tickSize + " " + tickSize);
        // enter + update
        ticks.transition().duration(duration)
            .attr("translation", function(tick) {
                return constVecWithAxisValue( 0, scale(tick), axisIndex ); })
        ticks.exit().remove();

        // tick labels
        var tickLabels = ticks.selectAll("billboard shape text")
            .data(function(d) { return [d]; });
        var newTickLabels = tickLabels.enter()
            .append("billboard")
            .attr("axisOfRotation", "0 0 0")
            .append("shape")
            .call(makeSolid)
        newTickLabels.append("text")
            .attr("string", scale.tickFormat(10))
            .attr("solid", "true")
            .append("fontstyle")
            .attr("size", tickFontSize)
            .attr("family", "SANS")
            .attr("justify", "END MIDDLE" );
        tickLabels // enter + update
            .attr("string", scale.tickFormat(10))
        tickLabels.exit().remove();

        // base grid lines
        if (axisIndex==0 || axisIndex==2) {

            var gridLines = scene.selectAll( "."+axisName("GridLine", axisIndex))
                .data(scale.ticks( numTicks ));
            gridLines.exit().remove();

            var newGridLines = gridLines.enter()
                .append("transform")
                .attr("class", axisName("GridLine", axisIndex))
                .attr("rotation", axisIndex==0 ? [0,1,0, -Math.PI/2] : [0,0,0,0])
                .append("shape")

            newGridLines.append("appearance")
                .append("material")
                .attr("emissiveColor", "gray")
            newGridLines.append("polyline2d");

            gridLines.selectAll("shape polyline2d").transition().duration(duration)
                .attr("lineSegments", "0 0, " + axisRange[1] + " 0")

            gridLines.transition().duration(duration)
                .attr("translation", axisIndex==0
                    ? function(d) { return scale(d) + " 0 0"; }
                    : function(d) { return "0 0 " + scale(d); }
            )
        }
    }

    // Update the data points (spheres) and stems.
    function plotData( duration ) {

        if (!rows) {
            console.log("no rows to plot.")
            return;
        }

        var deaths = scales[0], kills = scales[1], assists = scales[2];
        var sphereRadius = 0.6;

        // Draw a sphere at each x,y,z coordinate.
        var datapoints = scene.selectAll(".datapoint").data( rows );
        datapoints.exit().remove()

        var newDatapoints = datapoints.enter()
            .append("transform")
            .attr("class", "datapoint")
            .attr("scale", [sphereRadius, sphereRadius, sphereRadius])
            .append("shape");
        newDatapoints
            .append("appearance")
            .append("material");
        newDatapoints
            .append("sphere")
        // Does not work on Chrome; use transform instead
        //.attr("radius", sphereRadius)

        datapoints.selectAll("shape appearance material")
            .attr("diffuseColor", 'steelblue' )

        datapoints.transition().ease(ease).duration(duration)
            .attr("translation", function(row) {
                return deaths(row[axisKeys[0]]) + " " + kills(row[axisKeys[1]]) + " " + assists(row[axisKeys[2]])})
    }

    //function that gets the data points.
    function initializeDataGrid() {
        var rows = [];
        // Follow the convention where y(x,z) is elevation.
       /* for (var x=0; x<=15; x+=1) {
            for (var z=0; z<=15; z+=1) {
                rows.push({Deaths: x, Kills: 1, Assists: z});
            }
        }*/
        rows.push({Deaths: 8, Kills: 0, Assists: 0});
        rows.push({Deaths: 0, Kills: 5, Assists: 0});
        rows.push({Deaths: 0, Kills: 0, Assists: 7});

        return rows;
    }

    function updateData() {
        time += Math.PI/8;
        if ( x3d.node() && x3d.node().runtime ) {
            for (var r=0; r<rows.length; ++r) {
                var x = rows[r].Deaths;
                var z = rows[r].Assists;
                rows[r].y = 5*( Math.sin(0.5*x + time) * Math.cos(0.25*z + time));
            }
            //plotData( defaultDuration );
        } else {
            console.log('x3d not ready.');
        }
    }

    initializeDataGrid();
    initializePlot();
    plotData(defaultDuration);
    //plotData(defaultDuration, 'kills');
    //plotData(defaultDuration, 'assists');
    //setInterval( updateData, defaultDuration );
}
// d3.select('html').style('height','100%').style('width','100%');
// d3.select('body').style('height','100%').style('width','100%');
// d3.select('#plot').style('width', "600px").style('height', "600px")
// plot3d(d3.select('#plot'));