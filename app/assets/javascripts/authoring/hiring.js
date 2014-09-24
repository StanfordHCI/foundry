function hireForm(groupNum){
	var task_id =getEventJSONIndex(groupNum);

	var url = task_id +'/hire_form';
        window.open(url);        
        /*
$.ajax({
            url: url,
            type: 'get'
        }).done(function(data){console.log("opened hire form page")})
*/
	
}