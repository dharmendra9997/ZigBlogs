// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Homepage: list latest blogs and support search via query parameter (e.g., ?search=keyword)
router.get('/', userController.getHome);

// Blog Details: URL will be based on the blog's slug
router.get('/blog/:slug', userController.getBlogDetails);

module.exports = router;
