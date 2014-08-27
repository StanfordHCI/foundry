/* load.js
 * ---------------------------------
 *
 */

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

$(document).ready(function(){
	var notice = getParameterByName("notice");
	if(notice){
		alert(notice);
	}
});

/*
var ready = function() {
  var flash_team_id = $("#flash_team_id").val();

  var url = '/flash_teams/' + flash_team_id + '/get_json';
  $.get(url, function(data){
    drawFlashTeamFromJSON(data);
  });
};
*/

// Trick to fix a turbolink issue
//$(document).ready(ready);
//$(document).on('page:load', ready);