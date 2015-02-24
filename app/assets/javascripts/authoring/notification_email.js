function sendEarlyCompletionEmail(uniq,minutes) {
	
	var flash_team_id = $("#flash_team_id").val();
    var url = '/flash_teams/' + flash_team_id + '/early_completion_email';
    $.post(url, {uniq: uniq, minutes:minutes} ,function(data){
    	console.log("successfully sent Early Task Completion email for uniq: " + uniq);
    });
};

function sendBeforeTaskStartsEmail(minutes,email){
	
	var flash_team_id = $("#flash_team_id").val();
    var url = '/flash_teams/' + flash_team_id + '/before_task_starts_email';
    $.post(url, {email: email, minutes:minutes} ,function(data){
    	console.log("successfully sent notification before task starts");
    });
};


function sendDelayedTaskFinishedEmail(minutes,uniq,title){
	//alert(uniq);
    var flash_team_id = $("#flash_team_id").val();
    var url = '/flash_teams/' + flash_team_id + '/delayed_task_finished_email';
    
    $.post(url, {uniq: uniq, minutes:minutes, title: title} ,function(data){
    	console.log("successfully sent notification: delayed task is finished");
    });
};

//This function is not used anymore
function sendTaskDelayedEmail(email){
	
	var flash_team_id = $("#flash_team_id").val();
    var url = '/flash_teams/' + flash_team_id + '/task_delayed_email';
    $.post(url, {email: email} ,function(data){
    	console.log("successfully sent notification: a task is delayed");
    });
};


/* called in awareness.js */
//this function is not used anymore
function delayed_notification_helper(new_remaining_tasks){
     var emails=[];
     for (var i=0;i<new_remaining_tasks.length;i++){
        var groupNum = new_remaining_tasks[i];
        for (var j = 0; j<flashTeamsJSON["events"].length; j++){
       
        eventId = flashTeamsJSON["events"][j].id;
	        if (eventId == groupNum){
	        	//alert("id == groupNum");
	            var event_tmp = flashTeamsJSON["events"][j];
	            //alert(event_tmp["members"]);
	            //TODO actual emails instead of roles
	            for( var m_i=0;m_i<event_tmp["members"].length;m_i++ ){
	            	tmp_email=event_tmp["members"][m_i];
	             	
	                if(emails.indexOf(tmp_email)==-1){
	                emails.push(tmp_email);
	                //alert("sent email to "+tmp_email);
	                sendTaskDelayedEmail(tmp_email);
	             	}
	            }
	        }
        }
    }  
};

function early_completion_helper(remaining_tasks,early_minutes){
    console.log("sending emails..");
    var uniqs_sent_already = [];
    for (var i=0;i<remaining_tasks.length;i++){
        console.log("remaining task " + i);
        var groupNum = remaining_tasks[i];
        //alert(i+" "+groupNum);
    	for (var j = 0; j<flashTeamsJSON["events"].length; j++){
            eventId = flashTeamsJSON["events"][j].id;
            console.log("event id: " + eventId);
	        if (eventId == groupNum){
	            var event_tmp = flashTeamsJSON["events"][j];
                console.log("event_tmp: " + event_tmp);
	            //TODO actual emails instead of roles
	            for(var m_i=0;m_i<event_tmp["members"].length;m_i++){
	                var memberId = parseInt(event_tmp["members"][m_i]);
                    var member = entryManager.getEntryById(memberId);
                    var uniq=member["uniq"];	
                                   
                    console.log("uniq: " + uniq);
	                if(uniqs_sent_already.indexOf(uniq)==-1){
	                   uniqs_sent_already.push(uniq);
	                   //alert("sent email to "+tmp_email);

                       console.log("sending early completion email..");
	                   sendEarlyCompletionEmail(uniq,early_minutes);
	                   //alert("sent email to"+tmp_email+" "+early_minutes);
	             	}
	            }
	        }
        }
    }
};
  

 //used when a delayed task is finished. the main function is called in awareness.js 
function DelayedTaskFinished_helper(tasks_after,title){
  var emails=[];
  for (var i=0;i<tasks_after.length;i++){
        var groupNum = tasks_after[i];
        //alert(i+" "+groupNum);
    	for (var j = 0; j<flashTeamsJSON["events"].length; j++){
       
        eventId = flashTeamsJSON["events"][j].id;
	        if (eventId == groupNum){
	        	
	            var event_tmp = flashTeamsJSON["events"][j];
	            
	            //TODO actual emails instead of roles
	            for( var m_i=0;m_i<event_tmp["members"].length;m_i++ ){
                        var memberId = parseInt(event_tmp["members"][m_i]);
	            	    var member = entryManager.getEntryById(memberId);
                    	var uniq=member["uniq"];
	             		
                        //var member_role=event_tmp["members"][m_i];
	               	  
	           
                    if(emails.indexOf(uniq)==-1){
	                	emails.push(uniq);
	                    //var remaining_time= getUserNextTaskStartTime(memberId);
                        //disabled calculation of remaining time after switching to on demand hiring.
                        var remaining_time = 0;
                        if (remaining_time != undefined){
	                       sendDelayedTaskFinishedEmail(remaining_time,uniq,title);
                           //console.log("sent delayed task finished email to"+tmp_email+" "+remaining_time);
                       }          
	             	}
	            }
	        }
        }
    }	
}  



/* get the start time of the next upcoming task of user to be notified*/
var memberId=0;
function getUserNextTaskStartTime(input_id){
   

    memberId=input_id;
    var memberName = input_id;

    currentUserEvents2 = flashTeamsJSON["events"].filter(isCurrent2);
    currentUserEvents2 = currentUserEvents2.sort(function(a,b){return parseInt(a.startTime) - parseInt(b.startTime)});
   	upcomingEvent2 = currentUserEvents2[0].id;
   
    task_g2 = getTaskGFromGroupNum(upcomingEvent2);
    console.log("???");
    console.log(currentUserEvents2);
    console.log(task_g2.data[0]);

    if (task_g2.data()[0].completed){
        toDelete = upcomingEvent2;
        currentUserEvents2.splice(0,1);
        upcomingEvent2 = currentUserEvents2[0].id;
        task_g2 = getTaskGFromGroupNum(upcomingEvent2)
    }
    
    var cursor_x = cursor.attr("x1");
    var cursorHr = (cursor_x-(cursor_x%100))/100;
    var cursorMin = (cursor_x%100)/25*15;
    if(cursorMin == 57.599999999999994) {
        cursorHr++;
        cursorMin = 0;
    } else cursorMin += 2.4
    var cursorTimeinMinutes = parseInt((cursorHr*60)) + parseInt(cursorMin);
  
   
    var displayTimeinMinutes = parseInt(currentUserEvents2[0].startHr * 60 + currentUserEvents2[0].startMin) - parseInt(cursorTimeinMinutes);
   

    var hours = parseInt(displayTimeinMinutes/60);
    var minutes = displayTimeinMinutes%60;
    if (hours==0 && minutes>1)
    	var overallTime = minutes+ " minutes";
    if (hours==1 && minutes>1)
    	var overallTime= hours + " hour "+minutes+" minutes";
    if (hours>1 && minutes>1)
    	var overallTime= hours + " hours "+minutes+" minutes";

   
    if (displayTimeinMinutes < 0){
       console.log("overallTime= "+overallTime+". Why do you want to notify the user?")
    }else{
    	return overallTime;
    } 

};       

function isCurrent2(element) {
  	return element.members.indexOf(memberId) != -1;
};