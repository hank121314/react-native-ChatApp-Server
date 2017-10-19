const multer = require('multer');
const fs = require('fs');

const createFolder = folder => {
  try {
    fs.accessSync(folder);
  } catch (e) {
    fs.mkdirSync(folder);
  }
};

var uploadFolder = './data/image/';

createFolder(uploadFolder);

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    var uploadFolder = './data/image/';
    console.log('file', file);
    cb(null, uploadFolder); // 保存的路径，备注：需要自己创建
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

export const uploader = app => {
  app.post('/upload', upload.single('file'), function(req, res, next) {
    var file = req.body;
  });
};
