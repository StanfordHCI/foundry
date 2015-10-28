ProjectOverview = function () {

  //showProjectOverview
  this.render = function() {
    var project_overview = this["projectoverview"];

    if(project_overview === undefined){
      project_overview = "No project overview has been added yet.";
    }

    //uniq_u is null for author, we use this to decide whether to show the edit link next to project overview
    var uniq_u=getParameterByName('uniq');

    if(uniq_u == "" || memberType == "pc" || memberType == "client") {
      $('#projectOverviewEditLink').show();
      $("#projectOverviewEditLink").html('<a onclick="editProjectOverview(false)" style="font-weight: normal;">Edit</a>');
    }

    var projectOverviewContent = '<div id="project-overview-text"><p>' + project_overview + '</p></div>';

    $('#projectOverview').html(projectOverviewContent);

    //modal content
    $('#po-text').html(projectOverviewContent);

    //only allow authors to edit project overview
    if(uniq_u == "" || memberType == "pc" || memberType == "client") {
      $("#edit-save").css('display', '');
      $("#edit-save").attr('onclick', 'editProjectOverview(true)');
      $("#edit-save").html('Edit');
    }
    else{
      $("#edit-save").css('display', 'none');
    }
  }

  this.edit = function() {
    var project_overview = this["projectoverview"];

    if(project_overview === undefined){
      project_overview = "";
    }

    if(popover==true){
      $('#po-edit-link').hide();

      currentTeam.logActivity("editProjectOverview(true)",'Edit Project Overview - In Modal', flashTeamsJSON);

      var projectOverviewForm = '<form name="projectOverviewForm" id="projectOverviewForm" style="margin-bottom: 5px;">'
            +'<textarea type="text"" id="projectOverviewInput" rows="6" placeholder="Description of project...">'+project_overview+'</textarea>'
            + '<a onclick="showProjectOverview()" style="font-weight: normal;">Cancel</a>'
            +'</form>';
      $('#po-text').html(projectOverviewForm);

      $("#edit-save").attr('onclick', 'saveProjectOverview()');
      $("#edit-save").html('Save');
    } else {
      $('#projectOverviewEditLink').hide();

      var projectOverviewForm = '<form name="projectOverviewForm" id="projectOverviewForm" style="margin-bottom: 5px;">'
          +'<textarea type="text"" id="projectOverviewInput" rows="6" placeholder="Description of project...">'+project_overview+'</textarea>'
          + '<button class="btn btn-default" type="button" onclick="showProjectOverview()">Cancel</button>'
          + '<button class="btn btn-success" type="button" onclick="saveProjectOverview()" style="float: right;">Save</button>'
          +'</form>';

      $('#projectOverview').html(projectOverviewForm);
    }
  }

  this.save = function() {
    // retrieve project overview from form
    var project_overview_input = $("#projectOverviewInput").val();
    if (project_overview_input === "") {
      project_overview_input =  "No project overview has been added yet.";
    }

    currentTeam.logActivity('saveProjectOverview()',"saveProjectOverview() - Before Update",'Save Project Overview - Before Update', flashTeamsJSON);


    currentTeam["projectoverview"] = project_overview_input;

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
    updateStatus();

    this.show();
  }
}

ProjectOverview.create = function(parent) {
  var projectOverview = new ProjectOverview();
  projectOverview.prototype = parent;
  return projectOverview;
}
