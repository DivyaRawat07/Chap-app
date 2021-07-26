var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = [];

app.use('/', express.static(__dirname + '/www'));
server.listen(process.env.PORT || 3000);
console.log('Server started on port 3000');

io.sockets.on('connection', function(socket) {
    
    socket.on('login', function(name) {
        if (users.indexOf(name) > -1) {
            socket.emit('nameExisted');
        } else {
            socket.name = name;
            users.push(name);
            socket.emit('loginSuccess');
            io.sockets.emit('system', name, users.length, 'login');
        };
    });

    socket.on('disconnect', function() {
        if (socket.name != null) {
            users.splice(users.indexOf(socket.name), 1);
            socket.broadcast.emit('system', socket.name, users.length, 'logout');
        }
    });
    
    socket.on('postMsg', function(msg, color) {
        socket.broadcast.emit('newMsg', socket.name, msg, color);
    });
    
    socket.on('img', function(imgData, color) {
        socket.broadcast.emit('newImg', socket.name, imgData, color);
    });
});
