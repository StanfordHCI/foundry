/* completeTask.js
 * ---------------------------------------------
 *
 */


//Alert firing on event complete buttons
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
    	//completeTask(groupNum);
    };
    
    hidePopover(groupNum); 
}

//Called when user confirms event completion alert
var completeTask = function(groupNum){
    //COMMENTED OUT FOR TICKER DISABLING
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
