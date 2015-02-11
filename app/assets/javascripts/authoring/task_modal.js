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
            $("#start-end-task").css('display', '');
            $("#start-end-task").attr('onclick', 'confirmCompleteTask('+groupNum+')');
            $("#start-end-task").addClass('btn-success');
            $("#start-end-task").html('Complete');
        }  
        else if(eventObj.status == "completed"){
             $("#start-end-task").css('display', '');
              $("#start-end-task").html('Complete');
              $("#start-end-task").addClass('btn-success');
              $("#start-end-task").prop('disabled', true)
        }
        else{
           $("#start-end-task").css('display', '');
            $("#start-end-task").attr('onclick', 'startTask('+groupNum+')');
            $("#start-end-task").addClass('btn-primary');
            $("#start-end-task").html('Start'); 
        }
    }
    else{
            $("#start-end-task").css('display', 'none');   
    }

    if(uniq_u == "" || memberType == "pc" || memberType == "client"){
        $("#hire-task").css('display','');
    }
    else{
        $("#hire-task").css('display','none');
    }
    
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

function membersSetup (eventObj) {
    var substringMatcher = function (strs) {
        return function findMatches(q, cb) {
            var matches, substringRegex;

            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function (i, item) {
                var str = item.role;
                if (substrRegex.test(str)) {
                    // the typeahead jQuery plugin expects suggestions to a
                    // JavaScript object, refer to typeahead docs for more info
                    matches.push({ value: item.id, role: str });
                }
            });

            cb(matches);
        };
    };

    var members = flashTeamsJSON["members"];

    var sourceOptions = { name: 'members',
        displayKey: 'role',
        source: substringMatcher(members)
    };

    var typeaheadUIOptions = {
        hint: true,
        highlight: true,
        minLength: 1,
        autoselect: true
    };

    $("#pc-field, #dri-field").typeahead(typeaheadUIOptions, sourceOptions)
        .bind('typeahead:selected', $.proxy(function (obj, datum) {
            
        }));

    var pcObject = getPCObject(eventObj);
    console.log("pcobject")
    console.log(pcObject);
    if (pcObject != null)
        $("pc-field").typeahead('val', getPCObject(eventObj).role);

    var driObject = getDRIObject(eventObj);
    if (driObject != null)
        $("dri-field").typeahead('val', getDRIObject(eventObj).role);

    // members field needs to be a typeahead too
    $('#members-field').each(function (i, o) {
        // grab the input inside of tagsinput
        var taginput = $(o).tagsinput('input');

        // ensure that a valid member is being entered
        $(o).on('itemAdded', function (event) {
            // error checking FAILURE 
            // if (members.indexOf(event.item) < 0) {
            //     $(o).tagsinput('remove', event.item);
            //     alert(event.item + " is not a valid state");
            // }
        });

        // initialize typeahead for the tag input
        taginput.typeahead(typeaheadUIOptions, sourceOptions)
            .bind('typeahead:selected', $.proxy(function (obj, datum) {
                // if the member is clicked, add it to tagsinput and clear input
                $(o).tagsinput('add', datum.role);
                taginput.typeahead('val', '');
            }));

        // erase any entered text on blur
        $(taginput).blur(function () {
            taginput.typeahead('val', '');
        });
    });
}

function collapseSetup () {
    $("#task_modal .collapsible .heading").click(function () {
        var collapsedSection = $(this).next(".collapsed");
        if (collapsedSection.is(":hidden")) {
            collapsedSection.show();
            $(".form-body").scrollTop($(this).offset().top);

        } else {
            collapsedSection.hide();
        }
    });
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
		
        collapseSetup();

		$("#edit-save-task").attr('onclick', 'saveTaskOverview('+groupNum+')');
		$("#edit-save-task").html('Save');	

        $("#input-field").tagsinput();
        $("#deliv-field").tagsinput();
        $("#members-field").tagsinput();

        membersSetup(eventObj);


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

    var form = '<form name="taskOverfiewForm" id="taskOverviewForm">'
        + '<div class="modal-container" id="event-title-container"><div id="event-title">'
        + '<input type="text" name="event-title" value="' + title + '" class="event_title">'
        + '</div></div>'
        + '<div class="form-body"><div class="modal-container"><div id="time-info" class="info">'
        + '<div class="first"><span class="input-label side">START TIME</span>'
        + '<input type="text" name="start_time" value="' + startHr + ':' + startMin + '"></div>'
        + '<div class="second"><span class="input-label side">DURATION</span>'
        + '<input type="text" name="duration" value="' + numHours + 'h' + minutesLeft + 'm' + '"></div></div>'

        + '<div id="description-info" class="info"><div class="first">'
        + '<span class="input-label top">DESCRIPTION</span>'
        + '<textarea id="description-text" placeholder="Write a description of this event..." value="' + notes + '"></textarea>'
        + '</div></div>'

        + '<div id="materials-info" class="info"><div class="first">'
        + '<span class="input-label top">INPUTS</span>'
        + '<input type="text" name="inputs" value="" class="tagsy side_input" id="input-field">'
        + '</div><div class="second"><span class="input-label top">DELIVERABLES</span>'
        + '<input type="text" name="deliverables" value="" class="tagsy side_input" id="deliv-field">'
        + '</div></div></div>'

        + '<div class="modal-container collapsible" id="members-info-container"><div id="members-info" class="info">'
        + '<span class="heading"> MEMBERS </span>'
        + '<div class="collapsed info"><div class="first">'
        + '<span class="input-label top">PROJECT COORDINATOR</span>'
        + '<input type="text" name="pc" id="pc-field" value="" class="side_input typeahead">'
        + '</div><div class="second"><span class="input-label top">DIRECTLY RESPONSIBLE INDIVIDUAL</span>'
        + '<input type="text" name="dri" id="dri-field" value="" class="side_input typeahead">'
        + '</div><div class="third"><span class="input-label top">TEAM MEMBERS</span>'
        + '<input type="text" class="tagsy-typeahead" id="members-field" value="candy"></input>'
        + '</div></div></div></div>'

        + '<div class="modal-container collapsible" id="documentation-info-container">'
        + '<div id="documentation-info" class="info">'
        + '<span class="heading"> DOCUMENTATION QUESTIONS </span>'
        + '<div class="collapsed"><div class="question-box">'
        + '<textarea placeholder="Write your question here..."></textarea>'
        + '</div></div></div></div></div> <!-- end form-body --> </form>'

        return form;

    var oldForm = '<form name="taskOverviewForm" id="taskOverviewForm" style="margin-bottom: 5px;">'
        + '<div class="event-table-wrapper">'
        + '<div class="row-fluid">' 
        + '<div class="span6">'
        + '<b>Event Start</b> <br>' 
        + 'Hours : <input type="number" id="startHr" placeholder="' + startHr 
            + '" min="0" style="width:36px">         ' 
        + 'Minutes : <input type="number" id="startMin" placeholder="' + startMin 
            + '" min="0" step="15" max="45" style="width:36px"><br />'

        + '<b>Project Coordinator</b><br><select class="pcInput"' 
            +' name="pcName" id="pcEvent"' 
            + 'onchange="getPC('+groupNum + ')">'+ writePCMembers(groupNum,PC_id) +'</select>'
    
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
        + '<div class="span12">'
        + '<b>Members</b><br/> <div id="eventMemberList">'
        + writeEventMembers(eventObj)  +'</div>'

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

    var content = '<div class="row-fluid" >' 
        + '<div class="span6">'
        + '<b>Event Start:  </b>'
        + evStartHr + ':'
        + evStartMin + '<br>'
        + '</div>'
        + '<div class="span6" style="margin-left:0px">'
        +'<b>Total Runtime:  </b>' 
        + hrs+':'+mins
        + '</div>';
        + '</div>';

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
            content += '<div class=row-fluid> <div class="span6">'
            content += '<b>Project Coordinator:</b><br>';
            content += mem;
            content += "</div>"
            
        }
    }
    else{

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
            content += '<div class="span6">';
            content += '<b>Directly-Responsible Individual:</b><br>';
            content += mem;
            content += '</div> </div>'
        }
    }
    else{

    }

    if(ev.inputs) {
        content += '<b>Inputs:</b><br>';
        var inputs = ev.inputs.split(",");
        for(var i=0;i<inputs.length;i++){
            content += inputs[i];
            content += "<br>";
        }
    }
    
    if(ev.outputs) {
        content += '<b>Deliverables:</b><br>';
        var outputs = ev.outputs.split(",");
        for(var i=0;i<outputs.length;i++){
            content += outputs[i];
            content += "<br>";
        }
    }

    var num_members = ev.members.length;
    if(num_members > 0){
        content += '<b>Members:</b><br>';
        for (var j=0;j<num_members-1;j++){
            var member = getMemberById(ev.members[j]);
            content += member.role;
            content += ', ';
        }
        var member = getMemberById(ev.members[num_members-1]);
        content += member.role;
        content += '<br/>';
    }

    if (ev.notes != ""){
        content += '</br><b>Description:</b><br>';
        content += ev.notes;
        content += '<br>';
    }


    content += "<hr/>";
    content += "<b>Documentation Questions</b><hr/>";

    //Add output documentation questions to task modal    
    for (var key in ev.outputQs){
        if (key != ""){
            content += "<b>" + key + "</b></br>";
            keyArray = ev.outputQs[key];
            for (i = 0; i < keyArray.length; i++){
                content += "<p><i>" + keyArray[i][0] + "</i></br>" + keyArray[i][1] + "</p>";
            }
        }
    }
    content += "<hr/>";

    //Add general documentation questions to task modal
    if (ev.docQs.length > 0){
        docQs = ev.docQs;
        for (i = 0; i < docQs.length; i++){
            if (docQs[i][1] != null){
                content += "<b>" + docQs[i][0] + " </b>";
                content += "<p>" + docQs[i][1] + "</p>";
            }
        }
    }
   
    return content;
}

function saveTaskOverview(groupNum){
	var task_index = getEventJSONIndex(groupNum); 
	var ev = flashTeamsJSON["events"][task_index];

    // //Update title
    // if($("#eventName").val() != "")
    //     ev.title = $("#eventName").val();

    // //Update start time if changed
    // var startHour = $("#startHr").val();    
    // if (startHour != "") startHour = parseInt($("#startHr").val());
    // else startHour = parseInt($("#startHr").attr("placeholder"));

    // var startMin = $("#startMin").val();
    // if (startMin != "") startMin = parseInt($("#startMin").val());
    // else startMin = parseInt($("#startMin").attr("placeholder"));

    // var totalStartMin = (startHour*60) + startMin;
    // ev.startTime = totalStartMin;
    // ev.startHr = startHour;
    // ev.startMin = startMin;
    // //SHOULD WE BE UPDATING EV.X HERE??

    // //Update duration if changed
    // var newHours = $("#hours").val();
    // if (newHours != "") newHours = parseInt($("#hours").val());
    // else newHours = parseInt($("#hours").attr("placeholder"));

    // var newMin = $("#minutes").val();
    // if (newMin != "") newMin = parseInt($("#minutes").val());
    // else newMin = parseInt($("#minutes").attr("placeholder"));
    // newMin = Math.round(parseInt(newMin)/15) * 15;

    // if (newHours == 0 && newMin == 15){    //cannot have events shorter than 30 minutes
    //     newMin = 30;
    // }
    // ev.duration = (newHours * 60) + newMin;

    //Update PC if changed
    // var pcId = getPC(groupNum);
    // ev.pc = pcId;

    var pcID = $('#pc-field').typeahead('val');
    ev.pc = pcID;

    //Update DRI if changed
    // var driId = getDRI(groupNum);
    //     ev.dri = driId;

 //    //Update Members if changed
 //    ev.members = [];
 //    for (var i = 0; i<flashTeamsJSON["members"].length; i++) {
 //        var member = flashTeamsJSON["members"][i];
 //        var memberId = member.id;
 //        var checkbox = $("#event" + groupNum + "member" + i + "checkbox")[0];
 //        if (checkbox == undefined) continue;
 //        if (checkbox.checked == true) {
 //            ev.members.push(memberId); //Update JSON
 //        } 
 //    }

 //    //Update description if changed
 //    var eventNotes = $("#notes").val();
 //    ev.notes = eventNotes;

 //    //Update inputs and outputs if changed
 //    ev.inputs = $('#inputs').val();
 //    ev.outputs = $('#outputs' ).val();


 //    //Update documentation questions if changed
	// var genQs = [];
 //    qString = $("#questions").val().split("\n");
 //    for (i = 0; i < qString.length; i++){
 //        if (qString[i] != ""){
 //            genQs.push([qString[i],""]);
 //        }
 //    }
 //    ev.docQs = genQs;

 //    //Save output questions
 //    var outQs = {};
 //    outputVals = ($("#outputs").val()).split(",");
 //    for (i = 0; i < outputVals.length; i++){
 //        output = outputVals[i];
 //        if (output != ""){
 //            outQs[output] = [];
 //            questionArray = (document.getElementById("num" + outputVals[i]).value).split("\n");
 //            for (j = 0; j < questionArray.length; j++){
 //                if (questionArray[j] != ""){
 //                    outQs[output].push([questionArray[j],""]);
 //                }
 //            } 
 //        }
 //    }
 //    ev.outputQs = outQs;

    drawEvent(ev);
    updateStatus();

    $('#task_modal').modal('hide'); 
}