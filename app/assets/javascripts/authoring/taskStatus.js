/* taskStatus.js
 * ---------------------------------------------
 * Handles status of the task ("started", "not_started", "delayed", "completed")
 * Formerly completeTask.js
 */


//TASK STATUS COLORS
var TASK_NOT_START_COLOR = "#e4e4e4";
var TASK_NOT_START_BORDER_COLOR = "#c7c7c7";
var TASK_NOT_START_STROKE_COLOR = "rgba(82, 82, 82, 0.11)";

//yellow (this for a worker's upcoming tasks highlighted in his/her timeline)
var WORKER_TASK_NOT_START_COLOR = "#fbeed5";//"#ffdd32";
var WORKER_TASK_NOT_START_BORDER_COLOR = "#eacd72";

//blue
var TASK_START_COLOR = "#40b8e4";
var TASK_START_BORDER_COLOR = "#45a1da";

//red
var TASK_DELAY_COLOR = "#f52020";
var TASK_DELAY_BORDER_COLOR = "#c84d4d";

//green
var TASK_COMPLETE_COLOR = "#3fb53f";
var TASK_COMPLETE_BORDER_COLOR = "#308e30";

//lighter blue/grey
var TASK_PAUSED_COLOR =  "#a8cfde"; 
var TASK_PAUSED_BORDER_COLOR = "#7db7ce";

function checkEventsBeforeCompleted(groupNum) {
    // check if events before have been completed
    var eventsBefore = dependencyAPI.getEventsBefore(groupNum, true);
    if (eventsBefore == null)
        return true;
    for (var i = 0; i < eventsBefore.length; i++) {
        var ev = getEventFromId(eventsBefore[i]);
        if (ev.status != "completed") {
            alert("This task depends on one or more tasks that have not been completed yet. Please let them finish first.");
            return false;
        }
    }

    return true;
}

function checkEventsBeforeCompletedNoAlert(groupNum) {
    // check if events before have been completed
    var eventsBefore = dependencyAPI.getEventsBefore(groupNum, true);
    if (eventsBefore == null)
        return true;
    for (var i = 0; i < eventsBefore.length; i++) {
        var ev = getEventFromId(eventsBefore[i]);
        if (ev.status != "completed") {
            //alert("This task depends on one or more tasks that have not been completed yet. Please let them finish first.");
            return false;
        }
    }

    return true;
}

//Fires on "Start" button on task modal
function startTask(groupNum) {
     if (!checkEventsBeforeCompleted(groupNum))
       return;

    var indexOfJSON = getEventJSONIndex(groupNum);
    var eventObj = flashTeamsJSON["events"][indexOfJSON];
    eventObj.status = "started";
    eventObj.timer = eventObj.duration;
    eventObj.task_startBtn_time = (new Date).getTime();
    eventObj.task_latest_active_time = eventObj.task_startBtn_time;
    eventObj.latest_remaining_time = eventObj["timer"];

	//alert(eventObj.latest_remaining_time);
    
    //remove task from remaining and add to live task array
    var idx = remaining_tasks.indexOf(groupNum);
    if (idx != -1) { // delayed task
        remaining_tasks.splice(idx, 1);
    }
    live_tasks.push(groupNum);

    logActivity("startTask(groupNum)",'Start Task', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(groupNum)]);

    updateStatus();
    drawEvent(eventObj); //Will update color
    trackUpcomingEvent();

    //Close the task modal
    //$("#task_modal").modal('hide');


    //chaning start button to complete button on the task modal
    $("#start-end-task").attr('onclick', 'confirmCompleteTask('+groupNum+')');
    $("#start-end-task").html('Complete');

    // Message Slack
    postToSlack(eventObj, "started");

}

//Fires on "Pause" button on task modal
function pauseTask(groupNum) {
	
	//Close the first (task) modal
    $("#task_modal").modal('hide');
    
	var indexOfJSON = getEventJSONIndex(groupNum);
    var eventObj = flashTeamsJSON["events"][indexOfJSON];
    eventObj.status = "paused";
    eventObj.task_pauseBtn_time = (new Date).getTime();
    eventObj.task_latest_active_time = eventObj.task_pauseBtn_time; 
    
    eventObj.latest_remaining_time = eventObj["timer"];
    
    paused_tasks.push(groupNum);

    logActivity("pauseTask(groupNum)",'Pause Task', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(groupNum)]);

    updateStatus();
    drawEvent(eventObj); //Will update color
    trackUpcomingEvent();
	

	//chaning resume button to pause button on the task modal
    $("#pause-resume-task").attr('onclick', 'resumeTask('+groupNum+')');
    $("#pause-resume-task").html('Resume Task'); 

    postToSlack(eventObj, "paused");
	
}

//Fires on "Pause" button on task modal
function resumeTask(groupNum) {
	
	//Close the first (task) modal
    $("#task_modal").modal('hide');
    
	var indexOfJSON = getEventJSONIndex(groupNum);
    var eventObj = flashTeamsJSON["events"][indexOfJSON];
    
    if(isDelayed(groupNum)){
        eventObj.status = "delayed";
    } else{
        eventObj.status = "started";
    }
    eventObj.task_resumeBtn_time = (new Date).getTime();
    eventObj.task_latest_active_time = eventObj.task_resumeBtn_time;
    eventObj.latest_remaining_time = eventObj["timer"];
    
    //remove task from remaining and add to live task array
    var idx = paused_tasks.indexOf(groupNum);
    if (idx != -1) { // delayed task
        paused_tasks.splice(idx, 1);
    }

    logActivity("resumeTask(groupNum)",'Resume Task', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(groupNum)]);
   
    updateStatus();
    drawEvent(eventObj); //Will update color
    trackUpcomingEvent();


	//chaning start button to complete button on the task modal
    $("#pause-resume-task").attr('onclick', 'pauseTask('+groupNum+')');
    $("#pause-resume-task").html('Take a Break'); 

    postToSlack(eventObj, "resumed");
	
}

// This function lets you know the current status of a task that is paused
// This is useful because if you just get the value of ev.status for a paused event it will be paused
// If you are editing a paused task, you might need to know the actual status of the task (e.g., whether the paused task is currently delayed)
// NOTE: Right now this function is not used anywhere but it might be useful at some point
function checkPausedTaskStatus(eventObj){
    var pausedTaskStatus;

    if(eventObj.status != "paused"){
        return;
    }

    if (isDelayed(eventObj)) pausedTaskStatus = "delayed";
    else pausedTaskStatus = "started";

    return pausedTaskStatus; 
}

//Alert firing on event complete buttons
function confirmCompleteTask(groupNum) { 
    //Close the first (task) modal
    $("#task_modal").modal('hide');

    logActivity("confirmCompleteTask(groupNum)",'Confirm Complete Task - Show Doc Questions Modal', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(groupNum)]);

    $(".confirm-modal-cancel").attr('onclick', 'logCloseTaskDocModal('+groupNum+')');

    //Gets information from event using id
    var indexOfJSON = getEventJSONIndex(groupNum);
    var events = flashTeamsJSON["events"];
    var eventToComplete = events[indexOfJSON];

    //Creates the alert modal title
    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = eventToComplete.title + "<br /> Have You Completed This Task?";
    
    //Edits the confirmAction modal from _confirm_action.html.erb
    var alertText = document.getElementById("confirmActionText");
    alertText.innerHTML = completeTaskModalText(eventToComplete);

    //Code for the Task Completed Button
    var completeButton = document.getElementById("confirmButton");
    completeButton.innerHTML = "Answer all questions to submit";
    $("#confirmButton").attr("class","btn btn-success");
    completed = allCompleted(eventToComplete);
    if (completed){
            $("#confirmButton").prop('disabled', false);
            $("#confirmButton")[0].innerHTML = "Submit!";
        }
        else{ 
            $("#confirmButton").prop('disabled', true);
            $("#confirmButton")[0].innerHTML = "Answer all Questions to Submit";
        }
    $('#confirmAction').modal('show');

    //Code for Documentation Question Save Button
    var saveButton = document.getElementById("saveButton");
    saveButton.innerHTML = "Save and Close";
    $("#saveButton").attr("class","btn btn-default");
    $("#saveButton").attr("style", "display:inline;");
    $('#confirmAction').modal('show');
    

    $(".outputForm").change(function() {
        completed = allCompleted(eventToComplete);
        //console.log(completed);
        if (completed){
            $("#confirmButton").prop('disabled', false);
            $("#confirmButton")[0].innerHTML = "Submit!";
        }
        else{ 
            $("#confirmButton").prop('disabled', true);
            $("#confirmButton")[0].innerHTML = "Answer all Questions to Submit";
        }
    });


    //Calls completeTask function if user confirms the complete
    document.getElementById("confirmButton").onclick=function(){
    	logActivity("confirmCompleteTask(groupNum) - document.getElementById('confirmButton').onclick=function()",'Confirm Complete Task - Clicked Confirm Button', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(groupNum)]);
        $('#confirmAction').modal('hide');
    	completeTask(groupNum);
    };
    //hidePopover(groupNum); 

    //calls saveQuestions functions if user chooses to save questions
    document.getElementById("saveButton").onclick=function(){
        logActivity("confirmCompleteTask(groupNum) - document.getElementById('saveButton').onclick=function()",'Confirm Complete Task - Clicked Save Button', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(groupNum)]);
        $('#confirmAction').modal('hide');
        saveQuestions(groupNum);
    };
}

function logCloseTaskDocModal(groupNum){
    logActivity("logCloseTaskDocModal(groupNum)",'Close Task Documentation Modal', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(groupNum)]);
}

var allCompleted = function(eventToComplete){
    var totalCheckboxes = $(".outputCheckbox").length;
    var checkedCheckboxes = $(".outputCheckbox:checked").length;
    if (eventToComplete.outputs != null){
        var splitOutputs = eventToComplete.outputs.split(",");
        for (i = 0; i < totalCheckboxes; i++){
            value = false;
            for (j = 0; j < checkedCheckboxes; j++){
                if ($(".outputCheckbox")[i].contains($(".outputCheckbox:checked")[j])){
                    value = true;
                }
            } 
                if (value){ 
                //console.log(splitOutputs[i]);
                document.getElementById("output" + splitOutputs[i]).style.display = "block";
            }else{ 
                document.getElementById("output" + splitOutputs[i]).style.display = "none";
            }
        }
    }

    var outputFormLength = $(".outputForm").length;
    var completed = true;
    for (i = 0; i < outputFormLength; i++){
        if ($(".outputForm")[i].type != "checkbox"){
            idVal = "text" + $(".outputForm")[i].id;
            if (document.getElementById(idVal).innerHTML.indexOf("optional") == -1){
                if ($(".outputForm")[i].value == ""){
                    completed = false;
                }
            }
        }
    }
    if (totalCheckboxes != checkedCheckboxes) {
        completed = false;
    }
    return completed;
}

var keyUpFunc = function(eventToComplete){
    var outputFormLength = $(".outputForm").length;
    var totalCheckboxes = $(".outputCheckbox").length;
    var checkedCheckboxes = $(".outputCheckbox:checked").length;
    var completed = true;
    for (i = 0; i < outputFormLength; i++){
        if ($(".outputForm")[i].type != "checkbox"){
            idVal = "text" + $(".outputForm")[i].id;
            if (document.getElementById(idVal).innerHTML.indexOf("optional") == -1){
                if ($(".outputForm")[i].value == ""){
                    completed = false;
                }
            }
        }
    }
    if (totalCheckboxes != checkedCheckboxes) {
        completed = false;
    }
    if (completed){
        $("#confirmButton").prop('disabled', false);
        $("#confirmButton")[0].innerHTML = "Submit!";
    }
    else{ 
        $("#confirmButton").prop('disabled', true);
        $("#confirmButton")[0].innerHTML = "Answer all Questions to Submit";
    }
}

//Return text to fill complete task modal
function completeTaskModalText(eventToComplete) {
    var modalText = "<p align='left' style='padding-bottom:4px'><b>Please check the box next to each deliverable to indicate that you have completed and uploaded it to this </b>"
                    + "<a href=" + eventToComplete["gdrive"][1] + " target='_blank'>Google Drive Folder</a></p>";
                    
    //Get outputs from eventObj
    var eventOutputs = eventToComplete.outputs;
    if (eventOutputs != null && eventOutputs != "") {
        eventOutputs = eventToComplete.outputs.split(",");
    }

    var outputFilledQ = eventToComplete["outputQs"];
    var generalFilledQ = eventToComplete["docQs"];

    generalQuestions = [];
    for (i = 0; i < eventToComplete.docQs.length; i++){
        generalQuestions.push(eventToComplete.docQs[i][0]);
    }

    //Create Checklist of outputs with the relevant documentation questions for each output
    modalText += "<form id='event_checklist_" + eventToComplete.id + "' align='left' >";
    if (eventOutputs == null || eventOutputs == "") {
        modalText += "No outputs were specified for this task.";
    } else {
        for (i=0; i<eventOutputs.length; i++) {
            if (!eventToComplete.checkboxes){
                value = ""; styleVal = "display:none;"
            }
            else if(eventToComplete.checkboxes[eventOutputs[i]] == true){
                value = "checked"; styleVal = "display:block;"
            }
            else{
                value = ""; styleVal = "display:none;"
            }
            modalText += "<b><input type='checkbox' id = '" + eventOutputs[i] + "' class='outputCheckbox outputForm' " + value + ">" + " " + eventOutputs[i] + "</input></b><br>";
            modalText += '<div id="output' + eventOutputs[i] + '" style = ' + styleVal + '>';
            questions = outputFilledQ[eventOutputs[i]];
            for (j = 0; j < questions.length; j++){
                if (questions[j] != ""){
                    modalText += '<p id="textoutput' + i + 'q' + j + '">' + questions[j][0] + '</p></br><textarea id = "output' + i + 'q' + j + '" class="outputForm" rows="4" onkeyup="keyUpFunc(); saveDocQuestions(' + eventToComplete.id + ')">' + questions[j][1] + '</textarea></br>';
                }
            }
            modalText += "</div>"
        }
    }

    //Creating a form for the general documentation questions for a particular task
    modalText += "</form><hr/>";
    modalText += '<p align="left" style="padding-bottom:4px"><b>General Questions:</b></p>';
    modalText +='<form name="docQForm" id="docQForm" style="margin-bottom: 1px; padding-bottom: 4px;" align="left">' + '<div class="event-table-wrapper">';
    for (i = 0; i < generalQuestions.length; i++){
        if (!generalFilledQ)
            var placeholderVal = "";
        else{
            var placeholderVal = generalFilledQ[i][1]; 
        }
        modalText += '<p id="textq' + i + '">' + generalQuestions[i] + ': </p></br><textarea id="q' + i + '"class="outputForm" rows="4" onkeyup="keyUpFunc(); saveDocQuestions(' + eventToComplete.id + ')">'+ placeholderVal + '</textarea></br>';
    } 
    modalText += "</div></form>";
    modalText+= "<em>Click 'Task Completed' to alert the PC and move on to the documentation questons.</em>";
    return modalText;
}

//Function to save the documentation questions in the form when the task is completed
function saveDocQuestions(groupNum){
    var task_id = getEventJSONIndex(groupNum); 
    var ev = flashTeamsJSON["events"][task_id];

    var eventOutputs = ev["outputs"];
    if (eventOutputs != null && eventOutputs != "") {
        eventOutputs = ev["outputs"].split(",");
        for (i=0; i<eventOutputs.length; i++) {
            questions = ev["outputQs"][eventOutputs[i]];
            for (j = 0; j < questions.length; j++){
                ev["outputQs"][eventOutputs[i]][j][1] = $("#output" + i + "q" + j).val();
            }
        }
    }

    checked = $(".outputCheckbox:checked");
    total = $(".outputCheckbox");
    if (total.length > 0){
        ev["checkboxes"] = {};
        for (i = 0; i < total.length; i++){
            value = false;
            for (j = 0; j < checked.length; j++){
                if (total[i].contains(checked[j])){
                    value = true;
                }
            }
            ev["checkboxes"][total[i].id] = value;
        }   
    }
    
    var docQuestions = [];
    generalQuestions = [];
    for (i = 0; i < ev.docQs.length; i++){
        generalQuestions.push(ev.docQs[i][0]);
    }
    for (i = 0; i < generalQuestions.length; i++){
        docQuestions.push([generalQuestions[i], $("#q" + i).val()]);
    }    
    ev["docQs"] = docQuestions;

    flashTeamsJSON["local_update"] = new Date().getTime();
}

//Called when user presses "Save" button
var saveQuestions = function(groupNum){
    saveDocQuestions(groupNum);
    logActivity("var saveQuestions = function(groupNum)",'Save Questions', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(groupNum)]);
    updateStatus();
}


//Called when user confirms event completion alert
var completeTask = function(groupNum){
    //Update the status of a task
    var indexOfJSON = getEventJSONIndex(groupNum);
    var eventToComplete = flashTeamsJSON["events"][indexOfJSON];
    saveDocQuestions(groupNum);
    //console.log(eventToComplete["docQs"]);
    
    if(eventToComplete.status == "delayed"){
        
        var idx = delayed_tasks.indexOf(groupNum);
        if (idx != -1) { // delayed task
            delayed_tasks.splice(idx, 1);
            //console.log("removed task from delayed and added to completed_red");
            
        }
        completed_red_tasks.push(groupNum);
        sendEmailOnCompletionOfDelayedTask(groupNum);
    }
    else if (eventToComplete.status == "started"){
       
        var idx = live_tasks.indexOf(groupNum);
        if (idx != -1){ // live task
            live_tasks.splice(idx, 1);
        }
         drawn_blue_tasks.push(groupNum);
    }

    // remove from either live or delayed tasks. Add to completed_red_tasks or drawn_blue_tasks
    var idx = delayed_tasks.indexOf(groupNum);
    if (idx != -1) { // delayed task
        delayed_tasks.splice(idx, 1);
        completed_red_tasks.push(groupNum);
        //updateStatus(true);
        //console.log("removed task from delayed and added to completed_red");
        sendEmailOnCompletionOfDelayedTask(groupNum);
    } else {
        idx = live_tasks.indexOf(groupNum);
        if (idx != -1){ // live task
            //var task_g = getTaskGFromGroupNum (groupNum);
            //var blue_width = drawBlueBox(ev, task_g);
            drawn_blue_tasks.push(groupNum);
            
            //sendEmailOnEarlyCompletion(blue_width);
            live_tasks.splice(idx, 1);
        }
    }

    eventToComplete.status = "completed";

    logActivity("var completeTask = function(groupNum)",'Complete Task', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(groupNum)]);
   
    //TODO: Iteration Marker - if we iterate and want to put it on the task, do it here

    //Update database, must be false b/c we are not using the old ticker
    //updateStatus(false);
    
    /*Note from DR: I commented out the updateStatus(false) because it was causing the team to end when you completed a task
    I think updateStatus needs to be true since the team is still in progress when you complete a task */
    flashTeamsJSON['local_update'] = new Date().getTime();
    updateStatus();
    drawEvent(eventToComplete);
    trackUpcomingEvent();

    // Message Slack that it's been done
    postToSlack(eventToComplete, "completed");

    //Message the PC that the task has been completed
    //TODO

    //Guide worker to documentation questions
    //TODO

};

/**
 * Messages the relevant slack channel that the task is started or finished.
 * Requires a private slack Incoming Webhook integration URL, or it will post to the StanfordHCI slack.
 */

var postToSlack = function(event, update) {
    var title = event['title'];
    var user = chat_name;
    var teamUrl = defaultUrl + '/flash_teams/'+flash_team_id+'/edit';
    //var teamUrl = 'http://foundry-app.herokuapp.com/flash_teams/'+flash_team_id+'/';

    // HACK HACK HACK for summer deployment. 
    //Eventually teams need to have a place they can store the private URLs
    var channel = "#foundry-notifications";  
    var notification_group = "Update";
    var private_slack_url = slackPrivateUrls['stanfordhcigfx'];
    if (flashTeamsJSON['id'] == 178) { // trauma
        channel = '#general';
        notification_group = '@everyone';
        private_slack_url = slackPrivateUrls['trauma'];
    } else if (flashTeamsJSON['id'] == 155) { // accenture
        channel = '#general';
        notification_group = '@everyone';
        private_slack_url = slackPrivateUrls['accenture'];
    } else if (flashTeamsJSON['id'] == 158) { // true story
        channel = '#general';
        notification_group = '@everyone';
        private_slack_url = slackPrivateUrls['truestory'];
    }

    var defaultMsg = user + ' has ' + update + ' *' + title + '* on Foundry. <' + teamUrl + '|See the task description on Foundry.>';

    var slackMsg = "";

    if (update == "completed") {
        //slackMsg = notification_group + ': ' + user + ' has completed *' + title + '* on Foundry. <' + teamUrl + '|See the submission on Foundry.> Congratulate \'em! The next task is ready to start!';
        slackMsg = notification_group + ': ' + defaultMsg + ' Congratulate \'em! The next task is ready to start!';
    } else if (update == "started") {
        //slackMsg = notification_group + ': ' + user + ' has started *' + title + '* on Foundry. <' + teamUrl + '|See the task description on Foundry.> Wish \'em luck!';
        slackMsg = notification_group + ': ' + defaultMsg + ' Wish \'em luck!';
    } else if (update == "paused") {
        //slackMsg = notification_group + ': ' + user + ' has paused *' + title + '* on Foundry. <' + teamUrl + '|See the task description on Foundry.> Let \'em know you hope to see them back soon!';
        slackMsg = defaultMsg + ' Let \'em know you hope to see them back soon!';
    } else if (update == "resumed") {
        //slackMsg = notification_group + ': ' + user + ' has resumed *' + title + '* on Foundry. <' + teamUrl + '|See the task description on Foundry.> Issue a hearty \'Welcome back\'!';
        slackMsg = defaultMsg +  ' Issue a hearty \'Welcome back\'!';
    }

    var payload = 'payload={\"channel\": \"#flashteams-foundry\", \"username\": \"Foundry\", \"text\": \"' + slackMsg + '\", \"icon_emoji\": \":shipit:\", \"link_names\": 1}';
    $.post(private_slack_url, payload);
}