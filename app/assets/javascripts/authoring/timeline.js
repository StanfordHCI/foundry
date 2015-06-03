/* Timeline.js
 * ---------------------------------------------
 * Code that manages the workflow timeline in Foundry.
 */


var SVG_WIDTH = 4850,
    SVG_HEIGHT = 550;

var HEADER_HEIGHT = 28;

var STEP_WIDTH = 22,
    HOUR_WIDTH = 4 * STEP_WIDTH;

// declared in events.js
var RECTANGLE_WIDTH = HOUR_WIDTH;

var STEP_INTERVAL = 15; // minutes per step

var TIMELINE_HOURS = 48;
var TOTAL_HOUR_PIXELS = TIMELINE_HOURS*HOUR_WIDTH;

var XTicks = TOTAL_HOUR_PIXELS / STEP_WIDTH,
    YTicks = 6;

var ROW_HEIGHT = ROW_HEIGHT || 80;

var BKG_COLOR = "white";
var STROKE_COLOR = "rgba(233,233,233,0.4)";
var STRONG_STROKE_COLOR = "rgba(227, 227, 227, 0.8)";
var MARKER_COLOR = "transparent";
var ALT_MARKER_COLOR = "transparent";

var current = undefined;
var currentUserEvents = [];
var currentUserIds = [];
var upcomingEvent; 

//Remove existing X-axis labels
var numMins = -60;

var timelineDiv = $('<div  ondrop="drop(event)" ondragover="allowDrop(event)" class="timeline"></div>');
$("#timeline-container").css({
  backgroundColor: BKG_COLOR,
}).append(timelineDiv);


var d3TimelineElem = d3.select("#timeline-container .timeline");

var header_svg = d3TimelineElem.append("svg")
  .attr("width", SVG_WIDTH)
  .attr("height", HEADER_HEIGHT)
  .attr("class", "header-svg")
  .style({"display": "block",
          "border-bottom": "solid 1px " + STROKE_COLOR});

//Append timeline to DOM
var timeline_svg = d3TimelineElem.append("svg")
    .attr("class", "timeline-svg chart")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT);
(function() {
  var gridLayer = timeline_svg.append("g")
        .attr("width", SVG_WIDTH)
        .attr("height", SVG_HEIGHT)
        .attr("class", "grid-layer");
  
  var selectionLayer = timeline_svg.append("g")
        .attr("width", SVG_WIDTH)
        .attr("height", SVG_HEIGHT)
        .attr("class", "selection-layer");
  
  var handoffLayer = timeline_svg.append("g")
        .attr("width", SVG_WIDTH)
        .attr("height", SVG_HEIGHT)
        .attr("class", "handoff-layer");
  
  var collabLayer = timeline_svg.append("g")
        .attr("width", SVG_WIDTH)
        .attr("height", SVG_HEIGHT)
        .attr("class", "collab-layer");
  
  var eventLayer = timeline_svg.append("g")
        .attr("width", SVG_WIDTH)
        .attr("height", SVG_HEIGHT)
        .attr("class", "event-layer");
  
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

      selection: undefined,

      stepInterval: STEP_INTERVAL,

      stepWidth: STEP_WIDTH,

      hourWidth: HOUR_WIDTH,

      timelineSvg: timeline_svg,

      gridLayer: gridLayer,

      selectionLayer: selectionLayer,

      handoffLayer: handoffLayer,

      collabLayer: collabLayer,
      
      eventLayer: eventLayer,

      svgHeight: SVG_HEIGHT,

      svgWidth: SVG_WIDTH,

      headerSvg: header_svg,

      rowHeight: ROW_HEIGHT,

      highlightSvg: undefined,

      strokeColor: STROKE_COLOR,

      strongStrokeColor: STRONG_STROKE_COLOR,

      markerColor: MARKER_COLOR,

      altMarkerColor: ALT_MARKER_COLOR,

      numRows: 1,

      rowCoverSvg: undefined,


      _svgSizeKeys: ["timelineSvg", "gridLayer", "selectionLayer",
                     "handoffLayer", "collabLayer", "eventLayer"],
      /**
       * Resizes the timeline SVG and all of its layers
       * @param number width
       * @param number height
       */
      resizeSvg: function(width, height) {
        var timeline = _foundry.timeline;
        for(var i = 0; i < timeline._svgSizeKeys.length; i++) {
          var key = timeline._svgSizeKeys[i];
          var svg = timeline[key];
          if(width) {
            svg.attr("width", width);
          }
          if(height) {
            svg.attr("height", height);
          }
        }
      },

      /* highlightMarkerRange
       * --------------------
       * highlights a range given two markers and a row
       */
      highlightMarkerRange: function(m1, m2, row) {
        var timeline = _foundry.timeline;
        var timelineSvg = timeline.timelineSvg;

        var left = parseInt(m1.getAttribute("x"));
        var width =   parseInt(m2.getAttribute("x"))
                    + parseInt(m2.getAttribute("width"))
                    - left;

        if(!timeline.selection) {
          timeline.selection = {};
        }

        timeline.selection.startMarker = m1;
        timeline.selection.endMarker = m2;

        if(!timeline.selection.svg) {
          timeline.selection.svg = timeline.selectionLayer
            .insert("rect", ":first-child")
            .attr("class", "selection");
        }

        timeline.selection.svg
          .attr("x", left)
          .attr("y", row * timeline.rowHeight)
          .attr("width", width)
          .attr("height", timeline.rowHeight)
          .style({
            "pointer-events": "none",
            "fill": "rgba(75, 158, 214, 0.52)"
        });
      },

      clearSelection: function() {
        var timeline = _foundry.timeline;

        timeline.selectionLayer.select("rect.selection").remove();

        timeline.rangeStartMarker = undefined;
        timeline.rangeEndMarker = undefined;
        timeline.selection = undefined;
      },

      getRangeDuration: function(m1, m2) {
        var timeline = window._foundry.timeline;
        var left = parseInt(m1.getAttribute("x"));
        var width =   parseInt(m2.getAttribute("x"))
                    + parseInt(m2.getAttribute("width"))
                    - left;
        return (width / timeline.stepWidth) * timeline.stepInterval;
      },

      /* timelineMousedownFn
       * -------------------
       * mousedown function for the timeline svg, kept here
       * for maintenance purposes.
       *
       * Enables drag selection
       */
      timelineMousedownFn: function() {
        var e = d3.event;

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

        // Indicate the start of a range and that the mouse is currently down on
        // the timeline. This should be reset on mouseup
        timeline.mousedownOnMarker = true;
        timeline.rangeStartMarker = target;

        // add the selected class to the marker
        if(targetClassName.indexOf("selected") === -1) {
          target.className.baseVal += " selected";
        }
      },

      timelineMouseoverFn: function() {
        var timeline = window._foundry.timeline;

        // if the mouse wasn't pushed down on a marker,
        // cut out early
        if(!timeline.mousedownOnMarker) {return;}

        if(timeline.mousedownMarker !== undefined) {

          var start = parseInt(timeline.mousedownMarker.getAttribute("x"));
          var coords = d3.mouse(timeline.timelineSvg.node());
          var end = coords[0];

          var numMarkers = Math.floor((end - start) / timeline.stepWidth);

          var startMarkerNum = parseInt(
                                   timeline.mousedownMarker
                                          .getAttribute("marker-num"));

          var endMarkerNum = startMarkerNum + numMarkers;
          var endMarker = d3.select(".marker[marker-num='" + endMarkerNum + "']")
                              .node();

          if(endMarkerNum > startMarkerNum) {
            // moving forward
            timeline.rangeStartMarker = timeline.mousedownMarker;
            timeline.rangeEndMarker = endMarker;
          } else {
            // moving backward
            timeline.rangeStartMarker = endMarker;
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
      timelineMouseupFn: function() {
        var timeline = window._foundry.timeline;

        timeline.mousedownMarker = undefined;
        timeline.mousedownOnMarker = false;

        if(timeline.selection) {
          timeline.createEventFromSelection();
        }
      },

      createEventFromSelection: function() {
        var timeline = window._foundry.timeline;
        if(!timeline.selection) return;
        var point = [
          timeline.selection.svg.attr("x"),
          timeline.selection.svg.attr("y")
        ];

        console.log("PointX= " + timeline.selection.svg.attr("x") + ", PointY=" + timeline.selection.svg.attr("y"));

        var duration = timeline.getRangeDuration(
            timeline.rangeStartMarker,
            timeline.rangeEndMarker
        );

        timeline.clearSelection();
        if(duration >= 30) {
          newEvent(point, duration);
        } else {
          // TODO: give some sort of response
        }
      },

      /**
       * updates the number of rows on the timeline and moves
       * overlay accordingly
       * @param {number} numRows
       */
      updateNumRows: function(numRows) {
        this.numRows = numRows;
        redrawTimeline();
      }
    }
  };
})();

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
  var timeline = window._foundry.timeline;
  
  // an array of the numbers [0, 1, 2, ..., numSteps-1]
  var intervals = (
      function (steps){
          var a = []; steps++;
          for(var i = 0; i < steps; i++) {
            a.push(i);
          }
          return a;
      })(TOTAL_HOUR_PIXELS / STEP_WIDTH);

  var timelineSvg = timeline.timelineSvg;
  var gridLayer = timeline.gridLayer;
  
  //Reset svg width
  timeline.resizeSvg(SVG_WIDTH, SVG_HEIGHT);
  
  //Remove all existing grid lines & background
  gridLayer.selectAll("line.grid-line").remove();
  gridLayer.selectAll("rect.marker").remove();
  
  // draw markers to timeline svg
  gridLayer.selectAll("rect.marker")
      .data(intervals) // hour intervals
      .enter().append("rect")
          .attr("class", "marker")
          .attr("marker-num", function(d) {return d;})
          .style("fill",
                 function(d) {
                   var stepsPerHour = HOUR_WIDTH / STEP_WIDTH;
                   return Math.floor(d/stepsPerHour) % 2 == 0 ? 
                     timeline.markerColor : timeline.altMarkerColor;
                 })
          .attr("x", function(d) {return d * STEP_WIDTH})
          .attr("width", STEP_WIDTH)
          .attr("y", 0)
          .attr("height", SVG_HEIGHT)

  // reset timeline svg width
  timeline.resizeSvg(TOTAL_HOUR_PIXELS);

  // draw x grid lines to timeline svg
  gridLayer.selectAll("line.x")
      .data(intervals)
      .enter().append("line")
      .attr("class", "x grid-line")
      .attr("x1", function(d) {return d * STEP_WIDTH})
      .attr("x2", function(d) {return d * STEP_WIDTH})
      .attr("y1", 0)
      .attr("y2", SVG_HEIGHT)
      .style("stroke",
        function(d) {
          var stepsPerHour = HOUR_WIDTH / STEP_WIDTH;
          return d % stepsPerHour == 0 ? 
            timeline.strongStrokeColor : timeline.strokeColor;
      });

  // draw y grid lines to timeline svg
  var numRows = _foundry.timeline.numRows;
  gridLayer.selectAll("line.y")
      .data(intervals.slice(1, numRows+1))
      .enter().append("line")
        .attr("class", "y grid-line")
        .attr("x1", 0)
        .attr("x2", "100%")
        .attr("y1", function(d) {return d * _foundry.timeline.rowHeight;})
        .attr("y2", function(d) {return d * _foundry.timeline.rowHeight;})
        .style("stroke", _foundry.timeline.strokeColor);
  
  // redraw row cover
  gridLayer.selectAll("rect.row-cover").remove();
  timeline.rowCoverSvg = gridLayer
    .append("rect").attr("class", "row-cover")
    .attr("x", 0)
    .attr("y", numRows * timeline.rowHeight)
    .attr("width", "100%")
    .attr("height", "100%")
    .style("fill", "rgba(0, 0, 0, 0.04)");
  
  //Remove existing X-axis labels
  gridLayer.selectAll("text.timelabel").remove();
  numMins = -60;
  
  //Add ability to draw rectangles on extended timeline
  timelineSvg
      .on("mousedown", _foundry.timeline.timelineMousedownFn)
      .on("mouseover", _foundry.timeline.timelineMouseoverFn);
  
  var headerSvg = timeline.headerSvg;
  // reset header svg width
  headerSvg.attr("width", TOTAL_HOUR_PIXELS)
  
  // draw lines to header svg
  headerSvg.selectAll("line")
      .data(intervals.slice(0, intervals.length/4))
      .enter().append("line")
      .attr("x1", function(d) {return d * (timeline.stepWidth * 4)})
      .attr("x2", function(d) {return d * (timeline.stepWidth * 4)})
      .attr("y1", HEADER_HEIGHT - 12)
      .attr("y2", HEADER_HEIGHT)
      .style("stroke", timeline.strokeColor);
  
  // draw timeline time intervals to header svg
  headerSvg.selectAll("text.time-marker")
      .data(intervals.slice(0, intervals.length/4))
      .enter().append("text")
          .attr("class", "time-marker")
          .style("width", STEP_WIDTH * 4)
          .text(function(d) {return d + ':00';})
          .attr("x", function(d) {return d * (timeline.stepWidth * 4) + 4})
          .attr("y", HEADER_HEIGHT - 2)
          .style({
              "font-family": "Helvetica Neue",
              "font-size": "10px",
              "font-weight": "400",
              "fill": "#777",
          });

  //Get the latest time and team status, update x position of cursor
  // cursor = timeline_svg.select(".cursor");
  
  //NOTE from DR: I commented out the block of code below because it was raising an error when the timeline was loaded 
  //and the same exact code is included in awareness.js
  
  /* var latest_time;
  if (in_progress){
      latest_time = (new Date).getTime();
  } else {
      latest_time = loadedStatus.latest_time;
  }*/
  
  //Next line is commented out after disabling the ticker
  //cursor_details = positionCursor(flashTeamsJSON, latest_time);

  //move all existing events back on top of timeline
  //$(timelineSvg.selectAll('g')).each(function() {
  //    $('.chart').append(this);
  //});
}

redrawTimeline();
