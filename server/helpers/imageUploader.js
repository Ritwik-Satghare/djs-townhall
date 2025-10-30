const cloudinary = require("cloudinary").v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const eventUploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "events",
    });
    fs.unlinkSync(filePath); // delete local file after upload
    console.log(result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.log("cloudinary image upload error: " + error);
    throw error;
  }
};

module.exports = { eventUploadImage };
