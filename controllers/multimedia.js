const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const Users = require('../models/users'); // Assuming you have defined the Users and Chats models
const Chats = require('../models/chats');
const upload = require('../middleware/multerMiddleware');

exports.postDownload = async (req, res, next) => {
    try {
        // Get file data and token from request body
        const fileData = req.file; // Access the 'file' key from the FormData
        const token = req.body.token;
        const currentGroup =parseInt(req.body.currentGroup,10); // Access the 'token' key from the FormData
        console.log(fileData, token);

        // Decode token to get user ID
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decoded.id;

        // Fetch user's name using user ID
        const user = await Users.findOne({ where: { id: userId } });

        // Upload file to AWS S3
        const fileUrl = await uploadToS3(fileData);

        // Create a new entry in the chats table with the link
        // await Chats.create({
        //     id: userId,
        //     name: user.name,
        //     chat: fileUrl,
        //     group_id: currentGroup, // Assuming currentGroup is defined somewhere in your code
        //     time: new Date() // Assuming you want to store the current date/time as the time
        // });

        // Send success response
        res.status(200).json({ success: true, message: 'File uploaded to S3 and chat entry created with file link', fileUrl: fileUrl });
    } catch (error) {
        console.error('Error uploading file and creating chat entry:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error });
    }
};


function uploadToS3(file) {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    const s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    });

    const params = {
        Bucket: BUCKET_NAME,
        Key: file.originalname, // Use originalname property of the file
        Body: file.buffer, // Use buffer property to access the file data
        ACL: 'public-read'
    };

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, data) => {
            if (err) {
                console.error('Error uploading file to S3:', err);
                reject(err);
            } else {
                resolve(data.Location);
            }
        });
    });
}