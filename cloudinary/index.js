const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.Cloudinary_cloud_name,
    api_key: process.env.Cloudinary_api_key,
    api_secret:process.env.Cloudinary_api_secret
})

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
    folder: "yelpcamp",
        allowedFormats: ["jpeg", "jpg", "png"]
    }
})

module.exports = {
    cloudinary,storage
}