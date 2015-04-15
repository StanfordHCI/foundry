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
  var authorizeButton = document.getElementById('gFolder');
  if (authResult && !authResult.error) {
    $("#authorize-button").html('Google Drive™ folder');
    googleDriveLink();
      if(!in_progress){ 
        hideGoogleDriveFolder();
      }else{
        if(!flashTeamsJSON.folder[1] && current_user == "Author"){
          createProjectFolder();
        }
        showGoogleDriveFolder();
      }    
  } else {
    checkAuth(false);
    $("#authorize-button").html('Login to Google Drive™');
    $("#google-drive-button").css('display','');
    authorizeButton.onclick = handleAuthClick; 
  }
}

//loads the authorization popup window when the user clicks on the login to google drive button
function handleAuthClick(event) {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
  return false;
}

//shows the google drive button in the left sidebar
function showGoogleDriveFolder(){
  $("#google-drive-button").css('display','');
}

//hides the google drive bar in the left sidebar if it is a worker 
//if is in author view and the team has been started (e.g., even if it ended), it will show the google drive folder
// this is because the author should always see the google drive folder when the team has ended but a worker shouldn't
function hideGoogleDriveFolder(){
  if(current_user == "Author" && flashTeamsJSON["startTime"]){
    showGoogleDriveFolder();
  }else{
    $("#google-drive-button").css('display','none');
  }
}

//Creates the project's folder
function createProjectFolder(){
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
        var folderArray = [resp.id, resp.alternateLink];
        
        insertPermission(folderArray[0], "me", "anyone", "writer");
        flashTeamsJSON.folder = folderArray;
        
    updateStatus(); // don't put true or false here
        
    addAllTaskFolders(flashTeamsJSON.folder[0])
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
