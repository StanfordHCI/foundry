 var last_notification = null;

function notifyMe(notif_title, notif_body, notif_tag) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    currentTeam.logActivity("notifyMe(notif_title, notif_body, notif_tag)", "This browser does not support desktop notification", flashTeamsJSON);
    alert("This browser does not support desktop notification");
  }

  // Let's check if the user is okay to get some notification
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
	   showNotif(notif_title, notif_body, notif_tag);
  }


  // Otherwise, we need to ask the user for permission
  // Note, Chrome does not implement the permission static property
  // So we have to check for NOT 'denied' instead of 'default'
  else if (Notification.permission !== 'denied') {

    Notification.requestPermission(function (permission) {
        currentTeam.logActivity("notifyMe(notif_title, notif_body, notif_tag)", 'Notification.requestPermission(function (permission)', flashTeamsJSON);


      // Whatever the user answers, we make sure we store the information
      if(!('permission' in Notification)) {
        Notification.permission = permission;
        currentTeam.logActivity("notifyMe(notif_title, notif_body, notif_tag)", 'Save Notification.requestPermission(function (permission): Notification.permission = ' + permission, flashTeamsJSON);

      }
      // If the user is okay, let's create a notification
      if (permission === "granted") {
		    showNotif(notif_title, notif_body, notif_tag);
      }
    });

  }

  // At last, if the user already denied any notification, and you
  // want to be respectful there is no need to bother him any more.
}

function showNotif(notif_title, notif_body, notif_tag){
	closeNotif(last_notification); //close any notifications that might exist from previous sessions

	var notification = new Notification(notif_title, {body: notif_body, tag: notif_tag});

  currentTeam.logActivity("showNotif(notif_title, notif_body, notif_tag)", 'Show Notification: ' + notif_title, notification);


  //automatically closes the notification after 5 seconds
  notification.onshow = function () {
    setTimeout(notification.close.bind(notification), 5000);
  }

    notification.addEventListener('click', closeNotif(last_notification));

    notification.addEventListener('close', closeNotif(last_notification));

    playSound("/assets/notify");

    last_notification = notification;

}

function closeNotif(notif){
  if (last_notification == null)
    return;

  last_notification.close();
  last_notification = null;
}


//filename without extension (can be a path like "assets/notify")
function playSound(filename){
    document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="' +
    filename + '.mp3" type="audio/mpeg" /><source src="' + filename
    + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="'
    + filename +'.mp3" /></audio>';
}

