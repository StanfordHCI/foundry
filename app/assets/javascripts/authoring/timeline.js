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

var ROW_HEIGHT = ROW_HEIGHT || 80;

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

//Remove existing X-axis labels
var numMins = -60;

$("#timeline-container").css({
  backgroundColor: BKG_COLOR,
});


var header_svg = d3.select("#timeline-container").append("svg")
    .attr("width", SVG_WIDTH)
    .attr("height", HEADER_HEIGHT)
    .attr("class", "header-svg")
    .style({"display": "block",
            "border-bottom": "solid 1px " + STROKE_COLOR});

var timeline_svg = d3.select("#timeline-container").append("svg")
    .attr("class", "timeline-svg chart")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT)

//console.log("APPENDED TIMELINE TO DOM!");

window._foundry = {
  timeline: {
    // marker that triggers a mousedown event
    mousedownMarker: undefined,
    
    // row of the marker that last triggered a mousedown event
    mousedownMarkerRow: undefined,
    
    // true if the mouse is currently held down over the timeline, false
    // otherwise
    mousedownOnMarker: false,
    
    // first and last markers of the current selection
    rangeStartMarker: undefined,
    rangeEndMarker: undefined,
    
    
    timelineSvg: timeline_svg,
    
    headerSvg: header_svg,
    
    rowHeight: ROW_HEIGHT,
    
    highlightSvg: undefined,
    
    /* highlightMarkerRange
     * --------------------
     * highlights a range given two markers and a row
     */
    highlightMarkerRange: function(m1, m2, row) {
      var timeline = _foundry.timeline;
      var timelineSvg = _foundry.timeline.timelineSvg;
      
      var left = parseInt(m1.getAttribute("x"));
      var width =   parseInt(m2.getAttribute("x"))
                  + parseInt(m2.getAttribute("width"))
                  - left;
      
      if(!timeline.highlightSvg) {
        timeline.highlightSvg = timelineSvg.append("rect")
          .attr("class", "highlight")
      }
      
      timeline.highlightSvg
        .attr("x", left)
        .attr("y", row * timeline.rowHeight)
        .attr("width", width)
        .attr("height", timeline.rowHeight)
        .style("fill", "rgba(75, 158, 214, 0.52)");
    },
    
    /* removeHighlights
     * ----------------
     * removes all the highlights from the timeline
     */
    removeHighlights: function() {
      var timeline = _foundry.timeline;
      timeline.timelineSvg.select("rect.highlight").remove();
      timeline.highlightSvg = undefined;
    },
    
    clearSelection: function() {
      var timeline = _foundry.timeline;
      timeline.removeHighlights();
      timeline.rangeStartMarker = undefined;
      timeline.rangeEndMarker = undefined;
    },
    
    /* timelineMousedownFn
     * -------------------
     * mousedown function for the timeline svg, kept here
     * for maintenance purposes.
     *
     * Enables drag selection
     */
    timelineMousedownFn: function(e) {
      e = e || window.event;
      e = $.event.fix(e);
      
      // event delegation
      var target = e.target || e.srcElement;
      var targetClassName = target.className.baseVal;
      if(targetClassName.indexOf("marker") === -1) {return;}
      
      var timeline = window._foundry.timeline;
      timeline.mousedownMarker = target;
      
      // remove all old highlights
      timeline.clearSelection();
      
      // determine which row was clicked
      var offset = e.pageY - $('.timeline-svg').offset().top;
      timeline.mousedownMarkerRow = Math.floor(offset/timeline.rowHeight);
      
      // Indicate the start of a range and that the
      // mouse is currently down on the timeline. This
      // should be reset on mouseup
      timeline.mousedownOnMarker = true;
      timeline.rangeStartMarker = target;
      
      // add the selected class to the marker
      if(targetClassName.indexOf("selected") === -1) {
        target.className.baseVal += " selected";
      }
    },
    
    timelineMousemoveFn: function(e) {
      var timeline = window._foundry.timeline;
      
      // if the mouse wasn't pushed down on a marker,
      // cut out early
      if(!timeline.mousedownOnMarker) {return;}
      
      e = e || window.event;
      
      // event delegation
      var target = e.target || e.srcElement;
      var targetClassName = target.className.baseVal;
      if(targetClassName.indexOf("marker") === -1) {return;}
      
      
      if(timeline.mousedownMarker !== undefined) {
        var targetLeft = parseInt(target.getAttribute("x"));
        var startLeft = parseInt(timeline.mousedownMarker.getAttribute("x"));
        
        if(targetLeft > startLeft) {
          // dragging forward
          timeline.rangeStartMarker = timeline.mousedownMarker;
          timeline.rangeEndMarker = target;
        } else {
          // dragging backward
          timeline.rangeStartMarker = target;
          timeline.rangeEndMarker = timeline.mousedownMarker;
        }
        
        timeline.highlightMarkerRange(
          timeline.rangeStartMarker,
          timeline.rangeEndMarker,
          timeline.mousedownMarkerRow
        );
      }
    },
    
    // should be attached to the window mouseup event
    timelineMouseupFn: function(e) {
      var timeline = window._foundry.timeline;
      
      timeline.mousedownMarker = undefined;
      timeline.mousedownOnMarker = false;
    },
    
    timelineKeyupFn: function(e) {
      var timeline = _foundry.timeline;
      
      // ctrl-n or enter key
      var newEventKey = (e.ctrlKey && e.keyCode === 78) || (e.keyCode === 13);
      if(newEventKey && timeline.rangeStartMarker && timeline.rangeEndMarker) {
        var point = [
          timeline.rangeStartMarker.getAttribute("x"),
          timeline.rangeStartMarker.getAttribute("y")
        ];
        console.log(point);
        newEvent(point);
        timeline.clearSelection();
      }
    }
  },
};

window.addEventListener("mouseup", _foundry.timeline.timelineMouseupFn);
window.addEventListener("keyup", _foundry.timeline.timelineKeyupFn);

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


//VCom Calculates how many hours to add when user expands timeline manually 
//Increases by 1/3 each time (130% original length)
function calcAddHours(currentHours) {
    TIMELINE_HOURS = currentHours + Math.floor(currentHours/3);
    TOTAL_HOUR_PIXELS = TIMELINE_HOURS * HOUR_WIDTH;
    SVG_WIDTH = TIMELINE_HOURS * HOUR_WIDTH + 50;
    XTicks = TOTAL_HOUR_PIXELS / STEP_WIDTH;
}

//Should have updated the variables: TIMELINE_HOURS, TOTAL_HOUR_PIXELS, SVG_WIDTH, XTicks
//Redraws timeline based on those numbers
function redrawTimeline() {
  // an array of the numbers [0, 1, 2, ..., numSteps-1]
  var intervals = (
      function (steps){
          var a = []; steps++;
          for(var i = 0; i < steps; i++) {
            a.push(i);
          }
          return a;
      })(TOTAL_HOUR_PIXELS / STEP_WIDTH);

  console.log(SVG_HEIGHT);
  console.log(YTicks);
  console.log(ROW_HEIGHT);

  //Reset overlay and svg width
  document.getElementById("overlay").style.width = SVG_WIDTH + 50 + "px";
  timeline_svg.attr("width", SVG_WIDTH);
  
  //Remove all existing grid lines & background
  timeline_svg.selectAll("line").remove();
  timeline_svg.selectAll("rect.marker").remove();

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
  timeline_svg.selectAll("rect.marker")
      .data(intervals) // hour intervals
      .enter().append("rect")
          .attr("class", "marker")
          .style("fill", function(d) {return Math.floor(d/4) % 2 === 0 ? MARKER_COLOR : ALT_MARKER_COLOR;})
          .attr("x", function(d) {return d * STEP_WIDTH})
          .attr("width", STEP_WIDTH)
          .attr("y", 0)
          .attr("height", SVG_HEIGHT);

  // draw x grid lines to timeline svg
  timeline_svg.selectAll("line.x")
      .data(intervals)
      .enter().append("line")
      .attr("class", "x")
      .attr("x1", function(d) {return d * STEP_WIDTH})
      .attr("x2", function(d) {return d * STEP_WIDTH})
      .attr("y1", 0)
      .attr("y2", SVG_HEIGHT)
      .style("stroke", STROKE_COLOR);
  
  //Draw y axis grid lines
  timeline_svg.selectAll("line.y")
      .data(intervals.slice(0, YTicks-1)) 
      .enter().append("line")
      .attr("class", "y")
      .attr("x1", 0)
      .attr("x2", "100%")
      // TODO: same hack carried over, adds height to first row
      //       will adjust blocks on that row to stay at the same
      //       height as blocks on lower rows
      .attr("y1", function(d) {return 20 + (d+1) * ROW_HEIGHT - 3})
      .attr("y2", function(d) {return 20 + (d+1) * ROW_HEIGHT - 3})
      .style("stroke", STROKE_COLOR);
      
    
  //Redraw Add Time Button
  document.getElementById("timeline-header").style.width = SVG_WIDTH - 50 + "px";
  
  //Remove existing X-axis labels
  timeline_svg.selectAll("text.timelabel").remove();
  numMins = -60;
  
  //Add ability to draw rectangles on extended timeline
  timeline_svg
      .on("mousedown", _foundry.timeline.timelineMousedownFn)
      .on("mousemove", _foundry.timeline.timelineMousemoveFn);

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

redrawTimeline();