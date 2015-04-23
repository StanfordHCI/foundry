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
