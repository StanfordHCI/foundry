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

// var branch = {"events":[{"id":1451522704201,"x":-4,"min_x":0,"y":5,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"UI Task","members":["1451522684042"],"startTime":0,"duration":120,"startHr":0,"startMin":0,"row":0,"dri":"0","pc":"0","notes":"UI Description","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451522719541,"x":172,"min_x":176,"y":85,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"UX Task","members":["1451522685753"],"startTime":120,"duration":120,"startHr":2,"startMin":0,"row":1,"dri":"0","pc":"0","notes":"UX Task Description","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451523453482,"x":348,"min_x":352,"y":165,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"UX and UI Event","members":["1451522684042","1451522685753"],"startTime":240,"duration":120,"startHr":4,"startMin":0,"row":2,"dri":"0","pc":"0","notes":"UX and UI Task Description","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451524371154,"x":172,"min_x":176,"y":245,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"Test Event","members":["1451522684042"],"startTime":120,"duration":120,"startHr":2,"startMin":0,"row":3,"dri":"0","pc":"0","notes":"Test test test","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451524611070,"x":436,"min_x":440,"y":5,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"Testing again","members":[],"startTime":300,"duration":120,"startHr":5,"startMin":0,"row":0,"dri":"0","pc":"0","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451524959620,"x":612,"min_x":616,"y":245,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"hola","members":[],"startTime":420,"duration":120,"startHr":7,"startMin":0,"row":3,"dri":"0","pc":"0","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451525753692,"x":612,"min_x":616,"y":85,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"MSB Event","members":["1451525760903"],"startTime":420,"duration":120,"startHr":7,"startMin":0,"row":1,"dri":"0","pc":"0","notes":"HEY MSB","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451525878841,"x":788,"min_x":792,"y":165,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"DR EVENT","members":["1451522685753"],"startTime":540,"duration":120,"startHr":9,"startMin":0,"row":2,"dri":"0","pc":"0","notes":"DR DR DR","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451529339851,"x":370,"min_x":374,"y":325,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"Daniela","members":["1451522685753"],"startTime":255,"duration":90,"startHr":4,"startMin":15,"row":4,"dri":"0","pc":"0","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451544180708,"x":612,"min_x":616,"y":325,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"ANDREW","members":["1451544193926"],"startTime":420,"duration":135,"startHr":7,"startMin":0,"row":4,"dri":"0","pc":"0","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451544257444,"x":854,"min_x":858,"y":5,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"Heyyyy","members":["1451525760903","1451544193926"],"startTime":585,"duration":135,"startHr":9,"startMin":45,"row":0,"dri":"0","pc":"0","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451584479455,"x":1052,"min_x":1056,"y":85,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"DR ROCKS","members":["1451522684042"],"startTime":720,"duration":120,"startHr":12,"startMin":0,"row":1,"dri":"0","pc":"0","notes":"DR DR DR","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}}],"members":[{"role":"UI","id":"1451522684042","color":"#b175ca","type":"worker","skills":[],"seenDocQs":[],"parentId":"root","uniq":"ec74ae2b-6bb8-430c-a09a-1c12a379b5cc","invitation_link":"http://localhost:3000/members/54/invited?uniq=ec74ae2b-6bb8-430c-a09a-1c12a379b5cc"},{"role":"UX","id":"1451522685753","color":"#9b59b6","type":"worker","skills":[],"seenDocQs":[],"parentId":"root","uniq":"8e8b1642-6cd9-4c18-a4b6-30a0d271c13e","invitation_link":"http://localhost:3000/members/54/invited?uniq=8e8b1642-6cd9-4c18-a4b6-30a0d271c13e"},{"role":"MSB","id":"1451525760903","color":"#d35400","type":"worker","skills":[],"seenDocQs":[],"parentId":"root","uniq":"601e54ad-3790-4511-8213-ced2396395f6","invitation_link":"http://localhost:3000/members/54/invited?uniq=601e54ad-3790-4511-8213-ced2396395f6"},{"role":"Andrew","id":"1451544193926","color":"#336e7b","type":"worker","skills":[],"seenDocQs":[],"parentId":"root","uniq":"345dc4a4-b58c-4e8c-82a1-e71f91cffc18","invitation_link":"http://localhost:3000/members/54/invited?uniq=345dc4a4-b58c-4e8c-82a1-e71f91cffc18"}],"folders":[],"interactions":[],"origin_id":54,"team_type":"branch","local_update":1451584497862,"id":58,"title":"DR NEW Branch","author":"Daniela"};

// var master = {"events":[{"id":1451522704201,"x":-4,"min_x":0,"y":5,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"UI Task","members":["1451522684042"],"startTime":0,"duration":120,"startHr":0,"startMin":0,"row":0,"dri":"0","pc":"0","notes":"UI Description","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451522719541,"x":172,"min_x":176,"y":85,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"UX Task","members":["1451522685753"],"startTime":120,"duration":120,"startHr":2,"startMin":0,"row":1,"dri":"0","pc":"0","notes":"UX Task Description","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451523453482,"x":348,"min_x":352,"y":165,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"UX and UI Event","members":["1451522684042","1451522685753"],"startTime":240,"duration":120,"startHr":4,"startMin":0,"row":2,"dri":"0","pc":"0","notes":"UX and UI Task Description","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451524371154,"x":172,"min_x":176,"y":245,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"Test Event","members":["1451522684042"],"startTime":120,"duration":120,"startHr":2,"startMin":0,"row":3,"dri":"0","pc":"0","notes":"Test test test","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451524611070,"x":436,"min_x":440,"y":5,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"Testing again","members":[],"startTime":300,"duration":120,"startHr":5,"startMin":0,"row":0,"dri":"0","pc":"0","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451524959620,"x":612,"min_x":616,"y":245,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"hola","members":[],"startTime":420,"duration":120,"startHr":7,"startMin":0,"row":3,"dri":"0","pc":"0","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451525753692,"x":612,"min_x":616,"y":85,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"MSB Event","members":["1451525760903"],"startTime":420,"duration":120,"startHr":7,"startMin":0,"row":1,"dri":"0","pc":"0","notes":"HEY MSB","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451525878841,"x":788,"min_x":792,"y":165,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"DR EVENT","members":["1451522685753"],"startTime":540,"duration":120,"startHr":9,"startMin":0,"row":2,"dri":"0","pc":"0","notes":"DR DR DR","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451529339851,"x":370,"min_x":374,"y":325,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"Daniela","members":["1451522685753"],"startTime":255,"duration":90,"startHr":4,"startMin":15,"row":4,"dri":"0","pc":"0","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451544180708,"x":612,"min_x":616,"y":325,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"ANDREW","members":["1451544193926"],"startTime":420,"duration":135,"startHr":7,"startMin":0,"row":4,"dri":"0","pc":"0","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451544257444,"x":854,"min_x":858,"y":5,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"Heyyyy","members":["1451525760903","1451544193926"],"startTime":585,"duration":135,"startHr":9,"startMin":45,"row":0,"dri":"0","pc":"0","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451584463004,"x":1052,"min_x":1056,"y":85,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"MSB ROCKS","members":["1451525760903"],"startTime":720,"duration":120,"startHr":12,"startMin":0,"row":1,"dri":"0","pc":"0","notes":"MSB MSB MSB","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}}],"members":[{"role":"UI","id":"1451522684042","color":"#b175ca","type":"worker","skills":[],"seenDocQs":[],"parentId":"root","uniq":"ec74ae2b-6bb8-430c-a09a-1c12a379b5cc","invitation_link":"http://localhost:3000/members/54/invited?uniq=ec74ae2b-6bb8-430c-a09a-1c12a379b5cc"},{"role":"UX","id":"1451522685753","color":"#9b59b6","type":"worker","skills":[],"seenDocQs":[],"parentId":"root","uniq":"8e8b1642-6cd9-4c18-a4b6-30a0d271c13e","invitation_link":"http://localhost:3000/members/54/invited?uniq=8e8b1642-6cd9-4c18-a4b6-30a0d271c13e"},{"role":"MSB","id":"1451525760903","color":"#d35400","type":"worker","skills":[],"seenDocQs":[],"parentId":"root","uniq":"601e54ad-3790-4511-8213-ced2396395f6","invitation_link":"http://localhost:3000/members/54/invited?uniq=601e54ad-3790-4511-8213-ced2396395f6"},{"role":"Andrew","id":"1451544193926","color":"#336e7b","type":"worker","skills":[],"seenDocQs":[],"parentId":"root","uniq":"345dc4a4-b58c-4e8c-82a1-e71f91cffc18","invitation_link":"http://localhost:3000/members/54/invited?uniq=345dc4a4-b58c-4e8c-82a1-e71f91cffc18"}],"folders":[],"interactions":[],"origin_id":54,"team_type":"original","local_update":1451584472109,"id":54,"title":"DR NEW","author":"Daniela","status":false};

// var master_updated = {"events":[{"id":1451522704201,"x":-4,"min_x":0,"y":5,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"UI Task","members":["1451522684042"],"startTime":0,"duration":120,"startHr":0,"startMin":0,"row":0,"dri":"0","pc":"0","notes":"UI Description","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451522719541,"x":172,"min_x":176,"y":85,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"UX Task","members":["1451522685753"],"startTime":120,"duration":120,"startHr":2,"startMin":0,"row":1,"dri":"0","pc":"0","notes":"UX Task Description","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451523453482,"x":348,"min_x":352,"y":165,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"UX and UI Event","members":["1451522684042","1451522685753"],"startTime":240,"duration":120,"startHr":4,"startMin":0,"row":2,"dri":"0","pc":"0","notes":"UX and UI Task Description","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451524371154,"x":172,"min_x":176,"y":245,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"Test Event","members":["1451522684042"],"startTime":120,"duration":120,"startHr":2,"startMin":0,"row":3,"dri":"0","pc":"0","notes":"Test test test","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451524611070,"x":436,"min_x":440,"y":5,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"Testing again","members":[],"startTime":300,"duration":120,"startHr":5,"startMin":0,"row":0,"dri":"0","pc":"0","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451524959620,"x":612,"min_x":616,"y":245,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"hola","members":[],"startTime":420,"duration":120,"startHr":7,"startMin":0,"row":3,"dri":"0","pc":"0","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451525753692,"x":612,"min_x":616,"y":85,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"MSB Event","members":["1451525760903"],"startTime":420,"duration":120,"startHr":7,"startMin":0,"row":1,"dri":"0","pc":"0","notes":"HEY MSB","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451525878841,"x":788,"min_x":792,"y":165,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"DR EVENT","members":["1451522685753"],"startTime":540,"duration":120,"startHr":9,"startMin":0,"row":2,"dri":"0","pc":"0","notes":"DR DR DR","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451529339851,"x":370,"min_x":374,"y":325,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"Daniela","members":["1451522685753"],"startTime":255,"duration":90,"startHr":4,"startMin":15,"row":4,"dri":"0","pc":"0","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451544180708,"x":612,"min_x":616,"y":325,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"ANDREW","members":["1451544193926"],"startTime":420,"duration":135,"startHr":7,"startMin":0,"row":4,"dri":"0","pc":"0","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451544257444,"x":854,"min_x":858,"y":5,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"Heyyyy","members":["1451525760903","1451544193926"],"startTime":585,"duration":135,"startHr":9,"startMin":45,"row":0,"dri":"0","pc":"0","notes":"","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}},{"id":1451584463004,"x":1052,"min_x":1056,"y":85,"timer":0,"task_startBtn_time":-1,"task_endBtn_time":-1,"status":"not_started","gdrive":[],"completed_x":null,"events_after":"","title":"MSB ROCKS","members":["1451525760903"],"startTime":720,"duration":120,"startHr":12,"startMin":0,"row":1,"dri":"0","pc":"0","notes":"MSB MSB MSB","inputs":"","all_inputs":"","outputs":"","docQs":[["Please explain all other design or execution decisions made, along with the reason they were made",""],["Please add anything else you want other team members, the team lead, or the client, to know. (optional)",""]],"outputQs":{}}],"members":[{"role":"UI","id":"1451522684042","color":"#b175ca","type":"worker","skills":[],"seenDocQs":[],"parentId":"root","uniq":"ec74ae2b-6bb8-430c-a09a-1c12a379b5cc","invitation_link":"http://localhost:3000/members/54/invited?uniq=ec74ae2b-6bb8-430c-a09a-1c12a379b5cc"},{"role":"UX","id":"1451522685753","color":"#9b59b6","type":"worker","skills":[],"seenDocQs":[],"parentId":"root","uniq":"8e8b1642-6cd9-4c18-a4b6-30a0d271c13e","invitation_link":"http://localhost:3000/members/54/invited?uniq=8e8b1642-6cd9-4c18-a4b6-30a0d271c13e"},{"role":"MSB","id":"1451525760903","color":"#d35400","type":"worker","skills":[],"seenDocQs":[],"parentId":"root","uniq":"601e54ad-3790-4511-8213-ced2396395f6","invitation_link":"http://localhost:3000/members/54/invited?uniq=601e54ad-3790-4511-8213-ced2396395f6"},{"role":"Andrew","id":"1451544193926","color":"#336e7b","type":"worker","skills":[],"seenDocQs":[],"parentId":"root","uniq":"345dc4a4-b58c-4e8c-82a1-e71f91cffc18","invitation_link":"http://localhost:3000/members/54/invited?uniq=345dc4a4-b58c-4e8c-82a1-e71f91cffc18"}],"folders":[],"interactions":[],"origin_id":54,"team_type":"original","local_update":1451584472109,"id":54,"title":"DR NEW","author":"Daniela","status":false};


var threeWayMerge;
var branchMerge; 

function diffMergeDef(){
    threeWayMerge = branchmerge.threeWayMerge();
    console.log(JSON.stringify(threeWayMerge, null, 3));
    branchMerge = branchmerge.patch(threeWayMerge.diff);
}

function diffMerge(){
    loadOriginStatus(origin_id);
    var master = loadedOriginStatus.flash_teams_json;
    var master_updated = master;
    var branch = flashTeamsJSON;

    //console.log(JSON.stringify(master_updated));
    var diff = branchmerge.threeWayMerge(master_updated, master, branch);
    console.log(JSON.stringify(diff, null, 3));
    var merged = branchmerge.patch(diff.diff, master_updated);
    console.log(JSON.stringify(merged));
}

function showDiff(){
    loadOriginStatus(origin_id);
    var master = loadedOriginStatus.flash_teams_json;
    var master_updated = master;
    var branch = flashTeamsJSON;

    //console.log(JSON.stringify(master_updated));
    var diff = branchmerge.threeWayMerge(master_updated, master, branch);
    console.log(JSON.stringify(diff, null, 3));
}

