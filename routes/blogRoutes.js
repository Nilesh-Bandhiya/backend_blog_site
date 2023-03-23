const express = require("express");
const {
  addBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs
} = require("../controller/blogController");
const authorizeUser = require("../middleware/auth");
const router = new express.Router();

router.get("/", authorizeUser, getAllBlogs);
router.get("/myblogs", authorizeUser, getMyBlogs);
router.post("/add", authorizeUser, addBlog);
router.get("/:blogId", authorizeUser, getBlog);
router.patch("/update/:blogId", authorizeUser, updateBlog);
router.delete("/delete/:blogId", authorizeUser, deleteBlog);

module.exports = router;
