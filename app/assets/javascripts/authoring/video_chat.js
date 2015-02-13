var comm = new Icecomm('47SZFqOPw46qw5PrJxOWDSUrQYix/aoeRodBwfIPecrGHzkY');

function createVideoConf(room_name){
	comm.connect(room_name);
	
	$("#vc").append('<video id="localVideo" autoplay></video>');

	//$("#vc").html('<video id="localVideo" autoplay></video>');
	$("#videoChatModal").modal('show');
}


comm.on('connected', function(options) {
  createRemoteVideo(options.stream, options.callerID);
});

comm.on('local', function(options) {
  localVideo.src = options.stream;
});

comm.on('disconnect', function(options) {
  document.getElementById(options.callerID).remove();
});

function disconnectVC(){
	comm.close();
	$("video").remove();
	$("#videoChatModal").modal('hide');
	
}

function createRemoteVideo(stream, key) {
  var remoteVideo = document.createElement('video');
  remoteVideo.src = stream;
  remoteVideo.id = key;
  remoteVideo.autoplay = true;
  $("#vc").append(remoteVideo);
  ///document.body.appendChild(remoteVideo);
  //$("#task-modal-body").html('<video id="localVideo" autoplay></video>');
}

/*
comm.connect('custom room', {audio: false});

comm.on('connected', function(options) {
   document.body.appendChild(options.video);
});

comm.on('local', function(options) {
  localVideo.src = options.stream;
});

comm.on('disconnect', function(options) {
  document.getElementById(options.callerID).remove();
});
*/	
