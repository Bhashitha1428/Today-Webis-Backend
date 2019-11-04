const multer = require('multer');
const cloudinary = require('cloudinary');

const userImageStorage = multer.diskStorage({
    filename: function(req, file, cd) {
        cd(null, Date.now()+'-'+ file.originalname)
    }
});

const imageFilter = function (req, file, cb) {
    // accept image files only
    //console.log("LLLLLLLLLLL")
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

cloudinary.config({ 
    cloud_name: 'webis123', 
    //api_key: process.env.CLOUDINARY_API_KEY, 
   // api_secret: process.env.CLOUDINARY_API_SECRET
    api_key:'242748185374675',
    api_secret:'EHeUEQyZ0QCr2bTthEA4ehmWmxw',
   
    
});

const userImageUpload = multer({ storage: userImageStorage, fileFilter: imageFilter });

module.exports = {
    userImageUpload: userImageUpload
};