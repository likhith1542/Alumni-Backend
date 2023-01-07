const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

const Gallery = require("../../models/Gallery");
const multer = require("multer");
var AWS = require("aws-sdk");

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
const parser = require("../../config/cloudinaryImage");


router.get("/getgallery", (req, res) => {
  Gallery.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/addgallery", parser.single("file"), (req, res) => {
  console.log(req);
  const file = req.file;
  // const s3FileURL = keys.awsuploadedfileurl;

  // let s3bucket = new AWS.S3({
  //   accessKeyId: keys.awsaccesskey,
  //   secretAccessKey: keys.awssecretkey,
  //   region: keys.awsregion,
  // });

  // var params = {
  //   Bucket: keys.awsbucketname,
  //   Key: file.originalname,
  //   Body: file.buffer,
  //   ContentType: file.mimetype,
  //   ACL: "public-read",
  // };

  // s3bucket.upload(params, function (err, data) {
  //   if (err) {
  //     res.status(500).json({ error: true, Message: err });
  //   } else {
  //     console.log(data);
  const newGallery = new Gallery({
    name: req.body.name,
    url: file.path,
    s3_key: file.path,
    type: req.body.type,
  });

  newGallery
    .save()
    .then((gallery) => res.json(gallery))
    .catch((err) => console.log(err));
  //   }
  // });
});

router.delete("/deletegallery/:id", (req, res) => {
  Gallery.findByIdAndDelete(req.params.id, (err, result) => {
    if (err) {
      console.log(err);
    }

    let s3bucket = new AWS.S3({
      accessKeyId: keys.awsaccesskey,
      secretAccessKey: keys.awssecretkey,
      region: keys.awsregion,
    });

    var params = {
      Bucket: keys.awsbucketname,
      Key: result.s3_key,
    };

    s3bucket.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.send({
          status: "200",
          responseType: "string",
          response: "success",
        });
      }
    });
  });
});

module.exports = router;
