import { success } from 'Schema/Success';
import { error } from 'Schema/Failed';
const Promise = require('bluebird');

export default function addFriends(socket, db) {
  socket.on('addFriends', data => {
    const usrDb = db.collection('UserInformation');
    usrDb.find({ username: data.parm.username }).toArray((err, result) => {
      usrDb.find({ username: data.parm.friends }).toArray((err, registered) => {
        socket.emit(
          'addFriendsRequest',
          new Promise((resolve, reject) => {
            if (registered.length !== 0) {
              if (registered[0].username === result[0].username) {
                return reject(error('Same user', '001', 'This is your username!'));
              }
              let friendsList;
              if (result[0].friendsList) {
                friendsList = result[0].friendsList.concat(data.parm.friends);
              } else {
                friendsList = [data.parm.friends];
              }
              const newFriends = { $set: { friendsList: friendsList } };
              usrDb.updateOne(result[0], newFriends, (err, updated) => {});
              resolve(success(data.parm));
            } else
              reject(
                error('Username not exist', '001', 'This username is not exist!Please Register!')
              );
          })
        );
      });
    });
  });
}
