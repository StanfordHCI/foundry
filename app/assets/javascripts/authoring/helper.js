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

// function saveFlashTeam() {
// 	console.log("Saving flash team");
    
//     var flash_team_id = $("#flash_team_id").val();
//     var authenticity_token = $("#authenticity_token").val();
//     var url = '/flash_teams/' + flash_team_id + '/update_json';
//     $.ajax({
//         url: url,
//         type: 'post',
//         data: {"flashTeamsJSON": flashTeamsJSON, "authenticity_token": authenticity_token}
//     }).done(function(data){
//         console.log("UPDATED FLASH TEAM JSON");
//     });
// }


function showJSONModal(id_array){
    loadOriginStatus(origin_id);

    var origin_ft_json = loadedOriginStatus.flash_teams_json;

    //console.log('normal:' + origin_ft_json);

    //console.log('stringify:' + JSON.stringify(origin_ft_json));

    if(team_type == 'original'){
        $("#origin-json-div").css('display', 'none');
        $('#json-merge-footer-btn').css('display', 'none');
        //$("#branch-json-div").css('class', 'span6');
        $("#branch-json-div").html('<h3>BRANCH JSON</h3>' + JSON.stringify(flashTeamsJSON));
    }

    if(team_type == 'branch'){
        $("#origin-json-div").html('<h3>ORIGIN JSON</h3>' + JSON.stringify(origin_ft_json));
        $("#branch-json-div").html('<h3>BRANCH JSON</h3>' + JSON.stringify(flashTeamsJSON));
    }

    $("#jsonModal").modal('show');

}

function mergeJSON(){
    //alert('merge!');

    var origin_ft_json = loadedOriginStatus;

    origin_ft_json['flash_teams_json'] = flashTeamsJSON;

    //console.log(origin_ft_json);


    var localStatusJSON = JSON.stringify(origin_ft_json);
        //console.log("updating string: " + localStatusJSON);

        var flash_team_id = origin_id;
        var authenticity_token = $("#authenticity_token").val();
        var url = '/flash_teams/' + flash_team_id + '/update_status';
        $.ajax({
            url: url,
            type: 'post',
            data: {"localStatusJSON": localStatusJSON, "authenticity_token": authenticity_token}
        }).done(function(data){
            console.log("UPDATED ORIGIN FLASH TEAM STATUS");
        });
}

function pullMasterJSON(){
    loadOriginStatus(origin_id);

    var origin_ft_json = loadedOriginStatus;

    flashTeamsJSON = origin_ft_json['flash_teams_json'];

    updateStatus();

    $("#flash_team_id").requestUpdates(true);

    console.log('pulled master json');

    $("#jsonModal").modal('hide');


}
