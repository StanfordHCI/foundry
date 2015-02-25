function showTaskOverview(groupNum){
	var task_id = getEventJSONIndex(groupNum);
	var eventObj = flashTeamsJSON["events"][task_id];
	var title = eventObj["title"];
	
	//uniq_u is null for author, we use this to decide whether to show the edit link next to project overview
	var uniq_u=getParameterByName('uniq');
		
	
	//modal label
	var label = title;
	$('#task_modal_Label').html(label);

	//modal content
	//var taskOverviewContent = '<div id="task-description-text"><p>' + description + '</p></div>';	
	var taskOverviewContent = getTaskOverviewContent(groupNum);
	//$('#taskOverview').html(taskOverviewContent);
	$('#task-text').html(taskOverviewContent);
    
	if(in_progress == true){
        


	
	if(eventObj.status == "started" || eventObj.status == "delayed"){
	            $("#start-end-task").addClass('btn-success');
	            $("#start-end-task").css('display', '');
	            $("#pause-resume-task").addClass('btn-default');
	            $("#pause-resume-task").css('display', '');
	            
	            
	            $("#start-end-task").attr('onclick', 'confirmCompleteTask('+groupNum+')');
	            $("#start-end-task").html('Complete');
	        } 
 


		/*
if(eventObj.status == "started" || eventObj.status == "delayed"){
            $("#start-end-task").css('display', '');
            $("#start-end-task").attr('onclick', 'pauseTask('+groupNum+')');
            $("#start-end-task").addClass('btn-default');
            $("#start-end-task").html('Pause');
        } 
*/
        
        else if(eventObj.status == "paused"){
            $("#start-end-task").css('display', 'none');
            $("#pause-resume-task").addClass('btn-primary');
            $("#pause-resume-task").css('display', '');
            $("#pause-resume-task").attr('onclick', 'resumeTask('+groupNum+')');
            
            $("#pause-resume-task").html('Resume Task');
            
             /*
 $("#start-end-task").html('Complete');
              $("#start-end-task").addClass('btn-success');
              $("#start-end-task").prop('disabled', true);
*/
        } 
        
        else if(eventObj.status == "completed"){
             $("#pause-resume-task").css('display', 'none'); 
             $("#start-end-task").css('display', '');
              $("#start-end-task").html('Complete');
              $("#start-end-task").addClass('btn-success');
              $("#start-end-task").prop('disabled', true)
        }
        else{
           $("#pause-resume-task").css('display', 'none'); 
           $("#start-end-task").css('display', '');
            $("#start-end-task").attr('onclick', 'confirm_show_docs('+groupNum+')');
            $("#start-end-task").addClass('btn-primary');
            $("#start-end-task").html('Start'); 
        }
    }
    else{
            $("#start-end-task").css('display', 'none');   
            $("#pause-resume-task").css('display', 'none');  
    }

	$("#hire-task").css('display','none');
    /*
if(uniq_u == "" || memberType == "pc" || memberType == "client"){
        $("#hire-task").css('display','');
    }
    else{
        $("#hire-task").css('display','none');
    }
*/
    
	if(in_progress != true && (uniq_u == "" || memberType == "pc" || memberType == "client") ) {
		$("#edit-save-task").css('display', '');
		
        $("#edit-save-task").attr('onclick', 'editTaskOverview(true,'+groupNum+')');
		$("#edit-save-task").html('Edit');
	}
	else{
		$("#edit-save-task").css('display', 'none');
		$("#delete").css('display','none');
	}
}

function editTaskOverview(popover,groupNum){
	var task_id = getEventJSONIndex(groupNum);
	var eventObj = flashTeamsJSON["events"][task_id];
	var title = eventObj["title"];
   	
	if(popover==true){
		$('#task-edit-link').hide();
		
		//label
		label = '<input type ="text" name="eventName" id="eventName' + '" placeholder="'+title+'" >'	
		$('#task_modal_Label').html(label);

        //content
        var taskOverviewForm = getTaskOverviewForm(groupNum);

		$('#task-text').html(taskOverviewForm);
		
		$("#edit-save-task").attr('onclick', 'saveTaskOverview('+groupNum+')');
		$("#edit-save-task").html('Save');	
        
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
	var eventObj = flashTeamsJSON["events"][task_id];
	var totalMinutes = eventObj["duration"];
    var groupNum = eventObj["id"];
    var title = eventObj["title"];
    var startHr = eventObj["startHr"];
    var startMin = eventObj["startMin"];
    var notes = eventObj["notes"];
    var inputs = eventObj["inputs"];
    if(!inputs) inputs = "";
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
        + 'Hours : <input type="number" id="startHr" placeholder="' + startHr 
            + '" min="0" style="width:36px">         ' 
        + 'Minutes : <input type="number" id="startMin" placeholder="' + startMin 
            + '" min="0" step="15" max="45" style="width:36px"><br />'
    
        + '<b>Members</b><br/> <div id="eventMemberList">'
        + writeEventMembers(eventObj)  +'</div>'
        + '</div> <div class="span6">'
        + '<b>Total Runtime </b> <br />' 
        + 'Hours : <input type = "number" id="hours" placeholder="'
            +numHours+'" min="0" style="width:36px"/>         ' 
        + 'Minutes : <input type = "number" id = "minutes" placeholder="'+minutesLeft
            +'" style="width:36px" min="0" step="15" max="45"/> <br />'     
        + '<b>Directly-Responsible Individual</b><br><select class="driInput"' 
            +' name="driName" id="driEvent"' 
			+ 'onchange="getDRI('+groupNum + ')">'+ writeDRIMembers(groupNum,dri_id) +'</select>'
        + '</div>'
        + '</div>'

        + '<div class="row-fluid">' 
        
		+ '<div class="span12"><br />'
        + '<div><b>Description </br></b><textarea class="span12" style="width:475px" rows="5" placeholder="Description of the task..." id="notes">' + notes + '</textarea></div>'
        + '<div><b>Inputs</b><br> <div><input type="text" value="' + inputs + '" placeholder="Add input" id="inputs" /></div>'
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
	var ev = flashTeamsJSON["events"][task_id];
	
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
	
	var content = '<div class="row-fluid" >';
	
		content += '<div class="span8">';
		
			content += '<h4>The goal of this task is to: </h4>';
		
			if (ev.notes != ""){
				content += ev.notes;	
			}
			else{
				content += "No task description has been provided yet."
			}
			
		content += '</div>';
		
		content += '<div class="span4"><b>Duration: </b>' + hrs+':'+mins +'<br />'
				+ '<b>Status: </b>'; 
				
				if(ev.status == "not_started"){
					content += "not started";
				}
				else{
					content += ev.status;
				}
		content += '</div>';
		
	content += '</div>';
		
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
    
    content += '<div class="row-fluid" >';	
				
				if(ev.inputs) {
					content += '<br /><h5>Review the following deliverables from previous tasks: </h5>';
					//content += '<b>Inputs:</b><br>';
					var inputs = ev.inputs.split(",");
					for(var i=0;i<inputs.length;i++){
						content += inputs[i];
					content += "<br />";
        		}
    }
		content +=  '</div>'; 
		
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

        for (var i = 0; i<flashTeamsJSON["members"].length; i++){
           
            if(flashTeamsJSON["members"][i].id == dri_id){
                mem = flashTeamsJSON["members"][i].role;
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
   
		
/*
		  if (ev.pc != "" && ev.pc != undefined){
	        var pc_id = parseInt (ev.pc);
	        var mem = null;
	
	        for (var i = 0; i<flashTeamsJSON["members"].length; i++){
	           
	            if(flashTeamsJSON["members"][i].id == pc_id){
	                mem = flashTeamsJSON["members"][i].role;
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
*/
    

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
                content += "<p><i>" + keyArray[i][0] + "</i></br>" + keyArray[i][1] + "</p>";
            }
            content += "<br />";
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


function saveTaskOverview(groupNum){
	var task_index = getEventJSONIndex(groupNum); 
	var ev = flashTeamsJSON["events"][task_index];

    //Update title
    if($("#eventName").val() != "")
        ev.title = $("#eventName").val();

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

    drawEvent(ev);
    updateStatus();

    $('#task_modal').modal('hide'); 
}