"use strict";
var pc = null;
var streams = [];
function OnStart()  {
  var servers = null;
  pc = new RTCPeerConnection(servers);
  pc.onicecandidate = OnIceCandidate;
  pc.ontrack = OnTrack;
  pc.createOffer(OnCreateOfferSuccess,OnCreateSessionDescriptionError,offerOptions);
}
function CreateVideo() {
  var constrains = {
    "video":true,
    "audio":false
  };
  var stream = navigator.mediaDevices.getUserMedia(constrains);
  var tracks = stream.getVideoTracks();
  var track = tracks[0];
  pc.addTrack(track,stream);
}

function OnIceCandidate(event) {
  pc.addIceCandidate(event.candidate).then(
    function() { OnAddIceCandidateSuccess(pc); },
    function(e) { OnAddIceCandidateError(pc,e); }
  );
}
function OnAddIceCandidateSuccess(pc1) {
  console.log("Add Ice Candidate: " + pc1 + " Success");
}
function OnAddIceCandidateError(pc1,e) {
  console.log("Add Ice Candidate: " + pc1 + " Error " + e);
}

function OnTrack(event) {
  for(var i = 0; i < streams.length; i++) {
    if (streams[i] == event.streams[0]) {
      return;
    }
  }
  streams.push(event.streams[0]);
  var vid = document.createElement("video");
  vid.autoplay = true;
  vid.srcObject = event.streams[0];
  document.getElementById("OtherStreams").appendChild(vid);
}

function OnCreateOfferSuccess(desc) {
  console.log("Setting Local Description");
  pc.setLocalDescriotion(desc,OnSetLocalSuccess,OnSetLocalError);
}
function OnSetLocalSuccess() {
  console.log("Local Description Has Been Set");
}
function OnSetLocalError(e) {
  console.error("Set Local Description Error: " + e);
}
