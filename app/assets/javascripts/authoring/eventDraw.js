/* eventDraw.js
 * ---------------------------------------------
 * All functions that are involved in physically drawing the 
 * events on the timeline
 * See events.js for helpers
 * See eventDetails.js for detailed piece drawing (i.e., clock icon, duration)
 */

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

//
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

//Draw a tab that represents each member assigned to an event appended to the bottom of the event
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

//Draw main rectangle of the event block
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
        .attr("id", function(d) { return "rect_" + d.groupNum; })
        .attr("class", "task_rectangle")
        .attr("groupNum", function(d) {return d.groupNum})
        .attr("width", width)
        .attr("height", events.bodyHeight)
        .attr("x", function(d) {return d.x})
        .attr("y", function(d) {return d.y})
        .attr("fill", function(d) {
            switch(eventObj.status) {
                case "not_started":
                    if(events.isWorkerTask(eventObj)) return WORKER_TASK_NOT_START_COLOR;
                    else return TASK_NOT_START_COLOR;
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

//
function drawTop(eventObj) {
    var events = window._foundry.events;
    
    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);
    var width = getWidth(eventObj);

    // grab the main rectangle
    var rect = task_g.select("#rect_" + groupNum);
    
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

//
function drawBottom(eventObj) {
    var events = window._foundry.events;
    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);
    var ev = getEventFromId(groupNum);
    
    // icon for the number of members
    addToTaskFromData(events.numMembersIcon, eventObj, task_g);
    
    // the number of members
    addToTaskFromData(events.numMembers, eventObj, task_g);

    // icon for setting
    var settingIcon = addToTaskFromData(events.settingIcon, eventObj, task_g);
        
        settingIcon.on("click", function(){ 

            // toggle the element of duplicateEvent
            var e = settingIcon;
            var e = e[0];
            e = e[0];
            var rectObj = e.parentNode.getElementsByClassName("duprect");
            var textObj = e.parentNode.getElementsByClassName("duptxt");
            if(rectObj[0].style.display == "none"){
                rectObj[0].style.display="block";
                textObj[0].style.display="block";
            }
            else{
                rectObj[0].style.display="none";
                textObj[0].style.display="none";
            }
               
        });

    // rectangle for duplicate event
    var duprect = addToTaskFromData(events.duprect, eventObj, task_g);

    // text for duplicate event
    var duptxt =  addToTaskFromData(events.duptxt, eventObj, task_g);
        duptxt.on("click", function(){
                var task_id = getEventJSONIndex(ev.id);
                var eventObj = flashTeamsJSON["events"][task_id];
                //Creating the New Event Copy
                createDuplicateEvent(eventObj);
        });
    
    // upload icon
    var uploadIcon = addToTaskFromData(events.uploadIcon, eventObj, task_g);
    uploadIcon.on("click", function(){
        d3.event.stopPropagation();
        // if (ev.gdrive.length > 0){
        //     window.open(ev.gdrive[1])
        // }
        // else{
        //     alert("The flash team must be running for you to upload a file!");
        // }

        if(ev.gdrive.length > 0){
          if (in_progress || (!in_progress && current_user == "Author" && flashTeamsJSON["startTime"])){
            logActivity("drawBottom(eventObj)",'Clicked gDrive Upload Icon - Success', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(groupNum)]);
            window.open(ev.gdrive[1]);
            } else{
            logActivity("drawBottom(eventObj)",'Clicked gDrive Upload Icon - Error Alert', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(groupNum)]);
            alert("The flash team must be running for you to upload a file!");  
            }
        }
        else{
            logActivity("drawBottom(eventObj)",'Clicked gDrive Upload Icon - Error Alert', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(groupNum)]);
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
                   ".event " + events.duprect.selector + ", " +
                   ".event " + events.uploadIcon.selector + ", " +
                   ".event " + events.collabIcon.selector + ", " +
                   ".event " + events.handoffIcon.selector;
    $(selector).each(function() {
          $(this).tooltip('destroy').tooltip();
    });

}

//
function drawDragHandles(eventObj) {
    var events = window._foundry.events;
    var groupNum = eventObj["id"];
    var task_g = getTaskGFromGroupNum(groupNum);
    
    var leftHandleSvg = addToTaskFromData(events.leftHandle, eventObj, task_g);
    leftHandleSvg.call(drag_left);
    
    var rightHandleSvg = addToTaskFromData(events.rightHandle, eventObj, task_g);
    rightHandleSvg.call(drag_right);
}

//
function drawEachHandoffForEvent(eventObj){
    var interactions = flashTeamsJSON["interactions"];
    var eventHandoffs = getHandoffsForEvent(eventObj["id"]);
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
    }
}

//
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
                }      
            }
        }
    }
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

//
function drawTimer(eventObj){
   
    if( in_progress != true || eventObj.status == "not_started" || eventObj.status == "paused" ) {
        return;
    }
    
    if( eventObj.status == "started" ){
            
        var time_passed = (parseInt(((new Date).getTime() - eventObj.task_latest_active_time)/ task_timer_interval ));

        var duration = eventObj["duration"];
                
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

        var time_passed = (parseInt(((new Date).getTime() - eventObj.task_latest_active_time)/ task_timer_interval ));
        var duration = eventObj["duration"];
        var remaining_time = eventObj.latest_remaining_time - time_passed;


        eventObj["timer"] = remaining_time;
        updateStatus(true);
    }
}

