/* global io */
// view.js

var viewport = (function () {
    var publicApi = {
        doc: null,
        init: function () {
            this.doc = document.body;
        },
        scrollLeft: function (data) {
            this.doc.scrollLeft = data.yscroll;
            this.doc.scrollTop = data.xscroll;
        }
    };
    return publicApi;
})();

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

        // Y scroll event listener
        ws.socketio.yoursocket.on('yScrollResponse', function (data) {
            viewport.scrollLeft(data);
            //ws.socketio.log('yscrol response view: ' + data + '<br />');
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
