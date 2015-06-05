/* global io */
// budy.js
var testCode = {};
testCode = {
    init: function () {
        var close = document.getElementById("close");
        var form = document.getElementById("form");
        var formHide = false;

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
                var doc = document.body, 
                scrollPosition = doc.scrollTop;

                console.log('scroll position: ' + scrollPosition);
                //window.scrollTo(0,0); 
            }; 
        };
    }
};

var ws = {};
ws.socketio = {
    yoursocket: null,

    init: function () {

        ws.socketio.yoursocket = io.connect('http://localhost:2222');

        ws.socketio.yoursocket.on('connect', function () {
            ws.socketio.log('You are connected to Server<br />');
        });              

        ws.socketio.yoursocket.on('YourMessageResponse', function (data) {
            ws.socketio.log('Server Custom Response: ' + data + '<br />');
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

    log: function (message) {
        document.querySelector('#log').innerHTML += message;
    }
};
