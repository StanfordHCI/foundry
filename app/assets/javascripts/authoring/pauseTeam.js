
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

    updateRequestChangeModal('');
});

$("#request-change-task-not-ready").click(function(){
    logActivity("$('#request-change-task-not-ready').click(function()","Clicked 'Task is Not Ready to Start' link in sidebar", new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);

    updateRequestChangeModal('taskNotReady');
});

$("#request-change-edit-task").click(function(){
    logActivity("$('#request-change-edit-task').click(function()","Clicked 'I want to edit the task' link in sidebar", new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);

    updateRequestChangeModal('taskEdit');
});

$("#request-change-more-time").click(function(){
    logActivity("$('#request-change-more-time').click(function()","Clicked 'I need more time' link in sidebar", new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);

    updateRequestChangeModal('needMoreTime');
});


$("#requestEditSubmitBtn").click(function(){

    var selected = $('#request-edit-dropdown').val();
    var title =  $('#request-edit-dropdown option:selected').text();

    var form_content = '<b>Type of Change: </b>' + title;
    form_content += '<br /> <em>Name of Requester:</em> ' + chat_name; 
    form_content += '<br /> <em>Role of Requester:</em> ' + chat_role; 
    form_content += '<br /><br />';

    if (selected == 'taskAutoHire'){

        form_content += '<b>Task Name: </b>' + $("#event-request-name").val() 
                + '<br />'
                + '<b>Duration: </b>' + $("#event-request-hours").val() + ' Hours  ' 
                + $("#event-request-minutes").val() + ' Minutes <br />' 
                + '<b>Description: </b>' + $("#event-request-description").val();
    }else if (selected == 'taskWarmHire'){
        form_content += '<b>Task Name: </b>' + $("#event-request-name").val() 
                + '<br />'
                + '<b>Duration: </b>' + $("#event-request-hours").val() + ' Hours  ' 
                + $("#event-request-minutes").val() + ' Minutes <br />' 
                + '<b>Description: </b>' + $("#event-request-description").val()
                + '<br /><b>Name of panel member that you would like to hire: </b>' + $("#panel-member-name").val()
                + '<br /><b>Active Time spent on deciding on panel member (for our experimental logs): </b>' + $("#time-spent-deciding").val();
    }else if (selected == 'taskEdit'){
        form_content += '<b>Task Name: </b>' + $("#event-request-name").val() 
                + '<br />'
                + '<b>Description of changes to task: </b>' + $("#event-request-description").val();
    }else if (selected == 'taskRedo'){
        form_content = '<b>Task Name: </b>' + $("#event-request-name").val() + '<br />'
                + '<b>Description of what is wrong with this deliverable: </b>' + $("#event-request-description").val() + '<br />'
                + '<b>Would you like to drop this worker from the panel? </b>' + $("#event-request-drop-worker-panel").val() + '<br />'
                + '<b>Who would you like to redo this task, the same worker or a new worker? If a new worker is desired, would you like to warm hire or automatically hire this new worker? </b>' + $("#event-request-worker-selection").val();
        disabled = false; 
    }else if (selected == 'taskNotReady'){
        form_content += '<b>Task Name: </b>' + $("#event-request-name").val() 
                + '<br />'
                + '<b>Description of why task is not ready and the requested changes: </b>' + $("#event-request-description").val();
    }else if (selected == 'needMoreTime'){
        form_content += '<b>Task Name: </b>' + $("#event-request-name").val() 
                + '<br />'
                + '<b>Description of how much more time you need and why: </b>' + $("#event-request-description").val();
    }else if (selected == 'moduleAdd'){
        form_content = '<b>Module Name: </b>' + $("#event-request-name").val() + '<br />'
                + '<b>Due Date: </b>' + $("#event-request-module-deadline").val() + '<br />' 
                + '<b>Number of workers required for module: </b>' + $("#event-request-num-workers").val() + '<br />' 
                + '<b>Description of module: </b>' +  $("#event-request-description").val();
        disabled = false;
    }else if (selected == 'moduleEdit'){
        form_content = '<b>Module Name: </b>' + $("#event-request-name").val() + '<br />'
                + '<b>Description of changes to task: </b>' + $("#event-request-description").val();
        disabled = false;
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
            $("#request-edit-help-block").css('display','none');
            $("#request-edit-dropdown").css('display','none');
            $('#request-edit-form-content').html('Your request was sent to the project owner for review. <br /><br />' + edit_request_text );
            $("#requestEditSubmitBtn").css('display', 'none');
            $("#request-edit-modal-cancel").html("Close");
        }); //end ajax call

    postToSlack({ title: selected}, "requested a change");
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

    if (selected == ''){
        content = '<p>Please select which type of change you would like to make.</p>';
        disabled = true;        
    }else if (selected == 'taskAutoHire'){
        content = 'Task Name: <input type="text" class="request-change-input input-xlarge" id="event-request-name" value="" placeholder="Task Name"> <br />'
                + 'Duration: <input type="number" class="request-change-input" id="event-request-hours" value="" min="0" placeholder="00" style="margin-left: 10px; width:36px;"/> Hours' 
                + '<input type = "number" class="request-change-input" id="event-request-minutes" value="" placeholder="00" style=" margin-left: 15px; width:36px" min="0" step="15" max="45"/> Minutes <br />' 
                + 'Description of task: <br /> <textarea class="request-change-input input-block-level" rows="5" value="" placeholder="Description of task" id="event-request-description"></textarea>';
        disabled = false;
    }else if (selected == 'taskWarmHire'){
        var panelsButtonContent = '<br />'
        if(current_user == "Author"){panelsButtonContent = '<br /> <a href="/workers/index" target="_blank" class="btn btn-default">View Panels</a> <br /><br />'}
        content = 'Task Name: <input type="text" class="request-change-input input-xlarge" id="event-request-name" value="" placeholder="Task Name"> <br />'
                + 'Duration: <input type="number" class="request-change-input" id="event-request-hours" value="" min="0" placeholder="00" style="margin-left: 10px; width:36px;"/> Hours' 
                + '<input type = "number" class="request-change-input" id="event-request-minutes" value="" placeholder="00" style=" margin-left: 15px; width:36px" min="0" step="15" max="45"/> Minutes <br />' 
                + 'Description of task: <br /> <textarea class="request-change-input input-block-level" rows="5" value="" placeholder="Description of task" id="event-request-description"></textarea>'
                + panelsButtonContent
                + 'Name of panel member: <input type = "text" class="request-change-input input-block-level" id="panel-member-name" value="" placeholder="Name of panel member that you would like to hire."/><br />'
                + 'Time spent on deciding: <input type = "text" class="request-change-input input-block-level" id="time-spent-deciding" value="" placeholder="Active time spent on deciding on panel member (for our experimental logs)."/><br />';
        disabled = false;
    }else if (selected == 'taskNotReady'){
        content = 'Task Name: <input type="text" class="request-change-input input-xlarge" id="event-request-name" value="" placeholder="Name of Task to Change"> <br />'
                + 'Description of why task is not ready and the requested changes: <br /> <textarea class="request-change-input input-block-level" rows="5" value="" placeholder="Describe why the task is not ready to be started and what changes need to be made to the task or workflow" id="event-request-description"></textarea>';
        
        disabled = false; 
    }else if (selected == 'taskRedo'){
        content = 'Task Name: <input type="text" class="request-change-input input-xlarge" id="event-request-name" value="" placeholder="Name of Task to Change"> <br />'
                + 'Description of what is wrong with this deliverable: <br /> <textarea class="request-change-input input-block-level" rows="5" value="" placeholder="Describe what is wrong with this deliverable and why the task needs to be redone" id="event-request-description"></textarea>'
                + 'Would you like to drop this worker from the panel? <br /> <textarea class="request-change-input input-block-level" rows="2" value="" placeholder="Please state whether you would like to drop the worker who completed this task from the panel" id="event-request-drop-worker-panel"></textarea>'
                + 'Who would you like to redo this task, the same worker or a new worker? If a new worker is desired, would you like to warm hire or automatically hire this new worker?<br /> <textarea class="request-change-input input-block-level" rows="3" value="" placeholder="Describe who should complete this task (same worker or new one) and how new workers (if chosen) should be hired" id="event-request-worker-selection"></textarea>';
        
        disabled = false; 
    }else if (selected == 'needMoreTime'){ //THIS OPTION IS CURRENTLY COMMENTED OUT IN DROPDOWN
        content = 'Task Name: <input type="text" class="request-change-input input-xlarge" id="event-request-name" value="" placeholder="Name of Task to Change"> <br />'
                + 'Description of how much more time you need and why: <br /> <textarea class="request-change-input input-block-level" rows="5" value="" placeholder="Describe how much more time you need to complete the task and why" id="event-request-description"></textarea>';
        disabled = false;
    }else if (selected == 'taskEdit'){
        content = 'Task Name: <input type="text" class="request-change-input input-xlarge" id="event-request-name" value="" placeholder="Name of Task to Change"> <br />'
                + 'Description of changes to task: <br /> <textarea class="request-change-input input-block-level" rows="5" value="" placeholder="Describe what changes you would like to make to the task" id="event-request-description"></textarea>';
        disabled = false;
    }else if (selected == 'moduleAdd'){
        content = 'Module Name: <input type="text" class="request-change-input input-xlarge" id="event-request-name" value="" placeholder="Module Name"> <br />'
                + 'Due Date: <input type="text" class="request-change-input" id="event-request-module-deadline" value="" placeholder="Date to be completed" /> <br />' 
                + 'Number of workers required for module: <input type="number" class="request-change-input" id="event-request-num-workers" value="" min="0" placeholder="00" style="width: 36px"/> workers <br />' 
                + 'Description of module: <br /> <textarea class="request-change-input input-block-level" rows="5" value="" placeholder="Description of module" id="event-request-description"></textarea>';
        disabled = false;
    }else if (selected == 'moduleEdit'){
        content = 'Module Name: <input type="text" class="request-change-input input-xlarge" id="event-request-name" value="" placeholder="Name of Module to Change"> <br />'
                + 'Description of changes to task: <br /> <textarea class="request-change-input input-block-level" rows="5" value="" placeholder="Describe what changes you would like to make to the module" id="event-request-description"></textarea>';
        disabled = false;
    }
    else{
        content = '<p>Description of changes you would like to make to the team:</p>'
                +  '<textarea class="request-change-input input-block-level" rows="5" id="request-edit-form-text" value="" placeholder="Describe what changes you would like to make to the team"></textarea>';
        disabled = false;
    }

    $("#requestEditSubmitBtn").prop("disabled", disabled);
    $('#request-edit-form-content').html(content);

    $("#request-edit-help-block").css('display','');
    $("#request-edit-dropdown").css('display','');
    $("#requestEditSubmitBtn").css('display', '');
    $("#request-edit-modal-cancel").html("Cancel");
    $('#workerRequestEdit').modal('show');
}




