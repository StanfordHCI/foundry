/* events.js
 * ---------------------------------------------
 * 
 * See eventDraw.js to see all the functions that draw an event
 */

var RECTANGLE_WIDTH = window._foundry.timeline.hourWidth || 100;
var RECTANGLE_HEIGHT = 70;
var DRAGBAR_WIDTH = 8;
var GUTTER = 20;

var dragged = false;

//Called when the right resize of a task rectangle is dragged
var drag_right = d3.behavior.drag()
    .on("drag", rightResize)
    .on("dragend", function(d){
        updateStatus(false);
    });

//Called when the left resize of a task rectangle is dragged
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
        if(dragged){
            dragged = false;
            var ev = getEventFromId(d.groupNum);

            //Check if handoffs will make this a bag drag
            var outOfRange = false;
            var event1;
            var event2;
            var eventHandoffs = getHandoffsForEvent(d.groupNum);
            for (var i = 0; i<eventHandoffs.length; i++) {
                var handoff = flashTeamsJSON["interactions"][getIntJSONIndex(eventHandoffs[i])];
                event1 = flashTeamsJSON["events"][getEventJSONIndex(handoff["event1"])];
                event2 = flashTeamsJSON["events"][getEventJSONIndex(handoff["event2"])];
                if (handoffOutOfRange(handoff["event1"], handoff["event2"]) == true) {
                    outOfRange = true;
                    break;
                }
            } 
            if (outOfRange) {
                alert("Sorry, " + event1.title + " cannot end before " + event2.title + " begins.");
                flashTeamsJSON["events"][getEventJSONIndex(d.groupNum)] = originalEV;
                drawEvent(originalEV, false);
            }

            //Check if collabs will make this a bad drag
            outOfRange = false;
            var eventCollabs = getCollabsForEvent(d.groupNum);
            for (var i = 0; i<eventCollabs.length; i++) {
                var collab = flashTeamsJSON["interactions"][getIntJSONIndex(eventCollabs[i])];
                event1 = flashTeamsJSON["events"][getEventJSONIndex(collab.event1)];
                event2 = flashTeamsJSON["events"][getEventJSONIndex(collab.event2)];
                var overlap = eventsOverlap(event1.x, getWidth(event1), event2.x, getWidth(event2));
                
                if (overlap <= 0) {
                    alert("Sorry, " + event1.title + " and " + event2.title 
                        + " must overlap to have a collaboration.");
                    flashTeamsJSON["events"][getEventJSONIndex(d.groupNum)] = originalEV;
                    drawEvent(originalEV, false);
                    break;
                }
            }
            
            updateStatus(false);
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

//Called when event is dragged. First updates the json, then redraws
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

    if(isUser || in_progress) { // user page
        return;
    }
    createEvent(point, duration);
};

//Draw a new event and add the event object to the json
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
    duration = duration || 60;
    
    var startTimeObj = getStartTime(snapPoint[0]);
  
    //Create the event json object
    var newEvent = {
        "title":"New Event", "id":createEventId(), 
        "x": snapPoint[0]-4, "min_x": snapPoint[0], "y": snapPoint[1], //NOTE: -4 on x is for 1/15/15 render of events
        "startTime": startTimeObj["startTimeinMinutes"], "duration":duration, 
        "members":[], timer:0, task_startBtn_time:-1, task_endBtn_time:-1,
        "dri":"", "pc":"", "notes":"", "startHr": startTimeObj["startHr"], "status":"not_started",
        "startMin": startTimeObj["startMin"], "gdrive":[], "completed_x":null, "inputs":"", "all_inputs":"", "outputs":"", events_after : "",
        "docQs": [["Please explain all other design or execution decisions made, along with the reason they were made",""], 
        ["Please add anything else you want other team members, the project coordinator, or the client, to know. (optional)",""]],
        "outputQs":{},"row": Math.floor((snapPoint[1]-5)/_foundry.timeline.rowHeight)};
    
    //add new event to flashTeams database
    flashTeamsJSON.events.push(newEvent);
    
    return newEvent;
};

//Create a unique event id based on the current time
function createEventId(){
	var timestamp = new Date();
	event_timestamp = Math.floor(timestamp.getTime());
	return event_timestamp;
}

//Retrieve event json object using id
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

//Calculate and return start hour in minutes for some given x position of an event
function startHrForX(X){
    var roundedX = Math.round(X/STEP_WIDTH) * STEP_WIDTH;
    var hrs = Math.floor(parseFloat(roundedX)/parseFloat(RECTANGLE_WIDTH));
    return hrs;
};

//Calculate and return leftover start minutes for some given x position of an event
function startMinForX(X){
    var roundedX = Math.round(X/STEP_WIDTH) * STEP_WIDTH;
    var mins = (parseFloat(roundedX) % parseFloat(RECTANGLE_WIDTH)) * 60 / parseFloat(RECTANGLE_WIDTH);
    return mins;
};

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

//
function findCurrentUserNextEvent(currentUserEvents){
    for (var i = 0; i < currentUserEvents.length; i++){
        if(currentUserEvents[i].status == "not_started" || currentUserEvents[i].status == "delayed"){
            return currentUserEvents[i]["id"];      
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

function renderAllMemberTabs() {
    var events = flashTeamsJSON["events"];
    for (var i = 0; i < events.length; i++){
        var ev = events[i];
        drawMemberTabs(ev);
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
    drawMemberTabs(flashTeamsJSON["events"][indexOfEvent]);
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
    //Hide the editing task modal
    $('#confirmAction').modal('hide');
    
    //Delete the event object from the json
    var indexOfJSON = getEventJSONIndex(eventId);
    var events = flashTeamsJSON["events"];
    events.splice(indexOfJSON, 1);
    
    //stores the ids of all of the interactions to erase
    var intersToDel = [];
    
    //Iterate over interactions to find any that involve the specific event
    for (var i = 0; i < flashTeamsJSON["interactions"].length; i++) {
            var inter = flashTeamsJSON["interactions"][i];
            if (inter.event1 == eventId || inter.event2 == eventId) {
                intersToDel.push(inter.id);
            }
        }
      
    //Delete all of the interactions specified from the previous function from the json
    for (var i = 0; i < intersToDel.length; i++) {
        var intId = intersToDel[i];
        deleteInteraction(intId);
    }

    //Visually removes task from the timeline, in awareness.js
    removeTask(eventId);
    updateStatus(false);
}


//This function is used to truncate the event title string since html tags cannot be attached to svg
String.prototype.trunc = String.prototype.trunc ||
      function(n){
         // return this.length>n ? this.substr(0,n-1)+'...' : this;
      };
