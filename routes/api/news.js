const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

const News = require("../../models/News");
const multer = require("multer");
var AWS = require("aws-sdk");

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.get("/getnews", (req, res) => {
    News.find()
    .then((news) => res.json(news))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/addnews", upload.single("file"), (req, res) => {
  const file = req.file;
  const s3FileURL = keys.awsuploadedfileurl;

  let s3bucket = new AWS.S3({
    accessKeyId: keys.awsaccesskey,
    secretAccessKey: keys.awssecretkey,
    region: keys.awsregion,
  });

  var params = {
    Bucket: keys.awsbucketname,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  s3bucket.upload(params, function (err, data) {
    if (err) {
      res.status(500).json({ error: true, Message: err });
    } else {
      const newNews = new News({
        name: req.body.name,
        image: s3FileURL + file.originalname,
        s3_key: params.Key,
        message: req.body.message,
      });

      newNews
        .save()
        .then((News) => res.json(News))
        .catch((err) => console.log(err));
    }
  });
});

router.delete("/deletenews", (req, res) => {
  News.findByIdAndDelete(req.body.id, (err, result) => {

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


router.delete("/deleteNews/:id", (req, res) => {
  News.findByIdAndDelete(req.params.id, (err, result) => {
    if (err) {
      console.log(err);
    }

    res.send({
      status: "200",
      responseType: "string",
      response: "success",
    });
  });
});


module.exports = router;
