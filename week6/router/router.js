const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');

router.get('/getContent', controller.getAllContent);
router.post('/addContent', controller.addContent);
router.delete('/deleteContent/:id', controller.deleteContent);

module.exports = router;