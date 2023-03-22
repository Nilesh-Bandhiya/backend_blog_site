const Blog = require("../models/blogsModel");

const addBlog = async (req, res) => {
  const formData = req.body;
  try {
    const data = { ...formData, userId: req.user };
    const blog = new Blog(data);
    const cretedBlog = await blog.save();

    res.status(201).json({ msg: "Blog Added Successfully", data: cretedBlog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
const getBlog = async (req, res) => {
  const { blogId } = req.params;
  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      res.status(404).json({ msg: "Blog not Found" });
    }

    res.status(200).json({ msg: "Blogs Fetched Successfully", data: blog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
const updateBlog = async (req, res) => {
  const { blogId } = req.params;
  const formData = req.body;
  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      res.status(404).json({ msg: "Blog not Found" });
    }

    if (blog.userId.toString() !== req.user.toString()) {
      res.status(401).json({ msg: "Only Blog Owner Update the Blog" });
    }

    const updetedBlog = await Blog.findByIdAndUpdate(blogId, formData, {
      new: true,
    });

    res
      .status(200)
      .json({ msg: "Blog Updated Successfully", data: updetedBlog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
const deleteBlog = async (req, res) => {
  const { blogId } = req.params;
  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      res.status(404).json({ msg: "Blog not Found" });
    }

    if (blog.userId.toString() !== req.user.toString()) {
      res.status(401).json({ msg: "Only Blog Owner Delete the Blog" });
    }

    await Blog.findByIdAndDelete(blogId);

    res.status(200).json({ msg: "Blog Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.status(200).json({ msg: "Blogs Fetched Successfully", data: blogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ userId: req.user });
    res.status(200).json({ msg: "Blogs Fetched Successfully", data: blogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


module.exports = {
  addBlog,
  getBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getMyBlogs,
};
