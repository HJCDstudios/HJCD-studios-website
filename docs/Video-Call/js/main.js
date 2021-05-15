"use strict";
var pc = null;
var streams = [];
var offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};
function OnStart()  {
  var servers = null;
  pc = new RTCPeerConnection(servers);
  pc.onicecandidate = OnIceCandidate;
  pc.ontrack = OnTrack;
  pc.createOffer(OnCreateOfferSuccess,OnCreateSessionDescriptionError,offerOptions);
}
function CreateVideo() {
  console.log("Creating Video");
  var constrains = {
    "video":true,
    "audio":false
  };
  var stream = navigator.mediaDevices.getUserMedia(constrains);
  var tracks = stream.getVideoTracks();
  pc.addTrack(tracks[0],stream);
}

function OnIceCandidate(event) {
  pc.addIceCandidate(event.candidate).then(
    function() {
      OnAddIceCandidateSuccess(event.candidate);
    },
    function(e) {
      OnAddIceCandidateError(event.candidate,e);
    }
  );
}
function OnAddIceCandidateSuccess(pc1) {
  console.log("Add Ice Candidate: " + pc1 + " Success");
}
function OnAddIceCandidateError(pc1,e) {
  console.log("Add Ice Candidate: " + pc1 + " Error\n" + e);
}

function OnTrack(event) {
  for(var i = 0; i < streams.length; i++) {
    if (streams[i] == event.streams[0]) {
      return;
    }
  }
  streams.push(event.streams[0]);
  var vid = document.createElement("video");
  vid.srcObject = event.streams[0];
  console.log("Received a track:\n",event);
}

function OnCreateOfferSuccess(desc) {
  console.log("Setting Local Description");
  pc.setLocalDescription(desc,OnSetLocalSuccess,OnSetLocalError);
}
function OnSetLocalSuccess() {
  console.log("Local Description Has Been Set");
}
function OnSetLocalError(e) {
  console.error("Set Local Description Error: " + e);
}

function OnCreateSessionDescriptionError(e) {
  console.error("OCDE Error\n" + e);
}
