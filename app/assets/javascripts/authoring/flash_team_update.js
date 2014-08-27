/* flash_team_update.js
 * ---------------------------------
 *
 */

function updateJSONFormField() {
  $('#flash_team_json').val(JSON.stringify(flashTeamsJSON));
};

$('.edit_flash_team').submit(function(e) { 
  e.preventDefault();
  var valuesToSubmit = $(this).serialize();
  $.ajax({
    type: 'POST',
    url: $(this).attr('action'), //sumbits it to the given url of the form
    data: valuesToSubmit,
    dataType: "JSON" // you want a difference between normal and ajax-calls, and json is standard
  })
  .success(function(json){
    console.log("submit succeded");
  });
  return false; // prevents normal behaviour
});

$("#flashTeamSaveBtn").click(function() {   
  updateJSONFormField();
  $('.edit_flash_team').submit();
});