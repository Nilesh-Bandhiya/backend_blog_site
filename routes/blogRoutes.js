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
const router = new express.Router();

router.get("/", getAllBlogs);
router.get("/myblogs", authorizeAdmin, getMyBlogs);
router.post("/add", authorizeAdmin, addBlog);
router.get("/:blogId", authorizeUser, getBlog);
router.patch("/update/:blogId", authorizeAdmin, updateBlog);
router.delete("/delete/:blogId", authorizeAdmin, deleteBlog);

module.exports = router;
