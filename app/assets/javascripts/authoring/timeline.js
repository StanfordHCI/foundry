/* Timeline.js
 * ---------------------------------------------
 * Code that manages the workflow timeline in Foundry.
 */


var SVG_WIDTH = 4850,
    SVG_HEIGHT = 550;

var HEADER_HEIGHT = 28;

var STEP_WIDTH = 25,
    HOUR_WIDTH = 100;
var STEP_INTERVAL = 15; // minutes per step
    

var TIMELINE_HOURS = 48;
var TOTAL_HOUR_PIXELS = TIMELINE_HOURS*HOUR_WIDTH;

var XTicks = TOTAL_HOUR_PIXELS / STEP_WIDTH,
    YTicks = 6;

var BKG_COLOR = "#202020";
var STROKE_COLOR = "rgba(233,233,233,0.2)";
var MARKER_COLOR = "#28282b";
var ALT_MARKER_COLOR = "#2c2c2f";

var x = d3.scale.linear()
    .domain([0, TOTAL_HOUR_PIXELS])

var y = d3.scale.linear() 
    .domain([17, 550])
    .range([17, 550]);

var current = undefined;
var currentUserEvents = [];
var currentUserIds = [];
var upcomingEvent; 

var overlayIsOn = false;

$("#timeline-container").css({
  backgroundColor: BKG_COLOR,
});


var header_svg = d3.select("#timeline-container").append("svg")
    .attr("width", SVG_WIDTH)
    .attr("height", HEADER_HEIGHT)
    .style({"display": "block",
            "border-bottom": "solid 1px " + STROKE_COLOR});

var timeline_svg = d3.select("#timeline-container").append("svg")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT)
    .attr("class", "chart");

//console.log("APPENDED TIMELINE TO DOM!");

function drawTimeline() {
  // an array of the numbers [0, 1, 2, ..., numSteps-1]
  var intervals = (
      function (steps){
          var a = []; steps++;
          for(var i = 0; i < steps; i++) {
            a.push(i);
          }
          return a;
      })(TOTAL_HOUR_PIXELS / STEP_WIDTH);

  // reset header svg width
  header_svg.attr("width", TOTAL_HOUR_PIXELS)
  
  // draw lines to header svg
  header_svg.selectAll("line")
      .data(intervals.slice(0, intervals.length/4))
      .enter().append("line")
      .attr("x1", function(d) {return d * (STEP_WIDTH * 4)})
      .attr("x2", function(d) {return d * (STEP_WIDTH * 4)})
      .attr("y1", HEADER_HEIGHT - 12)
      .attr("y2", HEADER_HEIGHT)
      .style("stroke", STROKE_COLOR);
  
  console.log('drawing');
  
  // draw timeline time intervals to header svg
  header_svg.selectAll("text.time-marker")
      .data(intervals.slice(0, intervals.length/4))
      .enter().append("text")
          .attr("class", "time-marker")
          .style("width", STEP_WIDTH * 4)
          .text(function(d) {return d + ':00';})
          .attr("x", function(d) {return d * (STEP_WIDTH * 4) + 4})
          .attr("y", HEADER_HEIGHT - 2)
          .style({
              "font-family": "Helvetica Neue",
              "font-size": "10px",
              "font-weight": "400",
              "fill": "#777",
          });

  // reset timeline svg width
  timeline_svg.attr("width", TOTAL_HOUR_PIXELS);
  
  // draw alternating markers to timeline svg
  timeline_svg.selectAll("rect.background")
      .data(intervals.slice(0, intervals.length/4)) // hour intervals
      .enter().append("rect")
          .attr("class", "background")
          .style("fill", function(d) {return d % 2 === 0 ? MARKER_COLOR : ALT_MARKER_COLOR;})
          .attr("x", function(d) {return d * STEP_WIDTH * 4})
          .attr("width", STEP_WIDTH * 4)
          .attr("y", 0)
          .attr("height", SVG_HEIGHT-65)

  // draw x grid lines to timeline svg
  timeline_svg.selectAll("line.x")
      .data(intervals)
      .enter().append("line")
      .attr("class", "x")
      .attr("x1", function(d) {return d * STEP_WIDTH})
      .attr("x2", function(d) {return d * STEP_WIDTH})
      .attr("y1", 0)
      .attr("y2", SVG_HEIGHT-65)
      .style("stroke", STROKE_COLOR);
}

drawTimeline();

var yLines = y.ticks(YTicks);
//Hack: subtract 20* to get the row heights shorter
for (i = 0; i<yLines.length; i++) {
    yLines[i] -= 3;
    yLines[i] -= (i*20);
}


//Draw y axis grid lines
timeline_svg.selectAll("line.y")
    .data(yLines) 
    .enter().append("line")
    .attr("class", "y")
    .attr("x1", 0)
    .attr("x2", SVG_WIDTH-50)
    .attr("y1", y)
    .attr("y2", y)
    .style("stroke", STROKE_COLOR);

//Remove existing X-axis labels
var numMins = -60;

//Extend the timeline the necessary amount for the project
function initializeTimelineDuration() {
    var totalHours = findTotalHours();
    if (totalHours > 48) {
        TIMELINE_HOURS = totalHours;
        TOTAL_HOUR_PIXELS = TIMELINE_HOURS * HOUR_WIDTH;
        SVG_WIDTH = TIMELINE_HOURS * 100 + 50;
        XTicks = TIMELINE_HOURS * 4;
        redrawTimeline();
    }
}


var task_g = timeline_svg.selectAll(".task_g");

//Set the width of the timeline header row so add time button is all the way to the right
document.getElementById("timeline-header").style.width = SVG_WIDTH - 50 + "px";

//Turn on the overlay so a user cannot continue to draw events when focus is on a popover
function overlayOn() {
    console.log("overlay on");
    //$("#overlay").css("display", "block");
};

//Remove the overlay so a user can draw events again
function overlayOff() {
    console.log("overlay off");
    $(".task_rectangle").popover("hide");
    //$("#overlay").css("display", "none");
};

//Access a particular "event" in the JSON by its id number and return its index in the JSON array of events
function getEventJSONIndex(idNum) {
    var num_events = flashTeamsJSON["events"].length;
    for (var i = 0; i < num_events; i++) {
        if (flashTeamsJSON["events"][i].id == idNum) {
            return i;
        }
    }
};

//VCom Time expansion button trial 
function addTime() {
    calcAddHours(TIMELINE_HOURS);
    redrawTimeline();
}

//Should have updated the variables: TIMELINE_HOURS, TOTAL_HOUR_PIXELS, SVG_WIDTH, XTicks
//Redraws timeline based on those numbers
function redrawTimeline() {
    //debugger;
    //Recalculate 'x' based on added hours
    var x = d3.scale.linear()
    .domain([0, TOTAL_HOUR_PIXELS])
    .range([0, TOTAL_HOUR_PIXELS]);
    
    //Reset overlay and svg width
    document.getElementById("overlay").style.width = SVG_WIDTH + 50 + "px";
    timeline_svg.attr("width", SVG_WIDTH);
    
    //Remove all existing grid lines & background
    timeline_svg.selectAll("line").remove();
    timeline_svg.selectAll("rect.background").remove();
    
    drawTimeline();
    
    //Redraw all y-axis grid lines
    timeline_svg.selectAll("line.y")
        .data(yLines) 
        .enter().append("line")
        .attr("class", "y")
        .attr("x1", 0)
        .attr("x2", SVG_WIDTH-50)
        .attr("y1", y)
        .attr("y2", y)
        .style("stroke", STROKE_COLOR);
    
    //Redraw Add Time Button
    document.getElementById("timeline-header").style.width = SVG_WIDTH - 50 + "px";
    
    //Remove existing X-axis labels
    timeline_svg.selectAll("text.timelabel").remove();
    numMins = -60;


    
    //Add ability to draw rectangles on extended timeline
    timeline_svg.append("rect")
        .attr("class", "background")
        .attr("width", SVG_WIDTH)
        .attr("height", SVG_HEIGHT)
        .attr("fill", "white")
        .attr("fill-opacity", 0)
        .on("mousedown", function() {
            var point = d3.mouse(this);
            newEvent(point);
        }); 

    //Redraw the cursor
    timeline_svg.append("line")
        .attr("y1", 0)
        .attr("y2", SVG_HEIGHT-50)
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("class", "cursor")
        .style("stroke", "red")
        .style("stroke-width", "2")

    //Get the latest time and team status, update x position of cursor
    cursor = timeline_svg.select(".cursor");
    var latest_time;
    if (in_progress){
        latest_time = (new Date).getTime();
    } else {
        latest_time = loadedStatus.latest_time;
    }
    
    //Next line is commented out after disabling the ticker
    //cursor_details = positionCursor(flashTeamsJSON, latest_time);

    //move all existing events back on top of timeline
    $(timeline_svg.selectAll('g')).each(function() {
        $('.chart').append(this);
    });
}

//VCom Calculates how many hours to add when user expands timeline manually 
//Increases by 1/3 each time (130% original length)
function calcAddHours(currentHours) {
    TIMELINE_HOURS = currentHours + Math.floor(currentHours/3);
    TOTAL_HOUR_PIXELS = TIMELINE_HOURS * HOUR_WIDTH;
    SVG_WIDTH = TIMELINE_HOURS * HOUR_WIDTH + 50;
    XTicks = TOTAL_HOUR_PIXELS / STEP_WIDTH;
}
