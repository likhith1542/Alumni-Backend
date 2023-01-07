const multer = require("multer");

const cloudinary = require("cloudinary").v2;

const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name:"vcorner1",
    api_key:"597563658827227",
    api_secret:"EFFty6YgViptAf5POw9zG5pDXQQ"

});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    resource_type: "auto",
    folder: "alumni",
    // format: async () => "mp4",
    public_id: (req, file) => file.filename,
  },
});

const parser = multer({ storage: storage });

module.exports = parser;

