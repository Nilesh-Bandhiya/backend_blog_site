const express = require("express");

const multer = require('multer');


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './images');
  },
  filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '_' + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('Please Upload image Jpg|Jpeg|Png'))
  }
  cb(null, true);
}

const upload = multer({ storage: fileStorage, fileFilter: fileFilter  })

const {
  addBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs
} = require("../controller/blogController");
const { authorizeUser, authorizeAdmin } = require("../middleware/auth");
const router = new express.Router();

router.get("/", getAllBlogs);
router.get("/myblogs", authorizeAdmin, getMyBlogs);
router.post("/add", authorizeAdmin, upload.single('image'), addBlog);
router.get("/:blogId", authorizeUser, getBlog);
router.patch("/update/:blogId", authorizeAdmin, updateBlog);
router.delete("/delete/:blogId", authorizeAdmin, deleteBlog);

module.exports = router;
