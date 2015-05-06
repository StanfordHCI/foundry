/* gdrive.js
--------------------
* References the Google Drive API, and contains functions 
* to initialize google sign in, and connect to a user's google drive
* It also containts functions for creating files and folders, 
* as well as modify their permissions
*/

//Initializes the global array which will store information about each event's google drive folder
folderIds = [];

//Called when the client library is loaded.
function handleClientLoad() {
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth(true),1);
}

//Check if the current user has authorized the application.
//loadPopup parameter indicates whether it will try to load the popup authorization window immeidately
function checkAuth(loadPopup) {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: loadPopup}, handleAuthResult);
}

//Called when authorization server replies.
function handleAuthResult(authResult) {
  var gFolderBtn = document.getElementById('gFolder');
  if (authResult && !authResult.error) {
    
    //if user is authorized and the team is in progress but the folder hasn't been created it, create it
    if(in_progress && !flashTeamsJSON.folder && current_user == "Author"){
          createProjectFolder();
    }

    googleDriveLink();  

  } else {
    checkAuth(false);
    if(!in_progress || current_user == "Author" || !flashTeamsJSON.folder){
      $("#authorize-button").html('Log in to Google Drive™');
      $("#google-drive-button").toggleClass('gdrive-inactive', false);
      gFolderBtn.onclick = handleAuthClick; 
    }
    else{
      googleDriveLink();
    }

  }
}

//loads the authorization popup window when the user clicks on the log in to google drive button
function handleAuthClick(event) {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
  return false;
}


var googleDriveLink = function(){
    var gFolderBtn= document.getElementById("gFolder");

    // if(in_progress){
    //   $("#projectStatusText").toggleClass('projectStatusText-inactive', true);
    // }
    // else{
    //   $("#projectStatusText").toggleClass('projectStatusText-inactive', false);
    // }


    if(!in_progress || !flashTeamsJSON.folder){
      if (current_user == "Author" && flashTeamsJSON["startTime"]){
        $("#authorize-button").html('Google Drive™ folder');
        $("#google-drive-button").toggleClass('gdrive-inactive', false);
      }else{
        $("#authorize-button").html('Waiting for Google Drive™');
        $("#google-drive-button").toggleClass('gdrive-inactive', true);
      }
    }else{
      $("#authorize-button").html('Google Drive™ folder');
      $("#google-drive-button").toggleClass('gdrive-inactive', false);
    }

    gFolderBtn.onclick=function(){
        //console.log("is clicked");
        if((in_progress && flashTeamsJSON.folder) || (current_user == "Author" && flashTeamsJSON["startTime"])){
          logActivity("gFolderBtn.onclick=function()",'Clicked Google Drive Project Folder', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON); 
          window.open(flashTeamsJSON.folder[1]);
          

        }else{
          logActivity("gFolderBtn.onclick=function()",'Clicked Google Drive Project Folder - Error Alert Triggered', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
          alert("Team hasn't started or folder hasn't been created yet.");
        }
        
    }
};

//Creates the project's folder
function createProjectFolder(){
  
  //if team has been ended in the past (e.g., the google drive folder already exists), don't create a new one
  if(!in_progress && flashTeamsJSON["folder"] != undefined && flashTeamsJSON["startTime"] != undefined){
    //console.log('project folder already exists');
    return;
  }

  gapi.client.load('drive', 'v2', function() {
    var req;
    req = gapi.client.request({
        'path': '/drive/v2/files',
        'method': 'POST',
        'body':{
            "title" : flashTeamsJSON.title,
            "mimeType" : "application/vnd.google-apps.folder",
            "description" : "Overall Shared Folder"
         }
      });
      
      req.execute(function(resp) { 
        //console.log("resp: " + resp);
         //console.log("resp.id: " + resp.id);
         if(resp.id == undefined){
           //console.log("resp.id is undefined: " + resp);
           return;
         }

        var folderArray = [resp.id, resp.alternateLink];
        
        insertPermission(folderArray[0], "me", "anyone", "writer");
        flashTeamsJSON.folder = folderArray;
        
    updateStatus(); // don't put true or false here
        
    addAllTaskFolders(flashTeamsJSON.folder[0])

    googleDriveLink();

    logActivity("createProjectFolder()",'Created Project and Task Folders', new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
    });
    
    
  }); 
  
}

//Creates a subfolder for a particular task
function createTaskFolder(eventName, JSONId, parent_folder){
  
  gapi.client.load('drive', 'v2', function() {
    var req;
    req = gapi.client.request({
        'path': '/drive/v2/files',
        'method': 'POST',
        'body':{
            "title" : eventName,
            "mimeType" : "application/vnd.google-apps.folder",
            "description" : "Shared Folder",
            "parents": [{"id": parent_folder}]
         }
      });
      
      req.execute(function(resp) { 
        var folderArray = [resp.id, resp.alternateLink];
        
        flashTeamsJSON["events"][JSONId].gdrive = folderArray;
        insertPermission(folderArray[0], "me", "anyone", "writer");
        folderIds.push(folderArray);

    updateStatus(); // don't put true or false here
    });
    
    
  }); //end gapi.client.load
  
}

//Adds all the task folders when the folder has started
function addAllTaskFolders(parent_folder){
  for (var i = 0; i<flashTeamsJSON["events"].length; i++){
    createTaskFolder(flashTeamsJSON["events"][i].title, i, parent_folder);
  }
};


//Creates a new file
function createNewFile(eventName) {

    gapi.client.load('drive', 'v2', function() {

       var request = gapi.client.request({
        'path': '/drive/v2/files',
        'method': 'POST',
        'body':{
            "title" : eventName + ".gdoc",
            "mimeType" : "application/vnd.google-apps.document",
            "description" : "Shared Doc"//,
            // "parents": [{"id": "0B6l5YPiF_QFBUWtPaEgyOWZmOUk"}]
         }
     });

      request.execute(function(resp) {});
   });
};


/**
 * Rename a folder.
 *
 * @param {String} fileId <span style="font-size: 13px; ">ID of the file to rename.</span><br> * @param {String} newTitle New title for the file.
 */
function renameFolder(fileId, newTitle) {

    gapi.client.load('drive', 'v2', function() {

       var request = gapi.client.request({
        'path': '/drive/v2/files/'+fileId,
        'method': 'PATCH',
        'body':{
            //"fileId": fileId,
            "title" : newTitle,
            "mimeType" : "application/vnd.google-apps.folder"
         }
     });

      request.execute(function(resp) {});
   });
};


//Deletes a file
function deleteFile(fileId){
  gapi.client.load('drive', 'v2', function(){
    var request = gapi.client.drive.files.delete({
      'fileId': fileId
    });
    request.execute(function(resp) { });
  });
};

//Allows a changing of the permissions of a file or folder: roles can be checked on the Google API
function insertPermission(fileId, value, type, role) {
  var body = {
    'value': value,
    'type': type,
    'role': role,
    'withLink': true
  };
  var request = gapi.client.drive.permissions.insert({
    'fileId': fileId,
    'resource': body
  });
  request.execute(function(resp) { });
};
