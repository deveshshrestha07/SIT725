const express = require('express');
const router = express.Router();
const ContentController = require('../controller/controller');

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

// Route handling
router.post('/addContent', ContentController.addContent.bind(ContentController));
router.get('/getContent', ContentController.getAllContent.bind(ContentController));
router.delete('/deleteContent/:id', ContentController.deleteContent.bind(ContentController));

module.exports = router;