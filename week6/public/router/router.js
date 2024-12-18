const express = require('express');
const router = express.Router();
const ContentController = require('../controller/controller');

router.post('/addContent', ContentController.addContent);
router.get('/getContent', ContentController.getAllContent);
router.delete('/deleteContent/:id', ContentController.deleteContent);

module.exports = router;