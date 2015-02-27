/* events.js
 * ---------------------------------------------
 * 
 */

var RECTANGLE_WIDTH = window._foundry.timeline.hourWidth || 100;
var RECTANGLE_HEIGHT = 70;
var HIRING_HEIGHT = 50;
var DRAGBAR_WIDTH = 8;
var event_counter = 0;
var GUTTER = 20;

/*$(document).ready(function(){
    timeline_svg.append("rect")
    .attr("class", "background")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT)
    .attr("fill", "white")
    .attr("fill-opacity", 0)
    .on("mousedown", function(){
        var point = d3.mouse(this);
        newEvent(point);
    });
});*/

var dragged = false;

//Called when the right dragbar of a task rectangle is dragged
var drag_right = d3.behavior.drag()
    .on("drag", rightResize)
    .on("dragend", function(d){
        updateStatus(false);
    });

//Called when the left dragbar of a task rectangle is dragged
var drag_left = d3.behavior.drag()
    .on("drag", leftResize)
    .on("dragend", function(d){
        updateStatus(false);
    });

//Called when task rectangles are dragged
var drag = d3.behavior.drag()
    .origin(Object)
    .on("dragstart", function(d) {
        var ev = getEventFromId(d.groupNum);
        originalEV = JSON.parse(JSON.stringify(ev)); //deep copy orig position
    })
    .on("drag", dragEventBlock)
    .on("dragend", function(d){
        console.log("original", originalEV);
        if(dragged){
            dragged = false;
            var ev = getEventFromId(d.groupNum);

            //Check if handoffs will make this a bag drag
            var outOfRange = false;
            
            updateStatus(false);
            console.log("current", ev);
        } else {
            // click
            eventMousedown(d.groupNum);
        } 
    });

// leftResize: resize the rectangle by dragging the left handle
function leftResize(d) {
    if(isUser || in_progress) { // user page
        return;
    }

    // get event id
    var groupNum = d.groupNum;

    // get event object
    var ev = getEventFromId(groupNum);
    
    // get new left x
    var width = getWidth(ev);
    var rightX = ev.x + width;
    var newX = d3.event.x - (d3.event.x%(STEP_WIDTH)) - DRAGBAR_WIDTH/2;
    if(newX < 0){
        newX = 0;
    }
    var newWidth = width + (ev.x - newX);
    if (newWidth < 30)
        return;
    
    // update x and draw event
    ev.x = newX;
    ev.min_x = newX;
    ev.duration = durationForWidth(newWidth);
    
    var startHr = startHrForX(newX);
    var startMin = startMinForX(newX);
  
    ev.startHr = startHr;
    ev.startMin = startMin;
    ev.startTime = startHr * 60 + startMin;

    drawEvent(ev, false);
}

// rightResize: resize the rectangle by dragging the right handle
function rightResize(d) {
    if(isUser || in_progress) { // user page
        return;
    }

    // get event id
    var groupNum = d.groupNum;

    // get event object
    var ev = getEventFromId(groupNum);

    var newX = d3.event.x - (d3.event.x%(STEP_WIDTH)) - (DRAGBAR_WIDTH/2);
    if(newX > SVG_WIDTH){
        newX = SVG_WIDTH;
    }
    var newWidth = newX - ev.x;
    if (newWidth < 30) {
        return;
    }
    ev.duration = durationForWidth(newWidth);

    drawEvent(ev, false);
}

function dragEventBlock(d) {
    if(isUser || in_progress) { // user page
        return;
    }
    dragged = true;

    // get event id
    var groupNum = d.groupNum;

    // get event object
    var ev = getEventFromId(groupNum);
    var width = getWidth(ev);

    //Horizontal dragging
    var dragX = d3.event.x - (d3.event.x%(STEP_WIDTH)) - DRAGBAR_WIDTH/2;
    var newX = Math.max((0 - (DRAGBAR_WIDTH/2)), Math.min(SVG_WIDTH-width, dragX));
    if (d3.event.dx + d.x < 0) newX = (0 - (DRAGBAR_WIDTH/2));
    
    ev.x = newX;
    ev.min_x = newX;

    //update start time, start hour, start minute
    var startHr = startHrForX(newX);
    var startMin = startMinForX(newX);
    ev.startHr = startHr;
    ev.startMin = startMin;
    ev.startTime = startHr * 60 + startMin;

    //Vertical Dragging
    var rowHeight = window._foundry.timeline.rowHeight;
    
    var currentY = rowHeight * ev.row;
    var dy = Math.floor(d3.event.y - currentY);
    var newRow = ev.row + Math.floor(dy/rowHeight);
    if(newRow < 0 || newRow > window._foundry.timeline.numRows - 1) {
      return;
    }
    ev.row = newRow;
    ev.y = currentY+5;
    updateStatus();
    drawEvent(ev, false);   
}

//VCom Calculates where to snap event block to when created
function calcSnap(mouseX, mouseY) {
    var timeline = window._foundry.timeline;
    var snapX = timeline.stepWidth * Math.floor(mouseX/timeline.stepWidth);
    var snapY = 5 + timeline.rowHeight * Math.floor(mouseY/timeline.rowHeight);
    return [snapX, snapY];
    
}

// drag on timeline => creates new event and draws it
function newEvent(point, duration) {
    // interactions
    if(DRAWING_HANDOFF==true || DRAWING_COLLAB==true) {
        alert("Please click on another event or the same event to cancel");
        return;
    }
    if (overlayIsOn) {
        overlayOff();
        return;
    } 

    if(isUser || in_progress) { // user page
        return;
    }
    createEvent(point, duration);
};

function createEvent(point, duration) {
    // get coords where event should snap to
    var snapPoint = calcSnap(point[0], point[1]);
  
    if(!checkWithinTimelineBounds(snapPoint)){ return; }

    // create event object
    var eventObj = createEventObj(snapPoint, duration);
    

    // render event on timeline
    drawEvent(eventObj, true);

    // save
    updateStatus(false);
};

function checkWithinTimelineBounds(snapPoint) {
    return ((snapPoint[1] < 505) && (snapPoint[0] < (SVG_WIDTH-150)));
};

function getStartTime(mouseX) {
    var startHr = startHrForX(mouseX);
    var startMin = startMinForX(mouseX);
    
    var startTimeinMinutes = parseInt((startHr*60)) + parseInt(startMin);
    return {"startHr":startHr, "startMin":startMin, "startTimeinMinutes":startTimeinMinutes};
};

function getDuration(leftX, rightX) {
    var hrs = Math.floor(((rightX-leftX)/100));
    var min = (((rightX-leftX)%(Math.floor(((rightX-leftX)/100))*100))/25*15);
    var durationInMinutes = parseInt((hrs*60)) + parseInt(min);

    return {"duration":durationInMinutes, "hrs":hrs, "min":min};
};

//task_startBtn_time and task_endBtn_time refer to the time when the start button and end button on the task is clicked.
function createEventObj(snapPoint, duration) {
    event_counter++; //this was previously used to assign IDs to events but now we use the createEventId() function instead to make sure that IDs are unique within a team
    
    duration = duration || 60;
    
    var startTimeObj = getStartTime(snapPoint[0]);
  
    var newEvent = {
        "title":"New Event", "id":createEventId(), 
        "x": snapPoint[0]-4, "min_x": snapPoint[0], "y": snapPoint[1], //NOTE: -4 on x is for 1/15/15 render of events
        "startTime": startTimeObj["startTimeinMinutes"], "duration":duration, 
        "members":[], timer:0, task_startBtn_time:-1, task_endBtn_time:-1,
        "dri":"", "pc":"", "notes":"", "startHr": startTimeObj["startHr"], "status":"not_started",
        "startMin": startTimeObj["startMin"], "gdrive":[], "completed_x":null, "inputs":"", "outputs":"", events_after : "",
        "docQs": [["Please explain all other design or execution decisions made, along with the reason they were made",""], 
        ["Please add anything else you want other team members, the project coordinator, or the client, to know. (optional)",""]],
        "outputQs":{},"row": Math.floor((snapPoint[1]-5)/_foundry.timeline.rowHeight)};
      //add new event to flashTeams database
    /*
if (flashTeamsJSON.events.length == 0 || !flashTeamsJSON.folder){
        createNewFolder(document.getElementById("ft-name").innerHTML);
        //createNewFolder($("#flash_team_name").val());
    }
*/
    flashTeamsJSON.events.push(newEvent);
    
    return newEvent;
};

function createEventId(){
	var timestamp = new Date();
	event_timestamp = Math.floor(timestamp.getTime());
	//console.log("eventId: " + event_timestamp);
	return event_timestamp;
}

function getEventFromId(id) {
    var events = flashTeamsJSON.events;
    for(var i=0;i<events.length;i++){
        var ev = events[i];
        if(ev.id == id){
            return ev;
        }
    }
    return null;
};

function checkEventsCompleted(events) {
    for (var i=0; i<events.length; i++){
        var event_obj = getEventFromId(events[i]);
        if (event_obj.completed_x == null){
            return false;
        }
    }
    return true;
}

//Return the width in pixels of an event
function getWidth(ev) {
    var durationInMinutes = ev.duration;
    var hrs = parseFloat(durationInMinutes)/parseFloat(60);
    var width = parseFloat(hrs)*parseFloat(RECTANGLE_WIDTH);
    var roundedWidth = Math.round(parseFloat(width)/parseFloat(STEP_WIDTH))*STEP_WIDTH;
    return roundedWidth;
};

function durationForWidth(width) {
    var hrs = parseFloat(width)/parseFloat(RECTANGLE_WIDTH);
    var mins = hrs*60;
    return Math.ceil(mins/15) * 15;
};

function startHrForX(X){
    var roundedX = Math.round(X/STEP_WIDTH) * STEP_WIDTH;
    var hrs = Math.floor(parseFloat(roundedX)/parseFloat(RECTANGLE_WIDTH));
    return hrs;
};

function startMinForX(X){
    var roundedX = Math.round(X/STEP_WIDTH) * STEP_WIDTH;
    var mins = (parseFloat(roundedX) % parseFloat(RECTANGLE_WIDTH)) * 60 / parseFloat(RECTANGLE_WIDTH);
    return mins;
};

function drawRightDragBar(eventObj, firstTime) {
    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);
    var width = getWidth(eventObj);

    var existingRightDragBar = task_g.selectAll("#rt_rect_" + groupNum);
    if(existingRightDragBar[0].length == 0){ // first time
        task_g.append("rect")
            .attr("class", "rt_rect")
            .attr("x", function(d) { 
                return d.x + width - (GUTTER/4); })
            .attr("y", function(d) {return d.y})
            .attr("id", function(d) {
                return "rt_rect_" + d.groupNum; })
            .attr("groupNum", function(d) {return d.groupNum})
            .attr("height", RECTANGLE_HEIGHT)
            .attr("width", DRAGBAR_WIDTH)
            .attr("fill", "#00")
            .attr("fill-opacity", .6)
            .attr('pointer-events', 'all')
            .call(drag_right);
    } else {
        task_g.selectAll(".rt_rect")
            .attr("x", function(d) {return d.x + width - (GUTTER/4);})
            .attr("y", function(d) {return d.y});
    }
}

function drawLeftDragBar(eventObj, firstTime) {
    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);

    var existingLeftDragBar = task_g.selectAll("#lt_rect_" + groupNum);
    if(existingLeftDragBar[0].length == 0){ // first time
        task_g.append("rect")
            .attr("class", "lt_rect")
            .attr("x", function(d) { return (d.x + (GUTTER/4));})
            .attr("y", function(d) {return d.y})
            .attr("id", function(d) {
                return "lt_rect_" + d.groupNum; })
            .attr("groupNum", function(d) {return d.groupNum})
            .attr("height", RECTANGLE_HEIGHT)
            .attr("width", DRAGBAR_WIDTH)
            .attr("fill", "#00")
            .attr("fill-opacity", .6)
            .attr('pointer-events', 'all')
            .call(drag_left);
    } else {
        task_g.selectAll(".lt_rect")
            .attr("x", function(d) {return d.x + (GUTTER/4);}) 
            .attr("y", function(d) {return d.y});
    }
}

function drawDurationText(eventObj, firstTime) {
    var x_offset = 15; // unique for duration (NOTE FROM DR: Used to be 10)
    var y_offset = 26; // unique for duration

    var totalMinutes = eventObj["duration"];
    var numHoursInt = Math.floor(totalMinutes/60);
    var minutesLeft = Math.round(totalMinutes%60);

    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);

    var existingDurationText = task_g.selectAll("#time_text_" + groupNum);
    if(existingDurationText[0].length == 0){ // first time
        task_g.append("text")
            .text(function (d) {
                if (numHoursInt == 0){
                    return minutesLeft+"min";
                }
                else
                    return numHoursInt+"hrs "+minutesLeft+"min";
            })
            .attr("class", "time_text")
            .attr("id", function(d) {return "time_text_" + groupNum;})
            .attr("groupNum", function(d){return d.groupNum})
            .attr("x", function(d) {return d.x + x_offset})
            .attr("y", function(d) {return d.y + y_offset})
            .attr("font-size", "12px");
    } else {
        task_g.selectAll(".time_text")
            .text(function (d) {
                if (numHoursInt == 0){
                    return minutesLeft+"min"; 
                }
                else
                    return numHoursInt+"hrs "+minutesLeft+"min";
            })
            .attr("x", function(d) {return d.x + x_offset})
            .attr("y", function(d) {return d.y + y_offset});
    }
}

function drawGdriveLink(eventObj, firstTime) {
    var x_offset = 15; // unique for gdrive link (NOTE FROM DR: Used to be 10)
    var y_offset = 38; // unique for gdrive link

    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);

    var existingGdriveLink = task_g.selectAll("#gdrive_" + groupNum);
    if(existingGdriveLink[0].length == 0){ // first time
        task_g.append("text")
            .text("Upload")
            .attr("style", "cursor:pointer; text-decoration:underline; text-decoration:bold;")
            .attr("class", "gdrive_link")
            .attr("id", function(d) {return "gdrive_" + d.groupNum;})
            .attr("groupNum", function(d){return d.groupNum})
            .attr("x", function(d) {return d.x + x_offset})
            .attr("y", function(d) {return d.y + y_offset})
            .attr("fill", "blue")
            .attr("font-size", "12px");

        // open gdrive upon click
        $("#gdrive_" + groupNum).on('click', function(ev){
            ev.stopPropagation();
            
            if (flashTeamsJSON["events"][groupNum-1].gdrive.length > 0){
                window.open(flashTeamsJSON["events"][groupNum-1].gdrive[1])
            }
            else{
                alert("The flash team must be running for you to upload a file!");
            }
        });
    } else {
         task_g.selectAll(".gdrive_link")
            .attr("x", function(d) {return d.x + x_offset})
            .attr("y", function(d) {return d.y + y_offset});
    }
}


function findCurrentUserNextEvent(currentUserEvents){
    //console.log("currentUserEvents: " + currentUserEvents);
    for (var i = 0; i < currentUserEvents.length; i++){
        if(currentUserEvents[i].status == "not_started" || currentUserEvents[i].status == "delayed"){
            return currentUserEvents[i]["id"];      
        }
    }
}

function drawEachHandoffForEvent(eventObj){
    var interactions = flashTeamsJSON["interactions"];
    var eventHandoffs = retHandoffsForEvent(eventObj["id"]);
    for (var i = 0; i < eventHandoffs.length; i++){
        var inter = flashTeamsJSON["interactions"][getIntJSONIndex(eventHandoffs[i])];
        var draw = false;
        var ev1;
        var ev2;
        if (inter["event1"] == eventObj["id"]){
            ev1 = eventObj;
            ev2 = flashTeamsJSON["events"][getEventJSONIndex(inter["event2"])];
        }
        else if (inter["event2"] == eventObj["id"]){
            ev1 = flashTeamsJSON["events"][getEventJSONIndex(inter["event1"])];
            ev2 = eventObj;
        }  
        
        var task1end = ev1.startTime + ev1.duration;
        if (task1end <= ev2.startTime) { 
            //Reposition an existing handoff
            var x1 = handoffStart(ev1);
            var y1 = ev1.y + 50;
            var x2 = ev2.x + 3;
            var y2 = ev2.y + 50;
            $("#interaction_" + inter["id"])
                .attr("d", function(d) {
                    return routeHandoffPath(ev1, ev2, x1, x2, y1, y2); 
                })
                .attr("stroke", function() {
                    if (isWorkerInteraction(inter["id"])) return WORKER_TASK_NOT_START_COLOR;
                    else return "gray";
                });
        } else { //Out of range
            //alert("Bag drag");
            $("#interaction_" + inter["id"]).fadeOut();
            setTimeout(function() {
                deleteInteraction(inter["id"]);
            }, 1000);
            //bootstrap alert, put back in original space
        }
    }
}

function drawEachCollabForEvent(eventObj){
    var interactions = flashTeamsJSON["interactions"];
    for (var i = 0; i < interactions.length; i++){
        var inter = interactions[i];
        var draw = false;
        if (inter["type"] == "collaboration"){
            if (inter["event1"] == eventObj["id"]){
                draw = true;
                var ev1 = eventObj;
                var ev2 = flashTeamsJSON["events"][getEventJSONIndex(inter["event2"])];
            }
            else if (inter["event2"] == eventObj["id"]){
                draw = true;
                var ev1 = flashTeamsJSON["events"][getEventJSONIndex(inter["event1"])];
                var ev2 = eventObj;
            }
            if (draw){
                var y1 = ev1.y;
                var x1 = ev1.x + 3;
                var x2 = ev2.x + 3;
                var y2 = ev2.y;
                var firstTaskY = 0;
                var taskDistance = 0;
                var overlap = eventsOverlap(ev1.x, getWidth(ev1), ev2.x, getWidth(ev2));

                if (overlap > 0) {
                    if (y1 < y2) {
                        firstTaskY = y1 + RECTANGLE_HEIGHT;
                        taskDistance = y2 - firstTaskY;
                    } else {
                        firstTaskY = y2 + RECTANGLE_HEIGHT;
                        taskDistance = y1 - firstTaskY;
                    }
                    if (x1 <= x2) var startX = x2;
                    else var startX = x1;
                    $("#interaction_" + inter["id"])
                        .attr("x", startX)
                        .attr("y", firstTaskY-9) //AT hack to fix offset from tab members
                        .attr("height", taskDistance+9)
                        .attr("width", overlap);
                } else { //Out of range
                    $("#interaction_" + inter["id"]).fadeOut();
                    setTimeout(function() {
                        deleteInteraction(inter["id"]);
                    }, 1000);
                }
            }
        }
    }
}

if(!window._foundry) {
    window._foundry = {};
}

(function() {
  var events = {
    bodyHeight: 64,
    
    tabHeight: 11,
    
    get totalHeight() {
        return events.bodyHeight + events.tabHeight;
    },
    
    get marginTop() {
        return (window._foundry.timeline.rowHeight - events.totalHeight)/2;
    },
    
    marginLeft: 4,
    
    iconOpacity: 0.38,
    
    /**
     * @param {object} eventObj
     * @returns true if the current user is assigned this task
     */
    isWorkerTask: function(eventObj) {
        return current_user && eventObj.members.indexOf(current_user.id) > - 1;
    },
    
    clock: {
        selector: ".clock_icon",
        tag: "image",
        attrs: {
            x: function(d) {return d.x + 10},
            y: function(d) {return d.y + 10},
            width: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                // set the width to zero if this is an hour long event
                return eventObj.duration <= 60 ? 0 : 9;
            },
            height: 9,
            "class": "clock_icon",
            "xlink:href": function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "/assets/icons/clock/clock.svg" : "/assets/icons/clock/clock_white.svg";
            }
        },
        
        style: {
            opacity: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    events.iconOpacity : 1;
            }
        }
    },
    
    /**
     * @param {string} text
     * @param {number} workingWidth
     * @param {object} [style]
     * @param {number} eventObjectId
     * @returns The string truncated enough to fit inside of the given working
     * width
     */
    getShortenedString: function(text, workingWidth, eventObjectId, style) {
        var textSvg = d3.select("#g_" + eventObjectId).append("text")
            .style(style)
            .style({color: "transparent"})
            .text(text);
        
        var length = text.length;
        while (textSvg.node().getBBox().width > workingWidth) {
            if(length === 0) {
                text = '...';
                break;
            }
            length--;
            text = text.substr(0, length) + "...";
            textSvg.text(text);
        }

        textSvg.remove();
        return text;
    },
    
    title: {
        selector: ".title",
        tag: "text",
        text: function(eventObj) {
            var title = eventObj.title;
            var clockAttrs = events.clock.attrs;
            
            
            var workingWidth =   getWidth(eventObj)
                               - 2 * events.marginLeft
                               - clockAttrs.width(d3.select("#g_" + eventObj.id).data()[0])
                               - 10 // clock's left margin
                               - 10 // right margin
                               - 5;
            
            return events.getShortenedString(
                title, workingWidth, eventObj.id, events.title.style);
        },
        
        attrs: {
            "class": "title",
            x: function(d) {
                var attrs = events.clock.attrs;
                return attrs.x(d) + attrs.width(d) + 5;
            },
            y: function(d) {return d.y + 19}
        },
        
        style: {
            "font-family": "proxima-nova",
            fill: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "#444" : "white";
            },
            "font-weight": function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    400 : 300;
            },
            "letter-spacing": "1px",
            "font-size": "12px",
            "text-transform": "uppercase"
        }
    },
    
    duration: {
        selector: ".duration",
        tag: "text",
        /**
         * @param {object} eventObj
         * @returns {string} the event's duration in the format 'x hrs y min'
         */
        text: function(eventObj) {
            var time = eventObj.timer || eventObj.duration;
            var sign = (time / Math.abs(time) < 0) ? "-" : "";
            
            var hours = Math.floor(Math.abs(time) / 60);
            var minutes = Math.abs(time) % 60;

            var durationArray = [];
            if(hours !== 0) {
                durationArray.push(hours + " " + (hours === 1 ? "hr" : "hrs"));
            }
            
            if(minutes !== 0) {
                var minStr = (eventObj.timer || time > 30 ? " min" : "");
                durationArray.push(minutes + minStr);
            }

            var timeStr = sign + durationArray.join(" ");
            
            var clockAttrs = events.clock.attrs;
            
            var d3Datum = d3.select("#g_" + eventObj.id).data()[0];
            var workingWidth =   getWidth(eventObj)
                               - 2 * events.marginLeft
                               - ((clockAttrs.x(d3Datum) - d3Datum.x) + clockAttrs.width(d3Datum))
                               - 10; // right padding
            return events.getShortenedString(
                timeStr, workingWidth, eventObj.id, events.duration.style);
        },
        
        attrs: {
            "class": "duration",
            x: function(d) {
                var clockAttrs = events.clock.attrs;
                return clockAttrs.x(d) + clockAttrs.width(d) + 4;
            },
            y: function(d) {return d.y + 32}
        },
        
        style: {
            "font-family": "proxima-nova",
            fill: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "#444" : "white";
            },
            "font-weight": function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    400 : 300;
            },
            "letter-spacing": "1px",
            "font-size": "10px",
            "text-transform": "uppercase"
        }
    },
    
    line: {
        selector: ".underline",
        tag: "line",
        attrs: {
            x1: function(d) {return d.x + 10},
            y1: function(d) {return d.y + 40},
            y2: function(d) {return d.y + 40},
            "class": "underline"
        },
        style: {
            "stroke": function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.24)"
            },
            "stroke-width": "1px"
        }
    },
    
    bottomBorder: {
        selector: ".bottom-border",
        tag: "rect",
        attrs: {
            x: function(d) {return d.x},
            y: function(d) {return d.y + events.bodyHeight},
            height: function(d) {return 2},
            class: "bottom-border"
        }
    },
    
    numMembersIcon: {
        selector: ".num-members-icon",
        tag: "image",
        attrs: {
            x: function(d) {return d.x + 10},
            y: function(d) {return d.y + events.bodyHeight - 18},
            width: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                // set the width to zero if this is an hour long event
                return eventObj.duration <= 60 ? 0 : 12;
            },
            height: 12,
            "xlink:href": function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "/assets/icons/member/member.svg" : "/assets/icons/member/member_white.svg";
            },
            "class": "num-members-icon",
            
            // tooltip stuff
            "data-toggle": "tooltip",
            "data-placement": "bottom",
            "data-container": "body",
            "data-animation": false,
            title: function(d) {
                var id = d.id.substr("task_g_".length);
                var event = getEventFromId(id);
                var str = event.members.length +
                    (event.members.length === 1 ? " member" : " members");
                return str;
            }
        },
        
        style: {
            opacity: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    events.iconOpacity : 1;
            }
        }
    },
    
    numMembers: {
        selector: ".num-members",
        tag: "text",
        text: function(eventObj) {return eventObj.members.length || 0;},
        attrs: {
            x: function(d) {
                var attrs = events.numMembersIcon.attrs;
                return attrs.x(d) + attrs.width(d) + 4;
            },
            y: function(d) {return d.y + window._foundry.events.bodyHeight - 9},
            style: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                // don't display the number of members if the event
                // is an hour or shorter
                return eventObj.duration <= 60 ? "display:none;" : "";
            },
            "class": "num-members"
        },
        style: {
            "font-size": "8px",
            fill: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "black" : "white";
            },
            "font-weight": 200,
            "font-family": "Helvetica"
        }
    },
    
    uploadIcon: {
        selector: ".upload",
        tag: "image",
        attrs: {
            x: function(d) {
                var iconWidth = events.uploadIcon.attrs.width(d);
                return events.collabIcon.attrs.x(d) - iconWidth;
            },
            y: function(d) {return d.y + events.bodyHeight - 19},
            width: function(d) {
                var iconWidth = 14;
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                var width = getWidth(eventObj) - 2 * events.marginLeft;
                var workingWidth = width - 2 * 10;
                if(workingWidth/3 < iconWidth) {
                    iconWidth = Math.floor(width/3) - 2;
                }
                return iconWidth;
            },
            height: 14,
            "xlink:href": function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                //console.log(d);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "/assets/icons/upload/upload.svg" : "/assets/icons/upload/upload_white.svg";
            },
            "class": "upload",
            
            // tooltip stuff
            "data-toggle": "tooltip",
            "data-placement": "bottom",
            "data-container": "body",
            "data-animation": false,
            title: "Upload files"
        },
        style: {
            cursor: "pointer",
            opacity: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    events.iconOpacity : 1;
            }
        }
    },
    
    collabIcon: {
        selector: ".collab_btn",
        tag: "image",
        attrs: {
            x: function(d) {
                var iconWidth = events.collabIcon.attrs.width(d);
                return events.handoffIcon.attrs.x(d) - iconWidth;
            },
            y: function(d) {return d.y + events.bodyHeight - 18},
            width: function(d) {
                var iconWidth = 14;
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                var width = getWidth(eventObj) - 2 * events.marginLeft;
                var workingWidth = width - 2 * 10;
                if(workingWidth/3 < iconWidth) {
                    iconWidth = Math.floor(width/3) - 2;
                }
                return iconWidth;
            },
            height: 14,
            "xlink:href": function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "/assets/icons/collaboration/collaboration.svg" :
                    "/assets/icons/collaboration/collaboration_white.svg";
            },
            id: function(d) {return "collab_btn_" + d.groupNum;},
            "class": "collab_btn",
            groupNum: function(d) {return d.groupNum},
            
            // tooltip stuff
            "data-toggle": "tooltip",
            "data-placement": "bottom",
            "data-container": "body",
            "data-animation": false,
            title: "Draw collaboration"
        },
        
        style: {
            opacity: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    events.iconOpacity : 1;
            }
        }
    },
    
    handoffIcon: {
        selector: ".handoff_btn",
        tag: "image",
        attrs: {
            x: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                var width = getWidth(eventObj) - 2 * events.marginLeft;
                var iconWidth = events.handoffIcon.attrs.width(d);
                
                // subtract the button's width and the right margin
                if(iconWidth !== 15) {
                    // if the width is to small to fit everything, just
                    // center the icons, don't worry about the padding
                    return (d.x + width - iconWidth) - (width - 3 * iconWidth)/2;
                } else {
                    return d.x + width - iconWidth - 10;
                }
            },
            y: function(d) {return d.y + events.bodyHeight - 19},
            width: function(d) {
                var iconWidth = 15;
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                var width = getWidth(eventObj) - 2 * events.marginLeft;
                var workingWidth = width - 2 * 10;
                
                if(workingWidth/3 < iconWidth) {
                    iconWidth = Math.floor(width/3) - 2;
                }
                
                return iconWidth;
            },
            height: 15,
            "xlink:href": function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "/assets/icons/arrow/right_arrow.svg" :
                    "/assets/icons/arrow/right_arrow_white.svg";
            },
            id: function(d) {return "handoff_btn_" + d.groupNum;},
            class: "handoff_btn",
            groupNum: function(d) {return d.groupNum},
            
            // tooltip stuff
            "data-toggle": "tooltip",
            "data-placement": "bottom",
            "data-container": "body",
            "data-animation": false,
            title: "Draw handoff"
        },
        
        style: {
            opacity: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    events.iconOpacity : 1;
            }
        }
    },
    
    leftHandle: {
        selector: ".left-handle",
        tag: "rect",
        attrs: {
            x: function(d) {return d.x + 4},
            y: function(d) {return d.y + (events.bodyHeight - 11)/2},
            width: 2,
            height: 11,
            rx: 1,
            ry: 1,
            "class": "left-handle"
        },
        style: {
            display: "none",
            cursor: "ew-resize",
            fill: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "rgba(0, 0, 0, 0.2" : "rgba(255, 255, 255, 0.8)";
            }
        }
    },
    
    rightHandle: {
        selector: ".right-handle",
        tag: "rect",
        attrs: {
            x: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                var width = getWidth(eventObj);
                return d.x + width - 2 * events.marginLeft - 2 - 4;
            },
            y: function(d) {return d.y + (events.bodyHeight - 11)/2},
            width: 2,
            height: 11,
            rx: 1,
            ry: 1,
            "class": "right-handle",
        },
        
        style: {
            display: "none",
            cursor: "ew-resize",
            fill: function(d) {
                var groupNum = parseInt(d.id.replace("task_g_", ""));
                var eventObj = getEventFromId(groupNum);
                return eventObj.status === "not_started" /* && !events.isWorkerTask(eventObj) */ ?
                    "rgba(0, 0, 0, 0.2" : "rgba(255, 255, 255, 0.8)";
            }
        }
    }
  };
  
  window._foundry.events = events;
})();



function drawG(eventObj) {
    var x = _foundry.timeline.stepWidth *
            (eventObj.startTime/_foundry.timeline.stepInterval);
    var y = _foundry.timeline.rowHeight * eventObj.row;
    
    var xOffset = window._foundry.events.marginLeft;
    var yOffset = window._foundry.events.marginTop;
    
    var groupNum = eventObj["id"];

    var idx = getDataIndexFromGroupNum(groupNum);
    if(idx == null) {
        var new_data = {
          id: "task_g_" + groupNum, class: "task_g",
          groupNum: groupNum, x: x + xOffset, y: y + yOffset
        };
        task_groups.push(new_data);
    } else {
        task_groups[idx].x = x + xOffset;
        task_groups[idx].y = y + yOffset;
    }
    
    var showHandles = function(d) {
        // same size as in leftResize and rightResize functions
        if(isUser || in_progress) {
            return;
        }
        
        var x = d3.mouse(this)[0];
        var eventX = d.x;

        var left = d3.select(this).selectAll(".left-handle");
        var right = d3.select(this).selectAll(".right-handle");

        var width = getWidth(getEventFromId(groupNum));
        
        if(x < eventX + width/2) {
            // show the left and hide the right
            left.style({display: ""})
            right.style({display: "none"});
        } else {
            // show the right and hide the left
            right.style({display: ""});
            left.style({display: "none"});
        }
    };
    
    // add group to timeline, based on the data object
    window._foundry.timeline.eventLayer.selectAll("g.event")
        .data(task_groups, function(d){ return d.groupNum; })
        .enter()
        .append("g")
        .attr("id", "g_" + groupNum)
        .attr("class", "event")
        .style({cursor: "pointer"})
        .on("mousemove", showHandles)
        .on("mouseout", function() {
            var handles = d3.select(this).selectAll(".left-handle, .right-handle");
            handles.style({display: "none"});
        });
}

/**
 * Adds a box shadow filter to the root <svg> element and gives it the
 * passed in id
 *
 * @param svg
 * @param {string} id
 */
function addBoxShadowFilter(svg, id) {
    // store the actual element here
    var svgRoot = svg[0][0];
    while(svgRoot.tagName.toLowerCase() !== "svg") {
        svgRoot = svgRoot.parentNode;
        if(!svgRoot) {
            svgRoot = svg[0][0];
        }
    }
    
    var selection = d3.select(svgRoot);
    
    var filter = selection.append("filter")
        .attr("id", id)
        .attr("height", "130%");
    
    var feGaussianBlur = filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 2);
    
    var feOffset = filter.append("feOffset")
        .attr("dx", 0)
        .attr("dy", 1)
        .attr("result", "offsetblur");
    
    var feComponentTransfer = filter.append("feComponentTransfer");
    feComponentTransfer.append("feFuncA")
        .attr("type", "linear")
        .attr("slope", 0.08);
    
    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode");
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");
}

function drawMainRect(eventObj) {
    var events = window._foundry.events;
    
    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);
    
    var width = getWidth(eventObj) - 2 * events.marginLeft;
    
    var rect = task_g.selectAll("#rect_" + groupNum);
    if(rect.empty()) {
        rect = task_g.append("rect")
            .attr("class", "task_rectangle")
            .attr("id", function(d){return "rect_"+d.groupNum})
            .attr("groupNum", function(d) {return d.groupNum});
    }

    var boxShadow = d3.select("#box-shadow");
    if(boxShadow.empty()) {
        addBoxShadowFilter(task_g, "box-shadow");
    }
    
    // call drag on both of these
    rect
        .attr("id", function(d) {
                return "rect_" + d.groupNum; })
        .attr("class", "task_rectangle")
        .attr("groupNum", function(d) {return d.groupNum})
        .attr("width", width)
        .attr("height", events.bodyHeight)
        .attr("x", function(d) {return d.x})
        .attr("y", function(d) {return d.y})
        .attr("fill", function(d) {
            switch(eventObj.status) {
                case "not_started":
                    if(events.isWorkerTask(eventObj)) {
                        return WORKER_TASK_NOT_START_COLOR;
                    } else {
                        return TASK_NOT_START_COLOR;
                    }
                case "started":
                    return TASK_START_COLOR;
                case "paused":
                    return TASK_PAUSED_COLOR;
                case "delayed":
                    return TASK_DELAY_COLOR;
                default:
                    return TASK_COMPLETE_COLOR;
            }
        })
        .style("filter", "url(#box-shadow)")
        .call(drag);
    
    if(eventObj.status === "not_started") {
        rect.style({
            stroke: TASK_NOT_START_STROKE_COLOR,
            "stroke-width": "1",
        });
    }
    
    var borderBottom = task_g.selectAll(".border-bottom");
    if(borderBottom.empty()) {
        borderBottom = task_g.append("rect");
    }
    borderBottom
        .attr("class", "border-bottom")
        .attr("width", width)
        .attr("height", 2)
        .attr("x", function(d) {return d.x})
        .attr("y", function(d) {return d.y + window._foundry.events.bodyHeight - 2})
        .attr("fill", function(d) {
            switch(eventObj.status) {
                case "not_started":
                    // if the task is for the currently logged in user
                    if(events.isWorkerTask(eventObj)) {
                        return WORKER_TASK_NOT_START_BORDER_COLOR
                    } else {
                        return TASK_NOT_START_BORDER_COLOR;
                    }
                case "started":
                    return TASK_START_BORDER_COLOR;
                case "paused":
                    return TASK_PAUSED_BORDER_COLOR;
                case "delayed":
                    return TASK_DELAY_BORDER_COLOR;
                default:
                    return TASK_COMPLETE_BORDER_COLOR;
            }
        })
        .call(drag);
};

/**
 * Adds an item (e.g. an icon or a text tag) to a task group.
 *
 * @param {object} data
 * @param {object} eventObj
 * @param {object} taskGroup SVG group for the task
 * @returns {object} the added svg element
 */
function addToTaskFromData(data, eventObj, taskGroup) {
    var tag = data.tag;
    
    var selector = data.selector;
    if(typeof(selector) === "function") {
        // if the selector is a function, pass it the event object to get
        // the string selector
        selector = selector(eventObj);
    }
    var selection = taskGroup.selectAll(selector);
    
    var svgElem = selection.empty() ? taskGroup.append(tag) : selection;
    
    if(tag === "text") {
        svgElem.text(data.text(eventObj));
    }
    
    svgElem.attr(data.attrs);
    svgElem.style(data.style);
    
    return svgElem;
}

function drawTop(eventObj) {
    var events = window._foundry.events;
    
    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);
    var width = getWidth(eventObj);

    // grab the main rectangle
    var rect = task_g.select("#rect_" + groupNum);
    
    var clockSvg = addToTaskFromData(events.clock, eventObj, task_g);
    clockSvg.call(drag);
    var titleSvg = addToTaskFromData(events.title, eventObj, task_g);
    titleSvg.call(drag);
    var durationSvg = addToTaskFromData(events.duration, eventObj, task_g);
    durationSvg.call(drag);
    
    // special case, have to determine x2
    var lineSvg = addToTaskFromData(events.line, eventObj, task_g);
    lineSvg.attr("x2", function(d) {
        var x1 = events.line.attrs.x1(d);
        return x1 + (getWidth(eventObj) - (2 * events.marginLeft) - (2 * (x1 - d.x)));
    })
    .call(drag);
    
}

function drawBottom(eventObj) {
    var events = window._foundry.events;
    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);
    var ev = getEventFromId(groupNum);
    
    // icon for the number of members
    addToTaskFromData(events.numMembersIcon, eventObj, task_g);
    
    // the number of members
    addToTaskFromData(events.numMembers, eventObj, task_g);
    
    // upload icon
    var uploadIcon = addToTaskFromData(events.uploadIcon, eventObj, task_g);
    uploadIcon.on("click", function(){
        d3.event.stopPropagation();
        if (ev.gdrive.length > 0){
            window.open(ev.gdrive[1])
        }
        else{
            alert("The flash team must be running for you to upload a file!");
        }
    });
    
    // collaboration icon
    var collabIconSvg = addToTaskFromData(events.collabIcon, eventObj, task_g);
    collabIconSvg.on("click", startWriteCollaboration);
    
    // handoff icon
    var handoffIconSvg = addToTaskFromData(events.handoffIcon, eventObj, task_g);
    handoffIconSvg.on("click", startWriteHandoff);
    
    var selector = ".event " + events.numMembersIcon.selector + ", " +
                   ".event " + events.uploadIcon.selector + ", " +
                   ".event " + events.collabIcon.selector + ", " +
                   ".event " + events.handoffIcon.selector;
    $(selector).each(function() {
          $(this).tooltip('destroy').tooltip();
    });
}

function drawMemberTabs(eventObj) {
    var events = window._foundry.events;
    var groupNum = eventObj["id"];
    var members = eventObj.members;
    var task_g = getTaskGFromGroupNum(groupNum);
    
    task_g.selectAll(".mem_tab").remove();
    var start = 4;
    for(var i = 0; i < members.length; i++) {
        var memberId = members[i];
        var member = getMemberById(memberId);
        var memberTab = task_g.selectAll("#mem_tab_" + memberId);
        if(memberTab.empty()) {
            memberTab = task_g.append("path");
        }
        
        // coordinates for drawing the tab shape
        var shapeData = [
            {x: 0, y: 0}, {x: 24, y: 0},
            {x: 24, y: 11}, {x: 7, y: 11},
            {x: 0, y: 0}
        ];
        
        var xOffset = 4 + i * 16;
        var tabPathFn = function(line, data) {
            return d3.svg.line()
                .x(function(d) {return data.x + xOffset + d.x;})
                .y(function(d) {return data.y + events.bodyHeight + d.y;})
                .interpolate("linear")(line);
        };
        
        var attrs = {
            id: "mem_tab_" + memberId,
            class: "mem_tab",
            "member-id": memberId,
            width: 24,
            height: 11,
            d: function(d) {return tabPathFn(shapeData, d)},
            fill: member.color,
            
            "data-toggle": "tooltip",
            "data-placement": "bottom",
            "data-container": "body",
            "data-animation": false,
            title: member.role
        }
        
        for(var key in attrs) {
            memberTab.attr(key, attrs[key]);
        }
        
        $(".mem_tab[member-id='" + memberId + "']").each(function() {
          $(this).tooltip()
        });
    }
}

function drawDragHandles(eventObj) {
    var events = window._foundry.events;
    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);
    
    var leftHandleSvg = addToTaskFromData(events.leftHandle, eventObj, task_g);
    leftHandleSvg.call(drag_left);
    
    var rightHandleSvg = addToTaskFromData(events.rightHandle, eventObj, task_g);
    rightHandleSvg.call(drag_right);
}

// TODO: might have issues with redrawing
function drawShade(eventObj) {
    if(current_user == undefined) {return;}

    var groupNum = eventObj["id"];
    var members = eventObj["members"];
    var task_g = getTaskGFromGroupNum(groupNum);

    // draw shade on main rect of this event
    //for each event it draws the shade. 
    //in doing so it takes its array of members FOR THAT EVENT
    //for each member for that event it gets their ID
    //if they are the CURRENT member
    for (var i=0; i<members.length; i++) {
        var member_id = members[i];
        //debugger;
        if (current_user.id == member_id){
            if (currentUserIds.indexOf(groupNum) < 0){
                currentUserIds.push(groupNum);
                currentUserEvents.push(eventObj);
            }

            
            task_g.selectAll("#rect_" + groupNum).attr("fill-opacity", .6);
            break;
        }
    }
}

//Creates graphical elements from array of data (task_rectangles)
function drawEvent(eventObj) {
    // Start off by redrawing the timeline if we need to, so the events
    
    // subtract two so there's always at least one empty row
    // (event.row is 0 indexed)
    if(eventObj.row >= window._foundry.timeline.numRows - 2) {
      window._foundry.timeline.updateNumRows(eventObj.row + 2);
    }
    
    drawG(eventObj);
    
    drawMemberTabs(eventObj);
    drawMainRect(eventObj);
    drawTop(eventObj);
    drawBottom(eventObj);
    
    drawDragHandles(eventObj);
    
    drawEachHandoffForEvent(eventObj);
    drawEachCollabForEvent(eventObj);
    
    drawShade(eventObj);
    drawTimer(eventObj);
};



function drawTimer(eventObj){
   
    if( in_progress != true || eventObj.status == "not_started" || eventObj.status == "paused" ) {
        return;
    }
    
    if( eventObj.status == "started" ){
    
        //var time_passed = (parseInt(((new Date).getTime() - eventObj.task_startBtn_time)/ task_timer_interval ));
        
        var time_passed = (parseInt(((new Date).getTime() - eventObj.task_latest_active_time)/ task_timer_interval ));
        
        var duration = eventObj["duration"];
        
        //var remaining_time = duration - time_passed;
        
		var remaining_time = eventObj.latest_remaining_time - time_passed;

        
        if(remaining_time < 0){
            eventObj.status = "delayed";
             
            var groupNum = parseInt(eventObj["id"]);
            
            var idx = live_tasks.indexOf(groupNum);
            if (idx != -1) { // delayed task
                live_tasks.splice(idx, 1);
            }
            delayed_tasks.push(groupNum);
            drawEvent(eventObj);
        }

        eventObj["timer"] = remaining_time;
        updateStatus(true);
    }

    else if( eventObj.status == "delayed" ){
    
        /* //OLD WAY
		var time_passed = (parseInt(((new Date).getTime() - eventObj.task_startBtn_time)/ task_timer_interval )) ;
        var duration = eventObj["duration"];
        var remaining_time = duration - time_passed;
		*/

		var time_passed = (parseInt(((new Date).getTime() - eventObj.task_latest_active_time)/ task_timer_interval ));
        var duration = eventObj["duration"];
        var remaining_time = eventObj.latest_remaining_time - time_passed;


        eventObj["timer"] = remaining_time;
        updateStatus(true);
    }
}

//Draw a triangular hiring event on the timeline
function drawHiringEvent() {
    drawHiringRect();
    //NOT DONE

    
}


function removeAllMemberCircles(eventObj){
    var groupNum = eventObj["id"];
    var members = eventObj["members"];
    var task_g = getTaskGFromGroupNum(groupNum);

    for(var i=0;i<members.length;i++){
        task_g.selectAll("#event_" + groupNum + "_eventMemCircle_" + (i+1)).remove();
    }
};

function renderAllMemberCircles() {
    var events = flashTeamsJSON["events"];
    for (var i = 0; i < events.length; i++){
        var ev = events[i];
        drawMemberTabs(ev);
        // drawMemberCircles(ev);
    }
};

// deprecated
//Add one of the team members to an event, includes a bar to represent it on the task rectangle
//and a pill in the popover that can be deleted, both of the specified color of the member
function addEventMember(eventId, memberIndex) {
    // get details from members array
    var memberName = flashTeamsJSON["members"][memberIndex].role;
    var memberUniq = flashTeamsJSON["members"][memberIndex].uniq;
    var memberColor = flashTeamsJSON["members"][memberIndex].color;

    // get event
    var indexOfEvent = getEventJSONIndex(eventId);

    // add member to event
    flashTeamsJSON["events"][indexOfEvent].members.push({name: memberName, uniq: memberUniq, color: memberColor});

    // render on events
    renderAllMemberCircles();
}

//Remove a team member from an event
function deleteEventMember(eventId, memberNum) {
    if (memberNum == current){
         $("#rect_" + eventId).attr("fill", TASK_NOT_START_COLOR)
     }

    //Update the JSON then redraw the event
    var indexOfJSON = getEventJSONIndex(eventId);
    var event = flashTeamsJSON["events"][indexOfJSON];
    var indexInEvent = event.members.indexOf(memberNum);
    if(indexInEvent != -1) {
        event.members.splice(indexInEvent, 1);
        drawEvent(event);
    }
}

//shows an alert asking the user to confirm that they want to delete an event
function confirmDeleteEvent(eventId) {
    $('#task_modal').modal('hide'); 
    
    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "Delete Event?";

    var indexOfJSON = getEventJSONIndex(eventId);
    var events = flashTeamsJSON["events"];
    var eventToDelete = events[indexOfJSON];

    var alertText = document.getElementById("confirmActionText");
    alertText.innerHTML = "<b>Are you sure you want to delete " + eventToDelete["title"] + "?</b><br><font size = '2'>Deleting an event will permanently delete all its data, handoffs, and collaborations.</font>";

    var deleteButton = document.getElementById("confirmButton");
    deleteButton.innerHTML = "Delete event";
    $("#confirmButton").attr("class","btn btn-danger");

    $('#confirmAction').modal('show');
    

    //Calls deleteEvent function if user confirms the delete
    document.getElementById("confirmButton").onclick=function(){deleteEvent(eventId)};
}


// first updates the event object array and interactions array
// then, calls removeTask to remove the task from the timeline
function deleteEvent(eventId){

    $('#confirmAction').modal('hide');

    var indexOfJSON = getEventJSONIndex(eventId);
    var events = flashTeamsJSON["events"];
        
    events.splice(indexOfJSON, 1);
    //console.log("event deleted from json");
    
    //stores the ids of all of the interactions to erase
    var intersToDel = [];
    
    for (var i = 0; i < flashTeamsJSON["interactions"].length; i++) {
            var inter = flashTeamsJSON["interactions"][i];
            if (inter.event1 == eventId || inter.event2 == eventId) {
                intersToDel.push(inter.id);
            }
        }
      
    for (var i = 0; i < intersToDel.length; i++) {
        // remove from timeline
        var intId = intersToDel[i];
        deleteInteraction(intId);
    }

    removeTask(eventId);
    
    updateStatus(false);
}

//CODE ON HOLD
//Draw the hiring event main rect for the hiring events
/*function drawHiringRect() {
    //START HERE

    var width = RECTANGLE_HEIGHT * 2; //default 2 hours

    var existingHireRect = task_g.selectAll("#hire_rect_" + groupNum);
    if(existingMainRect[0].length == 0){ // first time
        task_g.append("rect")
            .attr("class", "hire_rect")
            .attr("x", function(d) {return d.x;})
            .attr("y", function(d) {return d.y;})
            .attr("id", function(d) {
                return "hire_rect_" + d.groupNum; })
            .attr("groupNum", function(d) {return d.groupNum;})
            .attr("height", HIRING_HEIGHT)
            .attr("width", width)
            .attr("fill", "#C9C9C9")
            .attr("fill-opacity", .6)
            .attr("stroke", "#5F5A5A")
            .attr('pointer-events', 'all')
            .call(drag);
    } else {
        task_g.selectAll(".task_rectangle")
            .attr("x", function(d) {return d.x;})
            .attr("y", function(d) {return d.y;})
            .attr("width", width);
    }
}*/


//This function is used to truncate the event title string since html tags cannot be attached to svg
String.prototype.trunc = String.prototype.trunc ||
      function(n){
         // return this.length>n ? this.substr(0,n-1)+'...' : this;
      };
