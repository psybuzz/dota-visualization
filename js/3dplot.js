function plot3d(parent) {
    var x3d = parent
        .append("x3d")
        .style( "width", parseInt(parent.style("width"))+"px" )
        .style( "height", parseInt(parent.style("height"))+"px" )
        .style( "border", "none" )

    var scene = x3d.append("scene")

    scene.append("orthoviewpoint")
        .attr( "centerOfRotation", [5, 5, 5])
        .attr( "fieldOfView", [-5, -5, 15, 15])
        .attr( "orientation", [-0.5, 1, 0.2, 1.12*Math.PI/4])
        .attr( "position", [8, 4, 15])
}
