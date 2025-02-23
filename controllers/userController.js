
const Blog = require('../models/Blog');

exports.getHome = async (req, res) => {
  try {
   
    let query = {};
    if (req.query.search) {
      
      query.title = new RegExp(req.query.search, 'i');
    }
    
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    
    res.render('user/home', { blogs, search: req.query.search || '' });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).send('Server Error');
  }
};

exports.getBlogDetails = async (req, res) => {
  try {
    
    const blog = await Blog.findOne({ slug: req.params.slug }).populate('category');
    if (!blog) {
      return res.status(404).send('Blog not found');
    }
    res.render('user/blogDetail', { blog });
  } catch (error) {
    console.error('Error fetching blog details:', error);
    res.status(500).send('Server Error');
  }
};
