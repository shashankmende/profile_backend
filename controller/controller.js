const profileModel = require('../models/profileModel');
const RegistrationModel = require('../models/registrationModel')
const jwt = require('jsonwebtoken')
const fs = require('fs');
const bcrypt = require('bcrypt')
const path = require('path');
const multer = require('multer');
const registrationModel = require('../models/registrationModel');

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


///middle ware to check jwt token









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



const retrieveProfileDetails = async (req, res) => {
    try {
        const { email } = req.params;
        const person = await profileModel.findOne({ "personal.email": email });

        if (!person) {
            return res.status(404).send({ message: "Person not found" });
        }

        // Construct the full URL for the image if photoPreview is present
        let imageUrl = null;
        if (person.personal.photoPreview) {
            imageUrl = `${req.protocol}://${req.get('host')}/images/${path.basename(person.personal.photoPreview)}`;
        }

        // Return all profile details along with the image URL
        res.status(200).send({
            message: "Profile details retrieved successfully",
            profile: {
                personal: person.personal,
                // education: person.education,
                url: imageUrl
            }
        });
    } catch (error) {
        console.error("Error retrieving profile details:", error);
        res.status(500).send({ message: "Internal server error" });
    }
};

module.exports = { retrieveProfileDetails };



const uploadResume =async(req,res)=>{
    if(req.file){
        res.status(200).send({
            message:"Resume uploaded successfully",
            fileName:req.file.filename,
            filePath: `/resumes/${req.file.filename}`
        })
    }else{
        res.status(400).send({error:'Resume upload failed'})
    }
}

//registration

const Registration = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        
        const existingUser = await registrationModel.findOne({ email: email });
        console.log("existing user", existingUser);

        
        if (existingUser) {
            return res.status(400).send({ message: "User already exists" });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        await registrationModel.create({ email: email, password: hashedPassword });

        
        return res.status(201).send({ message: "Registration successful" });
    } catch (error) {
        console.error("Error in registration:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
};

//login
const Login = async(req,res)=>{
    try {
        const {email,password}=req.body
        const isExist = await registrationModel.findOne({email:email})
        if (!isExist){
            return res.status(404).send({message:"User doesn't exist"})
        }

        const isPasswordMatched = await bcrypt.compare(password,isExist.password)
        if (isPasswordMatched){

            const payload = {email:isExist.email}

            const jwtToken =  jwt.sign(payload,process.env.ACCESS_TOKEN,{expiresIn:"24days"})

            return res.status(200).send({message:"Login Successful",jwtToken:jwtToken})
        }
        return res.status(404).send({message:"Password is invalid"})

    } catch (error) {
        return res.status(500).send({message:"Internal server Error"})
        
    }
}




module.exports = {
    uploadImage,
    postDataToProfile,
    retrieveProfileDetails,
    uploadResume,
    Registration,
    Login
};
