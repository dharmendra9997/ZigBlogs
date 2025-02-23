
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/auth');


router.get('/', (req, res) => {
  res.redirect('/admin/login');
});


router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);


router.get('/dashboard', verifyAdmin, adminController.dashboard);


router.get('/blogs', verifyAdmin, adminController.getBlogs);
router.get('/blogs/new', verifyAdmin, adminController.getAddBlog);
router.post(
  '/blogs/new',
  verifyAdmin,
  upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'featuredImage', maxCount: 1 }]),
  adminController.addBlog
);
router.get('/blogs/edit/:id', verifyAdmin, adminController.getEditBlog);
router.post(
  '/blogs/edit/:id',
  verifyAdmin,
  upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'featuredImage', maxCount: 1 }]),
  adminController.editBlog
);
router.post('/blogs/delete/:id', verifyAdmin, adminController.deleteBlog);


router.get('/categories', verifyAdmin, adminController.getCategories);
router.get('/categories/new', verifyAdmin, (req, res) => res.render('admin/newCategory'));
router.post('/categories/new', verifyAdmin, adminController.addCategory);


router.get('/logout', verifyAdmin, adminController.logout);


module.exports = router;
