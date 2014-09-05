/* events.js
 * ---------------------------------------------
 * 
 */

var RECTANGLE_WIDTH = 100;
var RECTANGLE_HEIGHT = 90;
var ROW_HEIGHT = 100;
var DRAGBAR_WIDTH = 8;
var event_counter = 0;

$(document).ready(function(){
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
});

var dragged = false;

//Called when the right dragbar of a task rectangle is dragged
var drag_right = d3.behavior.drag()
    .on("drag", rightResize)
    .on("dragend", function(d){
        var ev = getEventFromId(d.groupNum);
        drawPopover(ev, true, false);
        updateStatus(false);
    });

//Called when the left dragbar of a task rectangle is dragged
var drag_left = d3.behavior.drag()
    .on("drag", leftResize)
    .on("dragend", function(d){
        var ev = getEventFromId(d.groupNum);
        drawPopover(ev, true, false);
        updateStatus(false);
    });

//Called when task rectangles are dragged
var drag = d3.behavior.drag()
    .origin(Object)
    .on("drag", dragEventBlock)
    .on("dragend", function(d){
        if(dragged){
            dragged = false;
            var ev = getEventFromId(d.groupNum);
            drawPopover(ev, true, false);
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
    if (newWidth < 30)
        return;

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
    var dragY = d3.event.y - (d3.event.y%(ROW_HEIGHT)) + 5;
    var newY = Math.min(SVG_HEIGHT - ROW_HEIGHT, dragY);
    if (d3.event.dy + d.y < 20) {
        ev.y = 17;
    } else {
        ev.y = newY;
    }

    drawEvent(ev, false);
}

//VCom Calculates where to snap event block to when created
function calcSnap(mouseX, mouseY) {
    var snapX = Math.floor(mouseX - (mouseX%50) - DRAGBAR_WIDTH/2),
        snapY = Math.floor(mouseY/ROW_HEIGHT) * ROW_HEIGHT + 5;
    return [snapX, snapY];
}

// mousedown on timeline => creates new event and draws it
function newEvent(point) {
    // interactions
    if(DRAWING_HANDOFF==true || DRAWING_COLLAB==true) {
        alert("Please click on another event or the same event to cancel");
        return;
    }

    if (overlayIsOn) {
        overlayOff();
        return;
    } 

    //Close all open popovers
    for (var i = 0; i<flashTeamsJSON["events"].length; i++) {
        var idNum = flashTeamsJSON["events"][i].id;
        $(timeline_svg.selectAll("g#g_"+idNum)[0][0]).popover('hide');
    }

    if(isUser || in_progress) { // user page
        return;
    }
    
    createEvent(point);
};

function createEvent(point) {
    // get coords where event should snap to
    var snapPoint = calcSnap(point[0], point[1]);
  
    if(!checkWithinTimelineBounds(snapPoint)){ return; }

    // create event object
    var eventObj = createEventObj(snapPoint);
    
    // render event on timeline
    drawEvent(eventObj, true);

    // render event popover
    drawPopover(eventObj, true, true);

    // save
    updateStatus(false);
};

function checkWithinTimelineBounds(snapPoint) {
    return ((snapPoint[1] < 505) && (snapPoint[0] < (SVG_WIDTH-150)));
};

function getStartTime(mouseX) {
    var startHr = (mouseX-(mouseX%100))/100;
    var startMin = (mouseX%100)/25*15;
    if(startMin == 57.599999999999994) {
        startHr++;
        startMin = 0;
    } else startMin += 2.4
    var startTimeinMinutes = parseInt((startHr*60)) + parseInt(startMin);

    return {"startHr":startHr, "startMin":startMin, "startTimeinMinutes":startTimeinMinutes};
};

function getDuration(leftX, rightX) {
    var hrs = Math.floor(((rightX-leftX)/100));
    var min = (((rightX-leftX)%(Math.floor(((rightX-leftX)/100))*100))/25*15);
    var durationInMinutes = parseInt((hrs*60)) + parseInt(min);

    return {"duration":durationInMinutes, "hrs":hrs, "min":min};
};

//Create JSON event object for a new event
function createEventObj(snapPoint) {
    event_counter++;
    var startTimeObj = getStartTime(snapPoint[0]);
    var newEvent = {"title":"New Event", "id":event_counter, "x": snapPoint[0], "min_x": snapPoint[0], "y": snapPoint[1], 
        "startTime": startTimeObj["startTimeinMinutes"], "duration":60, "members":[], "iteration":0,
        "dri":"", "notes":"", "startHr": startTimeObj["startHr"], "status":"not_started",
        "startMin": startTimeObj["startMin"], "gdrive":[], "completed_x":null, "inputs":null, "outputs":null};
      //add new event to flashTeams database
    if (flashTeamsJSON.events.length == 0){
        createNewFolder($("#flash_team_name").val());
    }
    flashTeamsJSON.events.push(newEvent);
    return newEvent;
};

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

function getWidth(ev) {
    var durationInMinutes = ev.duration;
    var hrs = parseFloat(durationInMinutes)/parseFloat(60);
    var width = parseFloat(hrs)*parseFloat(RECTANGLE_WIDTH);
    var roundedWidth = Math.round(parseFloat(width)/parseFloat(STEP_WIDTH)) * STEP_WIDTH;
    return roundedWidth;
};

function durationForWidth(width) {
    var hrs = parseFloat(width)/parseFloat(RECTANGLE_WIDTH);
    return hrs*60;
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


function getMemberIndexFromName(name) {
    for (var j = 0; j < flashTeamsJSON["members"].length; j++) { // go through all members
        if (flashTeamsJSON["members"][j].role == name){
            return j;
        }
    }
    return -1;
}

function drawG(eventObj, firstTime) {
    var x = eventObj["x"];
    var y = eventObj["y"];
    var groupNum = eventObj["id"];
    var y_offset = 17;

    var idx = getDataIndexFromGroupNum(groupNum);
    if(idx == null) {
        var new_data = {id: "task_g_" + groupNum, class: "task_g", groupNum: groupNum, x: x, y: y+y_offset};
        task_groups.push(new_data);
    } else {
        task_groups[idx].x = x;
        task_groups[idx].y = y+y_offset;
    }

    // add group to timeline, based on the data object
    timeline_svg.selectAll("g")
        .data(task_groups, function(d){ return d.groupNum; })
        .enter()
        .append("g")
        .attr("id", "g_" + groupNum);
}

function drawMainRect(eventObj, firstTime) {
    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);
    var width = getWidth(eventObj);

    var existingMainRect = task_g.selectAll("#rect_" + groupNum);
    if(existingMainRect[0].length == 0){ // first time
        task_g.append("rect")
            .attr("class", "task_rectangle")
            .attr("x", function(d) {return d.x;})
            .attr("y", function(d) {return d.y;})
            .attr("id", function(d) {
                return "rect_" + d.groupNum; })
            .attr("groupNum", function(d) {return d.groupNum;})
            .attr("height", RECTANGLE_HEIGHT)
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
};

//Returns a fill color for the main rect based on task status
function findFillColor(eventObj) {
    var taskStatus = eventObj.status;
    //Check status of event, change fill color appropriately 
    if (taskStatus == "completed") {
        return "#009933";
    } else if (taskStatus == "delayed") {
        return "RED";
    } else if (taskStatus == "live") {
        return "BLUE";
    } else {
        return "#C9C9C9";
    }
}

function drawRightDragBar(eventObj, firstTime) {
    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);
    var width = getWidth(eventObj);

    var existingRightDragBar = task_g.selectAll("#rt_rect_" + groupNum);
    if(existingRightDragBar[0].length == 0){ // first time
        task_g.append("rect")
            .attr("class", "rt_rect")
            .attr("x", function(d) { 
                return d.x + width; })
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
            .attr("x", function(d) {return d.x + width})
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
            .attr("x", function(d) { return d.x})
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
            .attr("x", function(d) {return d.x}) 
            .attr("y", function(d) {return d.y});
    }
}

function drawTitleText(eventObj, firstTime) {
    var x_offset = 10; // unique for title
    var y_offset = 14; // unique for title

    var groupNum = eventObj["id"];
    var title = eventObj["title"];
    var task_g = getTaskGFromGroupNum(groupNum);

    //shorten title to fit inside event
    var existingTitleTextDiv = document.getElementById("titleLength");
    var spn = existingTitleTextDiv.getElementsByTagName('span')[0];
    spn.innerHTML = title;
    var shortened_title = title;
    var width = (spn.offsetWidth );
    var event_width = getWidth(eventObj);
        
  while (width > event_width - 15){ 
        shortened_title = shortened_title.substring(0,shortened_title.length - 4);
        shortened_title = shortened_title + "...";
        spn.innerHTML = shortened_title;
        width = spn.offsetWidth;
  }

    title = shortened_title;
   

    var existingTitleText = task_g.selectAll("#title_text_" + groupNum);
    if(existingTitleText[0].length == 0){ // first time
        task_g.append("text")
            .text(title)
            .attr("class", "title_text")
            .attr("id", function(d) { return "title_text_" + d.groupNum; })
            .attr("groupNum", function(d) {return d.groupNum})
            .attr("x", function(d) {return d.x + x_offset})
            .attr("y", function(d) {return d.y + y_offset})
            .attr("font-weight", "bold")
            .attr("font-size", "12px");
    } else {
        task_g.selectAll(".title_text")
            .text(title)
            .attr("x", function(d) {return d.x + x_offset})
            .attr("y", function(d) {return d.y + y_offset});
    }


}

function drawDurationText(eventObj, firstTime) {
    var x_offset = 10; // unique for duration
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
    var x_offset = 10; // unique for gdrive link
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

function drawHandoffBtn(eventObj, firstTime) {
     if(isUser || in_progress){
        return;
    }

    var x_offset = getWidth(eventObj)-18; // unique for handoff btn
    var y_offset = 40; // unique for handoff btn

    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);

    var existingHandoffBtn = task_g.selectAll("#handoff_btn_" + groupNum);
    if(existingHandoffBtn[0].length == 0){ // first time
        task_g.append("image")
            .attr("xlink:href", "/assets/rightArrow.png")
            .attr("class", "handoff_btn")
            .attr("id", function(d) {return "handoff_btn_" + d.groupNum;})
            .attr("groupNum", function(d){return d.groupNum})
            .attr("width", 16)
            .attr("height", 16)
            .attr("x", function(d) {return d.x+x_offset})
            .attr("y", function(d) {return d.y+y_offset})
            .on("click", startWriteHandoff);

    /*$("#handoff_btn_" + groupNum).popover({
        trigger: "click",
        html: true,
        class: "interactionPopover",
        style: "font-size: 8px",
        placement: "right",
        content: "Click another event to draw a handoff. <br>Click on this event to cancel.",
        container: $("#timeline-container")
    });
    
    $("#handoff_btn_" + groupNum).popover("show");
    $("#handoff_btn_" + groupNum).popover("hide");*/
    
    } else {
        task_g.selectAll(".handoff_btn")
            .attr("x", function(d) {return d.x + x_offset})
            .attr("y", function(d) {return d.y + y_offset});
    }
}

function drawCollabBtn(eventObj, firstTime) {
    if(isUser || in_progress){ return; }

    var x_offset = getWidth(eventObj)-38; // unique for collab btn
    var y_offset = 40; // unique for collab btn

    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);

    var existingCollabBtn = task_g.selectAll("#collab_btn_" + groupNum);
    if(existingCollabBtn[0].length == 0){ // first time
        task_g.append("image")
            .attr("xlink:href", "/assets/doubleArrow.png")
            .attr("class", "collab_btn")
            .attr("id", function(d) {return "collab_btn_" + d.groupNum;})
            .attr("groupNum", function(d){return d.groupNum})
            .attr("width", 16)
            .attr("height", 16)
            .attr("x", function(d) {return d.x+x_offset})
            .attr("y", function(d) {return d.y+y_offset})
            .on("click", startWriteCollaboration);

    /*$("#collab_btn_" + groupNum).popover({
        trigger: "click",
        html: true,
        class: "interactionPopover",
        style: "font-size: 8px",
        placement: "right",
        content: "Click another event to draw a collaboration. <br>Click on this event to cancel.",
        container: $("#timeline-container")
    });

    $("#collab_btn_" + groupNum).popover("show");
    $("#collab_btn_" + groupNum).popover("hide");*/
    
    } else {
        task_g.selectAll(".collab_btn")
            .attr("x", function(d) {return d.x + x_offset})
            .attr("y", function(d) {return d.y + y_offset});
    }
}

function drawMemberLines(eventObj) {
    //console.log("drawing member lines for ", eventObj);
    var x_offset = 8; // unique for member lines
    var width = getWidth(eventObj) - 8;

    var groupNum = eventObj["id"];
    var members = eventObj["members"];
    var task_g = getTaskGFromGroupNum(groupNum);

    // figure out if first time or not for each member line
    for(var i=0;i<members.length;i++){
        var existingLine = task_g.selectAll("#event_" + groupNum + "_eventMemLine_" + (i+1));
        //console.log("EXISTING LINE", existingLine);
        var y_offset = 60 + (i*8); // unique for member lines
        if(existingLine[0].length == 0){ // first time
            var member = getMemberById(members[i]);
            var color = member.color;
            var name = member.name;
            
            task_g.append("rect")
                .attr("class", "member_line")
                .attr("id", function(d) {
                    return "event_" + groupNum + "_eventMemLine_" + (i+1);
                })
                .attr("x", function(d) {
                    return d.x + x_offset;})
                .attr("y", function(d) {
                    return d.y + y_offset;})
                .attr("groupNum", groupNum)
                .attr("height", 5)
                .attr("width", width)
                .attr("fill", color)
                .attr("fill-opacity", .9);
        } else { // line already exists, just need to redraw
            var members = eventObj["members"];
            var member = getMemberById(members[i]);
            var color = member.color;

            existingLine
                .attr("x", function(d) {return d.x + x_offset})
                .attr("y", function(d) {return d.y + y_offset})
                .attr("fill", color)
                .attr("width", width);
        }
    }
};



// TODO: might have issues with redrawing
function drawShade(eventObj, firstTime) {
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
        //var idx = getMemberIndexFromName(member["name"]);
        //debugger;
        if (current_user.id == member_id){
            if (currentUserIds.indexOf(groupNum) < 0){
                currentUserIds.push(groupNum);
                currentUserEvents.push(eventObj);
            }

            task_g.selectAll("#rect_" + groupNum)
                .attr("fill", color)
                .attr("fill-opacity", .4);

            break;
        }
    }

    if (currentUserEvents.length > 0){
        currentUserEvents = currentUserEvents.sort(function(a,b){return parseInt(a.startTime) - parseInt(b.startTime)});
        upcomingEvent = currentUserEvents[0].id; 
        task_g.selectAll("#rect_" + upcomingEvent)
            .attr("fill", color)
            .attr("fill-opacity", .9);  
    }
}

function drawEachHandoffForEvent(eventObj){
    var interactions = flashTeamsJSON["interactions"];
    for (var i = 0; i < interactions.length; i++){
        var inter = interactions[i];
        var draw = false;
        if (inter["type"] == "handoff"){
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
                //Reposition an existing handoff
                var x1 = handoffStart(ev1);
                var y1 = ev1.y + 50;
                var x2 = ev2.x + 3;
                var y2 = ev2.y + 50;
                $("#interaction_" + inter["id"])
                    .attr("x1", x1)
                    .attr("y1", y1)
                    .attr("x2", x2)
                    .attr("y2", y2)
                    .attr("d", function(d) {
                        var dx = x1 - x2,
                        dy = y1 - y2,
                        dr = Math.sqrt(dx * dx + dy * dy);
                        //For ref: http://stackoverflow.com/questions/13455510/curved-line-on-d3-force-directed-tree
                        return "M " + x1 + "," + y1 + "\n A " + dr + ", " + dr 
                        + " 0 0,0 " + x2 + "," + (y2+15); 
                    });
            }
        }
    }
}

function drawEachCollabForEvent(eventObj){
    var interactions = flashTeamsJSON["interactions"];
    for (var i = 0; i < interactions.length; i++){
        var inter = interactions[i];
        var draw;
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
                /*var existingInter = timeline_svg.selectAll("#interaction_" + inter["id"]);
                if(existingInter[0].length == 0){ // first time
                    //Alexandra - I'm not convinced this ever get called? 
                    var handoffData = {"event1":inter["event1"], "event2":inter["event2"], 
                        "type":"handoff", "description":"", "id":inter["id"]};
                    drawHandoff(handoffData);
                } else {*/
                    //Reposition existing collaboration
                    var y1 = ev1.y + 17;
                    var x1 = ev1.x + 3;
                    var x2 = ev2.x + 3;
                    var y2 = ev2.y + 17;
                    var firstTaskY = 0;
                    var taskDistance = 0;
                    var overlap = eventsOverlap(ev1.x, getWidth(ev1), ev2.x, getWidth(ev2));
                    if (y1 < y2) {
                        firstTaskY = y1 + 90;
                        taskDistance = y2 - firstTaskY;
                    } else {
                        firstTaskY = y2 + 90;
                        taskDistance = y1 - firstTaskY;
                    }
                    if (x1 <= x2) var startX = x2;
                    else var startX = x1;
                    $("#interaction_" + inter["id"])
                        .attr("x", startX)
                        .attr("y", firstTaskY)
                        .attr("height", taskDistance)
                        .attr("width", overlap);
                /*}*/
            }
        }
    }

}

//Creates graphical elements from array of data (task_rectangles)
function drawEvent(eventObj) { 
    //console.log("redrawing event");
    drawG(eventObj);
    drawMainRect(eventObj);
    drawRightDragBar(eventObj);
    drawLeftDragBar(eventObj);
    drawTitleText(eventObj);
    drawDurationText(eventObj);
    drawGdriveLink(eventObj);
    drawHandoffBtn(eventObj);
    drawCollabBtn(eventObj);
    drawMemberLines(eventObj);
    drawShade(eventObj);
    drawEachHandoffForEvent(eventObj);
    drawEachCollabForEvent(eventObj);
};

function drawAllPopovers() {
    var events = flashTeamsJSON["events"];
    for (var i = 0; i < events.length; i++){
        var ev = events[i];
        drawPopover(ev, true, false);
    }
};


function removeAllMemberLines(eventObj){
    var groupNum = eventObj["id"];
    var members = eventObj["members"];
    var task_g = getTaskGFromGroupNum(groupNum);

    for(var i=0;i<members.length;i++){
        task_g.selectAll("#event_" + groupNum + "_eventMemLine_" + (i+1)).remove();
    }
};

function renderAllMemberLines() {
    var events = flashTeamsJSON["events"];
    for (var i = 0; i < events.length; i++){
        var ev = events[i];
        drawMemberLines(ev);
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
    renderAllMemberLines();
}

//Remove a team member from an event
function deleteEventMember(eventId, memberNum, memberName) {
    //Delete the line
    $("#event_" + eventId + "_eventMemLine_" + memberNum).remove();
    if (memberNum == current){
         $("#rect_" + eventId).attr("fill", "#C9C9C9")
     }

    //Update the JSON
    var indexOfJSON = getEventJSONIndex(eventId);
    for (i = 0; i < flashTeamsJSON["events"][indexOfJSON].members.length; i++) {
        if (flashTeamsJSON["events"][indexOfJSON].members[i]["name"] == memberName) {
            flashTeamsJSON["events"][indexOfJSON].members.splice(i, 1);
            //START HERE IF YOU WANT TO SHIFT UP MEMBER LINES AFTER DELETION
            break;
        }
    }
}

//Remove all the lines from a given event
function removeAllMemberLines(eventObj){
    var groupNum = eventObj["id"];
    var members = eventObj["members"];
    var task_g = getTaskGFromGroupNum(groupNum);

    for(var i=0;i<members.length;i++){
        task_g.selectAll("#event_" + groupNum + "_eventMemLine_" + (i+1)).remove();
    }
};

//shows an alert asking the user to confirm that they want to delete an event
function confirmDeleteEvent(eventId) {

    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "Delete Event?";

    var indexOfJSON = getEventJSONIndex(eventId);
    var events = flashTeamsJSON["events"];
    var eventToDelete = events[indexOfJSON];

    var alertText = document.getElementById("confirmActionText");
    alertText.innerHTML = "<b>Are you sure you want to delete " + eventToDelete["title"] 
    + "?</b><br><font size = '2'>Deleting an event will permanently delete all its data, handoffs, and collaborations.</font>";

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
                //console.log("# of intersToDel: " + intersToDel.length);
            }
        }
      
    for (var i = 0; i < intersToDel.length; i++) {
        // take it out of interactions array
        var intId = intersToDel[i];
        var indexOfJSON = getIntJSONIndex(intId);
        flashTeamsJSON["interactions"].splice(indexOfJSON, 1);

        // remove from timeline
    	deleteInteraction(intId);
    }

    removeTask(eventId);
    
    updateStatus(false);
}

//This function is used to truncate the event title string since html tags cannot be attached to svg
String.prototype.trunc = String.prototype.trunc ||
      function(n){
         // return this.length>n ? this.substr(0,n-1)+'...' : this;
      };
