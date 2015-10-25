function logActivity(updateType, activityName, time, currentUser, chatName, teamId, activityObject){

    var activityJSON = JSON.stringify(activityObject);
    var currentUser = JSON.stringify(currentUser);

    var url = '/activity_logs/log_update';

    $.ajax({
        url: url,
        type: 'post',
        data: {"update_type": updateType, "activity_type": activityName, "act_tstamp": time, "current_user": currentUser, "chat_name": chatName, "team_id": teamId, "activity_json": activityJSON},
        success: function (result) {
            //console.log(activityName);
        },
        error: function (){
            console.log('!');
        }
    });
}

function Logger() {}
Logger.prototype.logActivity = function(updateType, activityName, activityObject) {
    var activityJSON = JSON.stringify(activityObject);
    var currentUser = JSON.stringify(current_user); //use global current_user object
    var time = new Date().getTime(); //it is current time all the times

    var url = '/activity_logs/log_update';

    $.ajax({
        url: url,
        type: 'post',
        data: {"update_type": updateType, "activity_type": activityName, "act_tstamp": time, "current_user": currentUser, "chat_name": chat_name, "team_id": currentTeam.id, "activity_json": activityJSON},
        success: function (result) {
            //console.log(activityName);
        },
        error: function (){
            console.log('!');
        }
    });
}
