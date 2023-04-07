const express = require("express");
const {
  addBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs
} = require("../controller/blogController");
const { authorizeUser, authorizeAdmin } = require("../middleware/auth");
const { upload } = require("../middleware/image");
const router = new express.Router();

router.get("/", getAllBlogs);
router.get("/myblogs", authorizeAdmin, getMyBlogs);
router.post("/add", authorizeAdmin, upload.single('image'), addBlog);
router.get("/:blogId", authorizeUser, getBlog);
router.patch("/update/:blogId", authorizeAdmin, upload.single('image'), updateBlog);
router.delete("/delete/:blogId", authorizeAdmin, deleteBlog);

module.exports = router;
