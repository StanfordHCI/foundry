function showTaskOverview(groupNum){
	var task_id = getEventJSONIndex(groupNum);
	var eventObj = currentTeam.flash_teams_json["events"][task_id];
	var title = eventObj["title"];

	//uniq_u is null for author, we use this to decide whether to show the edit link next to project overview
	var uniq_u=getParameterByName('uniq');


	//modal label
	var label = title;

	$('#task_modal_Label').html(label);

    $("#modal-close-btn").attr('onclick', 'logHideTaskOverview('+groupNum+')');

	//modal content
	var taskOverviewContent = getTaskOverviewContent(groupNum);
	//$('#taskOverview').html(taskOverviewContent);
	$('#task-text').html(taskOverviewContent);

    // if team hasn't started yet, don't show the google drive deliverables button in task footer
    if(!currentTeam.inProgress()){
        $("#gdrive-footer-btn").css('display', 'none');
    }

    // determines which buttons to show in the footer of the modal (e.g., start, complete, etc.)
    //checks if team has been started and if the current user is assigned to the task or if the user is an author, PC or client
	if(currentTeam.inProgress() == true && (currentMemberTask(groupNum) == true || uniq_u == "" || memberType == "pc" || memberType == "client")){


        if(eventObj.status == "started" || eventObj.status == "delayed"){
            $("#start-end-task").addClass('btn-success');
            $("#start-end-task").css('display', '');
            $("#pause-resume-task").addClass('btn-info');
            $("#pause-resume-task").css('display', '');


            $("#start-end-task").attr('onclick', 'confirmCompleteTask('+groupNum+')');
            $("#start-end-task").html('Complete');
        }


        else if(eventObj.status == "paused"){
            $("#start-end-task").css('display', 'none');
            $("#pause-resume-task").addClass('btn-primary');
            $("#pause-resume-task").css('display', '');
            $("#pause-resume-task").attr('onclick', 'resumeTask('+groupNum+')');

            $("#pause-resume-task").html('Resume Task');

        }

        else if(eventObj.status == "completed"){
             $("#pause-resume-task").css('display', 'none');
             $("#start-end-task").css('display', '');
              $("#start-end-task").html('Complete');
              $("#start-end-task").addClass('btn-success');
              $("#start-end-task").prop('disabled', true);
        }
        else{
           $("#pause-resume-task").css('display', 'none');
           $("#start-end-task").css('display', '');
            $("#start-end-task").attr('onclick', 'confirm_show_docs('+groupNum+')');
            $("#start-end-task").addClass('btn-warning');
            $("#start-end-task").html('Start Task');
        }
    } else{
            $("#start-end-task").css('display', 'none');
            $("#pause-resume-task").css('display', 'none');
    }

    if(uniq_u == "" || memberType == "pc" || memberType == "client"){
        $("#hire-task").css('display','');
        $("#duplicate-task").css('display','');
    }
    else{
        $("#hire-task").css('display','none');
        $("#duplicate-task").css('display','none');
    }

    if(currentTeam.inProgress() == true && currentTeam.flash_teams_json["paused"]==true && (uniq_u == "" )){
        $("#duplicate-task").css('display','');
    }

	if(currentTeam.inProgress() != true && (uniq_u == "" || memberType == "pc" || memberType == "client") ) {
		$("#edit-save-task").css('display', '')

        $("#edit-save-task").attr('onclick', 'editTaskOverview(true,'+groupNum+')');
		$("#edit-save-task").html('Edit');
	} //only the author, PC OR CLIENT (as of 8/21/2015) can edit tasks if the projec is in progress. The delayed, completed, and started tasks cannot be edited.
    else if(currentTeam.inProgress() == true && currentTeam.flash_teams_json["paused"]==true && (uniq_u == "" || memberType == "pc" || memberType == "client") && (eventObj.status != "started" && eventObj.status != "delayed" && eventObj.status != "completed")) {
            $("#edit-save-task").css('display', '');
            //$("#duplicate-task").css('display','');
            $("#edit-save-task").attr('onclick', 'editTaskOverview(true,'+groupNum+')');
            $("#edit-save-task").html('Edit');
    }
	else{
		$("#edit-save-task").css('display', 'none');
		$("#delete").css('display','none');
        //$("#duplicate-task").css('display','none');
	}
    currentTeam.logActivity("showTaskOverview(groupNum)",'Show Task Overview', currentTeam.flash_teams_json["events"][getEventJSONIndex(groupNum)]);
}

//logs when the user clicks the x on the top right of the task modal to hide it
function logHideTaskOverview(groupNum){
    currentTeam.logActivity("logHideTaskOverview(groupNum)",'Hide Task Overview', currentTeam.flash_teams_json["events"][getEventJSONIndex(groupNum)]);
}

function showShortTaskOverview(groupNum){
        var task_id = getEventJSONIndex(groupNum);
        var eventObj = currentTeam.flash_teams_json["events"][task_id];
        var title = eventObj["title"];

        //modal label
        var label = title;
        var taskOverviewContent = getTaskOverviewContent(groupNum);

        $('#task_modal_Label2').html(label);
        $("#modal-close-btn2").attr('onclick', 'logHideShortTaskOverview('+groupNum+')');

        //$("#modal-close-btn2").attr('onclick', 'logHideTaskOverview('+groupNum+')');

        $('#task-text2').html(taskOverviewContent);

        var modal_footer = '<button class="btn" data-dismiss="modal" aria-hidden="true" style="float: right" onclick="logHideShortTaskOverview(' + groupNum  + ')">Close</button>'
                            + '<a href=' + eventObj['gdrive'][1] +' class="btn btn-primary" id="gdrive-footer-btn" target="_blank" style="float: left" onclick="logShortTaskOverviewGDriveBtnClick(' + groupNum  + ')">Deliverables</a>';

        $('.task-modal-footer2').html(modal_footer);

        $('#task_modal2').modal('show');


        currentTeam.logActivity("showShortTaskOverview(groupNum)",'Show Short Task Overview', currentTeam.flash_teams_json["events"][getEventJSONIndex(groupNum)]);


}

function logShortTaskOverviewGDriveBtnClick(groupNum){
        currentTeam.logActivity("logShortTaskOverviewGDriveBtnClick(groupNum)",'Clicked on gDrive Button on Short Task Overview Modal', currentTeam.flash_teams_json["events"][getEventJSONIndex(groupNum)]);
}

function logTaskOverviewGDriveBtnClick(groupNum){
        currentTeam.logActivity("logTaskOverviewGDriveBtnClick(groupNum)",'Clicked on gDrive Button on Task Overview Modal', currentTeam.flash_teams_json["events"][getEventJSONIndex(groupNum)]);
}


//logs when the user clicks the x on the top right of the task modal to hide it
function logHideShortTaskOverview(groupNum){
    currentTeam.logActivity("logHideShortTaskOverview(groupNum)",'Hide Short Task Overview', currentTeam.flash_teams_json["events"][getEventJSONIndex(groupNum)]);
}



function editTaskOverview(popover,groupNum){
	currentTeam.logActivity("editTaskOverview(popover,groupNum)",'Edit Task Overview', currentTeam.flash_teams_json["events"][getEventJSONIndex(groupNum)]);
    var task_id = getEventJSONIndex(groupNum);
	var eventObj = currentTeam.flash_teams_json["events"][task_id];
	var title = eventObj["title"];

    var eventFormTitle = '';
    if(title != "New Event"){
        eventFormTitle = title;
    }

	if(popover==true){
		$('#task-edit-link').hide();

		//label
		label = '<input type ="text" name="eventName" id="eventName' + '" placeholder="'+title+'"' + '" value="'+eventFormTitle+'" >'
		$('#task_modal_Label').html(label);

        //content
        var taskOverviewForm = getTaskOverviewForm(groupNum);

		$('#task-text').html(taskOverviewForm);

		$("#edit-save-task").attr('onclick', 'saveTaskOverview('+groupNum+')');
		$("#edit-save-task").html('Save');

        // create the read only tags for inputs created by handoffs or collaborations
        // var int_inputs_tags = $('#int_inputs').tags({
        //     bootstrapVersion: "2",
        //     readOnly: true,
        //     readOnlyEmptyMessage: "No handoff or collaboration inputs from other tasks exist.",
        //     tagData: get_int_inputs_array(groupNum),
        //     tagClass: "btn-info",
        //     tagSize: "sm",
        // });

        var handoff_inputs_tags = $('#handoff_inputs').tags({
            bootstrapVersion: "2",
            readOnly: true,
            readOnlyEmptyMessage: "No handoff inputs from other tasks exist.",
            tagData: get_int_inputs_array(groupNum, "handoff"),
            tagClass: "btn-info",
            tagSize: "sm",
        });

        var collab_inputs_tags = $('#collab_inputs').tags({
            bootstrapVersion: "2",
            readOnly: true,
            readOnlyEmptyMessage: "No collaboration inputs from other tasks exist.",
            tagData: get_int_inputs_array(groupNum, "collab"),
            tagClass: "btn-info",
            tagSize: "sm",
        });

        $("#inputs").tagsinput();
        $("#outputs").tagsinput();

        //Adds the appropraiate documentation question field when
        $("#outputs").change(function() {
            tempText = {};
            for (i = 0; i < $(".oQs").length; i++){
                val = ($(".oQs")[i].id).substring(3);
                tempText[val] = ($(".oQs")[i].value).split("\n");
            }
            outputArray = ($("#outputs").val()).split(",");
            htmlString = "";
            for (i = 0; i < outputArray.length; i++){
                if (outputArray[i] != ""){
                    htmlString = htmlString + '<div><b>Questions about <i>' + outputArray[i] + ' </i></b><i>(Start a new line to create a new question)</i></br><textarea class="span12 oQs" style="width:475px" rows="5" placeholder="Add any questions here" id="num' + outputArray[i] + '">';
                    if (outputArray[i] in tempText){
                        for (j = 0; j < tempText[outputArray[i]].length; j++){
                            htmlString = htmlString + tempText[outputArray[i]][j] + '\n';
                        }
                    }
                    else{
                        htmlString = htmlString + "Please write a brief (1 sentence) description of this deliverable";
                    }
                    htmlString = htmlString + '</textarea></div>';
                }
            }
            document.getElementById("outputQForm").innerHTML = htmlString;
        });

	}
}

function getTaskOverviewForm(groupNum){
    var task_id = getEventJSONIndex(groupNum);
	var eventObj = currentTeam.flash_teams_json["events"][task_id];
	var totalMinutes = eventObj["duration"];
    var groupNum = eventObj["id"];
    var title = eventObj["title"];
    var startHr = eventObj["startHr"];
    var startMin = eventObj["startMin"];
    var notes = eventObj["notes"];
    var inputs = eventObj["inputs"];
    if(!inputs) inputs = "";
    //var int_inputs = get_int_inputs_array(groupNum).join(', ');
    var outputs = eventObj["outputs"];
    if(!outputs) outputs = "";
    var numHours = Math.floor(totalMinutes/60);
    var minutesLeft = totalMinutes%60;
    var dri_id = eventObj.dri;
    var PC_id = eventObj.pc;
    var questions = "";
    for (i = 0; i < eventObj["docQs"].length; i++){
        questions = questions + eventObj["docQs"][i][0] + "\n";
    }
    var outputQuestions = eventObj["outputQs"];
    /*'<form name="taskOverviewForm" id="taskOverviewForm" style="margin-bottom: 5px;">'
    					+'<textarea type="text"" id="descriptionInput" rows="6" placeholder="Task description ...">'+description+'</textarea>'
    					+ '<a onclick="showTaskOverview('+groupNum+')" style="font-weight: normal;">Cancel</a>'
    					+'</form>';*/

    var form ='<form name="taskOverviewForm" id="taskOverviewForm" style="margin-bottom: 5px;">'
        + '<div class="event-table-wrapper">'
        + '<div class="row-fluid">'
        + '<div class="span6">'
        + '<b>Event Start</b> <br>'
        + 'Hours : <input type="number" id="startHr" value="' + startHr
            + '" min="0" style="width:36px">         '
        + 'Minutes : <input type="number" id="startMin" value="' + startMin
            + '" min="0" step="15" max="45" style="width:36px"><br />'

        +'<br />'
        + '<b>Project Coordinator</b><br><select class="pcInput"'
            +' name="pcName" id="pcEvent"'
            + 'onchange="getPC('+groupNum + ')">'+ writePCMembers(groupNum,PC_id) +'</select>'

        + '</div> <div class="span6">'
        + '<b>Total Runtime </b> <br />'
        + 'Hours : <input type = "number" id="hours" value="'
            +numHours+'" min="0" style="width:36px"/>         '
        + 'Minutes : <input type = "number" id = "minutes" value="'+minutesLeft
            +'" style="width:36px" min="0" step="15" max="45"/> <br />'
        +'<br />'
        + '<b>Directly-Responsible Individual</b><br><select class="driInput"'
            +' name="driName" id="driEvent"'
			+ 'onchange="getDRI('+groupNum + ')">'+ writeDRIMembers(groupNum,dri_id) +'</select>'
        + '</div>'
        + '</div>'
        +'<br />'

        + '<div class="row-fluid">'
        + '<div class="span12">'
        + '<b>Members</b><br/> <div id="eventMemberList">'
        + writeEventMembers(eventObj)  +'</div>'
        +'<br />'
        + '<div><b>Description </br></b><textarea class="span12" style="width:475px" rows="5" placeholder="Description of the task..." id="notes">' + notes + '</textarea></div>'
        //+'<br />'
        + '<div style="margin-bottom: 15px;"><b>Inputs From Handoffs</b><br> <div id="handoff_inputs"></div><br /></div>'
        + '<div style="margin-bottom: 15px;"><b>Inputs From Collaborations</b><br> <div id="collab_inputs"></div><br /></div>'
        + '<div><b>Additional Inputs</b><br> <div><input type="text" value="' + inputs + '" placeholder="Add input" id="inputs" /></div>'
        + '<div><b>Deliverables</b> <div><input type="text" value="' + outputs + '" placeholder="Add deliverable" id="outputs" /></div>'
        + '<div><b>Task Documentation Questions </b><i>(Start a new line to create a new question)</i></br><textarea class="span12" style="width:475px" rows="5" placeholder="Add any General Questions here" id="questions">' + questions + '</textarea></div>'
        + '<div id="outputQForm">';
        for (var key in outputQuestions){
            form = form + '<div><b>Questions about <i>' + key + ' </i></b><i>(Start a new line to create a new question)</i></br><textarea class="span12 oQs" style="width:475px" rows="5" placeholder="Add any questions here" id="num' + key + '">';
            for (i = 0; i < outputQuestions[key].length; i++){
                form = form + outputQuestions[key][i][0] + '\n';
            }
            form = form + '</textarea></div>';
        }
        form = form + '</div>'
        + '<a onclick="showTaskOverview('+groupNum+')" style="font-weight: normal;">Cancel</a>'

        + '</div>'
        + '</div>'
        + '</div>'

        + '</form>';

    return form;

}


function getTaskOverviewContent(groupNum){
	var task_id = getEventJSONIndex(groupNum);
	var ev = currentTeam.flash_teams_json["events"][task_id];

	var hrs = Math.floor(ev.duration/60);
    var mins = ev.duration % 60;

    // if the minutes are < 10, you need to add a zero before
    if(mins < 10){
	    mins = '0' + mins;
    }

    var evStartHr = ev.startHr;
	var evStartMin = ev.startMin.toFixed(0);

	// if the minutes are < 10, you need to add a zero before
	if(evStartMin < 10){
	    evStartMin = '0' + evStartMin;
    }

	//var content = '<div class="row-fluid" >';

    var content = '<div class="row-fluid">';

                if(ev.status == "not_started"){
                    content += '<span class="span6"><b>Task Status: </b> not started  </span>';
                    content += '<span class="span6" style="text-align:right"><b>Task Duration: </b>' + formatModalTime(ev.duration) + '</span>';
                }
                else{
                    content += '<span class="span6"><b>Task Status: </b>' + ev.status +' </span>';
                    content += '<span class="span6" style="text-align:right">'
                            + '<b>Time Remaining: </b>' + formatModalTime(ev.timer) +' / ' + formatModalTime(ev.duration) + '</span>';
                }

        content += '</div>';

        content += '<hr/><div class="row-fluid"><em>30 minutes of this task are allocated for reading the requirements'
        +' and reviewing the previous materials. Click the start button when you are ready to review.</em>';

    content += '</div>';

		content += '<hr /><div class="row-fluid">';

			content += '<h4>The goal of this task is to: </h4>';

			if (ev.notes != ""){
				content += ev.notes;
			}
			else{
				content += "No task description has been provided yet."
			}

		content += '</div>';

        //content += '</div>';


	content += '<div class="row-fluid" >';

		if(ev.outputs) {
			//content += '<b>Deliverables:</b><br>';
			content +=  '<br /><h5>Specifically, you are expected to produce the following deliverables: </h5>';
			var outputs = ev.outputs.split(",");
			for(var i=0;i<outputs.length;i++){

				content += outputs[i];

				//content += outputs[i] + ': ';
				//content += 'insert description here';
				content += "<br />";
			}
		}

    content += '</div>';

    var handoff_inputs = events_immediately_before(groupNum);

    if(ev.inputs.length!=0) {
        handoff_inputs.push(parseInt(ev.id));
    }

    if(handoff_inputs.length!=0) {
        content += '<div class="row-fluid" >';
        content += '<hr /><h5>Review the following tasks and deliverables, which are important for your task: </h5>';
        for(var i=0; i<handoff_inputs.length; i++){
                input_ev_id = handoff_inputs[i];
                var input_ev = currentTeam.flash_teams_json["events"][getEventJSONIndex(input_ev_id)];
                content += '<p style="padding-top: 5px">';
                if(input_ev['outputs'].length ==0){
                    content+= '<b>prior task results</b>';

                }else{
                    content +='<b><a href=' + input_ev["gdrive"][1] + ' target="_blank" onclick="logHandoffInputClick(' + groupNum + ',' + input_ev_id + ')">'+ input_ev['outputs'].split(',').join(', ') +'</a></b>';

                }

                content += '<br /><span style="padding-left: 25px"><em>from: <a onclick=showShortTaskOverview(' + input_ev_id + ')>' + input_ev.title + '</a></em></span>';
                content += '</p>';
        }

        content +=  '</div>';
    }

     var collab_inputs = events_in_collaboration(groupNum);

    if(collab_inputs.length!=0) {
        content += '<div class="row-fluid" >';
        content += '<hr /><h5>As you work on your deliverables, you should collaborate with the team members working on the following tasks and deliverables: </h5>';
        for(var i=0; i<collab_inputs.length; i++){
                input_ev_id = collab_inputs[i];
                var input_ev = currentTeam.flash_teams_json["events"][getEventJSONIndex(input_ev_id)];
                content += '<p style="padding-top: 5px">';
                if(input_ev['outputs'].length ==0){
                    content+= '<b>collaboration</b>';

                }else{
                    content +='<b><a href=' + input_ev["gdrive"][1] + ' target="_blank" onclick="logCollabInputClick(' + groupNum + ',' + input_ev_id + ')">'+ input_ev['outputs'].split(',').join(', ') +'</a></b>';

                }

                content += '<br /><span style="padding-left: 25px"><em>with: <a onclick=showShortTaskOverview(' + input_ev_id + ')>' + input_ev.title + '</a></em></span>';

                content += '</p>';
        }

        content +=  '</div>';
    }


		content += "<hr/>";

	content += '<div class="row-fluid" >';

		content += '<b>Members assigned to this task: </b>';

		var num_members = ev.members.length;
	    if(num_members > 0){
	        //content += '<b>Members:</b><br>';
	        for (var j=0;j<num_members-1;j++){
	            var member = getMemberById(ev.members[j]);
	            content += member.role;
	            content += ', ';
	        }
	        var member = getMemberById(ev.members[num_members-1]);
	        content += member.role;
	        content += '<br/>';
	    }
	    else{
		    content += "No members have been assigned yet."
	    }

    if (ev.dri != "" && ev.dri != undefined){
        var dri_id = parseInt (ev.dri);
        var mem = null;

        for (var i = 0; i<currentTeam.flash_teams_json["members"].length; i++){

            if(currentTeam.flash_teams_json["members"][i].id == dri_id){
                mem = currentTeam.flash_teams_json["members"][i].role;
                break;
            }
        }

        if(mem && mem != undefined){
            content += '<div class=row-fluid>';
            content += '<b>Directly-Responsible Individual: </b>';
            content += mem;
            content += '</div>'
        }
    }
		  if (ev.pc != "" && ev.pc != undefined){
	        var pc_id = parseInt (ev.pc);
	        var mem = null;

	        for (var i = 0; i<currentTeam.flash_teams_json["members"].length; i++){

	            if(currentTeam.flash_teams_json["members"][i].id == pc_id){
	                mem = currentTeam.flash_teams_json["members"][i].role;
	                break;
	            }
	        }
          if(mem && mem != undefined){
            content += '<div class=row-fluid>'
            content += '<b>Project Coordinator: </b>';
            content += mem;
            content += "</div>"

        }
    }

	content += '</div>';

	content += "<hr/>";

	content += '<div class="row-fluid" >';

	//content += "<hr/>";
    content += "<h4>You will need to answer the following questions: <br /><br /></h4>";

    //Add output documentation questions to task modal
    for (var key in ev.outputQs){
        if (key != ""){
            content += "<b><i>" + key + "</i></b></br>";
            keyArray = ev.outputQs[key];
            for (i = 0; i < keyArray.length; i++){
                content += "<p><i>" + keyArray[i][0] + "</i></br>" + keyArray[i][1] + "</p><br />";
            }
            //content += "<br />";
        }
    }
    //content += "<hr/>";


    //Add general documentation questions to task modal
    if (ev.docQs.length > 0){
        docQs = ev.docQs;
        for (i = 0; i < docQs.length; i++){
            if (docQs[i][1] != null){
                content += "<b><i>" + docQs[i][0] + " </i></b>";
                content += "<p>" + docQs[i][1] + "</p><br />";
            }
        }
    }

    content += '</div>';

	return content;
}


function logHandoffInputClick(groupNum, inputEvId){
    //console.log('Task Modal Event groupNum: ' + groupNum + ' Id of input event clicked on: ' + inputEvId);
    currentTeam.logActivity("logHandoffClick(groupNum, inputEvId)",'Clicked on Input Link on Task Modal - Task Modal Event groupNum: ' + groupNum + ' Id of input event clicked on: ' + inputEvId, currentTeam.flash_teams_json["events"]);

}

function logCollabInputClick(groupNum, inputEvId){
    //console.log('Task Modal Event groupNum: ' + groupNum + ' Id of input event clicked on: ' + inputEvId);
    currentTeam.logActivity("logHandoffClick(groupNum, inputEvId)",'Clicked on Input Link on Task Modal - Task Modal Event groupNum: ' + groupNum + ' Id of input event clicked on: ' + inputEvId, currentTeam.flash_teams_json["events"]);

}

/* Returns a string with the time in the format of h:mm (if h<10) or hh:mm (if h>=10)
*  Returns a negative time string if the task is delayed
*  Param: time in minutes
*/
function formatModalTime(timeInMins){

    var time = timeInMins;
    var sign = (time / Math.abs(time) < 0) ? "-" : "";

    var hours = Math.floor(Math.abs(time) / 60);
    var minutes = Math.abs(time) % 60;

    if(minutes == 0){
        minutes = "00";
    }

    if(minutes > 0 && minutes < 10){
        minutes = "0" + minutes;
    }

    var timeStr = sign + hours + ":" + minutes;
    return timeStr;
}

function createOptionsButton(groupNum){

    var ev_index = getEventJSONIndex(groupNum);
    var ev_title = currentTeam.flash_teams_json["events"][ev_index].title;

    var optionsBtn = '<div class="btn-group dropup">'
                + '<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">'
                    + 'Options'
                    + '<span class="caret"></span>'
                + '</a>'
                + '<ul class="dropdown-menu">'
                    + '<li><a tabindex="-1" href="#" id="duplicate-task" onclick="duplicateEvent('+ groupNum +', true)">Duplicate</a></li>';
           if(currentTeam.flash_teams_json.folder != undefined){
                optionsBtn += '<li><a tabindex="-1" href="#" id="new-gdrive-proj-folder" '
                    + 'onclick="createTaskFolder(\'' + ev_title + ' - ' + groupNum + '\', ' + ev_index + ', \'' + currentTeam.flash_teams_json.folder[0] + '\')"'
                    + '>New GDrive Folder</a></li>';
            }

        optionsBtn += '</ul>'
                    + '</div>';

    return optionsBtn;
}

function saveTaskOverview(groupNum){
	var task_index = getEventJSONIndex(groupNum);
	var ev = currentTeam.flash_teams_json["events"][task_index];

    //Update title
    if($("#eventName").val() != "")
        ev.title = $("#eventName").val();

    if(ev.gdrive != ""){
        renameFolder(ev.gdrive[0], ev.title);
    }

    //Update start time if changed
    var startHour = $("#startHr").val();
    if (startHour != "") startHour = parseInt($("#startHr").val());
    else startHour = parseInt($("#startHr").attr("placeholder"));

    var startMin = $("#startMin").val();
    if (startMin != "") startMin = parseInt($("#startMin").val());
    else startMin = parseInt($("#startMin").attr("placeholder"));

    var totalStartMin = (startHour*60) + startMin;
    ev.startTime = totalStartMin;
    ev.startHr = startHour;
    ev.startMin = startMin;
    //SHOULD WE BE UPDATING EV.X HERE??

    // Save original duration (e.g., the tasks current duration in case it changes)
    // useful for updating the timer of in progress / paused tasks in edit mode (right now you can only edit paused tasks though)
    var originalDuration = ev.duration;

    // Save original remaining time (which is the time on the timer)
    // Used for recalculating the remaining time and timer for paused tasks edited when team is in progress (e.g., via edit mode)
    var originalRemainingTime = ev.latest_remaining_time;

    //Update duration if changed
    var newHours = $("#hours").val();
    if (newHours != "") newHours = parseInt($("#hours").val());
    else newHours = parseInt($("#hours").attr("placeholder"));

    var newMin = $("#minutes").val();
    if (newMin != "") newMin = parseInt($("#minutes").val());
    else newMin = parseInt($("#minutes").attr("placeholder"));
    newMin = Math.round(parseInt(newMin)/15) * 15;

    if (newHours == 0 && newMin == 15){    //cannot have events shorter than 30 minutes
        newMin = 30;
    }
    ev.duration = (newHours * 60) + newMin;

    // Updates the remaining time and timer for tasks that are paused and edited when team is in progress via edit mode
    if(currentTeam.inProgress() == true && currentTeam.flash_teams_json["paused"] == true && ev.status == "paused"){
        var newRemainingTime = (ev.duration - originalDuration) + originalRemainingTime;
        ev.timer = newRemainingTime;
        ev.latest_remaining_time = newRemainingTime;
    }

    //Update PC if changed
    var pcId = getPC(groupNum);
    ev.pc = pcId;

    //Update DRI if changed
    var driId = getDRI(groupNum);
        ev.dri = driId;

    //Update Members if changed
    ev.members = [];
    entryManager.eachMember(function(member, i) {
        var memberId = member.id;
        var checkbox = $("#event" + groupNum + "member" + i + "checkbox")[0];
        if (checkbox == undefined) return false;
        if (checkbox.checked == true) {
            ev.members.push(memberId); //Update JSON
        }
    });

    //Update description if changed
    var eventNotes = $("#notes").val();
    ev.notes = eventNotes;

    //Update inputs and outputs if changed
    ev.inputs = $('#inputs').val();
    ev.outputs = $('#outputs' ).val();


    //Update documentation questions if changed
	var genQs = [];
    qString = $("#questions").val().split("\n");
    for (i = 0; i < qString.length; i++){
        if (qString[i] != ""){
            genQs.push([qString[i],""]);
        }
    }
    ev.docQs = genQs;

    //Save output questions
    var outQs = {};
    outputVals = ($("#outputs").val()).split(",");
    for (i = 0; i < outputVals.length; i++){
        output = outputVals[i];
        if (output != ""){
            outQs[output] = [];
            questionArray = (document.getElementById("num" + outputVals[i]).value).split("\n");
            for (j = 0; j < questionArray.length; j++){
                if (questionArray[j] != ""){
                    outQs[output].push([questionArray[j],""]);
                }
            }
        }
    }
    ev.outputQs = outQs;

    //everytime a modal is saved all_inputs of all events on the timeline are updated
    update_all_inputs_string();

    currentTeam.flash_teams_json['local_update'] = new Date().getTime();
    drawEvent(ev);

    currentTeam.logActivity("saveTaskOverview(groupNum)",'Save Task Overview', currentTeam.flash_teams_json["events"][getEventJSONIndex(groupNum)]);

    updateStatus();

    $('#task_modal').modal('hide');
}


//this function updates all the inputs of all tasks based on previous tasks' outputs
function update_all_inputs_string(){
    var events = currentTeam.flash_teams_json["events"];
    var all_inputs_array=[];

    for (var i =0; i<events.length; i++){
        var all_inputs_string="";
        all_inputs_array = getAllInputs(events[i].id);

        for( var j=0; j<all_inputs_array.length; j++){
            if (j==0)
                all_inputs_string +=String(all_inputs_array[j][1]);
            else
                all_inputs_string +=', '+ String(all_inputs_array[j][1]);

            currentTeam.flash_teams_json["events"][i]["all_inputs"] = all_inputs_string;
        }

    }
}

//returns an array of inputs of the task including the current task inputs and the previous tasks' outputs.
// getAllInputs returns: [[task_id, input]]
function getAllInputs(groupNum){
   var task_id = getEventJSONIndex(groupNum);
   var ev = currentTeam.flash_teams_json["events"][task_id];

   var events_before_ids = events_immediately_before(groupNum);
   var collaboration_ids = events_in_collaboration(groupNum);
   var all_inputs=[];

   if(ev.inputs) {

        var inputs = ev.inputs.split(",");
        for(var i=0;i<inputs.length;i++){
            all_inputs.push([groupNum, inputs[i] ]);
        }
    }

    if(events_before_ids.length!=0){
        for(var i=0;i<events_before_ids.length;i++){

            var ev_before = currentTeam.flash_teams_json["events"][getEventJSONIndex(events_before_ids[i])];
            if(ev_before["outputs"] =="" || ev_before["outputs"] == undefined)
                continue;

            var outputs = ev_before["outputs"].split(",");

            for(var j=0;j<outputs.length;j++){
               all_inputs.push([ev_before.id , outputs[j] ])
            }
        }
    }

    if(collaboration_ids.length!=0){
        for(var i=0;i<collaboration_ids.length;i++){

            var ev_collab = currentTeam.flash_teams_json["events"][getEventJSONIndex(collaboration_ids[i])];
            if(ev_collab["outputs"] =="" || ev_collab["outputs"] == undefined)
                continue;

            var outputs = ev_collab["outputs"].split(",");

            for(var j=0;j<outputs.length;j++){
               all_inputs.push([ev_collab.id , outputs[j] ])
            }
        }
    }

    return all_inputs;
}


//this function returns all of a task's inputs that are only from interactions (e.g., not inputs added manually to a task)
function get_int_inputs_array(groupNum, type){
    //var events = currentTeam.flash_teams_json["events"];
    var int_inputs_array=[];

    var task_id = getEventJSONIndex(groupNum);
    var eventObj = currentTeam.flash_teams_json["events"][task_id];

    //var all_inputs_array = getAllInputs(groupNum);

    if(type == "handoff"){
        var all_inputs_array = getHandoffInputs(groupNum);
    }
    else if(type == "collab"){
        var all_inputs_array = getCollabInputs(groupNum);
    }

    for( var j=0; j<all_inputs_array.length; j++){

        if (all_inputs_array[j][0] != groupNum){
            int_inputs_array.push(all_inputs_array[j][1]);
        }
    }
    return int_inputs_array;
}


//returns an array of inputs of the task only from collaborations
// getHandoffInputs returns: [[task_id, input]]
function getCollabInputs(groupNum){
   var task_id = getEventJSONIndex(groupNum);
   var ev = currentTeam.flash_teams_json["events"][task_id];

   var collaboration_ids = events_in_collaboration(groupNum);
   var collab_inputs=[];


    if(collaboration_ids.length!=0){
        for(var i=0;i<collaboration_ids.length;i++){

            var ev_collab = currentTeam.flash_teams_json["events"][getEventJSONIndex(collaboration_ids[i])];
            if(ev_collab["outputs"] =="" || ev_collab["outputs"] == undefined)
                continue;

            var outputs = ev_collab["outputs"].split(",");

            for(var j=0;j<outputs.length;j++){
               collab_inputs.push([ev_collab.id , outputs[j] ])
            }
        }
    }

    return collab_inputs;
}

//returns an array of inputs of the task only from handoffs
// getHandoffInputs returns: [[task_id, input]]
// Note: this only returns inputs from handoffs but in some cases you also want to include additional task inputs that were added
function getHandoffInputs(groupNum){
   var task_id = getEventJSONIndex(groupNum);
   var ev = currentTeam.flash_teams_json["events"][task_id];

   var events_before_ids = events_immediately_before(groupNum);
   var handoff_inputs=[];

    if(events_before_ids.length!=0){
        for(var i=0;i<events_before_ids.length;i++){

            var ev_before = currentTeam.flash_teams_json["events"][getEventJSONIndex(events_before_ids[i])];
            if(ev_before["outputs"] =="" || ev_before["outputs"] == undefined)
                continue;

            var outputs = ev_before["outputs"].split(",");

            for(var j=0;j<outputs.length;j++){
               handoff_inputs.push([ev_before.id , outputs[j] ])
            }
        }
    }

    return handoff_inputs;
}

// resolves jquery stacking error in console
//http://stackoverflow.com/questions/13649459/twitter-bootstrap-multiple-modal-error
$.fn.modal.Constructor.prototype.enforceFocus = function () {};

//improves apperance of stacked task modals
//http://gurde.com/stacked-bootstrap-modals/
// $(document)
//   .on('show.bs.modal', '.modal', function(event) {
//     $(this).appendTo($('body'));
//   })
//   .on('shown.bs.modal', '.modal.in', function(event) {
//     setModalsAndBackdropsOrder();
//   })
//   .on('hidden.bs.modal', '.modal', function(event) {
//     setModalsAndBackdropsOrder();
//   });

// function setModalsAndBackdropsOrder() {
//   var modalZIndex = 1040;
//   $('.modal.in').each(function(index) {
//     var $modal = $(this);
//     modalZIndex++;
//     $modal.css('zIndex', modalZIndex);
//     $modal.next('.modal-backdrop.in').addClass('hidden').css('zIndex', modalZIndex - 1);
// });
//   $('.modal.in:visible:last').focus().next('.modal-backdrop.in').removeClass('hidden');
// }
