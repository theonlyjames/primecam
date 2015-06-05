// ws.js

HTML5WebSockets.socketio = {
    yoursocket: null,

    initialize: function () {

        HTML5WebSockets.socketio.yoursocket = io.connect('http://localhost:22222');

        HTML5WebSockets.socketio.yoursocket.on('connect', function () {
            HTML5WebSockets.socketio.log('You are connected to Server<br />');
        });

        HTML5WebSockets.socketio.yoursocket.on('YourMessageResponse', function (data) {
            HTML5WebSockets.socketio.log('Server Custom Response: ' + data + '<br />');
        });

        HTML5WebSockets.socketio.yoursocket.on('disconnect', function () {
            HTML5WebSockets.socketio.log('You are disconnected from Server<br />');
        });

        document.querySelector('#sendCustMes').onclick = function () {
            HTML5WebSockets.socketio.emitCustomMessageToServer(document.querySelector('#custMes').value);
            document.querySelector('#custMes').value = '';
        };
    },

    emitCustomMessageToServer: function (data) {
        HTML5WebSockets.socketio.yoursocket.emit('YourcustomMessage', data);
        HTML5WebSockets.socketio.log('Custom message to Server: ' + data + '<br />');
    },