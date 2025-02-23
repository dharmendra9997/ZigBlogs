
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/', userController.getHome);


router.get('/blog/:slug', userController.getBlogDetails);

module.exports = router;
