import { success } from 'Schema/Success';
import { error } from 'Schema/Failed';
const Promise = require('bluebird');
const uuidV4 = require('uuid/v4');

export default function login(socket, db) {
  socket.on('login', data => {
    const usrDb = db.collection('UserInformation');
    const sessionDb = db.collection('Session');
    usrDb
      .find({ username: data.parm.username, password: data.parm.password })
      .toArray((err, result) => {
        console.log(result);
        socket.emit(
          'loginRequest',
          new Promise((resolve, reject) => {
            if (result.length !== 0) {
              sessionDb.find({ username: data.parm.username }).toArray((err, response) => {
                console.log(response);
                if (response.length === 0) {
                  sessionDb.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
                  const value = {
                    username: data.parm.username,
                    session: uuidV4(),
                    expireAt: new Date(new Date().valueOf() + 1 * 24 * 60 * 60 * 1000),
                  };
                  sessionDb.insert(value);
                } else {
                  const expireTime = {
                    $set: { expireAt: new Date(new Date().valueOf() + 1 * 24 * 60 * 60 * 1000) },
                  };
                  sessionDb.updateOne(response[0], expireTime, (err, updated) => {});
                }
              });
              resolve(success(data.parm));
            } else
              reject(
                error('Username not exist', '001', 'This username is not exist!Please Register!')
              );
          })
        );
      });
  });
}
