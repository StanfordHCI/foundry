/* taskStatus.js
 * ---------------------------------------------
 * Handles status of the task ("started", "not_started", "delayed", "completed")
 * Formerly completeTask.js
 */


 //TASK STATUS COLORS
 var TASK_NOT_START_COLOR = "#C9C9C9";
 var TASK_START_COLOR = "blue";
 var TASK_DELAY_COLOR = "red";
 var TASK_COMPLETE_COLOR = "green";


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
    completeButton.innerHTML = "Task Completed";
    $("#confirmButton").attr("class","btn btn-success");
    if (eventToComplete.outputs != null && eventToComplete.outputs != "") {
        $("#confirmButton").prop('disabled', true); //Defaults to disabled
    }
    $('#confirmAction').modal('show');
    
    //Set change function on checkboxes, enable button if all checkboxes are checked
    $(".outputCheckbox").change(function() {
        var totalCheckboxes = $(".outputCheckbox").length;
        var checkedCheckboxes = $(".outputCheckbox:checked").length;
        if (totalCheckboxes == checkedCheckboxes) {
            $("#confirmButton").prop('disabled', false);
        } else {
            $("#confirmButton").prop('disabled', true);
        }
    });

    //Calls completeTask function if user confirms the complete
    document.getElementById("confirmButton").onclick=function(){
    	$('#confirmAction').modal('hide');
    	completeTask(groupNum);
    };
    //hidePopover(groupNum); 
}

//Return text to fill complete task modal
function completeTaskModalText(eventToComplete) {
    var modalText = "<b>Outputs for " + eventToComplete["title"] + ":</b>";

    //Get outputs from eventObj
    var eventOutputs = eventToComplete.outputs;
    if (eventOutputs != null && eventOutputs != "") {
        eventOutputs = eventToComplete.outputs.split(",");
    }

    //Create Checklist of outputs
    modalText += "<form id='event_checklist_" + eventToComplete.id + "' >";
    if (eventOutputs == null || eventOutputs == "") {
        modalText += "No outputs were specified for this task.";
    } else {
        for (i=0; i<eventOutputs.length; i++) {
            modalText += "<input type='checkbox' class='outputCheckbox'>" + eventOutputs[i] + "</input><br>";
        }
    }
    modalText += "</form>";
    
    modalText+= "<br>Click 'Task Completed' to alert the PC and move on to the documentation questons."
    return modalText;
}

//Called when user confirms event completion alert
var completeTask = function(groupNum){
    //Update the status of a task
    var indexOfJSON = getEventJSONIndex(groupNum);
    var eventToComplete = flashTeamsJSON["events"][indexOfJSON];
    eventToComplete.status = "completed";

    //TODO: Iteration Marker - if we iterate and want to put it on the task, do it here

    //Update database, must be false b/c we are not using the old ticker
    updateStatus(false);
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
