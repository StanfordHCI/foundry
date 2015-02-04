//This is the events immediately before the upcoming event.
var events_before =[];
var events_before_index = 0;
function show_previous_doc(){
	console.log("in show_previous_doc function");

	if (currentUserEvents.length == 0 ) {
		return;
	}
    var currentUserEvents_tmp = currentUserEvents.sort(function(a,b){return parseInt(a.startTime) - parseInt(b.startTime)});
    var ev = flashTeamsJSON["events"][getEventJSONIndex(currentUserEvents_tmp[0].id)];
    var upcomingEvent_tmp = ev.id;
      
    //get the first unfinished task of the worker.    
    while (ev.status == "completed"){
        toDelete = upcomingEvent_tmp;
        currentUserEvents_tmp.splice(0,1);
        if (currentUserEvents_tmp.length == 0){
            return;
        }
        upcomingEvent_tmp = currentUserEvents_tmp[0].id;
        ev = flashTeamsJSON["events"][getEventJSONIndex(upcomingEvent_tmp)];
    }

    events_before = events_immediately_before(ev.id);
    if (events_before.length == 0) return;
    var ev_before = flashTeamsJSON["events"][getEventJSONIndex(events_before[events_before_index])];

    if (!checkEventsBeforeCompletedNoAlert(ev.id)) return;

    if(upcoming_ev_doc_seen(upcomingEvent_tmp)){
    	return;
    }
    else{
    	add_ev_seenDocQ(upcomingEvent_tmp);
    	
    	showDocModal(ev_before, events_before);
    	updateStatus();
    }    
};

function add_ev_seenDocQ(upcomingEvent_tmp){

 	if(current == undefined){
 		console.log("error: current user is undefined!");
 		return;
 	}

 	for (var i = 0; i < flashTeamsJSON["members"].length; i++) {
        if (parseInt(flashTeamsJSON["members"][i].id) == parseInt(current_user.id)) 
    		flashTeamsJSON["members"][i].seenDocQs.push(upcomingEvent_tmp);    	 
    }
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

function showDocModal(ev_before, events_before){
	//body of the modal

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
	content += "</div>";


	//alert(ev_tmp.docQs[0][0]);
	var modal_footer= '<button class="btn btn-primary" id="next-doc-modal" onclick="nextDocModal()">Next</button>';
	var modal_body=content;
	var modal_label= ev_before.title + " Documentation";

	 $('#doc_modal').modal('show'); 
     $('.doc-modal-footer').html(modal_footer);
     $('.doc-modal-body').html(modal_body);	
     $('#doc_modal_Label').html(modal_label);
     $("#next-doc-modal").css('display', '');
     if( (events_before_index + 1) >= (events_before.length) ){
     	modal_footer = '<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>';
     	$('.doc-modal-footer').html(modal_footer);
 	 }
 	 else
 	 	events_before_index = events_before_index + 1;
};

//is called when next button on the modal is clicked.
function nextDocModal(){
	if(events_before_index >= events_before.length )
		return;
	if (events_before.length == 0) return;
	var ev_before = flashTeamsJSON["events"][getEventJSONIndex(events_before[events_before_index])];
	showDocModal(ev_before, events_before);
	
};

