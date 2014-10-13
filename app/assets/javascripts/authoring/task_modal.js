function showTaskOverview(groupNum){

	var task_id = getEventJSONIndex(groupNum);
	var eventObj = flashTeamsJSON["events"][task_id];
	var description = eventObj.description;
	var title = eventObj["title"];
    var startHr = eventObj["startHr"];
    var startMin = eventObj["startMin"];
    //var notes = eventObj["notes"];
    var inputs = eventObj["inputs"];
    if(!inputs) inputs = "";
    var outputs = eventObj["outputs"];
    if(!outputs) outputs = "";
    var totalMinutes = eventObj["duration"];
    var numHours = Math.floor(totalMinutes/60);
    var dri_id = eventObj.dri;
	
	if(description === undefined){
		description = "No description has been added yet.";
	}
	
	//uniq_u is null for author, we use this to decide whether to show the edit link next to project overview
	var uniq_u=getParameterByName('uniq');
		
	if(uniq_u == "" || memberType == "pc" || memberType == "client") {
		$('#taskOverviewEditLink').show();
		$("#taskOverviewEditLink").html('<a onclick="editTaskOverview(false,'+groupNum+')" style="font-weight: normal;">Edit</a>');
	}
	
	//modal label
	var label = title;
	$('#task_modal_Label').html(label);

	//modal content
	var taskOverviewContent = '<div id="task-description-text"><p>' + description + '</p></div>';	
	$('#taskOverview').html(taskOverviewContent);
	$('#task-text').html(taskOverviewContent);

	

	
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

	var task_id = getEventJSONIndex(groupNum);
	var eventObj = flashTeamsJSON["events"][task_id];
	var description = eventObj.description;
	var title = eventObj["title"];
    var startHr = eventObj["startHr"];
    var startMin = eventObj["startMin"];
    //var notes = eventObj["notes"];
    var inputs = eventObj["inputs"];
    if(!inputs) inputs = "";
    var outputs = eventObj["outputs"];
    if(!outputs) outputs = "";
    var totalMinutes = eventObj["duration"];
    var numHours = Math.floor(totalMinutes/60);
    var dri_id = eventObj.dri;

	if(description === undefined){
		description = "";
	}
	
	if(popover==true){
		$('#task-edit-link').hide();
		
		//label
		label = '<input type ="text" name="eventName" id="eventName' + '" placeholder="'+title+'" >'	
		$('#task_modal_Label').html(label);

        //content
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
	
		
		//label
		var label = 'label<input type ="text" name="eventName" id="eventName' + '" placeholder="'+title+'" >'	
		$('#task_modal_Label').html(label);
		
     
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
	var eventObj = flashTeamsJSON["events"][task_id];
	// retrieve project overview from form
    var description_input = $("#descriptionInput").val();
    
    if (description_input != "")
        eventObj.description =description_input;
    
    if($("#eventName").val() !="")
        eventObj.title = $("#eventName").val();
    
    updateStatus();
    showTaskOverview(groupNum);
}


function ATFunction(groupNum){
alert("test");
}