/* awareness.js
 * ---------------------------------------------
 *
 */
var json_transaction_id = 0;

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
var user_loaded_before_team_start = false;

var window_visibility_state = null;
var window_visibility_change = null;
var timer_interval = null;

var task_actions = Object.freeze({
    START: "start",
    PAUSE: "pause",
    DELAY: "delay",
    RESUME: "resume",
    COMPLETE: "complete"
});

$(document).ready(function(){
    colorBox();
    $("#flash_team_id").requestUpdates(true);
    $("#flash_team_id").getTeamInfo();
});

// Start team after asking user for confirmation
$("#flashTeamStartBtn").click(function(){
    var bodyText = document.getElementById("confirmActionText");
    bodyText.innerHTML = "Are you sure you want to begin running " + flashTeamsJSON["title"] + "?";

    var confirmStartTeamBtn = document.getElementById("confirmButton");
    confirmStartTeamBtn.innerHTML = "Start the team";

    $("#confirmButton").attr("class","greenlink");
    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "Start Team?";
    $('#confirmAction').modal('show');

    document.getElementById("confirmButton").onclick=function(){startFlashTeam()};
});

$("#flashTeamEndBtn").click(function(){
    var bodyText = document.getElementById("confirmActionText");
    updateStatus();
    if ((live_tasks.length == 0) && (remaining_tasks.length == 0) && (delayed_tasks.length == 0)) {
        bodyText.innerHTML = "Are you sure you want to end " + flashTeamsJSON["title"] + "?";
    } else {
        bodyText.innerHTML = flashTeamsJSON["title"] + " is still in progress!  Are you sure you want to end the team?";
    }
    var confirmEndTeamBtn = document.getElementById("confirmButton");
    confirmEndTeamBtn.innerHTML = "End the team";
    $("#confirmButton").attr("class","redlink");
    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "End Team?";
    $('#confirmAction').modal('show');

    document.getElementById("confirmButton").onclick=function(){endTeam()};
});

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
    $("#flashTeamStartBtn").attr("disabled", "disabled");
    $("#flashTeamStartBtn").css('display','none');
    $("#flashTeamEndBtn").css('display','');
    $("#workerEditTeamBtn").css('display', '');
    if($("#pull_requests_mode").val() == 'enabled'){
        $("#flashTeamBranchBtn").css('display', '');
    } else {
        $("#flashTeamPauseBtn").css('display', '');
    }

    $("div#search-events-container").css('display','none');
    $("div#project-status-container").css('display','');
    $("div#chat-box-container").css('display','');
    $("#flashTeamTitle").css('display','none');

    disableTeamEditing();

    hideAllConfigIcons(true);
    removeColabBtns();
    removeHandoffBtns();
    save_tasksAfter_json();

    startTeam(true);
}

function endTeam() {
    $('#confirmAction').modal('hide');
    logActivity("endTeam()",'End Team', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
    updateStatus(false);
    stopProjectStatus();
    stopTrackingTasks();
    $("#flashTeamEndBtn").attr("disabled", "disabled");
    if($("#pull_requests_mode").val() == 'enabled'){
        $("#flashTeamBranchBtn").css('display','none');
    } else {
        $("#flashTeamPauseBtn").css('display','none');
    }
    $("#projectStatusText").html("The project is not in progress or has not started yet.");
    $("#projectStatusText").toggleClass('projectStatusText-inactive', false);
}

//save dependencyAPI.getEventsAfter(task_id, true) for each event in the json.
//This is used for the notification emails.
function save_tasksAfter_json(){
    var events_after = [];
    for(var i =0;i<  flashTeamsJSON["events"].length; i++){
        var id = parseInt(flashTeamsJSON["events"][i]["id"]);
        flashTeamsJSON["events"][i]["events_after"] = dependencyAPI.getEventsAfter(id, true);
    }
}

function stopTrackingTasks() {
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

function renderFlashTeamsJSON(data, firstTime) {
    console.log("CALLED");
    // firstTime will also be true in the case that flashTeamEndedorStarted, so
    // we make sure that it is false (i.e. true firstTime, upon page reload for user
    // before the team starts)
    if(firstTime){
        renderChatbox();
        renderProjectOverview(); //note: not sure if this goes here, depends on who sees the project overview (e.g., user and/or requester)
    }

    // Using transaction ID to avoid updatin client which is already updated.
    var currentTransactionID = json_transaction_id || 0
    var givenTransactionID = data.json_transaction_id || 1
    console.log("BEFORE checking transaction id");
    console.log("currentTransactionID: " + currentTransactionID);
    console.log("givenTransactionID: " + givenTransactionID);
    if(currentTransactionID >= givenTransactionID) return;
    console.log("AFTER checking transaction id");
    json_transaction_id = givenTransactionID

    loadedStatus = data;

    in_progress = loadedStatus.flash_team_in_progress;
    flashTeamsJSON = loadedStatus.flash_teams_json;

    // initialize the entry manager after flashTeamsJSON has been loaded
    window.entryManager = new window.EntryManager(flashTeamsJSON);

    //renderChatbox();
    setCurrentMember();
    renderProjectOverview();

    if(firstTime) {
        //setCurrentMember(); //commented this out because we now always call setCurrentMember() in case changes are made during project
        initializeTimelineDuration();
        //renderProjectOverview(); //commented this out because we now always call setCurrentMember() in case changes are made during project
    }

    // is this the user, and has he/she loaded the page
    // before the team started
    // is_user && firstTime && in_progress would be the case
    // where the user loads the page for the first time after
    // the team has started
    if(isUser) { // user loaded page before team started
        if (firstTime && !in_progress)
            user_loaded_before_team_start = true;
    }

    colorBox();
    if(in_progress){
        $("#flashTeamStartBtn").attr("disabled", "disabled");
        $("#flashTeamStartBtn").css('display','none'); //not sure if this is necessary since it's above
        $("#flashTeamEndBtn").css('display',''); //not sure if this is necessary since it's above
        $("#workerEditTeamBtn").css('display','');

        if($("#pull_requests_mode").val() != 'enabled'){
            if(flashTeamsJSON["paused"]){
                $("#flashTeamResumeBtn").css('display','');
                $("#flashTeamPauseBtn").css('display','none');
            } else{
                $("#flashTeamPauseBtn").css('display','');
                $("#flashTeamResumeBtn").css('display','none');
            }
        } else {
            $("#flashTeamBranchBtn").css('display','');
        }

        loadData();
        if(!isUser || memberType == "pc" || memberType == "client"){
            renderMembersRequester();
            $('#projectStatusText').html("The project is in progress.<br /><br />");
            $("#projectStatusText").toggleClass('projectStatusText-inactive', false);
        }else{
            renderAllMemberTabs();
            $("#projectStatusText").toggleClass('projectStatusText-inactive', true);
        }

        renderAllMemberTabs();
        trackUpcomingEvent();

        //call this function if team is not in the edit mode
        if(isUser && memberType != "pc" && memberType != "client"){
            disableTeamEditing();
        }
        else if(!flashTeamsJSON["paused"]){
            disableTeamEditing();
        }
    } else {
        if(!flashTeamsJSON)
            return;

        loadData();

        if(isUser && memberType != "pc" && memberType != "client"){
            disableTeamEditing();
        }

        if(!isUser || memberType == "pc" || memberType == "client") {
            renderMembersRequester();
        }

        if(isBranch()){
            $("#backBtn").css('display','none');
            $("#tourBtn").css('display','none');
            $("#flashTeamStartBtn").css('display','none');
            if(inReviewMode()){
                $("#mergePullRequestBtn").css('display', '');
            } else {
                $("#submitPullRequestBtn").css('display', '');
            }
        }
    }
}

// firstTime=true means page is reloaded
function renderEverything(data, firstTime) {
    renderFlashTeamsJSON(data, firstTime);
    if(firstTime) {
        logActivity("renderEverything(firstTime)",'Render Everything - First Time', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
        initTimer();
        listenForVisibilityChange();
    }
}

function initTimer() {
    if (timer_interval != null) {
        return;
    }
    timer_interval = window.setInterval(function(){
        try {
            drawStartedEvents();
        } catch (e) {
            console.log(e);
        }
     }, 55000);
 }

function listenForVisibilityChange(){
    if (typeof document.hidden !== "undefined") {
        window_visibility_change = "visibilitychange";
        window_visibility_state = "visibilityState";
        logActivity("listenForVisibilityChange()",'Window Visibility Change -- document.hidden: ' + document.hidden, new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
    } else if (typeof document.mozHidden !== "undefined") {
        window_visibility_change = "mozvisibilitychange";
        window_visibility_state = "mozVisibilityState";
        logActivity("listenForVisibilityChange()",'Window Visibility Change - document.mozHidden: ' + document.mozHidden, new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
    } else if (typeof document.msHidden !== "undefined") {
        window_visibility_change = "msvisibilitychange";
        window_visibility_state = "msVisibilityState";
        logActivity("listenForVisibilityChange()",'Window Visibility Change - document.msHidden: ' + document.msHidden, new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
    } else if (typeof document.webkitHidden !== "undefined") {
        window_visibility_change = "webkitvisibilitychange";
        window_visibility_state = "webkitVisibilityState";
        logActivity("listenForVisibilityChange()",'Window Visibility Change - document.webkitHidden: ' + document.webkitHidden, new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
    }

    // Add a listener for the next time that the page becomes visible
    document.addEventListener(window_visibility_change, function() {
        var state = document[window_visibility_state];

        logActivity("listenForVisibilityChange() -- document.addEventListener(window_visibility_change, function()",'Window Visibility Change -- window_visibility_state: ' + state, new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);

        //if(state == "hidden"){
            //logActivity("Team Update",'Window Hidden', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
        //}

        if(state == "visible"){
            $("#flash_team_id").requestUpdates(false);
            //logActivity("Team Update",'Window Became Visible', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
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
	   }

       if (chat_role == "" || chat_role == null){
        uniq_u2 = data["uniq"];

         flash_team_members = flashTeamsJSON["members"];
         for(var i=0;i<flash_team_members.length;i++){
            if (flash_team_members[i].uniq == uniq_u2){
              chat_role = flash_team_members[i].role;
              current = i;
              current_user = flash_team_members[i];

              trackUpcomingEvent();
            }
         }
       }

       // Set our initial online status.
       setUserStatus(currentStatus);

       myDataRef.on('child_added', function(snapshot) {
            var message = snapshot.val();
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

    // if gdrive folder is created (e.g., when a team starts),  the gdrive btn in all views should activate
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
    var latest_time;
    if (in_progress){
        latest_time = (new Date()).getTime();
    } else {
        latest_time = loadedStatus.latest_time; // really only useful at end
    }

    live_tasks = loadedStatus.live_tasks;
    paused_tasks = loadedStatus.paused_tasks;
    remaining_tasks = loadedStatus.remaining_tasks;
    delayed_tasks = loadedStatus.delayed_tasks;
    drawn_blue_tasks = loadedStatus.drawn_blue_tasks;
    completed_red_tasks = loadedStatus.completed_red_tasks;

    console.log("drawing events again..");
    console.log(flashTeamsJSON.events);
    drawEvents(!in_progress);
    drawBlueBoxes();
    drawRedBoxes();
    drawInteractions(); //START HERE, INT DEBUG
    googleDriveLink();
};

// user must call this startTeam(true, )
var startTeam = function(firstTime){
    if(!in_progress) {
        //flashTeamsJSON["original_json"] = JSON.parse(JSON.stringify(flashTeamsJSON));
        //flashTeamsJSON["original_status"] = JSON.parse(JSON.stringify(loadedStatus));
        //console.log("flashTeamsJSON['original_json']: " + flashTeamsJSON["original_json"]);
        //console.log("flashTeamsJSON['original_status']: " + flashTeamsJSON["original_status"]);
        //updateStatus();
        //checkProjectFolder();
        updateOriginalStatus();
		recordStartTime();
		//checkProjectFolder();
        //addAllFolders();
        createProjectFolder();
        in_progress = true; // TODO: set before this?
        $("#projectStatusText").html("The project is in progress.<br /><br />");

        flashTeamsJSON["paused"]=false;
        updateInteractionsPopovers();

        logActivity("var startTeam = function(firstTime) - Before Update Status",'Start Team - Before Update Status', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);

        //added next line to disable the ticker
        updateStatus(true);

        logActivity("var startTeam = function(firstTime) - After Update Status",'Start Team - After Update Status', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
    }

    // page was loaded after team started
    // OR
    // page was loaded before team started && this call to startTeam is as a result of
    // team now starting (received through poll)

    var page_loaded_after_start = firstTime && in_progress;
    var page_loaded_before_start_and_now_started = user_loaded_before_team_start && in_progress;

    if(page_loaded_after_start || page_loaded_before_start_and_now_started){
        if(page_loaded_before_start_and_now_started)
            user_loaded_before_team_start = false;
    }
};

var drawEvents = function(editable){
    for(var i=0;i<flashTeamsJSON.events.length;i++){
        var ev = flashTeamsJSON.events[i];
        drawEvent(ev);
    }
};

var drawStartedEvents = function(){
    for(var i=0;i<flashTeamsJSON.events.length;i++){
        var ev = flashTeamsJSON.events[i];
        if(ev.status == "started" || ev.status == "delayed" ){
            drawEvent(ev);
        }
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
            .attr("stroke", "#5F5A5A")
            .attr("display", "none");
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


//moves live task to remaining task if prev task is delayed
function MoveLiveToRemaining(new_live_tasks,new_remaining_tasks){
    var tmp_live_tasks = [];
    for (var i =0 ; i<new_live_tasks.length; i++){
        tmp_live_tasks.push(new_live_tasks[i]);
    }

    for (var j=0;j<tmp_live_tasks.length;j++){
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

function isLive(element) {
    for (var i=0; i<live_tasks.length;i++){
        if (live_tasks[i] == element){
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
    
    var overallTime;

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

            $("#project-status-text").html("You've completed all your tasks!");
            $("#project-status-text").css("margin-bottom", "10px");
            $("#project-status-text").css("color", "#3fb53f");

            $("#project-status-btn").css("display", "none");
            $("#project-status-btn2").css("display", "none");
            $("#project-status-alert").css("display", "none");
            $("#project-status-alert-btn").css("display", "none");
            $("#project-status-alert-btn2").css("display", "none");
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
            updateSidebarButton(ev.id, 'eventMousedown', 'Start Task', 'greenlink');
            updateAlertButton(ev.id, 'eventMousedown', 'Start Task', 'greenlink');
        } else {
            overallTime = "Your next task is <a href='#' class='task-name-status' onclick='eventMousedown(" + ev.id +")'>"+ ev.title +"</a>.";
            updateSidebarText(overallTime, "black");
            updateStatusAlertText(overallTime, 'alert-hide');
            updateSidebarButton(ev.id, 'eventMousedown', 'View Task', 'bluelink');
            updateAlertButton(ev.id, 'eventMousedown', 'View Task', 'bluelink');
        }
    }

    if( ev.status == "paused"){
        overallTime = "Your task <a href='#' class='task-name-status' onclick='eventMousedown(" + ev.id +")'>("+ ev.title +")</a> is paused.";
        updateSidebarText(overallTime, "#006699");
        updateStatusAlertText(overallTime, 'alert-info');
        updateSidebarButton(ev.id, 'resumeTask', 'Resume', 'bluelink');
        updateAlertButton(ev.id, 'resumeTask', 'Resume', 'bluelink');
    }

    if( ev.status == "delayed"){
        overallTime = "Your task <a href='#' class='task-name-status' onclick='eventMousedown(" + ev.id +")'>("+ ev.title +")</a> is delayed.";
        updateSidebarText(overallTime, "#f52020");
        updateStatusAlertText(overallTime, 'alert-danger');
        updateSidebarButton(ev.id, 'confirmCompleteTask', 'Complete Task', 'greenlink');
        updateSidebarButton(ev.id, 'pauseTask', 'Pause', 'bluelink', 'project-status-btn2');
        updateAlertButton(ev.id, 'confirmCompleteTask', 'Complete Task', 'greenlink');
        updateAlertButton(ev.id, 'pauseTask', 'Pause', 'bluelink', 'project-status-alert-btn2');
    }

    else if ( ev.status == "started"){
        overallTime = "Your task <a href='#' class='task-name-status' onclick='eventMousedown(" + ev.id +")'>("+ ev.title +")</a> is in progress.";
        updateSidebarText(overallTime, "#40b8e4");
        updateStatusAlertText(overallTime, 'alert-hide');
        updateSidebarButton(ev.id, 'confirmCompleteTask', 'Complete Task', 'greenlink');
        updateSidebarButton(ev.id, 'pauseTask', 'Pause Task', 'bluelink', 'project-status-btn2');
    }

    if(in_progress == true &&  (flashTeamsJSON["paused"] == true) ){
        overallTime = "The team is being edited right now. " + overallTime;
        updateSidebarText(overallTime);
    }
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

var constructStatusObj = function(){
    flashTeamsJSON["id"] = team_id; //previously: = $("#flash_team_id").val();
    flashTeamsJSON["title"] = team_name; //previously: = document.getElementById("ft-name").innerHTML;
    flashTeamsJSON["author"] = author_name;
    flashTeamsJSON["status"] = in_progress;

    var localStatus = {};

    localStatus.json_transaction_id = json_transaction_id || 1;

    localStatus.local_update = flashTeamsJSON["local_update"];
    localStatus.team_paused = flashTeamsJSON["paused"];
    localStatus.task_groups = task_groups;
    localStatus.live_tasks = live_tasks;
    localStatus.paused_tasks = paused_tasks;
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

var timer = null;

var updateEvent = function(id, task_action) {
    var eventJSON = null;
    for (var i = 0; i < flashTeamsJSON.events.length; i++) {
        if (flashTeamsJSON.events[i].id == id) {
            eventJSON = flashTeamsJSON.events[i];
        }
    }
    if (eventJSON == null) {
        console.log("did not update event because id was invalid: ", id);
        return;
    }
    var flash_team_id = $("#flash_team_id").val();
    var authenticity_token = $("#authenticity_token").val();
    var url = '/flash_teams/' + flash_team_id + '/update_event';
    $.ajax({
        url: url,
        type: 'post',
        data: {"eventJSON": JSON.stringify(eventJSON), "task_action": (task_action ? task_action : ""), "authenticity_token": authenticity_token}
    }).done(function(data){});
};

var updateStatus = function(flash_team_in_progress){
    if (timer) {
        clearTimeout(timer); //cancel the previous timer.
        timer = null;
    }
    timer = setTimeout(function(){
        json_transaction_id++
        var localStatus = constructStatusObj();

        //if flashTeam hasn't been started yet, update the original status in the db
        if(flashTeamsJSON["startTime"] == undefined){
    		updateOriginalStatus();
        }

        if(flash_team_in_progress != undefined){ // could be undefined if want to call updateStatus in a place where not sure if the team is running or not
            localStatus.flash_team_in_progress = flash_team_in_progress;
        } else {
            localStatus.flash_team_in_progress = in_progress;
        }
        localStatus.latest_time = (new Date).getTime();
        var localStatusJSON = JSON.stringify(localStatus);

        var flash_team_id = $("#flash_team_id").val();
        var authenticity_token = $("#authenticity_token").val();
        var url = '/flash_teams/' + flash_team_id + '/update_status';
        $.ajax({
            url: url,
            type: 'post',
            data: {"localStatusJSON": localStatusJSON, "authenticity_token": authenticity_token}
        }).done(function(data){});
    }, 2000);
};

//this function updates the original status of the flash team in the database, which is
// used for the team duplication feature (it preserves the team without saving the status
// information once the team is run
var updateOriginalStatus = function(){
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
