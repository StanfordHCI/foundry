/* interaction.js
 * ---------------------------------------------
 * Code that manages the interactions (collaborations and handoffs)
 * Drawing from scratch, drag response on (popovers.js)
 */
var DRAWING_HANDOFF = false;
var DRAWING_COLLAB = false;
var INTERACTION_TASK_ONE_IDNUM = 0;
var interaction_counter = undefined;

//For Interactions
timeline_svg.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("refX", 0)
    .attr("refY", 2)
    .attr("markerWidth", 5)
    .attr("markerHeight", 4)
    .attr("stroke", "gray")
    .attr("fill", "gray")
    .append("path")
        .attr("d", "M 0,0 V 4 L2,2 Z");

//Called when a user clicks a task rectangle (aka event)
//Determines if the user is trying to draw an interaction and if so, what type
function eventMousedown(task2idNum) {
    var task1idNum = INTERACTION_TASK_ONE_IDNUM;
    //Close all open popovers
    for (var i = 0; i<flashTeamsJSON["events"].length; i++) {
        var idNum = flashTeamsJSON["events"][i].id;
        if (idNum != task1idNum && idNum != task2idNum) {
            hidePopover(idNum);
        }   
    }

    if (DRAWING_HANDOFF == true) $("#handoff_btn_" + task1idNum).popover("hide");
    if (DRAWING_COLLAB == true) $("#collab_btn_" + task1idNum).popover("hide");
 
 //show modal if handoff or collaboration is NOT being drawn
    if (DRAWING_HANDOFF != true && DRAWING_COLLAB != true){
        
       var modal_body = '<p id="task-text">Task Description</p>' +
       '<p><span id="task-edit-link"></span></p>';
       var modal_footer =  '<button class="btn " id="hire-task" style="float :left " onclick="DRFunction('+task2idNum+')">Hire</button>' +
       '<button class="btn " id="start-task" style="float :left " onclick="ATFunction('+task2idNum+')">Start</button>'+
       '<button class="btn " id="end-task" style="float :left " onclick="ATFunction('+task2idNum+')">End</button>' +
       '<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>' +
       '<button class="btn btn-primary" id="edit-save-task" onclick="editTaskOverview(true,'+task2idNum+')">Edit</button>' ;
     
       $('#task_modal').modal('show'); 
       $('.task-modal-footer').html(modal_footer);
       $('.task-modal-body').html(modal_body);

      showTaskOverview(task2idNum);
    }

    //Check if interaction already exists
    if (DRAWING_COLLAB == true || DRAWING_HANDOFF == true) {
        timeline_svg.on("mousemove", null);
        $(".followingLine").remove();

        //Swap if task2 starts first
        if(firstEvent(task1idNum, task2idNum) == task2idNum)  {
            var t2Id = task2idNum;
            task2idNum = task1idNum;
            task1idNum = t2Id;
        }
        
        for (var i = 0; i < flashTeamsJSON["interactions"].length; i++) {
            var inter = flashTeamsJSON["interactions"][i];
            if ((inter.event1 == task1idNum && inter.event2 == task2idNum) 
                || (inter.event1 == task2idNum && inter.event2 == task1idNum)) {
                alert("Sorry, this interaction already exists.");
                DRAWING_COLLAB = false;
                DRAWING_HANDOFF = false;
                return;
            }
        }
    }

    //The user has cancelled the drawing
    if (task1idNum == task2idNum) {
        DRAWING_COLLAB = false;
        DRAWING_HANDOFF = false;
    //Draw a handoff from task one to task two
    } else if (DRAWING_HANDOFF == true) {
        if (interaction_counter == undefined) {
            interaction_counter = initializeInteractionCounter();
        } 
        interaction_counter++;
        updateStatus();
        var ev1 = flashTeamsJSON["events"][getEventJSONIndex(task1idNum)];
        var ev2 = flashTeamsJSON["events"][getEventJSONIndex(task2idNum)];
        var task1X = ev1.x;
        var task1Width = getWidth(ev1);
        var task2X = ev2.x;
        
        if ((task1X + task1Width) <= task2X) {
            var handoffData = {"event1":task1idNum, "event2":task2idNum, 
                "type":"handoff", "description":"", "id":interaction_counter};
            flashTeamsJSON.interactions.push(handoffData);
            updateStatus(false);
            drawHandoff(handoffData);
            DRAWING_HANDOFF = false;
            $(".task_rectangle").popover("hide");
            //d3.event.stopPropagation();
            INTERACTION_TASK_ONE_IDNUM = 0; // back to 0
        } else {
            alert("Sorry, the second task must begin after the first task ends.");
            DRAWING_COLLAB = false;
            DRAWING_HANDOFF = false;
        }
    //Draw a collaboration link between task one and task two
    } else if (DRAWING_COLLAB == true) {
        var ev1 = flashTeamsJSON["events"][getEventJSONIndex(task1idNum)];
        var ev2 = flashTeamsJSON["events"][getEventJSONIndex(task2idNum)];
        var task1X = ev1.x;
        var task1Width = getWidth(ev1);
        var task2X = ev2.x;
        var task2Width = getWidth(ev2);

        var overlap = eventsOverlap(task1X, task1Width, task2X, task2Width);
        if (overlap > 0) {
            if (interaction_counter == undefined) {
                interaction_counter = initializeInteractionCounter();
            }
            interaction_counter++;
            updateStatus();
            var collabData = {"event1":task1idNum, "event2":task2idNum, 
                "type":"collaboration", "description":"", "id":interaction_counter};
            flashTeamsJSON.interactions.push(collabData);
            updateStatus(false);
            drawCollaboration(collabData, overlap);
            DRAWING_COLLAB = false;
            $(".task_rectangle").popover("hide");
            //d3.event.stopPropagation();
            INTERACTION_TASK_ONE_IDNUM = 0; // back to 0
        } else {
            alert("These events do not overlap, so they cannot collaborate.");
            DRAWING_COLLAB = false;
            DRAWING_HANDOFF = false;
        }
    //There is no interation being drawn
    } else {
        var data = getPopoverDataFromGroupNum(task2idNum);
        togglePopover(task2idNum);
        return;
    }
}


//Called when we find DRAWING_HANDOFF
//initializes creating a handoff b/t two events
function startWriteHandoff() {
    if(isUser) { // user page
        return;
    }

    d3.event.stopPropagation();

    INTERACTION_TASK_ONE_IDNUM = this.getAttribute('groupNum');
    DRAWING_HANDOFF = true;
    var m = d3.mouse(this);
    //console.log("x: " + m[0] + " y: " + m[1]);
    line = timeline_svg.append("line")
        .attr("class", "followingLine")
        .attr("x1", m[0])
        .attr("y1", m[1])
        .attr("x2", m[0])
        .attr("y2", m[1])
        .attr("stroke-width", 3)
        .attr("stroke", "gray");
    timeline_svg.on("mousemove", interMouseMove);
};

function handoffStart(firstEvent){
    var x1;
     if (drawn_blue_tasks.indexOf(firstEvent["id"]) != -1){
        x1 = firstEvent.completed_x;
    } 
    else if (completed_red_tasks.indexOf(firstEvent["id"]) != -1){
        x1 = firstEvent.completed_x;
    }
    else if(delayed_tasks.indexOf(firstEvent["id"]) != -1){
        var cursor_x = parseFloat(cursor.attr("x1"));
        var widthRect = parseFloat(getWidth(firstEvent));
        var red_width = cursor_x - (firstEvent.x + widthRect);
        x1 = firstEvent.x + widthRect + red_width;
    }
    else { 
        x1 = firstEvent.x + 3 + getWidth(firstEvent);
    }
    return x1;
}

// Draw a handoff for the first time
// Don't call this directly. Call 'drawEachHandoff' in events.js instead.
function drawHandoff(handoffData) {
    var task1Id = handoffData["event1"];
    var task2Id = handoffData["event2"];
    var handoffId = handoffData["id"];

    //Find end of task 1
    var ev1 = flashTeamsJSON["events"][getEventJSONIndex(task1Id)];
    var x1 = handoffStart(ev1);
    var y1 = ev1.y + 50;
    
    //Find beginning of task 2
    var ev2 = flashTeamsJSON["events"][getEventJSONIndex(task2Id)];
    var x2 = ev2.x + 3;
    var y2 = ev2.y + 50;

    var path = timeline_svg.selectAll("path")
       .data(flashTeamsJSON["interactions"]);

    path.enter().insert("svg:path")
       .attr("class", "link")
       .style("stroke", "#ccc");

    path = timeline_svg.append("path")
        .attr("class", "handoffLine")
        .attr("id", function () {
            return "interaction_" + handoffId;
        })
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
        })
        .attr("stroke", "gray")
        .attr("stroke-width", 7)
        .attr("fill", "none")
        .attr("marker-end", "url(#arrowhead)"); //FOR ARROW

    $("#interaction_" + handoffId).popover({
        class: "handoffPopover", 
        id: '"handoffPopover_' + handoffId + '"',
        html: "true",
        trigger: "click",
        title: "Handoff",
        content: 'Description of Handoff Materials: '
        +'<textarea rows="2.5" id="interactionNotes_' + handoffId + '"></textarea>'
        + '<button type="button" class="btn btn-success" id="saveHandoff' + handoffId + '"'
            +' onclick="saveHandoff(' + handoffId +');">Save</button>          '
        + '<button type="button" class="btn btn-danger" id="deleteInteraction_' + handoffId + '"'
            +' onclick="deleteInteraction(' + handoffId +');">Delete</button>',
        container: $("#timeline-container")
    });
}

//Save handoff notes and update popover
function saveHandoff(intId) {
    //Update Popover Content
    var notes = $("#interactionNotes_" + intId).val()
    $("#interaction_" + intId).data('popover').options.content = 'Description of Handoff Materials: '
        +'<textarea rows="2" id="interactionNotes_' + intId + '">' + notes + '</textarea>'
        + '<button type="button" class="btn btn-success" class="btn" id="saveHandoff' + intId + '"'
        +' onclick="saveHandoff(' + intId +');">Save</button>          '
        + '<button type="button" class="btn btn-danger" id="deleteInteraction_' + intId + '"'
        +' onclick="deleteInteraction(' + intId +');">Delete</button>';

    //Update JSON
    var indexOfJSON = getIntJSONIndex(intId);
    flashTeamsJSON["interactions"][indexOfJSON].description = notes;

    //Hide Popover
    $("#interaction_" + intId).popover("hide");
}


//Called when we click the collaboration button initializes creating 
//a collaboration b/t two events
function startWriteCollaboration(ev) {
    if(isUser) { // user page
        return;
    }
    
    d3.event.stopPropagation();

    INTERACTION_TASK_ONE_IDNUM = this.getAttribute('groupNum'); 
    DRAWING_COLLAB = true;
    var m = d3.mouse(this);
    line = timeline_svg.append("line")
        .attr("class", "followingLine")
        .attr("x1", m[0])
        .attr("y1", m[1])
        .attr("x2", m[0])
        .attr("y2", m[1])
        .attr("stroke-width", 3)
        .attr("stroke", "black")
        .attr("stroke-dasharray", (4,4));
    timeline_svg.on("mousemove", interMouseMove);
};

//Draw collaboration between two events, calculates which event 
//comes first and what the overlap is
function drawCollaboration(collabData, overlap) {
    var task1Id = collabData["event1"];
    var task2Id = collabData["event2"];
    var collabId = collabData["id"];

    var ev1 = flashTeamsJSON["events"][getEventJSONIndex(task1Id)];
    var y1 = ev1.y + 17; // padding on the top and bottom of timeline rows + height of x-axis labels

    var ev2 = flashTeamsJSON["events"][getEventJSONIndex(task2Id)];
    var x2 = ev2.x + 3;
    console.log("NEW X OF COLLAB: " + x2);
    var y2 = ev2.y + 17;

    var firstTaskY = 0;
    var taskDistance = 0;
    if (y1 < y2) {
        firstTaskY = y1 + 90;
        taskDistance = y2 - firstTaskY;
    } else {
        firstTaskY = y2 + 90;
        taskDistance = y1 - firstTaskY;
    }
    collabLine = timeline_svg.append("rect")
        .attr("class", "collaborationRect")
        .attr("id", function () {
            return "interaction_" + collabId;
        })
        .attr("x", x2)
        .attr("y", firstTaskY)
        .attr("height", taskDistance)
        .attr("width", overlap) //START HERE, FIND REAL OVERLAP
        .attr("fill", "gray")
        .attr("fill-opacity", .7);

    drawCollabPopover(collabId);
}

//Add a popover to the collaboration rect so the user can add notes and delete
function drawCollabPopover(collabId) {
    $("#interaction_" + collabId).popover({
        class: "collabPopover", 
        id: '"collabPopover_' + collabId + '"',
        html: "true",
        trigger: "click",
        title: "Collaboration",
        content: 'Description of Collaborative Work: '
        +'<textarea rows="2.5" id="collabNotes_' + collabId + '"></textarea>'
        + '<button type="button" class="btn btn-success" id="saveCollab' + collabId + '"'
            +' onclick="saveCollab(' + collabId +');">Save</button>          '
        + '<button type="button" class="btn btn-danger" id="deleteInteraction_' + collabId + '"'
            +' onclick="deleteInteraction(' + collabId +');">Delete</button>',
        container: $("#timeline-container")
    });
}

//Saves the new notes text in the collab
function saveCollab(intId) {
    //Update Popover's Content
    var notes = $("#collabNotes_" + intId).val()
    $("#interaction_" + intId).data('popover').options.content =   'Description of Collaborative Work: '
        +'<textarea rows="2.5" id="collabNotes_' + intId + '">' + notes + '</textarea>'
        + '<button type="button" class="btn btn-success" id="saveCollab' + intId + '"'
        +' onclick="saveCollab(' + intId +');">Save</button>          '
        + '<button type="button" class="btn btn-danger" id="deleteInteraction_' + intId + '"'
        +' onclick="deleteInteraction(' + intId +');">Delete</button>';

    //Update JSON
    var indexOfJSON = getIntJSONIndex(intId);
    flashTeamsJSON["interactions"][indexOfJSON].description = notes;

    //Hide Popover
    $("#interaction_" + intId).popover("hide");
}

//Deletes the interaction from the timeline and the JSON
function deleteInteraction(intId) {
    //Destroy Popover
    $("#interaction_" + intId).popover("destroy");

    //Delete from JSON
    var indexOfJSON = getIntJSONIndex(intId);
    flashTeamsJSON["interactions"].splice(indexOfJSON, 1);
    updateStatus();

    //Delete Arrow or Rectangle
    $("#interaction_" + intId).remove();
}

//Returns the event that begins first
function firstEvent(task1idNum, task2idNum) {
    var task1Rect = $("#rect_" + task1idNum)[0];
    var x1 = task1Rect.x.animVal.value + 3;
    var task2Rect = $("#rect_" + task2idNum)[0];
    var x2 = task2Rect.x.animVal.value + 3;

    if (x1 <= x2) return task1idNum;
    else return task2idNum;
}

//Calculate the overlap of two events
function eventsOverlap(task1X, task1Width, task2X, task2Width) {
    var task1End = task1X + task1Width;
    var task2End = task2X + task2Width;

    //Task2 starts after the end of Task1
    if ((task1End <= task2X) || (task2End <= task1X)) {
        return 0;
    } else {
        var overlapStart;
        if (task1X <= task2X) overlapStart = task2X;
        else overlapStart = task1X;
            var overlapEnd = 0;
        //Task 1 Ends first or they end simultaneously
        if (task1End <= task2End) overlapEnd = task1End;
        //Task 2 Ends first
        else overlapEnd = task2End;
        return overlapEnd-overlapStart;
    }
}

//Follow the mouse movements after a handoff is initialized
function interMouseMove() {
    var m = d3.mouse(this);
    line.attr("x2", m[0]-3)
        .attr("y2", m[1]-3);
}

//Retrieve index of the JSON object using its id
function getIntJSONIndex(idNum) {
    for (var i = 0; i < flashTeamsJSON["interactions"].length; i++) {
        if (flashTeamsJSON["interactions"][i].id == idNum) {
            return i;
        }
    }
}

function initializeInteractionCounter() {
    if (flashTeamsJSON["interactions"].length == 0) return 0; 
    else {
        var highestId = 0;
        for (i = 0; i < flashTeamsJSON["interactions"].length; i++) {
            if (flashTeamsJSON["interactions"][i].id > highestId) {
                highestId = flashTeamsJSON["interactions"][i].id;
            }
        }
        return highestId;
    }
}



