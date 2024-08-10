const express = require('express');
const router = express.Router();
const examController = require('../controller/controller');
const multer = require('multer');
const path = require('path')
const fs= require("fs")
// Multer configuration
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, '../public/images');
            ensureDirectoryExists(uploadPath);
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

function ensureDirectoryExists(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../public/images');
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
//     fileFilter: (req, file, cb) => {
//         const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//         if (allowedTypes.includes(file.mimetype)) {
//             cb(null, true);
//         } else {
//             cb(new Error('Invalid file type'), false);
//         }
//     }
// });





// Routes
router.post('/uploadImage', upload.single('photo'), examController.uploadImage);
router.post('/profile', examController.postDataToProfile);
router.get('/image/:email', examController.retrieveImge);

module.exports = router;
