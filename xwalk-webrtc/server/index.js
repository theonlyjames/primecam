var ip = require('ip');
var PeerServer = require('peer').PeerServer;

var port = 9000;
var server = new PeerServer({port: port});

server.on('connection', function (id) {
    console.log('new connection with id ' + id);
});

server.on('disconnect', function (id) {
    console.log('disconnect with id ' + id);
});

console.log('peer server running on ' +
            ip.address() + ':' + port);
