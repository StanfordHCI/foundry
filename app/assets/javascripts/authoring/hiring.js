function hireForm(groupNum){
	var task_id =getEventJSONIndex(groupNum);
	logActivity("hireForm(groupNum)",'Clicked Hire Button on Task', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON["events"][getEventJSONIndex(groupNum)]);


	var url = task_id +'/hire_form';
    window.open(url);        	
}