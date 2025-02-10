
const Blog = require('../models/Blog');

exports.getHome = async (req, res) => {
  try {
    // Build a search query if a search term is provided via query parameter
    let query = {};
    if (req.query.search) {
      // Use case-insensitive regex to match title
      query.title = new RegExp(req.query.search, 'i');
    }
    // Fetch latest blogs (sorted descending by createdAt)
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    // Render the homepage with blogs and pass along the search term (if any)
    res.render('user/home', { blogs, search: req.query.search || '' });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).send('Server Error');
  }
};

exports.getBlogDetails = async (req, res) => {
  try {
    // Use the slug from the URL to find the blog and populate its category
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
