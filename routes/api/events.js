const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

const Event = require("../../models/Event");
const multer = require("multer");
var AWS = require("aws-sdk");
const parser = require("../../config/cloudinaryImage");

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.get("/getevents", (req, res) => {
  Event.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/addEvent", parser.single("file"), (req, res) => {
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
  const newEvent = new Event({
    name: req.body.name,
    image: file.path,
    s3_key: file.path,
    date: new Date(req.body.date),
    location: req.body.location,
    topic: req.body.topic,
    type: req.body.type,
  });

  newEvent
    .save()
    .then((event) => res.json(event))
    .catch((err) => console.log(err));
  //   }
  // });
});

router.delete("/deleteEvent", (req, res) => {
  Event.findByIdAndDelete(req.body.id, (err, result) => {
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

router.delete("/deleteEvent/:id", (req, res) => {
  Event.findByIdAndDelete(req.params.id, (err, result) => {
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
