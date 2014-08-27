/* helper.js
 * ---------------------------------
 * 
 */

//MAKE SURE THE JSON IS UPDATED IN ITS CURRENT VERSION EVERYWHERE
var flashTeamsJSON = {
    "title" : "New Flash Team",
    "id" : 1,
    "events": [],        //{"title", "id", "startTime", "duration", "notes", "members": [], "dri", "yPosition", inputs”:[], “outputs”:[]}
    "members": [],       //{"id", "role", "skills":[], "color", "category1", "category2"}
    "interactions" : [],  //{"event1", "event2", "type", "description", "id"}
    "author": "defaultAuthor",
    "original_status": "original status",
    "original_json": "original json"
};

function pressEnterKeyToSubmit(inputId, buttonId) {
	$(inputId).keydown(function(event){
		if(event.keyCode == 13){
			$(buttonId).click();
            return false;
		}
	});
}

/*//FOR TESTING, DELETE LATER
fakeJSON = {
	"title" : "New Flash Team",
    "id" : 1,

    //{"title", "id", "startTime", "duration", "notes", "members", "dri", "yPosition"}
    "events": [{"startTime":60, "yPosition":100, "members":["Illustrator"], "id":1, "notes":"hi there", "title":"My Event", "dri":""}],

    //{"id", "role", "skills":[], "color", "category1", "category2"}
    "members": [{"id":1, "role":"Illustrator", "category1":"Web Development", "category2":"UI Design", "skills":["shopify"], "color":"BLUE"}, 
    	{"id":2, "role":"Author", "category1":"Writing & Translation", "category2":"Creative Writing", "skills":["ebooks"], "color":"RED"}],       
    "interactions" : []  //{"event1", "event2", "type", "description"}       
};*/


/*//Takes a Flash Teams JSON Object and Draws a Flash Team
function drawFlashTeamFromJSON(ftJSON) {
    //Populate members
    //console.log("ftJSON: ");
    //console.log(ftJSON);

    var members_len = ftJSON["members"].length;
    for (var i = 0; i < members_len; i++) {
    	$("#addMemberInput").val(ftJSON["members"][i].role); //Need to mimic adding this name manually
    	addMember(); //Pulls role name from member input, also appends to FlashTeamsJSON
    	var memberIndex = flashTeamsJSON["members"].length-1;

    	//Populate the Member Popover
    	//Add oDesk Category 1 and Category 2
    	$("#member" + (i+1) + "_category1")[0].value = ftJSON["members"][i].category1;
    	$("#member" + (i+1) + "_category2").removeAttr("disabled");
    	$("#member" + (i+1) + "_category2").empty();
		var category1Select = document.getElementById("member" + memberCounter + "_category1");
	    var category1Name = category1Select.options[category1Select.selectedIndex].value;
	    for (j = 0; j < oDeskCategories[category1Name].length; j++) {
	        var option = document.createElement("option");
	        $("#member" + memberCounter + "_category2").append("<option>" + oDeskCategories[category1Name][j] + "</option>");
	    }
    	$("#member" + (i+1) + "_category2")[0].value = ftJSON["members"][i].category2;

    	//Add skills
    	for (var k = 0; k<ftJSON["members"][i].skills.length; k++) {
    		$("#addSkillInput_" + memberCounter).val(ftJSON["members"][i].skills[k]);
    		addSkill(memberCounter);
    	}
    	saveMemberInfo(memberCounter);
    }

    var events_len = ftJSON["events"].length;
    //DRAW EVENTS
    for (var j = 0; j < events_len; j++) {
    	event_counter++;

    	var x = ftJSON["events"][j].startTime * (1 + (2/3));
    	var y = ftJSON["events"][j].yPosition;
    	drawEvent(x, y, null, null, null);

    	//Add to JSON
    	ftJSON["events"][j].id = event_counter;
    	flashTeamsJSON.events.push(ftJSON["events"][j]);

    	//DRAW EVENT POPOVERS
    	var startHr = (ftJSON["events"][j].startTime - (ftJSON["events"][j].startTime%60))/60;
    	var startMin = ftJSON["events"][j].startTime%60;
    	addEventPopover(startHr, startMin);
    	//CHECK THAT MEMBERS WORK, SHOULD BE TAKEN CARE OF BY EVENT POPOVERT
    	$("#notes_" + memberCounter).val(ftJSON["events"][j].notes);
    	overlayOn();
    }
    
    //DRAW INTERACTIONS
}*/

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
