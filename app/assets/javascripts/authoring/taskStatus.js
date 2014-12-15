/* taskStatus.js
 * ---------------------------------------------
 * Handles status of the task ("started", "not_started", "delayed", "completed")
 * Formerly completeTask.js
 */


 //TASK STATUS COLORS
 var TASK_NOT_START_COLOR = "#F5F5F5"; //gray
 var WORKER_TASK_NOT_START_COLOR = "#FFFF33"; //yellow (this for a worker's upcoming tasks highlighted in his/her timeline)
 var TASK_START_COLOR = "#1E90FF"; //blue
 var TASK_DELAY_COLOR = "#DC143C"; //red
 var TASK_COMPLETE_COLOR = "#00FF7F"; //green

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

//Fires on "Start" button on task modal
 function startTask(groupNum) {
    if (!checkEventsBeforeCompleted(groupNum))
        return;

    var indexOfJSON = getEventJSONIndex(groupNum);
    var eventObj = flashTeamsJSON["events"][indexOfJSON];
    eventObj.status = "started";
    eventObj.timer = eventObj.duration;
    eventObj.task_startBtn_time = (new Date).getTime();
    
    //remove task from remaining and add to live task array
    var idx = remaining_tasks.indexOf(groupNum);
    if (idx != -1) { // delayed task
        remaining_tasks.splice(idx, 1);
    }
    live_tasks.push(groupNum);

    updateStatus(true);
    drawEvent(eventObj); //Will update color

    //Close the task modal
    $("#task_modal").modal('hide');

    
    //chaning start button to complete button on the task modal
    $("#start-end-task").attr('onclick', 'confirmCompleteTask('+groupNum+')');
    $("#start-end-task").html('Complete');         
 }

//Alert firing on event complete buttons
function confirmCompleteTask(groupNum) { 
    //Close the first (task) modal
    $("#task_modal").modal('hide');

    //Creates the alert modal title
    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "Have You Completed This Task?";

    //Gets information from event using id
    var indexOfJSON = getEventJSONIndex(groupNum);
    var events = flashTeamsJSON["events"];
    var eventToComplete = events[indexOfJSON];

    
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
    	$('#confirmAction').modal('hide');
    	completeTask(groupNum);
    };
    //hidePopover(groupNum); 

    //calls saveQuestions functions if user chooses to save questions
    document.getElementById("saveButton").onclick=function(){
        $('#confirmAction').modal('hide');
        saveQuestions(groupNum);
    };
}

var allCompleted = function(eventToComplete){
    // var indexOfJSON = getEventJSONIndex(groupNum);
    // var events = flashTeamsJSON["events"];
    // var eventToComplete = events[indexOfJSON];
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
    return completed
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
    var modalText = "<p align='left'><b>Please check the box next to each deliverable to indicate that you have completed and uploaded it to this </b><a href=" + eventToComplete["gdrive"][1] + ">Google Drive Folder</a></p>";
    
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
                    modalText += '<p id="textoutput' + i + 'q' + j + '">' + questions[j][0] + '</p></br><textarea id = "output' + i + 'q' + j + '" class="outputForm" rows="3" onkeyup="keyUpFunc()">' + questions[j][1] + '</textarea></br>';
                }
            }
            modalText += "</div>"
        }
    }

    //Creating a form for the general documentation questions for a particular task
    modalText += "</form><hr/>";
    modalText += '<p align="left"><b>General Questions:</b></p>';
    modalText +='<form name="docQForm" id="docQForm" style="margin-bottom: 5px;" align="left">' + '<div class="event-table-wrapper">';
    for (i = 0; i < generalQuestions.length; i++){
        if (!generalFilledQ)
            var placeholderVal = "";
        else{
            var placeholderVal = generalFilledQ[i][1]; 
        }
        modalText += '<p id="textq' + i + '">' + generalQuestions[i] + ': </p></br><textarea id="q' + i + '"class="outputForm" rows="3" onkeyup="keyUpFunc()">'+ placeholderVal + '</textarea></br>';
    } 
    modalText += "</form>";
    modalText+= "<br>Click 'Task Completed' to alert the PC and move on to the documentation questons.";
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
}

//Called when user presses "Save" button
var saveQuestions = function(groupNum){
    saveDocQuestions(groupNum);
    updateStatus(true);
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
        //sendEmailOnCompletionOfDelayedTask(groupNum);
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
   
    //TODO: Iteration Marker - if we iterate and want to put it on the task, do it here

    //Update database, must be false b/c we are not using the old ticker
    //updateStatus(false);
    
    /*Note from DR: I commented out the updateStatus(false) because it was causing the team to end when you completed a task
    I think updateStatus needs to be true since the team is still in progress when you complete a task */
    updateStatus(true);
    drawEvent(eventToComplete);

    //Message the PC that the task has been completed
    //TODO

    //Guide worker to documentation questions
    //TODO




    //------------------------------//
    //OLD TICKER VERSION CODE, TO DELETE LATER, USE TO MAKE SURE NOT MISSING CASES??
    /*
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
    //hidePopover(groupNum);

    // update db
    updateStatus(true);

    // reload status bar
    load_statusBar(status_bar_timeline_interval);*/
    //------------------------------//

};
