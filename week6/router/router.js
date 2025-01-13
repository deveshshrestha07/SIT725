const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');
const { validateContent } = require('../middleware/validation');

// Routes
router.get('/getContent', controller.getAllContent);
router.post('/addContent', validateContent, controller.addContent);
router.delete('/deleteContent/:id', controller.deleteContent);


module.exports = router;
