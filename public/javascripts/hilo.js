'use strict';

var socket = io();

var hilovideo = document.getElementById("hilovideo");
var cuuvideo = document.getElementById("cuuvideo");

var constraints = window.constraints = {
  video: true,
  audio: true
};

navigator.getUserMedia(constraints, success, fail);

function success(stream){
  var url = window.URL.createObjectURL(stream);
  cuuvideo.src = url;
  createPeerConnections(stream);
}

function fail(error){
  console.error("Error: ",error);
}


function createPeerConnections(stream){

  var localPeer = new webkitRTCPeerConnection(null);

  localPeer.onicecandidate = function(evt){
    if(evt.candidate){
      socket.emit("ice candidate hilo", evt.candidate);
    }
  }
  localPeer.addStream(stream);

  socket.on("remote description", function(desc){

    console.log("Ya tienes la descripcion de Chihuahua");
    localPeer.setRemoteDescription(new RTCSessionDescription(desc));

    localPeer.createAnswer(function(desc){

      localPeer.setLocalDescription(desc);
      socket.emit("hermosillo answer", desc);

    },logError);

  });

  socket.on("ice candidate cuu", function(candidate){
    var can = new RTCIceCandidate(candidate);
    localPeer.addIceCandidate(can);
  });

  localPeer.onaddstream = function gotRemoteStream(event){
    console.log("Recive stream from Chihuahua!");
    var url = window.URL.createObjectURL(event.stream);
    hilovideo.src = url;
  }

  function logError(error){
    console.log("Error: ",error);
  }

}
