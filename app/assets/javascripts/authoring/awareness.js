/* awareness.js
 * ---------------------------------------------
 *
 */

//var task_timer_interval = 1000; // "normal" speed is 60000. If 1000 : each second is a minute on timeline.
//var timeline_interval = 10000; // "normal" speed timer is 30 minutes (1800000 milliseconds); fast timer is 10 seconds (10000 milliseconds)
var fire_interval = 180; // change back to 180

var numIntervals = parseFloat(timeline_interval)/parseFloat(fire_interval);
var increment = parseFloat(50)/parseFloat(numIntervals);
var curr_x_standard = 0;

//not updated in the current version
var remaining_tasks = [];

var live_tasks = [];
var delayed_tasks = [];
var paused_tasks = [];
//tasks that are completed before being delayed
var drawn_blue_tasks = [];
//tasks that are completed after being delayed
var completed_red_tasks = [];
var task_groups = [];
var loadedStatus;
var in_progress = false;
//var paused = false;
var delayed_tasks_time = [];
var dri_responded = [];
var project_status_handler;
var cursor = null;
var cursor_interval_id = null;
var cursor_interval_live = false;
var cursor_details;
var tracking_tasks_interval_id;
var user_poll = false;
var user_loaded_before_team_start = false;

var window_visibility_state = null;
var window_visibility_change = null;

$(document).ready(function(){
    addCursor();
    cursor = timeline_svg.select(".cursor");
    colorBox();
    //console.log("THIS FUNCTION HITS");
    $("#flash_team_id").requestUpdates(true);
    $("#flash_team_id").getTeamInfo();
});

var addCursor = function(){
    // time cursor in red
    timeline_svg.append("line")
        .attr("y1", 15)
        .attr("y2", SVG_HEIGHT-50)
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("class", "cursor")
        .style("stroke", "red")
        .style("stroke-width", "2")
        .style("display", "none");
};

var getXCoordForTime = function(t){
    var numInt = parseInt(t / timeline_interval);
    var remainder = t % timeline_interval;
    var xCoordForRemainder = (remainder / timeline_interval) * 50;
    var xCoordForMainIntervals = 50*numInt;
    var finalX = parseFloat(xCoordForRemainder) + parseFloat(xCoordForMainIntervals);
    return {"finalX": finalX, "numInt": numInt};
};

function removeColabBtns(){
   var events = flashTeamsJSON["events"];
   for (var i = 0; i < events.length; i++){
        var eventObj = events[i];
        var groupNum = eventObj["id"];
        var task_g = getTaskGFromGroupNum(groupNum);
        task_g.selectAll(".collab_btn").attr("display","none");
    }
};

function hideAllConfigIcons(bHide){
    if(bHide)
        $(".icon-cog").hide();
    else
        $(".icon-cog").show();
}

function removeHandoffBtns(){
    var events = flashTeamsJSON["events"];
   for (var i = 0; i < events.length; i++){
        var eventObj = events[i];
        var groupNum = eventObj["id"];
        var task_g = getTaskGFromGroupNum(groupNum);
        task_g.selectAll(".handoff_btn").attr("display","none");
    }

};

$("#flashTeamStartBtn").click(function(){
    var bodyText = document.getElementById("confirmActionText");
    //updateStatus();
    bodyText.innerHTML = "Are you sure you want to begin running " + flashTeamsJSON["title"] + "?";

    var confirmStartTeamBtn = document.getElementById("confirmButton");
    confirmStartTeamBtn.innerHTML = "Start the team";

    $("#confirmButton").attr("class","btn btn-success");
    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "Start Team?";
    $('#confirmAction').modal('show');

    document.getElementById("confirmButton").onclick=function(){startFlashTeam()};
});

function disableTeamEditing() {
    updateInteractionsPopovers(); //update interaction popovers to read only mode

    $(".add-folder-button").addClass("disabled");
    $(".add-role").addClass("disabled");

    // assemble selector for event buttons
    var selectorPrefix = ".event-layer .event ";
    var selector = selectorPrefix + ".collab_btn, " +
                   selectorPrefix + ".handoff_btn";
    $(selector).hide();

    hideAllConfigIcons(true);

}

function enableTeamEditing() {
    updateInteractionsPopovers(); //update interaction popovers to edit mode

    $(".add-folder-button").removeClass("disabled");
    $(".add-role").removeClass("disabled");

    // assemble selector for event buttons
    var selectorPrefix = ".event-layer .event ";
    var selector = selectorPrefix + ".collab_btn, " +
                   selectorPrefix + ".handoff_btn";
    $(selector).show();

    hideAllConfigIcons(false);
}

function startFlashTeam() {
    $('#confirmAction').modal('hide');
    // view changes
    $("#flashTeamStartBtn").attr("disabled", "disabled");
    $("#flashTeamStartBtn").css('display','none');
    $("#flashTeamEndBtn").css('display','');
    $("#flashTeamPauseBtn").css('display', '');
    $("#workerEditTeamBtn").css('display', '');

    $("div#search-events-container").css('display','none');
    $("div#project-status-container").css('display','');
    //$("a#gFolder.button").css('visibility','visible');
    $("div#chat-box-container").css('display','');
    $("#flashTeamTitle").css('display','none');

    disableTeamEditing();

    hideAllConfigIcons(true);
    removeColabBtns();
    removeHandoffBtns();
    save_tasksAfter_json();

    currentTeam.start(true);

    //save dependencyAPI.getEventsAfter(task_id, true) for each event in the json.
    //This is used for the notification emails.

    //addAllFolders();
    //googleDriveLink();
}

/* moved to TeamControl class
function endTeam()
*/

//save dependencyAPI.getEventsAfter(task_id, true) for each event in the json.
//This is used for the notification emails.
function save_tasksAfter_json(){
    var events_after = [];

    for(var i =0;i<  flashTeamsJSON["events"].length; i++){
        var id = parseInt(flashTeamsJSON["events"][i]["id"]);
        flashTeamsJSON["events"][i]["events_after"] = dependencyAPI.getEventsAfter(id, true);

    }


}


//Asks user to confirm that they want to end the team
$("#flashTeamEndBtn").click(function(){
    var bodyText = document.getElementById("confirmActionText");
    currentTeam.updateStatus();
    if ((live_tasks.length == 0) && (remaining_tasks.length == 0) && (delayed_tasks.length == 0)) {
        bodyText.innerHTML = "Are you sure you want to end " + flashTeamsJSON["title"] + "?";
    } else {
        //console.log("ENDED TEAM EARLY");
        //var progressRemaining = Math.round(100 - curr_status_width);
        bodyText.innerHTML = flashTeamsJSON["title"] + " is still in progress!  Are you sure you want to end the team?";
    }
    var confirmEndTeamBtn = document.getElementById("confirmButton");
    confirmEndTeamBtn.innerHTML = "End the team";
    $("#confirmButton").attr("class","btn btn-danger");
    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "End Team?";
    $('#confirmAction').modal('show');

    document.getElementById("confirmButton").onclick=function(){currentTeam.end()};


});


function stopTrackingTasks() {
    //console.log("STOPPED TRACKING TASKS");
    window.clearInterval(tracking_tasks_interval_id);
};

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var uniq = getParameterByName('uniq');
$("#uniq").value = uniq;

var chat_role;
var chat_name;

var presname; // name of user shown in the presence box
var currentStatus; //the status of the user shown in the presence box

if(flashTeamsJSON) {
    entryManager = new EntryManager(flashTeamsJSON);
}

/* moved to FlashTeam class
function renderFlashTeamsJSON(data, firstTime)
*/

// firstTime=true means page is reloaded
/* moved to FlashTeam class
function renderEverything(data, firstTime)
}
*/

function listenForVisibilityChange(){
    if (typeof document.hidden !== "undefined") {
        window_visibility_change = "visibilitychange";
        window_visibility_state = "visibilityState";
        currentTeam.logActivity("listenForVisibilityChange()",'Window Visibility Change -- document.hidden: ' + document.hidden, flashTeamsJSON);
    } else if (typeof document.mozHidden !== "undefined") {
        window_visibility_change = "mozvisibilitychange";
        window_visibility_state = "mozVisibilityState";
        currentTeam.logActivity("listenForVisibilityChange()",'Window Visibility Change - document.mozHidden: ' + document.mozHidden, flashTeamsJSON);
    } else if (typeof document.msHidden !== "undefined") {
        window_visibility_change = "msvisibilitychange";
        window_visibility_state = "msVisibilityState";
        currentTeam.logActivity("listenForVisibilityChange()",'Window Visibility Change - document.msHidden: ' + document.msHidden, flashTeamsJSON);
    } else if (typeof document.webkitHidden !== "undefined") {
        window_visibility_change = "webkitvisibilitychange";
        window_visibility_state = "webkitVisibilityState";
        currentTeam.logActivity("listenForVisibilityChange()",'Window Visibility Change - document.webkitHidden: ' + document.webkitHidden, flashTeamsJSON);
    }

    // Add a listener for the next time that the page becomes visible
    document.addEventListener(window_visibility_change, function() {
        var state = document[window_visibility_state];

        currentTeam.logActivity("listenForVisibilityChange() -- document.addEventListener(window_visibility_change, function()",'Window Visibility Change -- window_visibility_state: ' + state, flashTeamsJSON);

        if(state == "visible"){
            $("#flash_team_id").requestUpdates(false);
        }
    }, false);
};

// saves member object for current_user (undefined for author so we will set it to 'Author')
var current_user;

/*moved to FlasTeam and Chat classes
//finds user name and sets current variable to user's index in array
var renderChatbox = function()
*/

var flashTeamEndedorStarted = function(){
    if (loadedStatus.flash_team_in_progress == undefined){
        return false;
    }
    return in_progress != loadedStatus.flash_team_in_progress;
};

var flashTeamUpdated = function(){
    var updated_team_paused = loadedStatus.team_paused;
    var updated_drawn_blue_tasks = loadedStatus.drawn_blue_tasks;
    var updated_completed_red_tasks = loadedStatus.completed_red_tasks;
    var updated_live_tasks = loadedStatus.live_tasks;
    var updated_paused_tasks = loadedStatus.paused_tasks;
    var updated_task_groups = loadedStatus.task_groups;
    var updated_gdrive = loadedStatus.flash_teams_json["folder"];
    var updated_local_update = loadedStatus.local_update;
    var updated_members = loadedStatus.flash_teams_json['members'];
    var updated_project_overview = loadedStatus.flash_teams_json['projectoverview'];
    var updated_interactions = loadedStatus.flash_teams_json['interactions'];

    if(flashTeamsJSON['projectoverview'] != updated_project_overview){
        //console.log('project overview has been updated');
        return true;
    }

    if(JSON.stringify(flashTeamsJSON['members'])!= JSON.stringify(updated_members)){
        return true;
    }

    // if certain task attributes (e.g., documentation answers, members added, etc.)
    if(updated_local_update > flashTeamsJSON['local_update']){
        //console.log('local update has been updated!');
        return true;
    }

    // if gdrive folder is created (e.g., when a team starts), the gdrive btn in all views should activate
    if(updated_gdrive != undefined && flashTeamsJSON["folder"] == undefined){
        return true;
    }

    //if the gdrive folders don't match (this should only happen if a gdrive error occurs and the gdrive folder array is [null, null])
    if(updated_gdrive != undefined && flashTeamsJSON["folder"] != undefined){
        if(updated_gdrive.sort().join(',') != flashTeamsJSON["folder"].sort().join(',')){
            return true;
        }
    }

    // if tasks are added or erased in author view (e.g., in authoring or editing mode), the changes should appear in all views
    if(updated_task_groups.length != task_groups.length){
        return true;
    }

    // if tasks are edited (e.g., name or other task details change), the changes should be reflected in other views
    // checks for content changes
    if(updated_task_groups.sort().join(',') !== task_groups.sort().join(',')){
        return true;
    }

    // if the author view enters edit mode, other views should be notified and update accordingly
    if(updated_team_paused != flashTeamsJSON["paused"]){
        return true;
    }

    // when a task is completed, all views should reflect that it is completed (e.g., green tasks)
    if (updated_drawn_blue_tasks.length != drawn_blue_tasks.length) {
        return true;
    }

    // when a task is completed, all views should reflect that it is completed (e.g., green tasks)
    // checks for content changes
    if(updated_drawn_blue_tasks.sort().join(',') !== drawn_blue_tasks.sort().join(',')){
        return true;
    }

    // when a task becomes delayed, all views should reflect that it is delayed (e.g., red tasks)
    if (updated_completed_red_tasks.length != completed_red_tasks.length) {
        return true;
    }

    // when a task becomes delayed, all views should reflect that it is delayed (e.g., red tasks)
    // checks for content changes
    if(updated_completed_red_tasks.sort().join(',') !== completed_red_tasks.sort().join(',')){
        return true;
    }

    // when a task becomes in progress, all views should reflect that it is in progress (e.g., blue tasks)
    if (updated_live_tasks.length != live_tasks.length) {
        return true;
    }

    // when a task becomes in progress, all views should reflect that it is in progress (e.g., blue tasks)
    // checks for content changes
    if(updated_live_tasks.sort().join(',') !== live_tasks.sort().join(',')){
        //console.log("live_tasks not same content");
        return true;
    }

    // when a task is paused, all views should reflect that it is paused (e.g., light blue tasks)
    if (updated_paused_tasks.length != paused_tasks.length) {
        return true;
    }

    // when a task is paused, all views should reflect that it is paused (e.g., light blue tasks)
    // checks for content changes
    if(updated_paused_tasks.sort().join(',') !== paused_tasks.sort().join(',')){
        return true;
    }

    // when an interaction is added, edited or removed, change should be reflected in all views
    if (updated_interactions.length != flashTeamsJSON['interactions'].length) {
        return true;
    }

    // when an interaction is added, edited or removed, change should be reflected in all views
    // checks for content changes
    if(updated_interactions.sort().join(',') !== flashTeamsJSON['interactions'].sort().join(',')){
        return true;
    }

    return false; // returns false if none of the above conditions are true, which assumes that the flash team has not been updated
};

var recordStartTime = function(){
    flashTeamsJSON["startTime"] = (new Date).getTime();
    currentTeam.updateStatus(true);
};

/* moved to requestUpdates
var loadStatus = function(id)
*/

/* moved to FlashTeam class
var loadData = function()
*/

/*
var checkProjectFolder = function(){
	if(!flashTeamsJSON.folder){
  	console.log("creating project folder");
	createNewFolder(document.getElementById("ft-name").innerHTML);
	console.log("flashTeamsJSON.folder: " + flashTeamsJSON.folder);
	//updateStatus();
  }
};
*/

// user must call this startTeam(true, )
/* moved to TeamControl class
var startTeam = function(firstTime)
*/

// var googleDriveLink = function(){
//     var gFolderLink = document.getElementById("gFolder");
//     gFolderLink.onclick=function(){
//         //console.log("is clicked");
//         window.open(flashTeamsJSON.folder[1]);
//     }
// };

var drawEvents = function(editable){
    //console.log('drawEvents is being called');
    var flashTeamsJSON = currentTeam.flash_teams_json;
    for(var i=0;i<flashTeamsJSON.events.length;i++){
        var ev = flashTeamsJSON.events[i];
        //console.log("DRAWING EVENT " + i + ", with editable: " + editable);
        drawEvent(ev);
        //drawPopover(ev, editable, false);
    }
    //checkProjectFolder();
};

var drawStartedEvents = function(){
    //console.log('drawStartedEvents is being called');
    for(var i=0;i<flashTeamsJSON.events.length;i++){
        var ev = flashTeamsJSON.events[i];
        if(ev.status == "started" || ev.status == "delayed" ){
            drawEvent(ev);
        }
        //drawPopover(ev, editable, false);
    }
};


// not being called right now
var drawStartedEvTimers = function(){
    //console.log('drawStartedEvents is being called');
    for(var i=0;i<flashTeamsJSON.events.length;i++){
        var ev = flashTeamsJSON.events[i];
        if(ev.status == "started" || ev.status == "delayed" ){
            drawTimer(ev);
        }
    }
};


var sortComparator = function(a, b){
    if(a[0] < b[0]) return -1;
    if(a[0] > b[0]) return 1;
    return 0;
};

// "overlapping" algorithm
var computeTotalOffset = function(allRanges){
    var changes = [];
    for(var i=0;i<allRanges.length;i++){
        var range = allRanges[i];
        changes.push([range[0], 1]);
        changes.push([range[1], -1]);
    }

    var sorted_changes = changes.sort(sortComparator);

    var curr = 0;
    var height = 0;
    var new_ranges = [];
    for(var j=0;j<sorted_changes.length;j++){
        var r = sorted_changes[j];
        new_ranges.push([curr, r[0], height]);
        curr = r[0];
        height = height + r[1];
    }

    var totalOffset = 0;
    for(var k=0;k<new_ranges.length;k++){
        var curr_range = new_ranges[k];
        if(curr_range[2] == 0) continue;
        totalOffset = totalOffset + (curr_range[1] - curr_range[0]);
    }

    return totalOffset;
};

//Takes the JSON and time and updates the cursor position
var positionCursor = function(team, latest_time){
    //Team hasn't started, initialize cursor to 0
    if(!team["startTime"]){
        cursor.attr("x1", 0);
        cursor.attr("x2", 0);
        curr_x_standard = 0;
        return;
    }

    cursor.transition().duration(0);
    clearInterval(cursor_interval_id);

    var currTime = latest_time;
    var startTime = team["startTime"];
    var diff = currTime - startTime;

    var cursor_details = getXCoordForTime(diff);
    //console.log("DIFF: " + diff);
    //console.log("CURSOR_DETAILS: " + cursor_details);
    var x = parseFloat(cursor_details["finalX"]);
    //console.log("POSITIONING CURSOR AT: " + x);
    cursor.attr("x1", x);
    cursor.attr("x2", x);
    curr_x_standard = x;

    return cursor_details;
};

var startCursor = function(cursor_details){
    /*
    var x = cursor_details["finalX"];
    var numIntervals = cursor_details["numInt"] + 1;
    var target_x = 50*numIntervals;
    var dist = target_x - x;
    var t = (dist/50)*timeline_interval;
    syncCursor(t, target_x);
    */
    setCursorMoving();
};

/*var syncCursor = function(length_of_time, target_x){
    curr_x_standard = target_x;

    cursor.transition()
        .duration(length_of_time)
        .ease("linear")
        .attr("x1", curr_x_standard)
        .attr("x2", curr_x_standard)
        .each("end", function(){
            //console.log("completed sync");
            //console.log("sync cursor done. moving cursor normally now..");
            setCursorMoving();
        });
};*/

var setCursorMoving = function(){
    cursor.transition().duration(0);
    clearInterval(cursor_interval_id);

    moveCursor(timeline_interval);
    cursor_interval_id = setInterval(function() {
        moveCursor(timeline_interval);
    }, timeline_interval);
};

var moveCursor = function(length_of_time){
    var curr_x = parseFloat(cursor.attr("x1"));
    //console.log("STARTING TO MOVE CURSOR. STARTING X IS: " + curr_x);
    curr_x_standard = curr_x + parseFloat(50);
    //console.log("MOVING IT TO NEW X: " + curr_x_standard);

    cursor.transition()
        .duration(length_of_time)
        .ease("linear")
        .attr("x1", curr_x_standard)
        .attr("x2", curr_x_standard);
};

var stopCursor = function() {
    //console.log("STOPPED CURSOR");
    cursor.transition().duration(0);
    clearInterval(cursor_interval_id);
};

var computeLiveAndRemainingTasks = function(){
    //console.log("computing live and remaining tasks: " + task_groups.length);
    var curr_x = cursor.attr("x1");
    var curr_new_x = parseFloat(curr_x) + increment;

    var remaining_tasks = [];
    var live_tasks = [];
    for (var i=0;i<task_groups.length;i++){
        var data = task_groups[i];
        var groupNum = data.groupNum;

        var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
        var start_x = ev.x;
        var width = getWidth(ev);
        var end_x = parseFloat(start_x) + parseFloat(width);


        if(curr_new_x >= start_x && curr_new_x <= end_x && drawn_blue_tasks.indexOf(groupNum) == -1){

		         //console.log("previous task does not appear to be delayed so adding task to live_task");
                   live_tasks.push(groupNum);


        } else if(curr_new_x < start_x){
            remaining_tasks.push(groupNum);
        }
    }

/*    var tasks_tmp = MoveLiveToRemaining(live_tasks,remaining_tasks);
    live_tasks = tasks_tmp["live"];
    remaining_tasks = tasks_tmp["remaining"];
    updateStatus(true);
  */
    //console.log("returning from computing live and remaining tasks");
    return {"live":live_tasks, "remaining":remaining_tasks};
};


var prevTasksDelayed = function(curr_x){
     var prevTasks = computeTasksBeforeCurrent(curr_x);
     if(prevTasks.length > 0){
     	for (var i=0;i<prevTasks.length;i++){

          if(isDelayed(prevTasks[i])){
               return true;
          }
		}
     }
     else{
          return false;
     }
     return false;
}

var computeTasksAfterCurrent = function(curr_x){
    tasks_after_curr = [];

    // go through all tasks
    for (var i=0;i<task_groups.length;i++){
        var data = task_groups[i];
        var groupNum = data.groupNum;

         if(getEventJSONIndex(groupNum) == undefined){
                removeTask(groupNum);
                //console.log("removed task from task_groups in computeTasksAfterCurrent");

            } else{
            // get start x coordinate of task
            var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
            var start_x = ev.x;

            // if the task's x coordinate is after the current x, it is "after," so add it
            if(curr_x <= start_x){
                tasks_after_curr.push(groupNum);
            }
        }
    }

    return tasks_after_curr;
};

//event.x of pushed back tasks are updated after the drawDelayedTasks is called
//This functions returns the pushed back tasks as tasks before current if it is called before drawDelayedTasks is called
var computeTasksBeforeCurrent = function(curr_x){
    tasks_before_curr = [];

    // go through all tasks
    for (var i=0;i<task_groups.length;i++){
        var data = task_groups[i];
        var groupNum = data.groupNum;

        if(getEventJSONIndex(groupNum) == undefined){
            removeTask(groupNum);
            //console.log("removed task from task_groups in computeTasksBeforeCurrent");

        } else{
            // get start x coordinate of task
            var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
            var start_x = ev.x;
            var width = getWidth(ev);
            var end_x = parseFloat(start_x) + parseFloat(width);

            // if the task's end x coordinate is before the current x, it is "before," so add it
            if(end_x <= curr_x){
                tasks_before_curr.push(groupNum);
            }
        }
    }
    return tasks_before_curr;
};

/*
    Usage:
    var g = getTaskGFromGroupNum(groupNum);
    g.append("rect").attr()..
    g.data()
*/
var getTaskGFromGroupNum = function(groupNum){
    return timeline_svg.selectAll("g#g_"+groupNum);
};

var getDataIndexFromGroupNum = function(groupNum){
    for(var i=0;i<task_groups.length;i++){
        var data = task_groups[i];
        if(data.groupNum == groupNum){
            return i;
        }
    }
    return null;
};

// only removes task from timeline, does not update the event array
// if you need to delete an event from the timeline, should call deleteEvent
// in events.js, which in turn calls this function
var removeTask = function(groupNum){
    // remove from data array
    var idx = null;
    for(var i=0;i<task_groups.length;i++){
        var data = task_groups[i];
        if (data.groupNum == groupNum){
            idx = i;
            break;
        }
    }
    if(idx != null){
        task_groups.splice(idx, 1);
    }

    // remove from screen
    timeline_svg.selectAll("g.event")
        .data(task_groups, function(d){ return d.groupNum; })
        .exit().remove();
};

var extendDelayedBoxes = function(){
    // go through delayed tasks and increase width of red box
    var cursor_x = parseFloat(cursor.attr("x1"));
    var diff = 0;
    for (var i=0;i<delayed_tasks.length;i++){
        var groupNum = delayed_tasks[i];
        var delayed_rect = timeline_svg.selectAll("#delayed_rect_" + groupNum);

        // new width is diff b/w current cursor position and starting of delayed rect
        var curr_width = parseFloat(delayed_rect.attr("width"));
        var new_width = cursor_x - parseFloat(delayed_rect.attr("x"));
        delayed_rect.attr("width", new_width);

        diff = new_width - curr_width;
    }
    if(diff > 0){
        moveRemainingTasksRight(diff);
    }
};

//Draws all the interactions that involve the "tasks"
//Note: if "tasks" is undefined, draws all interactions
var drawInteractions = function(tasks){
    //Find Remaining Interactions and Draw
    var remainingHandoffs = getHandoffs(tasks);
    var numHandoffs = remainingHandoffs.length;

    var remainingCollabs = getCollabs(tasks);
    var numCollabs = remainingCollabs.length;

    for (var j = 0; j < numHandoffs; j++) {
        var intId = remainingHandoffs[j].id
        $("#interaction_" + intId).popover("destroy");
        $("#interaction_" + intId).remove();
        drawHandoff(remainingHandoffs[j]);
    }

    for (var k = 0; k < numCollabs; k++) {
        var intId = remainingCollabs[k].id;
        $("#interaction_" + intId).popover("destroy");
        $("#interaction_" + intId).remove();
        var event1 = flashTeamsJSON["events"][getEventJSONIndex(remainingCollabs[k].event1)];
        var event2 = flashTeamsJSON["events"][getEventJSONIndex(remainingCollabs[k].event2)];
        var overlap = eventsOverlap(event1.x, getWidth(event1), event2.x, getWidth(event2));
        drawCollaboration(remainingCollabs[k], overlap);
    }
};

//Updates all the interaction popovers that involve the "tasks"
//Note: if "tasks" is undefined, updates all interaction popovers
//This is used to update the interaction popovers to edit mode or read only depending on the state of the team
var updateInteractionsPopovers = function(tasks){
    //Find Remaining Interactions and Draw
    var remainingHandoffs = getHandoffs(tasks);
    var numHandoffs = remainingHandoffs.length;

    var remainingCollabs = getCollabs(tasks);
    var numCollabs = remainingCollabs.length;

    for (var j = 0; j < numHandoffs; j++) {
        var intId = remainingHandoffs[j].id
        updateHandoffPopover(intId);
    }

    for (var k = 0; k < numCollabs; k++) {
        var intId = remainingCollabs[k].id;
        updateCollabPopover(intId);
    }
};


var moveTasksRight = function(tasks, amount, from_initial){
    var len = tasks.length;
    for (var i=0;i<len;i++){
        // get the task id
        var groupNum = tasks[i];

        // get the event object
        var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];

        // change the start x
        if (from_initial) {
            //console.log(groupNum + " | BEFORE MOVING RIGHT, MIN_X: " + parseFloat(ev.min_x));
            ev.x = parseFloat(ev.min_x) + parseFloat(amount);
            //console.log(groupNum + " | AFTER MOVING RIGHT, EV.X: " + ev.x);
        } else {
            //console.log(groupNum + " | NOT FROM INITIAL.");
            ev.x += parseFloat(amount);
        }

        // change the time corresponding to the new start x
        var startTimeObj = getStartTime(ev.x);
        ev.startTime = startTimeObj["startTime"];
        ev.startHr = startTimeObj["startHr"];
        ev.startMin = startTimeObj["startMin"];
        flashTeamsJSON["events"][getEventJSONIndex(groupNum)] = ev;

        drawEvent(ev);
        //drawPopover(ev, false, false);
    }

    var tasks_with_current = tasks.slice(0);
    tasks_with_current = tasks_with_current.concat(delayed_tasks);
    drawInteractions(tasks_with_current);

    //updateStatus();
};

//Notes: Error exist with delay and handoff connections...how and why are those dependencies the way they are?

var moveTasksLeft = function(tasks, amount){
    console.log("MOVE TASKS LEFT FXN CALLED");
    for (var i=0;i<tasks.length;i++){
        // get the task id
        var groupNum = tasks[i];

        // get the event object
        var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];

        // change the start x
        ev.x -= parseFloat(amount);
        if (ev.x < ev.min_x)
            ev.min_x = ev.x;

        // change the time corresponding to the new start x
        //ev.startTime -= amount;
        var startTimeObj = getStartTime(ev.x);
        ev.startTime = startTimeObj["startTime"];
        ev.startHr = startTimeObj["startHr"];
        ev.startMin = startTimeObj["startMin"];

        drawEvent(ev);
        //drawPopover(ev, false, false);
    }

    var tasks_with_current = tasks.slice(0);
    tasks_with_current = tasks_with_current.concat(delayed_tasks);
    drawInteractions(tasks_with_current);

    //updateStatus(true);
    updateStatus();
};

var moveRemainingTasksRight = function(amount){
    moveTasksRight(remaining_tasks, amount, false);
};

var moveRemainingTasksLeft = function(amount){
    // console.log("THESE ARE THE REMAINING TASKS", remaining_tasks);
    lastEndTime = 0;
    for (var i=0;i<live_tasks.length;i++){
        var ev = flashTeamsJSON["events"][getEventJSONIndex(live_tasks[i])]
        var start_x = ev.x;
        var width = getWidth(ev);
        var end_x = parseFloat(start_x) + parseFloat(width);
        if (end_x >= lastEndTime){
            lastEndTime = end_x;
        }
    }
    to_move = [];
    for (var i=0;i<remaining_tasks.length;i++){
        var evNum = remaining_tasks[i];
        var ev = flashTeamsJSON["events"][getEventJSONIndex(evNum)]
        var start_x = ev.x;
        var width = getWidth(ev);
        var end_x = parseFloat(start_x) + parseFloat(width);
        if (start_x >= lastEndTime){
            to_move.push(evNum);
        }
    }
    moveTasksLeft(to_move, amount);
}

/*
TODO:
update popover when automatically shift the tasks left or right
shorten width when finish early (?)
offset of half of drag bar width when drawing red and blue boxes
*/
// not being called for user's side
// trying to fix issue of user's page not extending delayed box (and moving remaining tasks to the right)
// var trackLiveAndRemainingTasks = function() {
//     tracking_tasks_interval_id = setInterval(function(){
//         var tasks = computeLiveAndRemainingTasks();
//         var new_live_tasks = tasks["live"];
//         var new_remaining_tasks = tasks["remaining"];

//         // extend already delayed boxes
//         extendDelayedBoxes();

//         var at_least_one_task_started = false;
//         var at_least_one_task_delayed = false;

//         // detect any live task is now delayed or completed early
//         for (var i=0;i<live_tasks.length;i++){
//             var groupNum = parseInt(live_tasks[i]);
//             var task_g = getTaskGFromGroupNum (groupNum);
//             var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
//             var completed = ev.completed_x;
//             var task_rect_curr_width = parseFloat(getWidth(ev));

//             // delayed
//             if (new_live_tasks.indexOf(groupNum) == -1 && !completed) { // groupNum is no longer live
//                 console.log("PREVIOUSLY LIVE TASK NOW DELAYED!");
//                 drawRedBox(ev, task_g, false);

//                 // add to delayed_tasks list
//                 delayed_tasks.push(groupNum);

//                 // updateStatus is required to send the notification email when a task is delayed
//                 delayed_tasks_time[groupNum]=(new Date).getTime();

//                 at_least_one_task_delayed = true;
//             }
//         }





//         var tasks_tmp = MoveLiveToRemaining(new_live_tasks,new_remaining_tasks);
//         new_live_tasks = tasks_tmp["live"];
//         new_remaining_tasks = tasks_tmp["remaining"];

//         for (var j=0;j<remaining_tasks.length;j++){
//             var groupNum = parseInt(remaining_tasks[j]);
//             if (new_live_tasks.indexOf(groupNum) != -1) { // groupNum is now live
//                 at_least_one_task_started = true;
//             }
//         }

//         live_tasks = new_live_tasks;
//         remaining_tasks = new_remaining_tasks;



//         if(at_least_one_task_delayed || at_least_one_task_started){
//             //updateStatus(true);
//             updateStatus();
//             if(at_least_one_task_delayed)
//                 at_least_one_task_delayed = false;
//             if(at_least_one_task_started)
//                 at_least_one_task_started = false;
//         }
//     }, fire_interval);
// };

//moves live task to remaining task if prev task is delayed
function MoveLiveToRemaining(new_live_tasks,new_remaining_tasks){
    var tmp_live_tasks = [];
    for (var i =0 ; i<new_live_tasks.length; i++){
        tmp_live_tasks.push(new_live_tasks[i]);
    }


    for (var j=0;j<tmp_live_tasks.length;j++){
       // console.log(tmp_live_tasks.length);
        var groupNum = parseInt(tmp_live_tasks[j]);
        var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
        var start_x = ev.x;


        if(prevTasksDelayed(start_x)){
                  new_remaining_tasks.push(groupNum);

                 //remove task from live array
                 new_live_tasks.splice(new_live_tasks.indexOf(tmp_live_tasks[j]), 1);

        }
    }


    return {"live":new_live_tasks, "remaining":new_remaining_tasks};

}


//Search all handoffs, return those that involve only two remaining tasks
function getHandoffs(tasks) {
    var handoffs = [];
    for (var i=0; i<flashTeamsJSON["interactions"].length; i++) {
        var inter = flashTeamsJSON["interactions"][i];
        if (inter.type == "collaboration") continue;

        if(tasks == undefined){ //If tasks undefined, include ALL handoffs
            handoffs.push(inter);
        } else {
            for (var j = 0; j<tasks.length; j++) {
                var task1Id = tasks[j];
                for (var k = 0; k<tasks.length; k++) {
                    if (j == k) continue;
                    var task2Id = tasks[k];
                    if ((inter.event1 == task1Id && inter.event2 == task2Id)
                    || (inter.event1 == task2Id && inter.event2 == task1Id)) {
                        handoffs.push(inter);
                    }
                }
            }
        }
    }

    return handoffs;
}

//Search all collaborations, return those that involve only two remaining tasks
function getCollabs(tasks) {
    var collabs = [];
    for (var i=0; i<flashTeamsJSON["interactions"].length; i++) {
        var inter = flashTeamsJSON["interactions"][i];
        if (inter.type == "handoff") continue;

        if(tasks == undefined) { //If tasks undefined, include ALL collaborations
            collabs.push(inter);
        } else {
            for (var j = 0; j<tasks.length; j++) {
                var task1Id = tasks[j];
                for (var k = 0; k<tasks.length; k++) {
                    if (j == k) {
                        continue;
                    }
                    var task2Id = tasks[k];
                    if ((inter.event1 == task1Id && inter.event2 == task2Id)
                    || (inter.event1 == task2Id && inter.event2 == task1Id)) {
                        collabs.push(inter);
                    }
                }
            }
        }
    }
    return collabs;
}

function isDelayed(element) {
    for (var i=0; i<delayed_tasks.length;i++){
        if (delayed_tasks[i] == element){
            return true;
        }
    }
    return false;
};

function getEventIndexFromId(event_id) {
    var index = -1;
    for (var i = 0; i < flashTeamsJSON["events"].length; i++) {
        if (flashTeamsJSON["events"][i]["id"] == event_id) {
            index = i;
        }
    }
    return index;
}


var trackUpcomingEvent = function(){

     if (current == undefined){
        return;
    }

    //setInterval(function(){

        var overallTime;

        // if (currentUserEvents.length == 0 ){
        //     overallTime = "You have not been assigned to any tasks yet.";
        //     statusText.text(overallTime);
        //     statusText.style("color", "black");
        //     return;
        // }

        currentUserEvents = currentUserEvents.sort(function(a,b){return parseInt(a.startTime) - parseInt(b.startTime)});

        if (currentUserEvents.length == 0){
            return;
        }

        var ev = flashTeamsJSON["events"][getEventJSONIndex(currentUserEvents[0].id)];
        upcomingEvent = ev.id;
        var task_g = getTaskGFromGroupNum(upcomingEvent);

        while (ev.status == "completed"){
            toDelete = upcomingEvent;
            currentUserEvents.splice(0,1);
            if (currentUserEvents.length == 0){
                upcomingEvent = undefined;

                //overallTime = "You've completed all your tasks!";

                //updateSidebarText("You've completed all your tasks!", "#3fb53f");

                $("#project-status-text").html("You've completed all your tasks!");
                $("#project-status-text").css("margin-bottom", "10px");
                $("#project-status-text").css("color", "#3fb53f");

                $("#project-status-btn").css("display", "none");
                $("#project-status-btn2").css("display", "none");
                $("#project-status-alert").css("display", "none");
                $("#project-status-alert-btn").css("display", "none");
                $("#project-status-alert-btn2").css("display", "none");
                //statusText.style("color", "#3fb53f");
                //statusText.text("You've completed all your tasks!");
                return;
            }
            upcomingEvent = currentUserEvents[0].id;
            task_g = getTaskGFromGroupNum(upcomingEvent);
            ev = flashTeamsJSON["events"][getEventJSONIndex(upcomingEvent)];
        }


        if( ev.status == "not_started" ){
            if(checkEventsBeforeCompletedNoAlert(upcomingEvent) && in_progress == true){
                overallTime = "You can now start <a href='#' class='task-name-status' onclick='eventMousedown(" + ev.id +")'>"+ ev.title +"</a> task.";

                updateSidebarText(overallTime, "black");

                updateStatusAlertText(overallTime, 'alert-class');

                updateSidebarButton(ev.id, 'eventMousedown', 'Start Task', 'btn-warning');

                updateAlertButton(ev.id, 'eventMousedown', 'Start Task', 'btn-warning');
            }
            else{
                overallTime = "Your next task is <a href='#' class='task-name-status' onclick='eventMousedown(" + ev.id +")'>"+ ev.title +"</a>.";

                updateSidebarText(overallTime, "black");

                updateStatusAlertText(overallTime, 'alert-hide');

                updateSidebarButton(ev.id, 'eventMousedown', 'View Task', 'btn-primary');

                updateAlertButton(ev.id, 'eventMousedown', 'View Task', 'btn-primary');
            }
        }

        if( ev.status == "paused"){
            overallTime = "Your task <a href='#' class='task-name-status' onclick='eventMousedown(" + ev.id +")'>("+ ev.title +")</a> is paused.";

            updateSidebarText(overallTime, "#006699");

            updateStatusAlertText(overallTime, 'alert-info');

            updateSidebarButton(ev.id, 'resumeTask', 'Resume Task', 'btn-primary');

            updateAlertButton(ev.id, 'resumeTask', 'Resume Task', 'btn-primary');

        }

        if( ev.status == "delayed"){
            overallTime = "Your task <a href='#' class='task-name-status' onclick='eventMousedown(" + ev.id +")'>("+ ev.title +")</a> is delayed.";

            updateSidebarText(overallTime, "#f52020");

            updateStatusAlertText(overallTime, 'alert-danger');

            updateSidebarButton(ev.id, 'confirmCompleteTask', 'Complete Task', 'btn-success');

            updateSidebarButton(ev.id, 'pauseTask', 'Take a Break', 'btn-info', 'project-status-btn2');

            updateAlertButton(ev.id, 'confirmCompleteTask', 'Complete Task', 'btn-success');
            updateAlertButton(ev.id, 'pauseTask', 'Take a Break', 'btn-info', 'project-status-alert-btn2');
        }

        else if ( ev.status == "started"){
            overallTime = "Your task <a href='#' class='task-name-status' onclick='eventMousedown(" + ev.id +")'>("+ ev.title +")</a> is in progress.";

            updateSidebarText(overallTime, "#40b8e4");

            updateStatusAlertText(overallTime, 'alert-hide');

            updateSidebarButton(ev.id, 'confirmCompleteTask', 'Complete Task', 'btn-success');

            updateSidebarButton(ev.id, 'pauseTask', 'Pause Task', 'btn-info', 'project-status-btn2');
        }

        if(in_progress == true &&  (flashTeamsJSON["paused"] == true) ){
            overallTime = "The team is being edited right now. " + overallTime;
            updateSidebarText(overallTime);
        }


    //}, fire_interval);
}

// updates the project status text in the sidebar
function updateSidebarText(overallTime, color){
    $("#project-status-text").html(overallTime);

    if(color){
        $("#project-status-text").css("color", color);

        if($(".task-name-status")){
            $(".task-name-status").css("color", color);
        }
    }
}

// updates the project status text and background of the alert div on top of timeline
function updateStatusAlertText(overallTime, alertClass){

    $("#project-status-alert-text").html(overallTime);

    var lastClass = $("#project-status-alert").attr('class').split(' ').pop();
    $("#project-status-alert").removeClass(lastClass);
    $("#project-status-alert").addClass(alertClass);

    if(alertClass =='alert-hide'){
        $("#project-status-alert").css("display", "none");

    }else{
        $("#project-status-alert").css("display", "");
    }

}

// updates the task buttons in the sidebar
function updateSidebarButton(groupNum, functionName, btnText, btnClass, btnId){

    var buttonId = btnId || "project-status-btn";

    // hide the second status button unless it is explicitly called
    if(buttonId != "project-status-btn2"){
        $("#project-status-btn2").css("display", "none");
    }

    //remove the last class on the button, which refers to the previous status button
    var lastClass = $("#" + buttonId).attr('class').split(' ').pop();
    $("#" + buttonId).removeClass(lastClass);
    $("#" + buttonId).addClass(btnClass);

    $("#" + buttonId).attr('onclick', functionName +'(' + groupNum + ')');

    $("#" + buttonId).css("display", "");
    $("#" + buttonId).html(btnText);
}

// updates the task buttons in the alert div over the timeline
function updateAlertButton(groupNum, functionName, btnText, btnClass, btnId){

    var buttonId = btnId || "project-status-alert-btn";

    // hide the second status button unless it is explicitly called
    if(buttonId != "project-status-alert-btn2"){
        $("#project-status-alert-btn2").css("display", "none");
    }

    //remove the last class on the button, which refers to the previous status button
    var lastClass = $("#" + buttonId).attr('class').split(' ').pop();
    $("#" + buttonId).removeClass(lastClass);
    $("#" + buttonId).addClass(btnClass);

    $("#" + buttonId).attr('onclick', functionName +'(' + groupNum + ')');

    $("#" + buttonId).css("display", "");
    $("#" + buttonId).html(btnText);
}

var getAllData = function(){
    var all_data = [];
    for(var i=0;i<task_groups.length;i++){
        var data = task_groups[i];
        all_data.push(data);
    }
    return all_data;
};

var getAllTasks = function(){
    var all_tasks = [];
    for(var i=0;i<task_groups.length;i++){
        var data = task_groups[i];
        var groupNum = data.groupNum;
        all_tasks.push(groupNum);
    }
    return all_tasks;
};

/* moved to FlashTeam
var constructStatusObj = function()
*/

var timer = null;

var updateStatus = function(flash_team_in_progress){
    currentTeam.updateStatus(flash_team_in_progress)
};

//this function updates the original status of the flash team in the database, which is
// used for the team duplication feature (it preserves the team without saving the status
// information once the team is run
var updateOriginalStatus = function(){
    currentTeam.updateOriginalStatus()
};

var sendEmailOnCompletionOfDelayedTask = function(groupNum){
    // send "delayed task is finished" email
   var tasks_after = flashTeamsJSON["events"][getEventJSONIndex(parseInt(groupNum))]["events_after"];

    if(tasks_after == null)
        return;

    if(tasks_after.length!=0){
        var title="test";
        var events = flashTeamsJSON["events"];

        for(var i=0;i<events.length;i++){
            var ev = events[i];
            if (parseInt(ev["id"]) == groupNum){
                title = ev["title"];
                break;
            }
        }

        DelayedTaskFinished_helper(tasks_after,title);
    }
};

var sendEmailOnEarlyCompletion = function(blue_width){
    var early_minutes=parseInt((parseFloat(blue_width+4)/50.0)*30);
    early_completion_helper(remaining_tasks,early_minutes);
};
