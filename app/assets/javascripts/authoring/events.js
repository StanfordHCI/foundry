/* events.js
 * ---------------------------------------------
 * 
 * See eventDraw.js to see all the functions that draw an event
 * See eventDetails.js for detailed piece drawing (i.e., duration)
 */

var RECTANGLE_WIDTH = window._foundry.timeline.hourWidth || 100;
var RECTANGLE_HEIGHT = 70;
var DRAGBAR_WIDTH = 8;
var CURRENT_EVENT_SELECTED = "";
var GUTTER = 20;

var dragged = false;

//Called when the right resize of a task rectangle is dragged
var drag_right = d3.behavior.drag()
    .on("drag", rightResize)
    .on("dragend", function(d){
        updateStatus();
    });

//Called when the left resize of a task rectangle is dragged
var drag_left = d3.behavior.drag()
    .on("drag", leftResize)
    .on("dragend", function(d){
        updateStatus();
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
            
            updateStatus();
        } else {
            // click
            eventMousedown(d.groupNum);
        } 
    });

// leftResize: resize the rectangle by dragging the left handle
function leftResize(d) {
    if(isUser) { // user page
        return;
    }
    if(in_progress && flashTeamsJSON["paused"]!=true){
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

    flashTeamsJSON['local_update'] = new Date().getTime();

    updateStatus();

    drawEvent(ev, false);
}

// rightResize: resize the rectangle by dragging the right handle
function rightResize(d) {
    if(isUser) { // user page
        return;
    }
    if(in_progress && flashTeamsJSON["paused"]!=true){
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

    flashTeamsJSON['local_update'] = new Date().getTime();

    updateStatus();

    drawEvent(ev, false);
}

//Called when event is dragged. First updates the json, then redraws
function dragEventBlock(d) {
    if(isUser) { // user page
        return;
    }
    if(in_progress && flashTeamsJSON["paused"]!=true){
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

    flashTeamsJSON['local_update'] = new Date().getTime();

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

    if(isUser) { // user page
       return;
    }
    if(in_progress && flashTeamsJSON["paused"]!=true){
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
    var eventObj = createEventObj(newEventObject(snapPoint, duration , {}));

    // render event on timeline
    drawEvent(eventObj, true);

    //if team is in edit mode, add the gDrive folder for this event
    if(flashTeamsJSON["paused"] == true){
        var event_index = getEventJSONIndex(eventObj.id);
        createTaskFolder(flashTeamsJSON["events"][event_index].title, event_index, flashTeamsJSON.folder[0]);
    }

    //if team has been ended and new events get added, add the gDrive folder for the newly added events
    if(!in_progress && flashTeamsJSON["folder"] != undefined && flashTeamsJSON["startTime"] != undefined){
        var event_index = getEventJSONIndex(eventObj.id);
        createTaskFolder(flashTeamsJSON["events"][event_index].title, event_index, flashTeamsJSON.folder[0]);
    }

    logActivity("createEvent(point, duration)",'Create Event', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(eventObj)]);


    // save
    updateStatus();
};


function newEventObject(snapPoint, duration, objectToDuplicate){

    var documented_questions = [];
    documented_questions[0] = "Please explain all other design or execution decisions made, along with the reason they were made";
    documented_questions[1] = "Please add anything else you want other team members, the project coordinator, or the client, to know. (optional)";

    var output_questions = [];
    output_questions[0] = "Please write a brief (1 sentence) description of this deliverable";

    duration = duration || 60;
    
    var startTimeObj = getStartTime(snapPoint[0]);
    
    var newEvent = {
        "id":createEventId(),
        "x": snapPoint[0]-4, "min_x": snapPoint[0], //NOTE: -4 on x is for 1/15/15 render of events
        "y": snapPoint[1], timer:0, task_startBtn_time:-1, task_endBtn_time:-1, 
        "status":"not_started", "gdrive":[], "completed_x":null, events_after : ""
    };

    newEvent["title"]  = objectToDuplicate["title"] || "New Event" ;
    newEvent["members"] = objectToDuplicate["members"] || [];
    newEvent["startTime"] = startTimeObj["startTimeinMinutes"];
    newEvent["duration"] = objectToDuplicate["duration"] || duration;
    newEvent["startHr"]  =  startTimeObj["startHr"];
    newEvent["startMin"]  =  startTimeObj["startMin"];
    newEvent["row"] = Math.floor((newEvent["y"]-5)/_foundry.timeline.rowHeight);
    newEvent["dri"] = objectToDuplicate["dri"] || "";
    newEvent["pc"] =  objectToDuplicate["pc"]|| "";
    newEvent["notes"] = objectToDuplicate["notes"] || "";
    newEvent ["inputs"] = objectToDuplicate["inputs"] || "";
    newEvent ["all_inputs"] = objectToDuplicate["inputs"] || ""; //only save inputs since inputs from handoffs and collabs aren't copied
    newEvent ["outputs"] = objectToDuplicate["outputs"] || "";

    if(objectToDuplicate["docQs"]){
        var questions = [];
        for(var i=0; i < objectToDuplicate["docQs"].length; i++){
             questions.push([objectToDuplicate["docQs"][i][0],""]);
        }
        newEvent["docQs"] = questions;

    }else{
        newEvent["docQs"] = [[documented_questions[0],""],[documented_questions[1], ""]];
    }

    var outQs = {};
    for (var key in objectToDuplicate.outputQs){

        if (key != ""){
            outQs[key] = [];
            keyArray = objectToDuplicate.outputQs[key];

            for (i = 0; i < keyArray.length; i++){
                outQs[key].push([keyArray[i][0],""]);
            }
        }
    }
    newEvent.outputQs = outQs;

    return newEvent;
}

//task_startBtn_time and task_endBtn_time refer to the time when the start button and end button on the task is clicked.
function createEventObj(eventObject) {

    //add new event to flashTeams database
    flashTeamsJSON.events.push(eventObject);

    return eventObject;
};

function onConfigClick(event){
    CURRENT_EVENT_SELECTED = event.groupNum;

    logActivity("onConfigClick(event)",'Clicked Event Config Icon', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(event.groupNum)]);

    showDropDown();
}

function showDropDown(){
    var menu = $.contextMenu({
        selector: '.icon-cog',
        trigger: 'left',
        callback: function(key, options) {
            //var m = "clicked: "  key;
            //window.console && console.log(m) || alert(options.groupNum);
            window[key + "Event"](CURRENT_EVENT_SELECTED);
        },
        items: {
            "view": {name: "View", icon: ""},
            "edit": {name: "Edit", icon: "", disabled: function(key, opt) { 
                    return ((getEventFromId(CURRENT_EVENT_SELECTED).status == "completed") || (getEventFromId(CURRENT_EVENT_SELECTED).status == "started") || (getEventFromId(CURRENT_EVENT_SELECTED).status == "delayed"));
                }
            },
            "duplicate": {name: "Duplicate", icon: ""},
            "confirmDelete": {name: "Delete", icon: "", disabled: function(key, opt) { 
                    return ((getEventFromId(CURRENT_EVENT_SELECTED).status == "completed") || (getEventFromId(CURRENT_EVENT_SELECTED).status == "started") || (getEventFromId(CURRENT_EVENT_SELECTED).status == "delayed"));
                }}
        }
    });
}

function duplicateEvent(groupNumber){
    var task_id = getEventJSONIndex(groupNumber);
    var eventToDuplicate = flashTeamsJSON["events"][task_id];


    //var x = eventToDuplicate["x"] + 4; //keep event X (and start time) the same as original event 
    var x = (parseInt(eventToDuplicate["x"]) + parseInt(getWidth(eventToDuplicate) + 4 )); //move event (and start time) to the right of the event
    
    var y = eventToDuplicate["y"]; //keep event on same row as original event
    //var y = eventToDuplicate["y"] + RECTANGLE_HEIGHT + 20;  //move event to row below original event
    
    var snapPoint = calcSnap(x,y); 

    //check if duplicated row would be within the bounds of the timeline (e.g., doesn't exceed the rows)  
    if(!checkWithinTimelineBounds(snapPoint)){ 
        alert('This event cannot be duplicated because it exceeds the boundaries of the timeline');
        return; 
    }

    var eventObj = createEventObj(newEventObject([snapPoint[0], snapPoint[1]], eventToDuplicate["duration"], eventToDuplicate));

    drawEvent(eventObj, true);

    if(flashTeamsJSON["paused"] == true){
        var event_index = getEventJSONIndex(eventObj.id);
        createTaskFolder(flashTeamsJSON["events"][event_index].title, event_index, flashTeamsJSON.folder[0]);
    }

    logActivity("duplicateEvent(groupNumber)",'Clicked Duplicate Event on Config Dropdown', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(groupNumber)]);    

    // save
    updateStatus();
}

function viewEvent(groupNumber){
    logActivity("viewEvent(groupNumber)",'Clicked View Event on Config Dropdown', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(groupNumber)]);    

    $('#task_modal').modal({show: true, onload: eventMousedown(groupNumber)});
}

function editEvent(groupNumber){
    logActivity("editEvent(groupNumber)",'Clicked Edit Event on Config Dropdown', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(groupNumber)]);    

    $('#task_modal').modal({show: true, onload: eventMousedown(groupNumber)});

       editTaskOverview(true, groupNumber);
}

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
    if(X < 0) X = 0;
    var roundedX = Math.round(X/STEP_WIDTH) * STEP_WIDTH;
    var hrs = Math.floor(parseFloat(roundedX)/parseFloat(RECTANGLE_WIDTH));
    return hrs;
};

//Calculate and return leftover start minutes for some given x position of an event
function startMinForX(X){
    if(X < 0) X = 0;
    var roundedX = Math.round(X/STEP_WIDTH) * STEP_WIDTH;
    var mins = (parseFloat(roundedX) % parseFloat(RECTANGLE_WIDTH)) * 60 / parseFloat(RECTANGLE_WIDTH);
    return mins;
};

//
function findCurrentUserNextEvent(currentUserEvents){
    for (var i = 0; i < currentUserEvents.length; i++){
        if(currentUserEvents[i].status == "not_started" || currentUserEvents[i].status == "delayed"){
            return currentUserEvents[i]["id"];      
        }
    }
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
    
    logActivity("addEventMember(eventId, memberIndex)",'Add Event Member - Before', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(eventId)]);

    // get event
    var indexOfEvent = getEventJSONIndex(eventId);

    // add member to event
    flashTeamsJSON["events"][indexOfEvent].members.push({name: memberName, uniq: memberUniq, color: memberColor});

    // render on events
    drawMemberTabs(flashTeamsJSON["events"][indexOfEvent]);

    logActivity("addEventMember(eventId, memberIndex)",'Add Event Member - After', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(eventId)]);
}

//Remove a team member from an event
function deleteEventMember(eventId, memberNum) {
    if (memberNum == current){
         $("#rect_" + eventId).attr("fill", TASK_NOT_START_COLOR)
     }

    logActivity("deleteEventMember(eventId, memberNum)",'Delete Event Member - Before', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(eventId)]);

    //Update the JSON then redraw the event
    var indexOfJSON = getEventJSONIndex(eventId);
    var event = flashTeamsJSON["events"][indexOfJSON];
    var indexInEvent = event.members.indexOf(memberNum);
    if(indexInEvent != -1) {
        event.members.splice(indexInEvent, 1);
        drawEvent(event);
    }

    logActivity("deleteEventMember(eventId, memberNum)",'Delete Event Member - After', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(eventId)]);

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
    
    // Only log before because event won't exist after
    logActivity("deleteEvent(eventId)",'Delete Event - Before', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(eventId)]);

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
    updateStatus();
}


//This function is used to truncate the event title string since html tags cannot be attached to svg
String.prototype.trunc = String.prototype.trunc ||
      function(n){
         // return this.length>n ? this.substr(0,n-1)+'...' : this;
      };
