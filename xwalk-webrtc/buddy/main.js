/*global Peer */
var websocket = new WebSocket('ws://10.192.217.32:1234');
var dataConnection;
document.addEventListener('DOMContentLoaded', function () {
    // PeerJS server location
    var SERVER_IP = '10.192.217.32';
    var SERVER_PORT = 9000;

    // DOM elements manipulated as user interacts with the app
    var messageBox = document.querySelector('#messages');
    var callerIdEntry = document.querySelector('#caller-id');
    var connectBtn = document.querySelector('#connect'); 
    var recipientIdEntry = document.querySelector('#recipient-id');
    var dialBtn = document.querySelector('#dial');
    var remoteVideo = document.querySelector('#remote-video');
    var localVideo = document.querySelector('#local-video');
    // controller
    var controler = document.getElementById("controls");
    var test = document.getElementById("test");

    // the ID set for this client
    var callerId = null;

    // PeerJS object, instantiated when this client connects with its
    // caller ID
    var peer = null;

    // Data connection for sending messages to peers
    //var dataConnection = null;

    // the local video stream captured with getUserMedia()
    var localStream = null;

    // DOM utilities
    var makePara = function (text) {
        var p = document.createElement('p');
        p.innerText = text;
        return p;
    };

    var addMessage = function (para) {
        if (messageBox.firstChild) {
            messageBox.insertBefore(para, messageBox.firstChild);
        }
        else {
            messageBox.appendChild(para);
        }
    };

    var logError = function (text) {
        var p = makePara('ERROR: ' + text);
        p.style.color = 'red';
        addMessage(p);
    };

    var logMessage = function (text) {
        addMessage(makePara(text));
    };

    // get the local video and audio stream and show preview in the
    // "LOCAL" video element
    // successCb: has the signature successCb(stream); receives
    // the local video stream as an argument
    var getLocalStream = function (successCb) {
        if (localStream && successCb) {
            successCb(localStream);
        }
        else {
            navigator.webkitGetUserMedia(
                {
                audio: false,
                video: true
            },

            function (stream) {
                localStream = stream;

                localVideo.src = window.URL.createObjectURL(stream);

                if (successCb) {
                    successCb(stream);
                }
            },

            function (err) {
                logError('failed to access local camera');
                logError(err.message);
            }
            );
        }
    };

    // set the "REMOTE" video element source
    var showRemoteStream = function (stream) {
        remoteVideo.src = window.URL.createObjectURL(stream);
    };

    // set caller ID and connect to the PeerJS server
    var connect = function () {
        callerId = callerIdEntry.value;

        if (!callerId) {
            logError('please set caller ID first');
            return;
        }

        try {
            // create connection to the ID server
            peer = new Peer(callerId, {host: SERVER_IP, port: SERVER_PORT});


            // hack to get around the fact that if a server connection cannot
            // be established, the peer and its socket property both still have
            // open === true; instead, listen to the wrapped WebSocket
            // and show an error if its readyState becomes CLOSED
            peer.socket._socket.onclose = function () {
                logError('no connection to server');
                peer = null;
            };

            // get local stream ready for incoming calls once the wrapped
            // WebSocket is open
            peer.socket._socket.onopen = function () {
                getLocalStream();
            };

            // handle events representing incoming calls
            peer.on('call', answer);

            peer.on('open', function () {
                console.log('open from connect(): ');
                peer.on('data', function (data) {
                    console.log('data from connect(): ', data);
                });
                peer.send({msg: "bitch"});
            });

        }
        catch (e) {
            peer = null;
            logError('error while connecting to server');
        }
    };

    var initDataConn = function(peer, id) {
        //var cameraId = 'cam';
        dataConnection = peer.connect(id, {serialization: "json"});
        dataConnection.on('open', function () {
            console.log('data connection open with: ' + id);
            dataConnection.on('data', function (data) {
                console.log('recieved data: ' + data);
            });
            dataConnection.send({msg: "BUDDDYYY"});
        });
        console.log(dataConnection);
    };

    // make an outgoing call
    var dial = function () {
        if (!peer) {
            logError('please connect first');
            return;
        }

        if (!localStream) {
            logError('could not start call as there is no local camera');
            return;
        }

        var recipientId = recipientIdEntry.value;

        if (!recipientId) {
            logError('could not start call as no recipient ID is set');
            return;
        }

        //dataConnection = peer.connect(callerId);
        initDataConn(peer, recipientId);

        getLocalStream(function (stream) {
            logMessage('outgoing call initiated');

            var call = peer.call(recipientId, stream);

            call.on('stream', showRemoteStream);

            call.on('error', function (e) {
                logError('error with call');
                logError(e.message);
            });
        });
    };
    
    // answer an incoming call
    var answer = function (call) {
        if (!peer) {
            logError('cannot answer a call without a connection');
            return;
        }

        if (!localStream) {
            logError('could not answer call as there is no localStream ready');
            return;
        }

        logMessage('incoming call answered');

        call.on('stream', showRemoteStream);

        call.answer(localStream);
    };

    var getDataConn = function () {
        return dataConnection;
    };

    var controlEvent = function (target) {
        var dataConn = getDataConn();
        dataConn.send({
            msg: target
        });
    };

    // wire up button events
    connectBtn.addEventListener('click', connect);
    dialBtn.addEventListener('click', dial);
    // controler
    controler.addEventListener('click', function(event) {
        controlEvent(event.target.id);
    });
});
