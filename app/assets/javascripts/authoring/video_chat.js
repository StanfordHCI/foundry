var comm = new Icecomm('yIkD3HFAWFNXV1qFkux9OqX8PPcAF8rLLQ6lM3hEJTFgcRI');

function createVideoConf(room_name){
	comm.connect(room_name);
	
	$("#vc").append('<video id="localVideo" autoplay></video>');

	$("#videoChatModal").modal('show');

  logActivity("createVideoConf(room_name)",('Created Video Conference - Room Name: ' + room_name), new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);
	
}


comm.on('connected', function(peer) {
  createRemoteVideo(peer.stream, peer.callerID);
});

comm.on('local', function(peer) {
  localVideo.src = peer.stream;
});

comm.on('disconnect', function(peer) {
  document.getElementById(peer.callerID).remove();
});

function disconnectVC(){
	comm.close();
	$("#videoChatModal").modal('hide');
  logActivity("disconnectVC()","Disconnected Video Conference", new Date().getTime(), current_user, chat_name, team_id, flashTeamsJSON);

	
}

$("#videoChatModal").on('hide', function () {
        window.location.reload();
    });

function createRemoteVideo(stream, key) {
  var remoteVideo = document.createElement('video');
  remoteVideo.src = stream;
  remoteVideo.id = key;
  remoteVideo.autoplay = true;
  $("#vc").append(remoteVideo);
}


