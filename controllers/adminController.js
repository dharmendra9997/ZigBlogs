

const User = require('../models/User');
const Blog = require('../models/Blog');
const Category = require('../models/Category');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Authentication


// GET /admin/login
exports.getLogin = (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return res.redirect('/admin/dashboard');
    } catch (err) {
      res.clearCookie('token');
    }
  }
  
  res.render('admin/login', { error: null, layout: 'admin/loginLayout' });
};

// POST /admin/login
exports.postLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await User.findOne({ username });
    if (!admin) {
      return res.render('admin/login', { error: 'Invalid credentials', layout: 'admin/loginLayout' });
    }
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.render('admin/login', { error: 'Invalid credentials', layout: 'admin/loginLayout' });
    }
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('token', token, { httpOnly: true });
    return res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    return res.render('admin/login', { error: 'Server error', layout: 'admin/loginLayout' });
  }
};


// Dashboard & Blog Management


// GET /admin/dashboard
exports.dashboard = async (req, res) => {
  try {
    
    const blogs = await Blog.find().populate('category').sort({ createdAt: -1 });
    res.render('admin/dashboard', { blogs, layout: 'admin/layout', title: 'Dashboard' });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Server error');
  }
};

// GET /admin/blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('category').sort({ createdAt: -1 });
    res.render('admin/blogs', { blogs, layout: 'admin/layout', title: 'All Blogs' });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).send('Server error');
  }
};

// GET /admin/blogs/new
exports.getAddBlog = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('admin/newBlog', { categories, layout: 'admin/layout', title: 'Add New Blog' });
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).send('Server error');
  }
};

// POST /admin/blogs/new
exports.addBlog = async (req, res) => {
  try {
    const { title, category, description, publishDate } = req.body;
    // Generate slug by replacing spaces with hyphens and converting to lowercase

    const slug = title.toLowerCase().replace(/\s+/g, '-');
    // Use Multer files if provided


    const imageThumbnail = req.files && req.files.thumbnail ? `/uploads/${req.files.thumbnail[0].filename}` : '';
    const imageFeatured = req.files && req.files.featuredImage ? `/uploads/${req.files.featuredImage[0].filename}` : '';
    const blog = new Blog({
      title,
      slug,
      category,
      description,
      publishDate: publishDate || Date.now(),
      imageThumbnail,
      imageFeatured
    });
    await blog.save();
    res.redirect('/admin/blogs');
  } catch (error) {
    console.error('Add blog error:', error);
    res.status(500).send('Server error');
  }
};

// GET /admin/blogs/edit/:id
exports.getEditBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const categories = await Category.find();
    if (!blog) {
      return res.status(404).send('Blog not found');
    }
    res.render('admin/editBlog', { blog, categories, layout: 'admin/layout', title: 'Edit Blog' });
  } catch (error) {
    console.error('Get edit blog error:', error);
    res.status(500).send('Server error');
  }
};

// POST /admin/blogs/edit/:id
exports.editBlog = async (req, res) => {
  try {
    const { title, category, description, publishDate } = req.body;
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    let updateData = { title, slug, category, description, publishDate };
    if (req.files && req.files.thumbnail) {
      updateData.imageThumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
    }
    if (req.files && req.files.featuredImage) {
      updateData.imageFeatured = `/uploads/${req.files.featuredImage[0].filename}`;
    }
    await Blog.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/admin/blogs');
  } catch (error) {
    console.error('Edit blog error:', error);
    res.status(500).send('Server error');
  }
};

// POST /admin/blogs/delete/:id
exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/admin/blogs');
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).send('Server error');
  }
};


// Category Management


// GET /admin/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('admin/categories', { categories, layout: 'admin/layout', title: 'All Categories' });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).send('Server error');
  }
};

// POST /admin/categories/new
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.redirect('/admin/categories');
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).send('Server error');
  }
};


// Logout

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/admin/login');
};
