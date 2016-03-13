function hireForm(groupNum){
	var task_id =getEventJSONIndex(groupNum);
	currentTeam.logActivity("hireForm(groupNum)",'Clicked Hire Button on Task', flashTeamsJSON["events"][getEventJSONIndex(groupNum)]);


	var url = task_id +'/hire_form';
    window.open(url);
}
