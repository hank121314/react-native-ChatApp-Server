import * as rpc from './rpc';
import webRTC from './js/signaling';
import { uploader } from './js/multerUploader';
var express = require('express');
var app = express();
var fs = require('fs');
var open = require('open');
var serverPort = 443;
var options = {
  key: fs.readFileSync('./ssl/private.key'),
  cert: fs.readFileSync('./ssl/certificate.crt'),
  ca: fs.readFileSync('./ssl/ca_bundle.crt'),
};
var server = require('https').Server(options, app);
var io = require('socket.io')(server);
var mongo = require('mongodb').MongoClient;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

uploader(app);

server.listen(serverPort, () => {
  app.get('port');
  console.log('Server listen ' + serverPort + ' is running');
});

mongo.connect('mongodb://localhost:27017/ChatApp', (err, db) => {
  io.on('connection', socket => {
    console.log('connect!');
    socket.on('connector', () => io.emit('userConnection'));
    rpc.register(socket, db);
    rpc.login(socket, db);
    rpc.addFriends(socket, db);
    webRTC(io, socket);
  });
});
