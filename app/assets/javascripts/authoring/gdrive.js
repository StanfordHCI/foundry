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
  checkAuth();
};

//Check if the current user has authorized the application.
function checkAuth() {
  gapi.auth.authorize(
      {'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': false},
      handleAuthResult2);
};

//Called when authorization server replies.
function handleAuthResult2(authResult) {
  if (authResult) {
    // Access token has been successfully retrieved, requests can be sent to the API
  } else {
    // No access token could be retrieved, force the authorization flow.
    gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
        handleAuthResult2);
  }
};


//Functions that authorize the API`
function onAuthApiLoad() {
  gapi.auth.authorize(
    {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
    handleAuthResult);
};

function onApiLoad(){
      gapi.load('auth', {'callback': onAuthApiLoad});
      gapi.load('picker');
};


/*
* The following code creates and runs a file picker
*/

var oauthToken;
function handleAuthResult(authResult){
  if (authResult && !authResult.error){
    oauthToken = authResult.access_token;
    createPicker();
  }
};

function createPicker(){
  var docUpload = new google.picker.DocsUploadView();
  var picker = new google.picker.PickerBuilder()
    .addView(docUpload)
    .setOAuthToken(oauthToken)
    .setDeveloperKey(GDRIVE_DEV_KEY)
    .setCallback(pickerCallback)
    .build()
  picker.setVisible(true);
};

function pickerCallback(data){
  if (data.action == google.picker.Action.PICKED){
    alert('URL: ' + data.docs[0].url);
  }
};

// -----------------------------------------------------


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

/**
 * Rename a file.
 *
 * @param {String} fileId <span style="font-size: 13px; ">ID of the file to rename.</span><br> * @param {String} newTitle New title for the file.
 */
// function renameFile(fileId, newTitle) {
//   var body = {'title': newTitle};
//   var request = gapi.client.drive.files.patch({
//     'fileId': fileId,
//     'resource': body
//   });
//   request.execute(function(resp) {
//     console.log('New Title: ' + resp.title);
//   });
// }


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
