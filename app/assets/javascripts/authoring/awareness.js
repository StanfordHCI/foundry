/* awareness.js
 * ---------------------------------------------
 * 
 */

var poll_interval = 5000; // 20 seconds
var poll_interval_id;
var timeline_interval = 10000; // "normal" speed timer is 30 minutes (1800000 milliseconds); fast timer is 10 seconds (10000 milliseconds)
var fire_interval = 180; // change back to 180
var numIntervals = parseFloat(timeline_interval)/parseFloat(fire_interval);
var increment = parseFloat(50)/parseFloat(numIntervals);
var curr_x_standard = 0;
var live_tasks = [];
var remaining_tasks = [];
var delayed_tasks = [];
var drawn_blue_tasks = [];
var completed_red_tasks = [];
var task_groups = [];
var loadedStatus;
var in_progress = false;
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
    renderEverything(true);
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
        .style("stroke-width", "2");
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

function startFlashTeam() {
    $('#confirmAction').modal('hide');
    // view changes
    $("#flashTeamStartBtn").attr("disabled", "disabled");
    $("#flashTeamStartBtn").css('display','none');
    $("#flashTeamEndBtn").css('display','');
    $("div#search-events-container").css('display','none');
    $("div#project-status-container").css('display','');
    $("div#chat-box-container").css('display','');
    $("#flashTeamTitle").css('display','none');
    removeColabBtns();
    removeHandoffBtns();
    startTeam(true);
    
    //addAllFolders();
    //googleDriveLink();
}


function endTeam() {
    console.log("TEAM ENDED");
    $('#confirmAction').modal('hide');
    updateStatus(false);
    stopCursor();
    stopProjectStatus();
    stopPolling();
    stopTrackingTasks();
    $("#flashTeamEndBtn").attr("disabled", "disabled");
}

//Asks user to confirm that they want to end the team
$("#flashTeamEndBtn").click(function(){
    var bodyText = document.getElementById("confirmActionText");
    updateStatus();
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

    document.getElementById("confirmButton").onclick=function(){endTeam()};
    

});


function stopPolling() {
    //console.log("STOPPED POLLING");
    window.clearInterval(poll_interval_id);
};

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

// firstTime=true means page is reloaded
function renderEverything(firstTime) {
    colorBox();
    var flash_team_id = $("#flash_team_id").val();
    var url = '/flash_teams/' + flash_team_id + '/get_status';
    $.ajax({
        url: url,
        type: 'get'
    }).done(function(data){
        // firstTime will also be true in the case that flashTeamEndedorStarted, so
        // we make sure that it is false (i.e. true firstTime, upon page reload for user
        // before the team starts)
        // !user_poll means a poll wasn't the one the generated this call to renderEverything
        //if(firstTime && !user_poll) // TODO: find better way to capture the case of user_poll
        if(firstTime){
            renderChatbox(); 
            renderProjectOverview(); //note: not sure if this goes here, depends on who sees the project overview (e.g., user and/or requester)
        }


        //get user name and user role for the chat
        if(data == null){
            //console.log("RETURNING BEFORE LOAD"); 
            return; // status not set yet
        }

        loadedStatus = data;

        in_progress = loadedStatus.flash_team_in_progress;
        flashTeamsJSON = loadedStatus.flash_teams_json;

        if(firstTime) {
            setCurrentMember();
            initializeTimelineDuration();
            renderProjectOverview(); //note: not sure if this goes here, depends on who sees the project overview (e.g., user and/or requester)
        }


        // is this the user, and has he/she loaded the page
        // before the team started
        // is_user && firstTime && in_progress would be the case
        // where the user loads the page for the first time after
        // the team has started
        if(isUser) {
            // user loaded page before team started
            if (firstTime && !in_progress)
                user_loaded_before_team_start = true;
        }

        if(in_progress){
            colorBox();
            console.log("flash team in progress");
            $("#flashTeamStartBtn").attr("disabled", "disabled");
            $("#flashTeamStartBtn").css('display','none'); //not sure if this is necessary since it's above 
            $("#flashTeamEndBtn").css('display',''); //not sure if this is necessary since it's above 
            loadData();
            if(!isUser || memberType == "pc" || memberType == "client")
                renderMembersRequester();
            else
                renderMembersUser();
            renderMembersUser();
            //startTeam(firstTime);
        } else {
            console.log("flash team not in progress");
            
            if(flashTeamsJSON["startTime"] == undefined){
	            //console.log("NO START TIME!");
				updateOriginalStatus();
            }
            
            if(!flashTeamsJSON)
                return;
            
            // will only be run way at the beginning before any members or events are added
            // will only run in requester's page, because on members' pages, members array
            // length will be greater than zero
            if (flashTeamsJSON.events.length == 0 && flashTeamsJSON.members.length == 0){
                createNewFolder(flashTeamsJSON["title"]); // gdrive
            }
            loadData();
            
            if(!isUser || memberType == "pc" || memberType == "client") {
                renderMembersRequester();
            }
        }
    });

    if(firstTime) {
        poll_interval_id = poll();
        listenForVisibilityChange();
    }
}

function listenForVisibilityChange(){
    if (typeof document.hidden !== "undefined") {
        window_visibility_change = "visibilitychange";
        window_visibility_state = "visibilityState";
    } else if (typeof document.mozHidden !== "undefined") {
        window_visibility_change = "mozvisibilitychange";
        window_visibility_state = "mozVisibilityState";
    } else if (typeof document.msHidden !== "undefined") {
        window_visibility_change = "msvisibilitychange";
        window_visibility_state = "msVisibilityState";
    } else if (typeof document.webkitHidden !== "undefined") {
        window_visibility_change = "webkitvisibilitychange";
        window_visibility_state = "webkitVisibilityState";
    }

    // Add a listener for the next time that the page becomes visible
    document.addEventListener(window_visibility_change, function() {
        var state = document[window_visibility_state];
        if(state == "visible" && in_progress){
            renderEverything(false);
        }
    }, false);
};  

// saves member object for current_user (undefined for author so we will set it to 'Author')
var current_user;

//finds user name and sets current variable to user's index in array
var renderChatbox = function(){
    var uniq_u=getParameterByName('uniq');
        
    var url2 = '/flash_teams/' + flash_team_id + '/get_user_name';
    $.ajax({
       url: url2,
       type: 'post',
       data : { "uniq" : String(uniq_u) }
    }).done(function(data){
       chat_name = data["user_name"];
       chat_role = data["user_role"];
       
       presname = chat_name;
	   currentStatus = "online ★";
	   
	   // current_user is undefined for author so just set it to 'Author' 
	   // when current_user is the author it won't have a uniq id so need to check for current_user == 'Author' instead
	   if(chat_role == 'Author'){
		   current_user = 'Author';
		   //console.log ("CURRENT USER AUTHOR: " + current_user);
		   
	   }

       if (chat_role == "" || chat_role == null){
         uniq_u2 = data["uniq"];
         
        
         flash_team_members = flashTeamsJSON["members"];
         //console.log(flash_team_members[0].uniq);
         for(var i=0;i<flash_team_members.length;i++){
            
            if (flash_team_members[i].uniq == uniq_u2){
              chat_role = flash_team_members[i].role; 
              current = i;
              current_user = flash_team_members[i];

              // here there once existed a call to boldEvents
              trackUpcomingEvent();
            }
         }
        
       }
       
       // Set our initial online status.
		setUserStatus(currentStatus);

       myDataRef.on('child_added', function(snapshot) {
                var message = snapshot.val();
                //console.log(snapshot);
                //console.log(message);
                //console.log("MESSAGE NAME: " + message["name"]);

                displayChatMessage(message.name, message.uniq, message.role, message.date, message.text);
                
                name = message.name;
            });
                   
    });
};

var flashTeamEndedorStarted = function(){
    if (loadedStatus.flash_team_in_progress == undefined){
        return false;
    }
    return in_progress != loadedStatus.flash_team_in_progress;
};

var flashTeamUpdated = function(){
    var updated_drawn_blue_tasks = loadedStatus.drawn_blue_tasks;
    var updated_completed_red_tasks = loadedStatus.completed_red_tasks;

    if (updated_drawn_blue_tasks.length != drawn_blue_tasks.length) {
        console.log("drawn_blue_tasks not same length");
        console.log(drawn_blue_tasks);
        console.log(updated_drawn_blue_tasks);
        return true;
    }
    if (updated_completed_red_tasks.length != completed_red_tasks.length) {
        console.log("completed_red_tasks not same length");
        console.log(completed_red_tasks);
        console.log(updated_completed_red_tasks);
        console.log(loadedStatus.live_tasks);
        console.log(loadedStatus.delayed_tasks);
        return true;
    }

    if(updated_drawn_blue_tasks.sort().join(',') !== drawn_blue_tasks.sort().join(',')){
        console.log("drawn_blue_tasks not same content");
        console.log(drawn_blue_tasks);
        console.log(updated_drawn_blue_tasks);
        return true;
    }

    if(updated_completed_red_tasks.sort().join(',') !== completed_red_tasks.sort().join(',')){
        console.log("completed_red_tasks not same content");
        console.log(completed_red_tasks);
        console.log(updated_completed_red_tasks);
        return true;
    }
    return false;
};

var poll = function(){
    //console.log("POLLING");
    return setInterval(function(){
        //console.log("MAKING POLL NOW...");
        var flash_team_id = $("#flash_team_id").val();
        var url = '/flash_teams/' + flash_team_id + '/get_status';
        $.ajax({
            url: url,
            type: 'get'
        }).done(function(data){
            if(data == null) return;
            loadedStatus = data;

            if(flashTeamEndedorStarted()) {
                //stopPolling();
                /*if(isUser) {
                    // to solve the case where the user already loaded the page
                    // and so already has the chatbox and has already started polling
                    user_poll = true;
                }
                renderEverything(true);
                */
                renderEverything(false);
            } else if (flashTeamUpdated()) {
                //stopPolling();
                console.log("FLASH TEAM UPDATED..CALLING renderEverything(FALSE)");
                renderEverything(false);
            } else {
                //console.log("Flash team not updated and not ended");
            }
        });
    }, poll_interval); // every 5 seconds currently
};

var recordStartTime = function(){
    flashTeamsJSON["startTime"] = (new Date).getTime();
    updateStatus(true);
};

var loadStatus = function(id){
    var loadedStatusJSON;
    var url = '/flash_teams/' + id.toString() + '/get_status';
    $.ajax({
        url: url,
        type: 'get'
    }).done(function(data){
        loadedStatusJSON = data;
        //console.log("loadedStatusJSON: " + loadedStatusJSON);
    });
    return JSON.parse(loadedStatusJSON);
};

var loadData = function(){
    // position cursor before getting the new task arrays
    // because once the new task arrays are updated,
    // trackLiveAndRemainingTasks is immediately going to
    // operate on them, while the current cursor here is
    // not yet where it should be in time (its behind)
    var latest_time;
    if (in_progress){
        latest_time = (new Date()).getTime();
    } else {
        latest_time = loadedStatus.latest_time; // really only useful at end
    }
   
    //Next line is commented out after disabling the ticker
   // cursor_details = positionCursor(flashTeamsJSON, latest_time);

    live_tasks = loadedStatus.live_tasks;
    remaining_tasks = loadedStatus.remaining_tasks;
    delayed_tasks = loadedStatus.delayed_tasks;
    drawn_blue_tasks = loadedStatus.drawn_blue_tasks;
    completed_red_tasks = loadedStatus.completed_red_tasks;

    load_statusBar(status_bar_timeline_interval);

    event_counter = flashTeamsJSON["events"].length;
    
    drawEvents(!in_progress);

    if(isUser){
        updateAllPopoversToReadOnly();  
    }
    drawBlueBoxes();
    drawRedBoxes();
    drawDelayedTasks();
    drawInteractions(); //START HERE, INT DEBUG
    googleDriveLink();
};

// user must call this startTeam(true, )
var startTeam = function(firstTime){
    console.log("STARTING TEAM");

    if(!in_progress) {
        //flashTeamsJSON["original_json"] = JSON.parse(JSON.stringify(flashTeamsJSON));
        //flashTeamsJSON["original_status"] = JSON.parse(JSON.stringify(loadedStatus));
        //console.log("flashTeamsJSON['original_json']: " + flashTeamsJSON["original_json"]);
        //console.log("flashTeamsJSON['original_status']: " + flashTeamsJSON["original_status"]);
        //updateStatus();
        updateOriginalStatus();
		recordStartTime();
        addAllFolders();
        in_progress = true; // TODO: set before this?
        //added next line to disable the ticker
        updateStatus(true);
    }

    //Next line is commented out after disabling the ticker
    //setCursorMoving();

    // page was loaded after team started
    // OR 
    // page was loaded before team started && this call to startTeam is as a result of 
    // team now starting (received through poll)
    
    var page_loaded_after_start = firstTime && in_progress;
    var page_loaded_before_start_and_now_started = user_loaded_before_team_start && in_progress;
    
    if(page_loaded_after_start || page_loaded_before_start_and_now_started){
        if(page_loaded_before_start_and_now_started)
            user_loaded_before_team_start = false;
        updateAllPopoversToReadOnly();
       
        
        //Next line is commented out after disabling the ticker
        /*project_status_handler = setProjectStatusMoving();
        trackLiveAndRemainingTasks();
        trackUpcomingEvent();*/
    }


    //Next line is commented out after disabling the ticker
    //load_statusBar(status_bar_timeline_interval);
};

var googleDriveLink = function(){
    var gFolderLink = document.getElementById("gFolder");
    gFolderLink.onclick=function(){
        console.log("is clicked");
        window.open(flashTeamsJSON.folder[1]);
    }
};

var drawEvents = function(editable){
    for(var i=0;i<flashTeamsJSON.events.length;i++){
        var ev = flashTeamsJSON.events[i];
        console.log("DRAWING EVENT " + i + ", with editable: " + editable);
        drawEvent(ev);
        drawPopover(ev, editable, false);
    }
};

var drawBlueBox = function(ev, task_g){
    var completed_x = ev.completed_x;

    if (!completed_x){
        return null;
    }

    var groupNum = ev.id;

    var task_start = parseFloat(ev.x);
    var task_rect_curr_width = parseFloat(getWidth(ev));
    var task_end = task_start + task_rect_curr_width;
    var blue_width = task_end - completed_x;
    
    var existingBlueBox = task_g.selectAll("#early_rect_" + groupNum);
    if(existingBlueBox[0].length == 0) {
        task_g.append("rect")
            .attr("class", "early_rectangle")
            .attr("x", completed_x)
            .attr("y", function(d){ return d.y; })
            .attr("id", "early_rect_" + groupNum )
            .attr("groupNum", function(d){ return d.groupNum; })
            .attr("height", RECTANGLE_HEIGHT)
            .attr("width", blue_width)
            .attr("fill", "blue")
            .attr("fill-opacity", .6)
            .attr("stroke", "#5F5A5A");
    } else {
        existingBlueBox
            .attr("x", completed_x)
            .attr("width", blue_width);
    }

    return blue_width;
};

var drawRedBox = function(ev, task_g, use_cursor){

    var groupNum = ev.id;
    var task_start = parseFloat(ev.x);
    var task_rect_curr_width = parseFloat(getWidth(ev));
    var task_end = task_start + task_rect_curr_width;
    var completed_x = ev.completed_x;
    var red_width;
    if(!use_cursor){
        if (!completed_x){
            red_width = 1;
        } else {
            completed_x = parseFloat(completed_x);
            red_width = completed_x - task_end;
        }
    } else {
        var cursor_x = parseFloat(cursor.attr("x1"));
        red_width = cursor_x - task_end;
    }

    var existingRedBox = task_g.selectAll("#delayed_rect_" + groupNum);
    if(existingRedBox[0].length == 0) {
        task_g.append("rect")
            .attr("class", "delayed_rectangle")
            .attr("x", function(d) {return parseFloat(d.x) + task_rect_curr_width})
            .attr("y", function(d) {return d.y})
            .attr("id", function(d) {
                return "delayed_rect_" + groupNum; })
            .attr("groupNum", groupNum)
            .attr("height", RECTANGLE_HEIGHT)
            .attr("width", red_width)
            .attr("fill", "red")
            .attr("fill-opacity", .6)
            .attr("stroke", "#5F5A5A");
    } else {
        existingRedBox
            .attr("width", red_width);
    }

    return red_width;
};

var drawBlueBoxes = function(){
    for (var i=0;i<drawn_blue_tasks.length;i++){
        var ev = flashTeamsJSON["events"][getEventJSONIndex(drawn_blue_tasks[i])];
        var task_g = getTaskGFromGroupNum(drawn_blue_tasks[i]);
        drawBlueBox(ev, task_g);
    }
};

var drawRedBoxes = function(){
    for (var i=0;i<completed_red_tasks.length;i++){
        var ev = flashTeamsJSON["events"][getEventJSONIndex(completed_red_tasks[i])];
        var task_g = getTaskGFromGroupNum(completed_red_tasks[i]);
        drawRedBox(ev, task_g, false);
    }
};

var drawDelayedTasks = function(){
    var cursor_x = parseFloat(cursor.attr("x1"));
    var before_tasks = computeTasksBeforeCurrent(cursor_x);
    var tasks_after = null;
    var allRanges = [];

    for (var i=0;i<before_tasks.length;i++){
        var groupNum = parseInt(before_tasks[i]);
        var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
        var task_g = getTaskGFromGroupNum(groupNum);
        
        var completed = ev.completed_x;
        
        if (completed) continue;
        
        var id_remaining = remaining_tasks.indexOf(groupNum)
        if (id_remaining != -1) continue;

        var red_width = drawRedBox(ev, task_g, true);
        console.log(" ^^^^^^^^^^^^^^^^^^^^^^ RED_WIDTH: " + red_width);
        var idx = live_tasks.indexOf(groupNum);
        if(idx != -1) {
            console.log(" %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% found task " + groupNum + " in live_tasks");
            live_tasks.splice(idx, 1);
            delayed_tasks.push(groupNum);
        } else {
            console.log(" %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% not even in live_tasks");
        }

        var groupNum = ev.id;
        var task_start = parseFloat(ev.x);
        var task_rect_curr_width = parseFloat(getWidth(ev));
        var task_end = task_start + task_rect_curr_width;
        var red_end = task_end + red_width;
        var new_tasks_after = computeTasksAfterCurrent(task_end); // TODO: right-most task or left-most task?
        if(tasks_after == null || new_tasks_after.length > tasks_after.length){
            tasks_after = new_tasks_after;
        }
     
        allRanges.push([task_end, red_end]);
    }

    var tasks_tmp = MoveLiveToRemaining(live_tasks,remaining_tasks);
    live_tasks = tasks_tmp["live"];
    remaining_tasks = tasks_tmp["remaining"];


    if (tasks_after != null){
        var actual_offset = computeTotalOffset(allRanges);
        console.log("DRAWING DELAYED TASKS AFTER UPDATE");
        moveTasksRight(tasks_after, actual_offset, true);
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

        // get start x coordinate of task
        var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
        var start_x = ev.x;
        
        // if the task's x coordinate is after the current x, it is "after," so add it
        if(curr_x <= start_x){
            tasks_after_curr.push(groupNum);
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
    // destroy popover
    destroyPopover(groupNum);

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
    timeline_svg.selectAll("g").data(task_groups, function(d){ return d.groupNum; }).exit().remove();
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
        drawPopover(ev, false, false);
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
        drawPopover(ev, false, false);
    }

    var tasks_with_current = tasks.slice(0);
    tasks_with_current = tasks_with_current.concat(delayed_tasks);
    drawInteractions(tasks_with_current);

    updateStatus(true);
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
var trackLiveAndRemainingTasks = function() {
    tracking_tasks_interval_id = setInterval(function(){
        var tasks = computeLiveAndRemainingTasks();
        var new_live_tasks = tasks["live"];
        var new_remaining_tasks = tasks["remaining"];

        // extend already delayed boxes
        extendDelayedBoxes();

        var at_least_one_task_started = false;
        var at_least_one_task_delayed = false;

        // detect any live task is now delayed or completed early
        for (var i=0;i<live_tasks.length;i++){
            var groupNum = parseInt(live_tasks[i]);
            var task_g = getTaskGFromGroupNum (groupNum);
            var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];
            var completed = ev.completed_x;
            var task_rect_curr_width = parseFloat(getWidth(ev));

            // delayed
            if (new_live_tasks.indexOf(groupNum) == -1 && !completed) { // groupNum is no longer live
                console.log("PREVIOUSLY LIVE TASK NOW DELAYED!");
                drawRedBox(ev, task_g, false);

                // add to delayed_tasks list
                delayed_tasks.push(groupNum);
                
                // updateStatus is required to send the notification email when a task is delayed
                delayed_tasks_time[groupNum]=(new Date).getTime();

                at_least_one_task_delayed = true;
            }
        }
      
        

       

        var tasks_tmp = MoveLiveToRemaining(new_live_tasks,new_remaining_tasks);
        new_live_tasks = tasks_tmp["live"];
        new_remaining_tasks = tasks_tmp["remaining"];
        
        for (var j=0;j<remaining_tasks.length;j++){
            var groupNum = parseInt(remaining_tasks[j]);
            if (new_live_tasks.indexOf(groupNum) != -1) { // groupNum is now live
                at_least_one_task_started = true;
            }
        }

        live_tasks = new_live_tasks;
        remaining_tasks = new_remaining_tasks;
       
        

        if(at_least_one_task_delayed || at_least_one_task_started){
            updateStatus(true);
            if(at_least_one_task_delayed)
                at_least_one_task_delayed = false;
            if(at_least_one_task_started)
                at_least_one_task_started = false;
        }
    }, fire_interval);
};

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

//Tracks a current user's ucpcoming and current events
var trackUpcomingEvent = function(){
     if (current == undefined){
        return;
    }
    setInterval(function(){
        if(!upcomingEvent) return;
        var ev = flashTeamsJSON["events"][getEventJSONIndex(upcomingEvent)];
        var task_g = getTaskGFromGroupNum(upcomingEvent);
        if (ev.completed_x){
            //console.log("THIS IS THE START TIME", currentUserEvents[0].startTime);
            toDelete = upcomingEvent;
            //console.log("BEFORE SPLICING", currentUserEvents);
            currentUserEvents.splice(0,1);
            //console.log("AFTER SPLICING", currentUserEvents);
            //console.log("THIS IS THE START TIME", stime);
            //console.log("THIS IS THE START TIME", currentUserEvents[0].startTime);
            if (currentUserEvents.length == 0){
                $("#rect_" + toDelete).attr("fill-opacity", .4);
                upcomingEvent = undefined;
                statusText.style("color", "green");
                statusText.text("You've completed all your tasks!");
                return;
            }
            upcomingEvent = currentUserEvents[0].id;
            // console.log("AFTER SPLICING", currentUserEvents, upcomingEvent);
            $("#rect_" + toDelete).attr("fill-opacity", .4);
            $("#rect_" + upcomingEvent).attr("fill-opacity", .9);
            task_g = getTaskGFromGroupNum(upcomingEvent);
        }
        var cursor_x = cursor.attr("x1");
        var cursorHr = (cursor_x-(cursor_x%100))/100;
        var cursorMin = (cursor_x%100)/25*15;
        if(cursorMin == 57.599999999999994) {
            cursorHr++;
            cursorMin = 0;
        } else cursorMin += 2.4

        //maggie added the -2 to fix the off by 2 min bug
        var cursorTimeinMinutes = parseInt((cursorHr*60)) + parseInt(cursorMin) - 2;
        //console.log(currentUserEvents, currentUserEvents[0]);
        //console.log("THIS IS START HOUR AND MINUTES", currentUserEvents[0].startHr, currentUserEvents[0].startMin);
        currentUserEvents[0].startTime = parseInt(currentUserEvents[0].startHr)*60 + parseInt(currentUserEvents[0].startMin);
        //console.log("THIS IS THE START TIME", currentUserEvents[0].startTime);
        var cur_ev_id = currentUserEvents[0].id;
        var cur_ev_ind = getEventIndexFromId(cur_ev_id);

        var ev_start_time = parseInt(ev.startHr) * 60 + parseInt(ev.startMin);
        var displayTimeinMinutes = ev_start_time - parseInt(cursorTimeinMinutes);

        //console.log(currentUserEvents[0].startTime);
        //console.log("DISPLAY TIME", displayTimeinMinutes);
        //console.log("CURSOR TIME", cursorTimeinMinutes);
        var hours = parseInt(displayTimeinMinutes/60);
        var minutes = displayTimeinMinutes%60;
        var minutesText = minutes;
        if (minutes < 10){
            minutesText = "0" + minutes;
        }
        var overallTime = hours + ":" + minutesText;
        if (displayTimeinMinutes < 0){

            if(!isDelayed(upcomingEvent)){
                overallTime = "Your task is IN PROGRESS";
                statusText.style("color", "blue");
            }
            else{
                overallTime = "Your task is DELAYED";
                statusText.style("color", "red");
            }
        } else {
            if (cursorTimeinMinutes == 0) {
            	//dr: adding the commented d3 line below as a reminder of a potential solution to reduce height
            	//project_status_svg.attr("height", 60);
                overallTime = "Your first task will start " + overallTime + " after the team has begun";
            } else {
                if (delayed_tasks.length != 0) {
                    //if the event starts immediately after the delayed event...
                    if ((hours == 0) && (minutes <= 2)) {
                        overallTime = "A task ahead of yours has been delayed. Your next task will start as soon as the delayed task is completed";
                    } else {
                        overallTime = "A task ahead of yours has been delayed. Your next task will start " + overallTime + " after the delayed task is completed.";
                    }
                    statusText.style("color", "red");
                } else {
                    overallTime = "Your next task starts in " + overallTime;
                    statusText.style("color", "blue");
                }
            }
        }
        if (displayTimeinMinutes == 0) {
            if (cursorTimeinMinutes == 0) {
                overallTime = "Your first task will begin as soon as the team starts";  
            } else {
                overallTime = "Your next task begins NOW";
            }
            statusText.style("color", "blue");  
        }
        
        //statusText.text(overallTime);
       
    }, fire_interval);

    //console.log("EXITING TRACKUPCOMINGEVENT FUNCTION");
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

var constructStatusObj = function(){
    var flash_team_id = $("#flash_team_id").val();
    flashTeamsJSON["id"] = flash_team_id;
    flashTeamsJSON["title"] = document.getElementById("ft-name").innerHTML;
    //flashTeamsJSON["author"] = 
   
    var localStatus = {};

    localStatus.live_tasks = live_tasks;
    localStatus.remaining_tasks = remaining_tasks;
    localStatus.delayed_tasks = delayed_tasks;
    localStatus.drawn_blue_tasks = drawn_blue_tasks;
    localStatus.completed_red_tasks = completed_red_tasks;
    localStatus.flash_teams_json = flashTeamsJSON;

    //delayed_task_time is required for sending notification emails on delay
    localStatus.delayed_tasks_time = delayed_tasks_time;
    localStatus.dri_responded = dri_responded;

    return localStatus;
};

var updateStatus = function(flash_team_in_progress){
    var localStatus = constructStatusObj();
    
    //if flashTeam hasn't been started yet, update the original status in the db
    if(flashTeamsJSON["startTime"] == undefined){
	    //console.log("NO START TIME!");    
		updateOriginalStatus();
    }

    if(flash_team_in_progress != undefined){ // could be undefined if want to call updateStatus in a place where not sure if the team is running or not
        localStatus.flash_team_in_progress = flash_team_in_progress;
    } else {

        localStatus.flash_team_in_progress = in_progress;
    }
    localStatus.latest_time = (new Date).getTime();
    var localStatusJSON = JSON.stringify(localStatus);
    //console.log("updating string: " + localStatusJSON);

    var flash_team_id = $("#flash_team_id").val();
    var authenticity_token = $("#authenticity_token").val();
    var url = '/flash_teams/' + flash_team_id + '/update_status';
    $.ajax({
        url: url,
        type: 'post',
        data: {"localStatusJSON": localStatusJSON, "authenticity_token": authenticity_token}
    }).done(function(data){
        //console.log("UPDATED FLASH TEAM STATUS");
    });
};

//this function updates the original status of the flash team in the database, which is 
// used for the team duplication feature (it preserves the team without saving the status 
// information once the team is run
var updateOriginalStatus = function(){
    //console.log("in updateOriginalStatus");
    var localStatus = constructStatusObj();

    localStatus.latest_time = (new Date).getTime();
    var localStatusJSON = JSON.stringify(localStatus);
    //console.log("updating string: " + localStatusJSON);

    var flash_team_id = $("#flash_team_id").val();
    var authenticity_token = $("#authenticity_token").val();
    var url = '/flash_teams/' + flash_team_id + '/update_original_status';
    $.ajax({
        url: url,
        type: 'post',
        data: {"localStatusJSON": localStatusJSON, "authenticity_token": authenticity_token}
    }).done(function(data){
        //console.log("UPDATED FLASH TEAM STATUS");
    });
};

var sendEmailOnCompletionOfDelayedTask = function(groupNum){
    // send "delayed task is finished" email
    if(remaining_tasks.length!=0){
        var title="test";
        var events = flashTeamsJSON["events"];
        
        for(var i=0;i<events.length;i++){
            var ev = events[i];
            if (parseInt(ev["id"]) == groupNum){
                title = ev["title"];
                break;
            }
        }

        DelayedTaskFinished_helper(remaining_tasks,title);
    }
};

var sendEmailOnEarlyCompletion = function(blue_width){
    var early_minutes=parseInt((parseFloat(blue_width+4)/50.0)*30);
    early_completion_helper(remaining_tasks,early_minutes);
};

function confirmCompleteTask(groupNum) {
    console.log("CLICKED COMPLETE TASK");
 
    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "Complete Event?";

    var indexOfJSON = getEventJSONIndex(groupNum);
    var events = flashTeamsJSON["events"];
    var eventToComplete = events[indexOfJSON];

    var alertText = document.getElementById("confirmActionText");
    alertText.innerHTML = "Are you sure you want to complete " + eventToComplete["title"] + "?";

    var completeButton = document.getElementById("confirmButton");
    completeButton.innerHTML = "Complete event";
    $("#confirmButton").attr("class","btn btn-success");

    $('#confirmAction').modal('show');
    
    //Calls completeTask function if user confirms the complete
    document.getElementById("confirmButton").onclick=function(){
    
    	$('#confirmAction').modal('hide');

        //added the next 2 lines after disabling the ticker. After the first user's task is completed, the next task turns to dark blue.
        var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];    
        ev.completed_x = 1;
    	updateStatus();
        //completeTask(groupNum)
    };
    
    hidePopover(groupNum); 
}


var completeTask = function(groupNum){
   
 
   
    /*console.log("COMPLETED TASK");
    $('#confirmAction').modal('hide');
    var ev = flashTeamsJSON["events"][getEventJSONIndex(groupNum)];

    var cursor_x = cursor.attr("x1");
    ev.completed_x = cursor_x;

    // remove from either live or delayed tasks
    var idx = delayed_tasks.indexOf(groupNum);
    if (idx != -1) { // delayed task
        delayed_tasks.splice(idx, 1);
        completed_red_tasks.push(groupNum);
        //updateStatus(true);
        console.log("removed task from delayed and added to completed_red");
        sendEmailOnCompletionOfDelayedTask(groupNum);
    } else {
        idx = live_tasks.indexOf(groupNum);
        if (idx != -1){ // live task
            var task_g = getTaskGFromGroupNum (groupNum);
            var blue_width = drawBlueBox(ev, task_g);
            if (blue_width !== null){
                drawn_blue_tasks.push(groupNum);
                moveRemainingTasksLeft(blue_width);
                //updateStatus(true);
                sendEmailOnEarlyCompletion(blue_width);
            }
            live_tasks.splice(idx, 1);
        }
    }

    hidePopover(groupNum);

    // update db
    updateStatus(true);

    // reload status bar
    load_statusBar(status_bar_timeline_interval);*/
};
