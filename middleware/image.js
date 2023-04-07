const multer = require('multer');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'images');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now().toString() + '_' + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('Please Upload image Jpg|Jpeg|Png'))
  }
  cb(null, true);
}

const upload = multer({ storage: fileStorage, fileFilter: fileFilter  })

module.exports = {upload}