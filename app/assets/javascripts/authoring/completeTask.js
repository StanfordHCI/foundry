/* completeTask.js
 * ---------------------------------------------
 * 
 */

//Fires on "Start" button on task modal
 function startTask(groupNum) {
    var indexOfJSON = getEventJSONIndex(groupNum);
    var eventObj = flashTeamsJSON["events"][indexOfJSON];
    eventObj.status = "started";

    //START HERE
    //

    updateStatus();
 }

//Alert firing on event complete buttons
function confirmCompleteTask(groupNum) { 
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
    hidePopover(groupNum); 
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


    
};
