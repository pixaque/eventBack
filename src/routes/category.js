const express = require('express');

const router = express.Router();

const categoryController = require('../controllers/categoryController');

//const { auth } = require('../middleware/auth');


router.get('/getCategories', categoryController.getCategories);
router.post('/newCategory', categoryController.newCategory);

module.exports = router;