
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyAdmin = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization'];
  if (!token) return res.redirect('/admin/login');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.redirect('/admin/login');
  }
};
