$("#hireBtn").click(function(){
    console.log("CLICKED HIRE BUTTON");

    var flash_team_id = $("#flash_team_id").val();

    var html = "";
    for (var i=0; i<flashTeamsJSON["events"].length; i++){
        var ev = flashTeamsJSON["events"][i];
        var url = "/flash_teams/" + flash_team_id + "/" + i.toString() + "/hire_form";
        html += "<a type='button' class='link' target='_blank' href='" + url + "'>" + ev.title + "</a><br/>";
    }
    $("#hire_modal .hire-modal-body").html(html);
    $("#hire_modal").modal('show');
});