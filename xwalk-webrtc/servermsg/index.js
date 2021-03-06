var http = require('http');
var io = require('socket.io');

var yourserver = http.createServer(function (request, response) {
    response.writeHead(250, { 'Content-Type': 'text/html' });
    response.end('Your WebSocket server is running');
}).listen(2222);

var yoursocket = io.listen(yourserver); //.set('log', 1);

yoursocket.on('connection', function (client) {
    client.on('YourcustomMessage', function (data) {
        console.log('Client Custom Message: ', data);

        var current = new Date().getTime();

        client.broadcast.emit('YourMessageResponse', data + '(broadcasted)->' + current);
    });
    client.on('yScrollEvent', function (data) {
        console.log('yScroll Event: ', data);

        client.broadcast.emit('yScrollResponse', data);
    });
    client.on('disconnect', function () {
        console.log('Your Client disconnected');
    });
});
