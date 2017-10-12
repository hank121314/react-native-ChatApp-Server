const socketIdsInRoom = (io, name) => {
  var socketIds = io.of('/').adapter.rooms[name];
  if (socketIds) {
    var collection = [];
    Object.values(socketIds).forEach((t, i) => {
      if (i % 2 === 0) {
        collection.push(Object.keys(t)[0]);
      } else {
        return;
      }
    });
    return collection;
  } else {
    return [];
  }
};
export default function webRTC(io, socket) {
  socket.on('webRTCConnect', () => {
    socket.emit('webRTCConnected');
  });
  socket.on('disconnect', function() {
    console.log('disconnect');
    if (socket.room) {
      var room = socket.room;
      io.to(room).emit('leave', socket.id);
      socket.leave(room);
    }
  });
  socket.on('join', (name, callback) => {
    console.log('join', name);
    var socketIds = socketIdsInRoom(io, name);
    console.log('socketRoom', socketIds);
    callback(socketIds);
    socket.join(name);
    socket.room = name;
  });
  socket.on('exchange', data => {
    console.log('exchange', data);
    data.from = socket.id;
    io.of('/').connected[data.to].emit('exchange', data);
  });
}
