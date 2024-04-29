const express = require("express");
const upload = require('../middleware/multerMiddleware');
const multimediaController = require('../controllers/multimedia');


const router = express.Router();

router.post('/postDownload', upload.single('file'),multimediaController.postDownload);


module.exports = router;