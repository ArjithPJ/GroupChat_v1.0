const multer = require('multer');

// Multer storage configuration
const storage = multer.memoryStorage(); // Store files in memory buffer

// Multer upload configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
});

module.exports = upload;