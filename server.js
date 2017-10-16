import * as rpc from './rpc';
import webRTC from './js/signaling';
import { uploader } from './js/multerUploader';
var express = require('express');
var app = express();
var fs = require('fs');
var open = require('open');
var serverPort = 443;
const uploadServerPort = 80;
var options = {
  key: fs.readFileSync('./ssl/private.key'),
  cert: fs.readFileSync('./ssl/certificate.crt'),
  ca: fs.readFileSync('./ssl/ca_bundle.crt'),
};
var uploadServer = require('http').Server(app);
var server = require('https').Server(options, app);
var io = require('socket.io')(server);
var mongo = require('mongodb').MongoClient;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

uploader(app);

uploadServer.listen(uploadServerPort, () => {
  app.get('port');
  console.log('Server listen ' + uploadServerPort + ' is running');
});
server.listen(serverPort, () => {
  app.get('port');
  console.log('Server listen ' + serverPort + ' is running');
  open('https://localhost:' + serverPort);
});

mongo.connect('mongodb://localhost:27017/ChatApp', (err, db) => {
  const sessionDb = db.collection('Session');
  io.on('connection', socket => {
    console.log('connect!');
    socket.on('connector', () => io.emit('userConnection'));
    rpc.register(socket, db);
    rpc.login(socket, db);
    rpc.addFriends(socket, db);
    webRTC(io, socket);
  });
});
