//This is the events immediately before the upcoming event.
var events_before =[];
var events_before_index = 0;

function confirm_show_docs(event_id){
  
  events_before_index = 0;
   events_before = events_immediately_before(event_id);
  if (events_before.length == 0)
    show_previous_doc(event_id);
  else
    confirm_show_docs_modal(event_id);
};

function confirm_show_docs_modal(event_id){
  var bodyText = document.getElementById("confirmActionText");
    //updateStatus();
    $("#task_modal").modal('hide');

   if (!checkEventsBeforeCompleted(event_id))
        return;

    bodyText.innerHTML = "<p>You need to read the documentation questions answered by previous workers before you can start your task.</p> ";
    
    var confirmStartTeamBtn = document.getElementById("confirmButton");
    confirmStartTeamBtn.innerHTML = "OK";
    
    $("#saveButton").css("display","none");
    $("#confirmButton").attr("class","btn btn-success");
    var label = document.getElementById("confirmActionLabel");
    label.innerHTML = "Read The Previous Task(s) Info First!";
    $('#confirmAction').modal('show');

    document.getElementById("confirmButton").onclick=function(){$('#confirmAction').modal('hide'); show_previous_doc(event_id)};    

}

function show_previous_doc(event_id){
	console.log("in show_previous_doc function");
  console.log(event_id);
  var ev = flashTeamsJSON["events"][getEventJSONIndex(event_id)];
  
  if (!checkEventsBeforeCompleted(event_id))
        return;
 
	/*if (currentUserEvents.length == 0 ) {
		return;
	}*/
    //var currentUserEvents_tmp = currentUserEvents.sort(function(a,b){return parseInt(a.startTime) - parseInt(b.startTime)});
    //var ev = flashTeamsJSON["events"][getEventJSONIndex(currentUserEvents_tmp[0].id)];
    //var upcomingEvent_tmp = ev.id;
      
    //get the first unfinished task of the worker.    
    /*while (ev.status == "completed"){
        toDelete = upcomingEvent_tmp;
        currentUserEvents_tmp.splice(0,1);
        if (currentUserEvents_tmp.length == 0){
            return;
        }
        upcomingEvent_tmp = currentUserEvents_tmp[0].id;
        ev = flashTeamsJSON["events"][getEventJSONIndex(upcomingEvent_tmp)];
    }*/

    events_before = events_immediately_before(ev.id);
    if (events_before.length == 0) {
      startTask(ev.id);
      $("#task_modal").modal('hide');
      return;
    }

    var ev_before = flashTeamsJSON["events"][getEventJSONIndex(events_before[events_before_index])];

    //if (!checkEventsBeforeCompletedNoAlert(ev.id)) return;

    /*if(upcoming_ev_doc_seen(upcomingEvent_tmp)){
    	return;
    }*/
    //else{
    //	add_ev_seenDocQ(upcomingEvent_tmp);

    	showDocModal(ev_before, events_before, event_id);
    	//updateStatus();
    //}    
};

function add_ev_seenDocQ(upcomingEvent_tmp){
 	if(current == undefined){
 		console.log("error: current user is undefined!");
 		return;
 	}

    var member = entryManager.getEntryById(current_user.id);
    member.seenDocQs.push(upcomingEvent_tmp);
};

function upcoming_ev_doc_seen(upcomingEvent_tmp){
  
  
  var curr_mem = getMemberById(current_user.id);
  
  var seenDocQs = curr_mem["seenDocQs"];
 
  if( (seenDocQs.indexOf(upcomingEvent_tmp)) == -1){
  	return false;
  }
  else{
  	return true;
  }
};

function showDocModal(ev_before, events_before, curr_event_id){
  
  logActivity("Event Update",'Show Doc Modal', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(curr_event_id)]);

  //body of the modal
    //hides the current task modal
 
    $("#task_modal").modal('hide');
    var outputs = ev_before.outputs.split(",");


    var content = '<div class="row-fluid" >' ;
    content += "<p><b>The goal of this input task was to:</b><br>";
    content += ev_before.notes + "</p><br>";
    content += "<p><b>Specifically, the deliverables of the task were:</b><p>";
    content +="<p>"
    for(var i =0;i<outputs.length; i++){
      content += outputs[i] ;
      if(i < outputs.length - 1)
        content +="<br>";      
    }
    content+="</p><hr>"

    content += "<p><b>Please review the deliverables of the "+ ev_before.title +" task here:</b></br>";
    content += "<a href=" + ev_before.gdrive[1] + " target='_blank'>"+ev_before["gdrive"][1] +"</a></p>";
    content += "<hr>"


    content += "<b><p> Below are the questions answered by the DRI of the "+ ev_before.title +" task. Please review them since they are related to your upcoming task:</p></b>";

    //Add output documentation questions to task modal    
    for (var key in ev_before.outputQs){
        if (key != ""){
            content +=   "<br>" + key.split(":")[0] + ":" ;
            keyArray = ev_before.outputQs[key];
            for (i = 0; i < keyArray.length; i++){
                content += "<p><i>- " + keyArray[i][0] + "</i></br>" + keyArray[i][1] + "</p>";
            }
        }
    }
    //Add general documentation questions to task modal
    if (ev_before.docQs.length > 0){
        docQs = ev_before.docQs;
        for (i = 0; i < docQs.length; i++){
            if (docQs[i][1] != null){
                content += "<br>-" +  docQs[i][0] ;
                content += "<p>" + docQs[i][1] + "</br></p>";
            }
        }
    }

      content += "</div>"; 


  //alert(ev_tmp.docQs[0][0]);
  var modal_footer;
  modal_footer= '<button class="btn btn-primary" id="next-doc-modal" onclick="nextDocModal('+curr_event_id+')">Next</button>';
   //alert("first");
   //alert(events_before_index);
  if(events_before_index>0){
       
        modal_footer = '<button class="btn btn-primary" id="prev-doc-modal" onclick="prevDocModal('+curr_event_id+')">Previous</button>' + modal_footer;
  }
 
  var modal_body=content;
  var modal_label= "Input Task: "+ ev_before.title ;

     $('#doc_modal').modal('show'); 
     $('.doc-modal-footer').html(modal_footer);
     $('.doc-modal-body').html(modal_body); 
     $('#doc_modal_Label').html(modal_label);
     $("#next-doc-modal").css('display', '');
    
    if( (events_before_index + 1) >= (events_before.length) ){
      modal_footer = '<button class="btn btn-primary" data-dismiss="modal" onclick="startTask('+curr_event_id+')" aria-hidden="true">Start Task</button>';
      //alert("second");
      //alert(events_before_index);
      if(events_before_index>0){
        modal_footer = '<button class="btn btn-primary" id="prev-doc-modal" onclick="prevDocModal()">Previous</button>' + modal_footer;
      }
      $('.doc-modal-footer').html(modal_footer);
      events_before_index = events_before_index + 1;

   }
   else{
    events_before_index = events_before_index + 1;
  }
   
};
function showDocModal_main(ev_before, events_before, curr_event_id){
	//body of the modal
    //hides the current task modal
  
    $("#task_modal").modal('hide');

    var content = '<div class="row-fluid" >' ;
    content += "<p> The following questions are answered by the DRI of the "+ ev_before.title +" task. Please review them as they are related to your upcoming task:</p> ";

    //Add output documentation questions to task modal    
    for (var key in ev_before.outputQs){
        if (key != ""){
            content +=   key + "</br>";
            keyArray = ev_before.outputQs[key];
            for (i = 0; i < keyArray.length; i++){
                content += "</br><p><i>- " + keyArray[i][0] + "</i></br>" + keyArray[i][1] + "</p>";
            }
        }
    }
    //Add general documentation questions to task modal
    if (ev_before.docQs.length > 0){
        docQs = ev_before.docQs;
        for (i = 0; i < docQs.length; i++){
            if (docQs[i][1] != null){
                content += "</br>- " +  docQs[i][0] ;
                content += "<p>" + docQs[i][1] + "</p>";
            }
        }
    }

    content += "<hr><p><b>Here is the link to the deliverables of the "+ ev_before.title +" task:</b></br>";
    content += "<a href=" + ev_before.gdrive[1] + " target='_blank'>"+ev_before["gdrive"][1] +"</a></p>";
	content += "</div>"; 


	//alert(ev_tmp.docQs[0][0]);
	var modal_footer;
  modal_footer= '<button class="btn btn-primary" id="next-doc-modal" onclick="nextDocModal('+curr_event_id+')">Next</button>';
	 //alert("first");
   //alert(events_before_index);
  if(events_before_index>0){
       
        modal_footer = '<button class="btn btn-primary" id="prev-doc-modal" onclick="prevDocModal('+curr_event_id+')">Previous</button>' + modal_footer;
  }
 
  var modal_body=content;
	var modal_label= ev_before.title + " Documentation";

	   $('#doc_modal').modal('show'); 
     $('.doc-modal-footer').html(modal_footer);
     $('.doc-modal-body').html(modal_body);	
     $('#doc_modal_Label').html(modal_label);
     $("#next-doc-modal").css('display', '');
    
    if( (events_before_index + 1) >= (events_before.length) ){
     	modal_footer = '<button class="btn btn-primary" data-dismiss="modal" onclick="startTask('+curr_event_id+')" aria-hidden="true">Start Task</button>';
     	//alert("second");
      //alert(events_before_index);
      if(events_before_index>0){
        modal_footer = '<button class="btn btn-primary" id="prev-doc-modal" onclick="prevDocModal()">Previous</button>' + modal_footer;
      }
      $('.doc-modal-footer').html(modal_footer);
      events_before_index = events_before_index + 1;

 	 }
 	 else{
 	  events_before_index = events_before_index + 1;
  }
   
};

//is called when next button on the modal is clicked.
function nextDocModal(curr_event_id){
	if(events_before_index >= events_before.length )
		return;
	if (events_before.length == 0) return;
  //alert(curr_event_id)
	logActivity("Event Update",'Next Doc Modal', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(curr_event_id)]);
  var ev_before = flashTeamsJSON["events"][getEventJSONIndex(events_before[events_before_index])];
	showDocModal(ev_before, events_before, curr_event_id);
	
};

function prevDocModal(curr_event_id){
  if(events_before_index > events_before.length )
    return;
  if (events_before.length == 0) return;
  
  if(events_before_index<=1) return;
 
  events_before_index = events_before_index - 2;
  
  logActivity("Event Update",'Prev Doc Modal', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(curr_event_id)]);

  //alert(curr_event_id);
  var ev_before = flashTeamsJSON["events"][getEventJSONIndex(events_before[events_before_index])];
  showDocModal(ev_before, events_before, curr_event_id);
  
};