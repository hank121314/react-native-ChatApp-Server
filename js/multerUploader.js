const multer = require('multer');
const fs = require('fs');

const createFolder = folder => {
  try {
    fs.accessSync(folder);
  } catch (e) {
    fs.mkdirSync(folder);
  }
};

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const str = file.originalname.split('-');
    console.log(str[0]);
    var uploadFolder = './data/image/' + str[0] + '/';
    createFolder(uploadFolder);
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
