
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

// $("#workerEditTeamBtn").click(function(){

//     $('#request-edit-dropdown').val('-- SELECT REQUEST TYPE --');
//     $("#request-edit-dropdown").css('display','');
//     $("#requestEditSubmitBtn").css('display', '');
//     $("#request-edit-modal-cancel").html("Cancel");

//     var content = '<p>Please select which type of change you would like to make.</p>';
//     $('#request-edit-form-content').html(content);

//     $("#requestEditSubmitBtn").prop("disabled", true);

//     $('#workerRequestEdit').modal('show');

// });

// $("#request-change-task-not-ready").click(function(){

//     $('#request-edit-dropdown').val('-- SELECT REQUEST TYPE --');
//     $("#request-edit-dropdown").css('display','');
//     $("#requestEditSubmitBtn").css('display', '');
//     $("#request-edit-modal-cancel").html("Cancel");

//     var content = '<p>Please select which type of change you would like to make.</p>';
//     $('#request-edit-form-content').html(content);

//     $("#requestEditSubmitBtn").prop("disabled", true);

//     $('#workerRequestEdit').modal('show');

// });

$("#workerEditTeamBtn").click(function(){
    updateRequestChangeModal('-- SELECT REQUEST TYPE --');
});

$("#request-change-task-not-ready").click(function(){
    updateRequestChangeModal('Task Not Ready');
});

$("#request-change-edit-task").click(function(){
    updateRequestChangeModal('Edit an Event');
});

$("#request-change-more-time").click(function(){
    updateRequestChangeModal('Need More Time');
});


$("#requestEditSubmitBtn").click(function(){

    var selected = $('#request-edit-dropdown').val();

    var form_content = '<b>Type of Change: </b>' + selected + '<br /><br />';

    if (selected == 'Add an Event'){

        form_content += '<b>Event Name: </b>' + $("#event-request-name").val() 
                + '<br />'
                + '<b>Duration: </b>' + $("#event-request-hours").val() + ' Hours  ' 
                + $("#event-request-minutes").val() + ' Minutes <br />' 
                + '<b>Description: </b>' + $("#event-request-description").val();
    }else if (selected == 'Edit an Event'){
        console.log('edit');

        form_content += '<b>Event Name: </b>' + $("#event-request-name").val() 
                + '<br />'
                + '<b>Description of changes to event: </b>' + $("#event-request-description").val();
    }else if (selected == 'Task Not Ready'){
        console.log('edit');

        form_content += '<b>Event Name: </b>' + $("#event-request-name").val() 
                + '<br />'
                + '<b>Description of why task is not ready and changes needed: </b>' + $("#event-request-description").val();
    }else if (selected == 'Need More Time'){
        console.log('edit');

        form_content += '<b>Event Name: </b>' + $("#event-request-name").val() 
                + '<br />'
                + '<b>Description of how much more time you need and why: </b>' + $("#event-request-description").val();
    }
    else{
        console.log('other');
        form_content += '<b>Description of changes you would like to make to the team: </b>' + $('#request-edit-form-text').val();
    }


    var edit_request_text = form_content;

    var url = '/flash_teams/' + flash_team_id + '/send_edit_team_request';

    var request = $.ajax({
        url: url,
        type: "post",
        data: {editRequestText : edit_request_text }
        }); //end var request
       
        request.done(function( data ) {
            $("#request-edit-dropdown").css('display','none');
            $('#request-edit-form-content').html('Your request was sent to the project owner for review. <br /><br />' + edit_request_text );
            //$("#requestEditText").html('Your request was sent to the project owner for review. <br />' + edit_request_text );
            $("#requestEditSubmitBtn").css('display', 'none');
            $("#request-edit-modal-cancel").html("Close");

            // request_text = data["request_text"];
            // outcome = data["outcome"];
            // $("#requestEditText").html('request_text: ' + request_text + '<br /> outcome: ' + outcome);

            //console.log('request form sent');
            //$('#workerRequestEdit').modal('hide');
        }); //end 

});

$('#request-edit-dropdown').change(function(){

    var selected = $('#request-edit-dropdown').val();

    updateRequestChangeModal(selected);
});

function updateRequestChangeModal(selected){

    var content; 

    $('#request-edit-dropdown').val(selected);

    if (selected == '-- SELECT REQUEST TYPE --'){
        content = '<p>Please select which type of change you would like to make.</p>';
        $("#requestEditSubmitBtn").prop("disabled", true);
        
    }
    else if (selected == 'Add an Event'){
        content = 'Event Name: <input type="text" class="input-xlarge" id="event-request-name" placeholder="Event Name"> <br />'
                + 'Duration: <input type = "number" id="event-request-hours" value="" min="0" placeholder="00" style="margin-left: 10px; width:36px;"/> Hours' 
                + '<input type = "number" id = "event-request-minutes" value="" placeholder="00" style=" margin-left: 15px; width:36px" min="0" step="15" max="45"/> Minutes <br />' 
                + 'Description: <br /> <textarea class="input-block-level" rows="5" placeholder="Description of event" id="event-request-description"></textarea>';
        
        $("#requestEditSubmitBtn").prop("disabled", false);
    }else if (selected == 'Task Not Ready'){
        content = 'Event Name: <input type="text" class="input-xlarge" id="event-request-name" placeholder="Name of Event to Change"> <br />'
                + 'Description of why task is not ready and changes needed: <br /> <textarea class="input-block-level" rows="5" placeholder="Describe why the task is not ready to be started and what changes need to be made to the task or workflow" id="event-request-description"></textarea>';
        
        $("#requestEditSubmitBtn").prop("disabled", false);
    }else if (selected == 'Need More Time'){
        content = 'Event Name: <input type="text" class="input-xlarge" id="event-request-name" placeholder="Name of Event to Change"> <br />'
                + 'Description of how much more time you need and why: <br /> <textarea class="input-block-level" rows="5" placeholder="Describe how much more time you need to complete the task and why" id="event-request-description"></textarea>';
        
        $("#requestEditSubmitBtn").prop("disabled", false);
    }
    else if (selected == 'Edit an Event'){
        content = 'Event Name: <input type="text" class="input-xlarge" id="event-request-name" placeholder="Name of Event to Change"> <br />'
                + 'Description of changes to event: <br /> <textarea class="input-block-level" rows="5" placeholder="Describe what changes you would like to make to the event" id="event-request-description"></textarea>';
        
        $("#requestEditSubmitBtn").prop("disabled", false);
    }
    else{
        content = '<p>Description of changes you would like to make to the team:</p>'
                +  '<textarea class="span6" rows="5" id="request-edit-form-text" placeholder="Describe what changes you would like to make to the team"></textarea>';
        
        $("#requestEditSubmitBtn").prop("disabled", false);
    }

    $('#request-edit-form-content').html(content);

    $("#request-edit-dropdown").css('display','');
    $("#requestEditSubmitBtn").css('display', '');
    $("#request-edit-modal-cancel").html("Cancel");
    $('#workerRequestEdit').modal('show');
}

