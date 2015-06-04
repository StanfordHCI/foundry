
$("#flashTeamPauseBtn").click(function(){
    
 	var bodyText = document.getElementById("confirmActionText");
    //updateStatus();
    bodyText.innerHTML = "Are you sure you want to edit the team?";
    
    var confirmStartTeamBtn = document.getElementById("confirmButton");
    confirmStartTeamBtn.innerHTML = "Edit";
    
    $("#confirmButton").attr("class","btn btn-success");
    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "Edit Team?";
    $('#confirmAction').modal('show');

    document.getElementById("confirmButton").onclick=function(){pauseFlashTeam()};    


});

function pauseFlashTeam(){
	$('#confirmAction').modal('hide');

	$("#flashTeamPauseBtn").css('display', 'none');
    $("#flashTeamResumeBtn").css('display', '');
 
	flashTeamsJSON["paused"]=true;

    logActivity("pauseFlashTeam() - Before Update Status",'Edit Team - Before Update Status', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
	updateStatus();

    //draw events in editable mode (show collaboration and handoff buttons, show drag handles etc.)
    enableTeamEditing();
    //drawEvents(true);
    logActivity("pauseFlashTeam() - After Update Status",'Edit Team - After Update Status', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);

}


$("#flashTeamResumeBtn").click(function(){
    
 	var bodyText = document.getElementById("confirmActionText");
    //updateStatus();
    bodyText.innerHTML = "Are you sure you want to save the changes?";
    
    var confirmStartTeamBtn = document.getElementById("confirmButton");
    confirmStartTeamBtn.innerHTML = "Save";
    
    $("#confirmButton").attr("class","btn btn-success");
    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "Save Team?";
    $('#confirmAction').modal('show');

    document.getElementById("confirmButton").onclick=function(){resumeFlashTeam()};    


});

function resumeFlashTeam(){
	$('#confirmAction').modal('hide');

	$("#flashTeamPauseBtn").css('display', '');
    $("#flashTeamResumeBtn").css('display', 'none');
 
	flashTeamsJSON["paused"]=false;

    logActivity("resumeFlashTeam() - Before Update Status",'Save Edited Team - Before Update Status', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
	updateStatus();
	
    //Hide handoff and collaboration buttons on the events.
    //drawEvents(false);
    disableTeamEditing();

    logActivity("resumeFlashTeam() - After Update Status",'Save Edited Team - After Update Status', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
}

$("#workerEditTeamBtn").click(function(){
    logActivity("$('#workerEditTeamBtn').click(function()",'Clicked Request Change to Team Button', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);

    updateRequestChangeModal('-- SELECT REQUEST TYPE --');
});

$("#request-change-task-not-ready").click(function(){
    logActivity("$('#request-change-task-not-ready').click(function()","Clicked 'Task is Not Ready to Start' link in sidebar", new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);

    updateRequestChangeModal('Task Not Ready');
});

$("#request-change-edit-task").click(function(){
    logActivity("$('#request-change-edit-task').click(function()","Clicked 'I want to edit the task' link in sidebar", new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);

    updateRequestChangeModal('Edit a Task');
});

$("#request-change-more-time").click(function(){
    logActivity("$('#request-change-more-time').click(function()","Clicked 'I need more time' link in sidebar", new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);

    updateRequestChangeModal('Need More Time');
});


$("#requestEditSubmitBtn").click(function(){

    var selected = $('#request-edit-dropdown').val();

    var form_content = '<b>Type of Change: </b>' + selected;
    form_content += '<br /> <em>Name of Requester:</em> ' + chat_name; 
    form_content += '<br /> <em>Role of Requester:</em> ' + chat_role; 
    form_content += '<br /><br />';

    if (selected == 'Add a Task'){

        form_content += '<b>Task Name: </b>' + $("#event-request-name").val() 
                + '<br />'
                + '<b>Duration: </b>' + $("#event-request-hours").val() + ' Hours  ' 
                + $("#event-request-minutes").val() + ' Minutes <br />' 
                + '<b>Description: </b>' + $("#event-request-description").val();
    }else if (selected == 'Edit a Task'){
        form_content += '<b>Task Name: </b>' + $("#event-request-name").val() 
                + '<br />'
                + '<b>Description of changes to task: </b>' + $("#event-request-description").val();
    }else if (selected == 'Task Not Ready'){
        form_content += '<b>Task Name: </b>' + $("#event-request-name").val() 
                + '<br />'
                + '<b>Description of why task is not ready and changes needed: </b>' + $("#event-request-description").val();
    }else if (selected == 'Need More Time'){
        form_content += '<b>Task Name: </b>' + $("#event-request-name").val() 
                + '<br />'
                + '<b>Description of how much more time you need and why: </b>' + $("#event-request-description").val();
    }
    else{
        form_content += '<b>Description of changes you would like to make to the team: </b>' + $('#request-edit-form-text').val();
    }

    var edit_request_text = form_content;

    logActivity("$('#requestEditSubmitBtn').click(function()",'Clicked Submit Button to Submit Request to Change Team - Type of Change: ' + selected, new Date().getTime(), current_user, chat_name, team_id, form_content);


    var url = '/flash_teams/' + flash_team_id + '/send_edit_team_request';

    var request = $.ajax({
        url: url,
        type: "post",
        data: {editRequestText : edit_request_text }
        }); //end var request
       
        request.done(function( data ) {
            $("#request-edit-dropdown").css('display','none');
            $('#request-edit-form-content').html('Your request was sent to the project owner for review. <br /><br />' + edit_request_text );
            $("#requestEditSubmitBtn").css('display', 'none');
            $("#request-edit-modal-cancel").html("Close");
        }); //end ajax call
});

$('#request-edit-dropdown').change(function(){

    var selected = $('#request-edit-dropdown').val();

    updateRequestChangeModal(selected);

    logActivity("$('#request-edit-dropdown').click(function()",'Selected the following type of change to request from dropdown: ' + selected, new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);

});

$(".request-edit-modal-cancel").click(function(){
    logActivity("$('#request-edit-modal-cancel').click(function()",'Closed the Request Change Modal', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
});


function updateRequestChangeModal(selected){

    var content; 
    var disabled;

    $('#request-edit-dropdown').val(selected);

    if (selected == '-- SELECT REQUEST TYPE --'){
        content = '<p>Please select which type of change you would like to make.</p>';
        disabled = true;        
    }else if (selected == 'Add a Task'){
        content = 'Task Name: <input type="text" class="request-change-input input-xlarge" id="event-request-name" value="" placeholder="Task Name"> <br />'
                + 'Duration: <input type="number" class="request-change-input" id="event-request-hours" value="" min="0" placeholder="00" style="margin-left: 10px; width:36px;"/> Hours' 
                + '<input type = "number" class="request-change-input" id="event-request-minutes" value="" placeholder="00" style=" margin-left: 15px; width:36px" min="0" step="15" max="45"/> Minutes <br />' 
                + 'Description: <br /> <textarea class="request-change-input input-block-level" rows="5" value="" placeholder="Description of task" id="event-request-description"></textarea>';
        disabled = false;
    }else if (selected == 'Task Not Ready'){
        content = 'Task Name: <input type="text" class="request-change-input input-xlarge" id="event-request-name" value="" placeholder="Name of Task to Change"> <br />'
                + 'Description of why task is not ready and changes needed: <br /> <textarea class="request-change-input input-block-level" rows="5" value="" placeholder="Describe why the task is not ready to be started and what changes need to be made to the task or workflow" id="event-request-description"></textarea>';
        
        disabled = false; 
    }else if (selected == 'Need More Time'){
        content = 'Task Name: <input type="text" class="request-change-input input-xlarge" id="event-request-name" value="" placeholder="Name of Task to Change"> <br />'
                + 'Description of how much more time you need and why: <br /> <textarea class="request-change-input input-block-level" rows="5" value="" placeholder="Describe how much more time you need to complete the task and why" id="event-request-description"></textarea>';
        disabled = false;
    }
    else if (selected == 'Edit an Event'){
        content = 'Event Name: <input type="text" class="request-change-input input-xlarge" id="event-request-name" value="" placeholder="Name of Event to Change"> <br />'
                + 'Description of changes to task: <br /> <textarea class="request-change-input input-block-level" rows="5" value="" placeholder="Describe what changes you would like to make to the task" id="event-request-description"></textarea>';
        disabled = false;
    }
    else{
        content = '<p>Description of changes you would like to make to the team:</p>'
                +  '<textarea class="request-change-input input-block-level" rows="5" id="request-edit-form-text" value="" placeholder="Describe what changes you would like to make to the team"></textarea>';
        disabled = false;
    }

    $("#requestEditSubmitBtn").prop("disabled", disabled);
    $('#request-edit-form-content').html(content);

    $("#request-edit-dropdown").css('display','');
    $("#requestEditSubmitBtn").css('display', '');
    $("#request-edit-modal-cancel").html("Cancel");
    $('#workerRequestEdit').modal('show');
}




