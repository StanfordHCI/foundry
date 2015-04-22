/* helper.js
 * ---------------------------------
 * 
 */

//MAKE SURE THE JSON IS UPDATED IN ITS CURRENT VERSION EVERYWHERE
var flashTeamsJSON = {
    "title" : document.getElementById("ft-name").innerHTML,
    "id" : flash_team_id,
    "events": [],        //{"title", "id", "startTime", "duration", "notes", "members": [], "dri", "yPosition", inputs”:[], “outputs”:[]}
    "members": [],       //{"id", "role", "skills":[], "color", "category1", "category2"}
    "folders": [],
    "interactions" : [],  //{"event1", "event2", "type", "description", "id"}
    "author": document.getElementById("ft-author-name").innerHTML//,
   // "original_status": "original status",
    //"original_json": "original json"
};

//rails g migration create_activity_logs activity_type:string act_tstamp:datetime current_user:string chat_role:string team_id:integer activity_json:text

function logTeamActivity(activityName, time, currentUser, chatName, teamId, loadedStatus){
    // console.log('activity: ' + activityName);
    // console.log('time: ' + time);
    // console.log('current_user: ' + currentUser);
    // console.log('chatRole: ' + chatRole);
    // console.log('teamId: ' + teamId);
    // console.log('loadedStatus: ' + loadedStatus);

    //"activity_type": activityName, "act_tstamp" :time, "current_user": currentUser, "chat_role": chatRole, "team_id": teamId, "activity_json": loadedStatus
    var activityJSON = JSON.stringify(loadedStatus);
    var currentUser = JSON.stringify(currentUser);

    var url = '/activity_logs/log_update';

    $.ajax({
        url: url,
        type: 'post',
        data: {"activity_type": activityName, "act_tstamp": time, "current_user": currentUser, "chat_name": chatName, "team_id": teamId, "activity_json": activityJSON, "update_type": "Team Event"},
        success: function (result) {
        //do somthing here
        //window.alert("success!!");
            console.log("Team activity: " + activityName);
        },
        error: function (){
            //window.alert("something wrong!");
            console.log('something went wrong!');
        }
    });
    // }).done(function(data){
    //     console.log("UPDATED log team activity!");
    // });

}

function logEventActivity(activityName, time, currentUser, chatName, teamId, eventJSON){
    // console.log('activity: ' + activityName);
    // console.log('time: ' + time);
    // console.log('current_user: ' + currentUser);
    // console.log('chatRole: ' + chatRole);
    // console.log('teamId: ' + teamId);
    // console.log('eventJSON: ' + JSON.stringify(eventJSON));

    var activityJSON = JSON.stringify(eventJSON);
    var currentUser = JSON.stringify(currentUser);

    var url = '/activity_logs/log_update';

    $.ajax({
        url: url,
        type: 'post',
        data: {"activity_type": activityName, "act_tstamp": time, "current_user": currentUser, "chat_name": chatName, "team_id": teamId, "activity_json": activityJSON, "update_type": "Task Event"},
        success: function (result) {
        //do somthing here
        //window.alert("success!!");
            //console.log("UPDATED log event activity!");
            console.log("Event activity: " + activityName);
        },
        error: function (){
            console.log('something went wrong!');
            //window.alert("something wrong!");
        }
    });
    // }).done(function(data){
    //     console.log("UPDATED log team activity!");
    // });

}


function pressEnterKeyToSubmit(inputId, buttonId) {
	$(inputId).keydown(function(event){
		if(event.keyCode == 13){
			$(buttonId).click();
            return false;
		}
	});
}

//Find the total hours (duration) of the entire team
function findTotalHours() {
    var totalHours = 48; 
    for (i = 0; i < flashTeamsJSON["events"].length; i++) {
        var eventObj = flashTeamsJSON["events"][i];
        var eventStart = eventObj.startTime;
        var eventDuration = eventObj.duration;
        var eventEnd = eventStart + eventDuration;
        var hours = (eventEnd - (eventEnd%60))/60; 
        if (hours > totalHours) totalHours = hours;
    }
    //NOTE: the above cut off minutes past the hour, must add at least 1 extra hour to return val
    totalHours++; 
    return totalHours + 2; //THE 2 IS ARBITRARY FOR PADDING
}


//CALL IN CONSOLE TO HIDE THE CHAT BOX AND PROJECT STATUS
function hideAwareness() {
    var projCont = document.getElementById("project-status-container");
    projCont.style.display = "none";
    var chatCont = document.getElementById("chat-box-container");
    chatCont.style.display = "none";
}

function saveFlashTeam() {
	console.log("Saving flash team");
    
    var flash_team_id = $("#flash_team_id").val();
    var authenticity_token = $("#authenticity_token").val();
    var url = '/flash_teams/' + flash_team_id + '/update_json';
    $.ajax({
        url: url,
        type: 'post',
        data: {"flashTeamsJSON": flashTeamsJSON, "authenticity_token": authenticity_token}
    }).done(function(data){
        console.log("UPDATED FLASH TEAM JSON");
    });
}
