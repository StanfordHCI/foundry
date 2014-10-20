function hireForm(groupNum){
	var task_id =getEventJSONIndex(groupNum);

	var url = task_id +'/hire_form';
    window.open(url);        	
}