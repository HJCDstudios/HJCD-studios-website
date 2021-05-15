"use strict";
var pc = null;
var streams = [];
var offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};
function OnStart()  {
  console.log("Creating RTCPeer");
  var servers = null;
  pc = new RTCPeerConnection(servers);
  pc.onicecandidate = OnIceCandidate;
  pc.onconnectionstatechange = OnIceStateChange;
  pc.ontrack = OnTrack;
  
  var stream = navigator.mediaDevices.getUserMedia({
    "video":true,
    "audio":false
  }).then(function(s) {
    document.getElementById("MyStream").srcObject = s;
    stream.getTracks().forEach(function(track) {
      pc.addTrack(track,stream);
    });
  });
  try {
    console.log('pc createOffer start');
    var offer = pc.createOffer(offerOptions);
    OnCreateOfferSuccess(offer);
  } catch (e) {
    onCreateSessionDescriptionError(e);
  }
}

function OnIceCandidate(event) {
  pc.addIceCandidate(event.candidate).then(
    OnAddIceCandidateSuccess,
    OnAddIceCandidateError
  );
}
function OnAddIceCandidateSuccess() {
  console.log("Add Ice Candidate Success");
}
function OnAddIceCandidateError(e) {
  console.error("Add Ice Candidate Error\n",e);
}

function OnTrack(event) {
  var vid = document.createElement("video");
  if (vid.srcObject != event.streams[0]) {
    vid.srcObject = event.streams[0];
    console.log("Received a track:\n",event);
  }
}

function OnCreateOfferSuccess(desc) {
  console.log("Setting Local Description");
  pc.setLocalDescription(desc,OnSetLocalSuccess,OnSetLocalError);
}
function OnSetLocalSuccess() {
  console.log("Local Description Has Been Set");
}
function OnSetLocalError(e) {
  console.error("Set Local Description Error\n",e);
}

function OnCreateSessionDescriptionError(e) {
  console.error("OCDE Error\n",e);
}

function OnIceStateChange(event) {
  if (pc) {
    console.log("ICE state: " + pc.iceConnectionState);
    console.log("ICE state change event: ", event);
  }
}
