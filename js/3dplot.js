/**
 * This file contains logic related to the team comparison tab on the player
 * detail view.
 */

function launch3DPlot (player){
    // Render the choices first so we can render our graphs based off of which
    // choices are selected.
    renderPlayerSelectors(player);
    renderTeamGraphs(player);
}

function renderTeamGraphs (player){
    var width = 300 + 100, height = 200;
    
    var kdaCanvas = $('#kdaCanvas')[0];
    kdaCanvas.width = width;
    kdaCanvas.height = height;
    plotAxes(kdaCanvas, player);
    plotTriangle(kdaCanvas, player);

    // Draw the graphs.
    var firstTeamCanvas = $('#firstTeamCanvas')[0];
    firstTeamCanvas.width = width;
    firstTeamCanvas.height = height;
    plotAxes(firstTeamCanvas, {K: '', D: '', A: ''});
    var selectedPlayers = getSelectedPlayers('#firstTeamSelector', firstTeam);
    for (var i=0; i<selectedPlayers.length; i++){
        plotTriangle(firstTeamCanvas, selectedPlayers[i]);
    }
    var firstKda = selectedPlayers.reduce(function(a,b){
        return {K:a.K+b.K, D:a.D+b.D, A:a.A+b.A};
    }, {K:0,D:0,A:0});

    var secondTeamCanvas = $('#secondTeamCanvas')[0];
    secondTeamCanvas.width = width;
    secondTeamCanvas.height = height;
    plotAxes(secondTeamCanvas, {K: '', D: '', A: ''});
    var selectedPlayers = getSelectedPlayers('#secondTeamSelector', secondTeam);
    for (i=0; i<selectedPlayers.length; i++){
        plotTriangle(secondTeamCanvas, selectedPlayers[i]);
    }
    var secondKda = selectedPlayers.reduce(function(a,b){
        return {K:a.K+b.K, D:a.D+b.D, A:a.A+b.A};
    }, {K:0,D:0,A:0});

    // Display overall stats.
    $('#firstTeamStats').html(
            firstKda.K + " Kills, " +
            firstKda.D + " Deaths, " +
            firstKda.A + " Assists");
    $('#secondTeamStats').html(
            secondKda.K + " Kills, " +
            secondKda.D + " Deaths, " +
            secondKda.A + " Assists");
}

/**
 * Returns a list of player objects for players that are selected in the UI
 * within the specified team container.
 * 
 * @param  {String} teamSelector        The selector to the team container.
 * @param  {Array.Object} teamData      The data to sample from.
 * 
 * @return {Array.Object}               The selected players.
 */
function getSelectedPlayers (teamSelector, teamData){
    var selectedNodes = document.querySelectorAll(teamSelector + ' .playerChoice.selected');
    var playerNames = Array.prototype.map.call(selectedNodes, function (node){
        return node.innerText;
    });
    var selectedPlayers = teamData.filter(function (player){
        var name = player.Player;
        return playerNames.indexOf(name) !== -1;
    });

    return selectedPlayers;
}

/**
 * Generate and render HTML for the player selector choices.
 */
function renderPlayerSelectors (player){
    // Generate HTML for the player choices.
    var firstChoices = firstTeam.map(function (player){
        var color = roleToColorMap[heroToRoleMap[player.Hero]];
        var html = "<li class='playerChoice selected' style='border-color:"+color+"'>" +
                    player.Player +
                "</li>";
        return html;
    });

    var secondChoices = secondTeam.map(function (player){
        var color = roleToColorMap[heroToRoleMap[player.Hero]];
        var html = "<li class='playerChoice selected' style='border-color:"+color+"'>" +
                    player.Player +
                "</li>";
        return html;
    });

    // Add player choice options to each list.
    $('#firstTeamSelector').html(firstChoices);
    $('#secondTeamSelector').html(secondChoices);

    // Register event handlers for checking and unchecking the checkboxes.
    $('.playerChoice').click(function (){
        $(this).toggleClass('selected');
        renderTeamGraphs(player);
    });
}

function plotAxes (canvas, player){
    var k = player.K, d = player.D, a = player.A;
    var w = canvas.width-100, h = canvas.height;
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'rgb(150,150,150)';

    ctx.beginPath();
    ctx.moveTo(w/2, h/2);
    ctx.lineTo(w/2, 0);
    ctx.stroke();
    ctx.font = "20px Lato";
    if (typeof k !== 'undefined') ctx.fillText('Kills '+k, (w/2), 20);

    ctx.moveTo(w/2, h/2);
    ctx.lineTo(0, (h/2)+(w/4));
    ctx.stroke();
    if (typeof d !== 'undefined') ctx.fillText('Deaths '+d, 0, (3*h/4));

    ctx.moveTo(w/2, h/2);
    ctx.lineTo(w, (h/2)+(w/4));
    ctx.stroke();
    if (typeof a !== 'undefined') ctx.fillText('Assists '+a, (w - 30), (3*h/4));

}

/**
 * Plots a triangle of the player's KDA onto the canvas.
 * 
 * @param  {element} canvas     The canvas element to draw upon.
 * @param  {Object} player      The player whose data is to be drawn.
 */
function plotTriangle (canvas, player){
    var k = player.K, d = player.D, a = player.A;
    var ks = k / 15, ds = d / 15, as = a / 15;
    var w = canvas.width-100, h = canvas.height;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = roleToColorMap[heroToRoleMap[player.Hero]];

    // Filled triangle
    ctx.beginPath();
    ctx.moveTo((w/2), (h/2) - (h/2)*ks);                // top
    ctx.lineTo((w/2) - (w/2)*ds, (h/2) + (w/4)*ds);     // bottom left
    ctx.lineTo((w/2) + (w/2)*as, (h/2) + (w/4)*as);     // bottom right
    ctx.fill();

    // // Also do a stroke?
    // ctx.fillStyle = 'rgba(0,0,0,1)';
    // ctx.stroke();
}
