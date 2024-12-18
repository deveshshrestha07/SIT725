const express = require('express');
const router = express.Router();
const ContentController = require('../controller/controller');

// Add a basic root route handler
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

// Your existing routes
router.post('/addContent', ContentController.addContent);
router.get('/getContent', ContentController.getAllContent);
router.delete('/deleteContent/:id', ContentController.deleteContent);
 
module.exports = router;