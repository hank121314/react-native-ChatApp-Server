import { success } from 'Schema/Success';
import { error } from 'Schema/Failed';
const Promise = require('bluebird');

export default function register(socket, db) {
  socket.on('register', data => {
    const usrDb = db.collection('UserInformation');
    usrDb.find({ username: data.parm.username }).toArray((err, result) => {
      socket.emit(
        'registerRequest',
        new Promise((resolve, reject) => {
          if (result.length === 0) {
            usrDb.insert(data.parm);
            resolve(success(data.parm));
          } else {
            return reject(error('Username duplicate', '001', 'This username is exist'));
          }
        })
      );
    });
  });
}
