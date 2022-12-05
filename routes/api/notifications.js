const express = require("express");
const router = express.Router();

const Notification = require("../../models/Notification");

router.get("/getNotifications", (req, res) => {
  Notification.find()
    .then((notifications) => res.json(notifications))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/addNotification", (req, res) => {
  
  const newNotification = new Notification({
    message: req.body.message,
    postedBy: req.body.id,
  });

  newNotification
    .save()
    .then((notification) => res.json(notification))
    .catch((err) => console.log(err));
});

router.delete("/deleteNotification/:id", (req, res) => {

  console.log(req.body);

  Notification.findByIdAndDelete(req.params.id, (err, result) => {
    if (err) {
      console.log(err);
    }

    console.log(result);

    res.send({
      status: "200",
      responseType: "string",
      response: "success",
    });
  });
});

module.exports = router;
