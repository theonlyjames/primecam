/* global io */
// budy.js
var testCode = {};
testCode = {
    init: function () {
        var close = document.getElementById("close");
        var form = document.getElementById("form");
        var formHide = false;
        var scrllTop = 0;
        var scrllLeft = 0;

        close.onclick = function () {
            if (formHide === false) {
                form.style.display = "none";
                formHide = true;
            } else {
                form.style.display = "block";
                formHide = false;
            }
        };
        window.onload = function () { 
            window.onscroll = function () { 
                var doc = document.body;
                scrllLeft = doc.scrollLeft;
                scrllTop = doc.scrollTop;


                // Emit over ws
                ws.socketio.emitYscroll({
                    yscroll: scrllLeft,
                    xscroll: scrllTop
                });

                //console.log('scroll position x: ' + scrllLeft + ' y: ' + scrllTop);
                //window.scrollTo(0,0); 
            }; 
        };
    }
};

var ws = {};
ws.socketio = {
    yoursocket: null,

    init: function () {

        ws.socketio.yoursocket = io.connect('http://10.192.217.32:2222');

        ws.socketio.yoursocket.on('connect', function () {
            ws.socketio.log('You are connected to Server<br />');
        });              

        ws.socketio.yoursocket.on('YourMessageResponse', function (data) {
            ws.socketio.log('Server Custom Response: ' + data + '<br />');
        });

        // Y scroll
        ws.socketio.yoursocket.on('yScrollResponse', function (data) {
            ws.socketio.log('Server Y Scroll Response: ' + data.yscroll + '<br />');
        });

        ws.socketio.yoursocket.on('disconnect', function () {
            ws.socketio.log('You are disconnected from Server<br />');
        });              

        document.querySelector('#wstest').onclick = function () {
            ws.socketio.emitCustomMessageToServer(document.querySelector('#custMes').value);
            document.querySelector('#custMes').value = '';
        };
    },         

    emitCustomMessageToServer: function (data) {
        ws.socketio.yoursocket.emit('YourcustomMessage', data);
        ws.socketio.log('Custom message to Server: ' + data + '<br />');
    },

    emitYscroll: function(data) {
        ws.socketio.yoursocket.emit('yScrollEvent', data);
        ws.socketio.log('Custom message to Server: ' + data + '<br />');
    },

    log: function (message) {
        document.querySelector('#log').innerHTML += message;
    }
};
