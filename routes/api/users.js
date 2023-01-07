const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");

const multer = require("multer");
var AWS = require("aws-sdk");
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
const parser = require("../../config/cloudinaryImage");

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

router.get("/getuser/:id", (req, res) => {
  User.findOne({ id: req.params.id })
    .then((users) => {
      users["password"] = "I am also a fucker like you once";
      res.json(users);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/getuseravatar/:id", (req, res) => {
  User.findOne({ id: req.params.id })
    .then((users) => {
      res.json(users.avatar);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/getusers", (req, res) => {
  User.find()
    .then((users) => {
      users["password"] = "I am also a fucker like you once";
      res.json(users);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({
    $or: [
      {
        email: req.body.email,
      },
      { id: req.body.id },
    ],
  }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email or ID already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        id: req.body.id,
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          isA: user.isA,
          // designation: user.designation,
          // dept: user.dept,
          // prgrm: user.prgrm,
          // year: user.year,
          // avatar: user.avatar,
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 2592000, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.put("/:id/follow", async (req, res) => {
  if (req.body.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.id);

      if (!currentUser.following.includes(req.params.id)) {
        await currentUser.updateOne({
          $push: {
            following: req.params.id,
          },
        });

        await user.updateOne({
          $push: {
            requests: req.body.id,
          },
        });

        res.status(200).json("Following");
      } else {
        res.status(403).json("You are already following this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json({ error: "You cant follow yourself" });
  }
});

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.id);

      if (currentUser.following.includes(req.params.id)) {
        await currentUser.updateOne({
          $pull: {
            following: req.params.id,
          },
        });

        await user.updateOne({
          $pull: {
            requests: req.body.id,
          },
        });

        res.status(200).json("UnFollowed");
      } else {
        res.status(403).json("You are not following this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json({ error: "You cant unfollow yourself" });
  }
});

router.post("/:uid/edit", parser.single("avatar"), async (req, res) => {
  // var promises = [];
  // var avatar;
  // const s3FileURL = keys.awsuploadedfileurl;

  if (req.files) {
    avatar = req.file;
    // promises.push(uploadLoadToS3(avatar));
  }

  const { name, designation, email, dept, prgrm, year, DOB } = req.body;

  // Promise.all(promises)
  //   .then(function (data) {
  
  // })
  // .catch(function (err) {
  //   res.send(err.stack);
  // });

  console.log(!req.file);

  if (!req.file) {
    User.findOneAndUpdate(
      { id: req.params.uid },
      {
        name,
        designation,
        email,
        dept,
        prgrm,
        year,
        DOB,
      }
    )
      .then((result) => {
        res.json(result);
      })
      .catch((err) => console.log(err));
  }else{
    User.findOneAndUpdate(
      { id: req.params.uid },
      {
        name,
        designation,
        email,
        dept,
        prgrm,
        year,
        DOB,
        avatar: req.file.path,
      }
    )
      .then((result) => {
        res.json(result);
      })
      .catch((err) => console.log(err));
  }
});

router.post("/getUsers", async (req, res) => {
  try {
    const page = parseInt(req.body.page) - 1 || 0;
    const name = req.body.name || "";
    const year = req.body.year || "";
    const dept = req.body.dept || "";
    const prgrm = req.body.prgrm || "";

    const users = await User.find({
      name: { $regex: name, $options: "i" },
      year: { $regex: year, $options: "i" },
      dept: { $regex: dept, $options: "i" },
      prgrm: { $regex: prgrm, $options: "i" },
      id: { $nin: [req.body.cid] },
    })
      .sort("year")
      .skip(page * 5)
      .limit(5);

    const total = await User.countDocuments({
      name: { $regex: name, $options: "i" },
      year: { $regex: year, $options: "i" },
      dept: { $regex: dept, $options: "i" },
      prgrm: { $regex: prgrm, $options: "i" },
    });

    const response = {
      total: total - 1,
      page: page + 1,
      users,
    };

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

router.post("/getBdays", async (req, res) => {
  User.find({ DOB: { $regex: req.body.DOB, $options: "i" } })
    .then((users) => {
      res.json(users);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
