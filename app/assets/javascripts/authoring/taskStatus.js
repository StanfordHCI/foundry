/* taskStatus.js
 * ---------------------------------------------
 * Handles status of the task ("started", "not_started", "delayed", "completed")
 * Formerly completeTask.js
 */


 //TASK STATUS COLORS
 var TASK_NOT_START_COLOR = "#F5F5F5"; //gray
 var TASK_START_COLOR = "#1E90FF"; //blue
 var TASK_DELAY_COLOR = "#DC143C"; //red
 var TASK_COMPLETE_COLOR = "#00FF7F"; //green

//Documentation Questions
var outputQuestions = ["Please write a brief (1 sentence) description of this deliverable", "Please explain all important decisions made about the deliverable, and the reason they were made", "If there is other information that you want team members and the project coordinators who will use this deliverable to know, please explain it here"];
var generalQuestions = ["Please explain all other design or execution decisions made, along with the reason they were made", "Is there anything else you want other team members, the project coordinator, or the client, to know?"];
//Fires on "Start" button on task modal
 function startTask(groupNum) {
    var indexOfJSON = getEventJSONIndex(groupNum);
    var eventObj = flashTeamsJSON["events"][indexOfJSON];
    eventObj.status = "started";

    //START TIMER
    //START HERE ALEXANDRA

    //Close the task modal
    $("#task_modal").modal('hide');

    updateStatus();
    drawEvent(eventObj); //Will update color

    console.log("redraw event after start");

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
    if (eventToComplete.outputs != null && eventToComplete.outputs != "") {
        $("#confirmButton").prop('disabled', true); //Defaults to disabled
    }
    $('#confirmAction').modal('show');

    var saveButton = document.getElementById("saveButton");
    saveButton.innerHTML = "Save and Close";
    $("#saveButton").attr("class","btn btn-default");
    $("#saveButton").attr("style", "display:inline;");
    $('#confirmAction').modal('show');
    

    $(".outputForm").change(function() {
        var totalCheckboxes = $(".outputCheckbox").length;
        var checkedCheckboxes = $(".outputCheckbox:checked").length;
        var splitOutputs = eventToComplete.outputs.split(",");
        for (j = 0; j < checkedCheckboxes; j++){
            for (i = 0; i < totalCheckboxes; i++){
                if ($(".outputCheckbox:checked")[j].contains($(".outputCheckbox")[i])){
                    $("#output" + splitOutputs[i]).attr("style", "display:block;");
                }
            }
        }
        var outputFormLength = $(".outputForm").length;
        var completed = true;
        for (i = 0; i < outputFormLength; i++){
            if ($(".outputForm")[i].type != "checkbox"){
                if ($(".outputForm")[i].value == ""){
                    completed = false;
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
        else 
            $("#confirmButton").prop('disabled', true);
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

//Return text to fill complete task modal
function completeTaskModalText(eventToComplete) {
    var modalText = "<p align='left'><b>Please check the box next to each deliverable to indicate that you have completed and uploaded it to this </b><a href='http://www.google.com'>google drive</a></p>";
    
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
            modalText += "<b><input type='checkbox' id = '" + eventOutputs[i] + "' class='outputCheckbox outputForm'>" + " " + eventOutputs[i] + "</input></b><br>";
            modalText += '<div id="output' + eventOutputs[i] + '" style = "display:none;">';
            for (j = 0; j<outputQuestions.length; j++){
                if (!outputFilledQ)
                    var placeholderVal = "";
                else{
                    var placeholderVal = outputFilledQ[eventOutputs[i]][j][1]; 
                }
                modalText += outputQuestions[j] + '</br><textarea id = "output' + i + 'q' + j + '" class="outputForm" rows="3">' + placeholderVal + '</textarea></br>';
            }
            modalText += "</div>";
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
        modalText += generalQuestions[i] + ': </br><textarea id="q' + i + '"class="outputForm" rows="3">'+ placeholderVal + '</textarea></br>';
    } 
    modalText += "</form>";
    modalText+= "<br>Click 'Task Completed' to alert the PC and move on to the documentation questons.";
    return modalText;
}

//Function to save the documentation questions in the form when the task is completed
function saveDocQuestions(groupNum){
    var task_id = getEventJSONIndex(groupNum); 
    var ev = flashTeamsJSON["events"][task_id];
    if (ev["outputs"]){
        var outputList = ev["outputs"].split(",");
        var outputQMap = {};
        for (i = 0; i < outputList.length; i++){
             outputQ = []
             for (j = 0; j < outputQuestions.length; j++){
                 outputQ.push([outputQuestions[j], $("#output" + i + "q" + j).val()]);
            }
            outputQMap[outputList[i]] = outputQ;
        }
        ev["outputQs"] = outputQMap;
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
    eventToComplete.status = "completed";
    saveDocQuestions(groupNum);

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
