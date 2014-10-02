
function showTaskOverview(groupNum){

	var task_id = getEventJSONIndex(groupNum);
	var description = flashTeamsJSON["events"][task_id].description;
	
	if(description === undefined){
		description = "No description has been added yet.";
	}
	
	//uniq_u is null for author, we use this to decide whether to show the edit link next to project overview
	var uniq_u=getParameterByName('uniq');
		
	if(uniq_u == "" || memberType == "pc" || memberType == "client") {
		$('#taskOverviewEditLink').show();
		$("#taskOverviewEditLink").html('<a onclick="editTaskOverview(false,'+groupNum+')" style="font-weight: normal;">Edit</a>');
	}
	
	var taskOverviewContent = '<div id="task-description-text"><p>' + description + '</p></div>';	
	
	$('#taskOverview').html(taskOverviewContent);
	
	//modal content
	$('#task-text').html(taskOverviewContent);

	//only allow authors to edit project overview
	if(uniq_u == "" || memberType == "pc" || memberType == "client") {
		$("#edit-save-task").css('display', '');
		$("#edit-save-task").attr('onclick', 'editTaskOverview(true,'+groupNum+')');
		$("#edit-save-task").html('Edit');


	}
	else{
		$("#edit-save-task").css('display', 'none');
		$("#hire-task").css('display','none');
	}
}

function editTaskOverview(popover,groupNum){

	var task_id =getEventJSONIndex(groupNum);
	var description = flashTeamsJSON["events"][task_id].description;
	
	if(description === undefined){
		description = "";
	}
	
	if(popover==true){
		$('#task-edit-link').hide();
		
		var taskOverviewForm = '<form name="taskOverviewForm" id="taskOverviewForm" style="margin-bottom: 5px;">'
					+'<textarea type="text"" id="descriptionInput" rows="6" placeholder="Task description ...">'+description+'</textarea>'
					+ '<a onclick="showTaskOverview('+groupNum+')" style="font-weight: normal;">Cancel</a>'
					+'</form>';
		$('#task-text').html(taskOverviewForm);
		
		$("#edit-save-task").attr('onclick', 'saveTaskOverview('+groupNum+')');
		$("#edit-save-task").html('Save');	
	}
	
	else{
		$('#taskOverviewEditLink').hide();
	
		var taskOverviewForm = '<form name="taskOverviewForm" id="taskOverviewForm" style="margin-bottom: 5px;">'
					+'<textarea type="text"" id="descriptionInput" rows="6" placeholder="Task description ...">'+description+'</textarea>'
					+ '<a onclick="showTaskOverview('+groupNum+')" style="font-weight: normal;">Cancel</a>'
					+ '<button class="btn btn-success" type="button" onclick="saveTaskOverview('+groupNum+')" style="float: right;">Save</button>'
					+'</form>';
			
		$('#taskOverview').html(taskOverviewForm);
	}
				
}


function saveTaskOverview(groupNum){
	var task_id = getEventJSONIndex(groupNum); 
	// retrieve project overview from form
    var description_input = $("#descriptionInput").val();
    
    		if (description_input === "") {
        		description_input =  "No task description has been added yet.";
				//alert("Please enter a project overview.");
				//return;
		}
	 
    flashTeamsJSON["events"][task_id].description =description_input;
    
    console.log("saved task description: " +   flashTeamsJSON["events"][task_id].description);
    
    updateStatus();
    
    showTaskOverview(groupNum);
}
