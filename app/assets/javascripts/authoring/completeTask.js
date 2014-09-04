/* completeTask.js
 * ---------------------------------------------
 *
 */


//Alert firing on event complete buttons
function confirmCompleteTask(groupNum) { 
    //Creates the alert modeal title
    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "Have You Completed This Task?";

    //Gets information from event using id
    var indexOfJSON = getEventJSONIndex(groupNum);
    var events = flashTeamsJSON["events"];
    var eventToComplete = events[indexOfJSON];

    //GET OUTPUTS HERE, CHANGE LATER TO GET FROM EVENT, TODO
    var fakeOutputs = ["Output 1", "Output 2", "Output 3"]; //placeholder text
    var eventOutputs = fakeOutputs;

    //Creates the alert modal 
    var alertText = document.getElementById("confirmActionText");
    alertText.innerHTML = "Outputs for " + eventToComplete["title"] + ":";

    //Create Checklist of outputs
    alertText.innerHTML += "<form id='event_checklist_" + groupNum + "' >";
    for (i=0; i<eventOutputs.length; i++) {
        alertText.innerHTML += "<input type='checkbox' class='outputCheckbox'>" + eventOutputs[i] + "</input><br>";
    }
    alertText.innerHTML += "</form>";
    alertText.innerHTML += "Click 'Task Completed' to alert the PC and move on to the documentation questons."

    //Code for the Task Completed Button
    var completeButton = document.getElementById("confirmButton");
    completeButton.innerHTML = "Task Completed";
    $("#confirmButton").attr("class","btn btn-success");
    $("#confirmButton").prop('disabled', true); //Defaults to disabled
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

//Called when user confirms event completion alert
var completeTask = function(groupNum){
    console.log("COMPLETED TASK new function");

    //Update Color of the Task
    $("#rect_" + groupNum).attr("fill", "#009933");

    //TODO: Iteration Marker - if we iterate and want to put it on the task, do it here

    //Message the PC that the task has been completed
    //TODO

    //Guide worker to documentation questions
    //TODO


    //OLD TICKER VERSION CODE
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

    hidePopover(groupNum);

    // update db
    updateStatus(true);

    // reload status bar
    load_statusBar(status_bar_timeline_interval);*/
};
