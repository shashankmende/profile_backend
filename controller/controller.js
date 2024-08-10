const profileModel = require('../models/profileModel');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Ensure directory exists
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

const upload = multer({
    storage: storage,
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

const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }

    const imagePath = `/images/${req.file.filename}`;
    res.send({ message: 'Image uploaded successfully', imagePath: imagePath });
};

const postDataToProfile = async (req, res) => {
    try {
        const { personal, education } = req.body;
        const { email } = personal;

        // Check if the user already exists
        const existingUser = await profileModel.findOne({ "personal.email": email });

        if (existingUser) {
            return res.status(400).send({ message: "User already exists" });
        }

        // Create a new profile
        await profileModel.create({ personal, education });
        res.send({ message: "Data successfully posted" });

    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
};

const retrieveImge = async (req, res) => {
    try {
        const { email } = req.params;
        const person = await profileModel.findOne({ "personal.email": email });

        if (!person) {
            return res.status(404).send({ message: "Person not found" });
        }

        const imagePath = person.personal.photoPreview;
        if (!imagePath) {
            return res.status(404).send({ message: "Image path not found" });
        }

        // Construct the full URL for the image
        const imageUrl = `${req.protocol}://${req.get('host')}/images/${path.basename(imagePath)}`;

        res.send({ message: "Image path retrieved successfully", url: imageUrl }).status(200);
    } catch (error) {
        console.error("Error retrieving image:", error);
        res.status(500).send({ message: "Internal server error" });
    }
};


module.exports = {
    uploadImage,
    postDataToProfile,
    retrieveImge
};
