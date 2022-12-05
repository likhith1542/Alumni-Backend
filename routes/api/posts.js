const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

const multer = require("multer");
var AWS = require("aws-sdk");

const Post = require("../../models/Post");

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

let s3bucket = new AWS.S3({
  accessKeyId: keys.awsaccesskey,
  secretAccessKey: keys.awssecretkey,
  region: keys.awsregion,
});

function uploadLoadToS3(file) {
  var params = {
    Bucket: keys.awsbucketname,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };
  return s3bucket.upload(params).promise();
}

router.get("/getPosts", (req, res) => {
  Post.find()
    .then((posts) => res.json(posts))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/getsomePosts/:pno", (req, res) => {
  var page = req.params.pno - 1 || 0;
  
    Post.find()
    .sort({ postedOn: -1 })
    .skip(page * 5)
    .limit(5)
    .then((posts) => res.json(posts))
    .catch((err) => res.status(400).json("Error: " + err));
  
  
  
});

router.get("/getPosts/:uid", (req, res) => {
  Post.find({ id: req.params.uid })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post(
  "/addPost",
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  (req, res) => {
    var promises = [];
    var file;
    var photo;
    const s3FileURL = keys.awsuploadedfileurl;
    if (req.files.photo) {
      photo = req.files.photo[0];
      promises.push(uploadLoadToS3(photo));
    }
    if (req.files.file) {
      file = req.files.file[0];
      promises.push(uploadLoadToS3(file));
    }

    Promise.all(promises)
      .then(function (data) {
        const newPost = new Post({
          id: req.body.id,
          message: req.body.message,
          file: file ? s3FileURL + file.originalname : "",
          photo: photo ? s3FileURL + photo.originalname : "",
          s3_file_key: file ? file.originalname : "",
          s3_photo_key: photo ? photo.originalname : "",
          type: req.body.category,
        });

        newPost
          .save()
          .then((post) => res.json(post))
          .catch((err) => console.log(err));
      })
      .catch(function (err) {
        res.send(err.stack);
      });
  }
);

router.put("/:id/like", async (req, res) => {
  console.log(req.body.id);
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.id)) {
      await post.updateOne({ $push: { likes: req.body.id } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.id } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.updateOne({
      $push: { comments: { id: req.body.id, comment: req.body.comment } },
    });
    res.status(200).json("The post has been liked");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/deletePost/:id", (req, res) => {
  console.log("hi" + req.params.id);
  Post.findByIdAndDelete(req.params.id, (err, result) => {
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
