const express = require("express");
const router = express.Router();


const Form = require("../../models/Form");

router.get("/getForms", (req, res) => {
  Form.find()
    .then((forms) => res.json(forms))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/addForm", (req, res) => {
  
  const newForm = new Form({
    name: req.body.name,
    id:req.body.id,
    email:req.body.email,
    phone:req.body.phone,
    type:req.body.category,
    subject:req.body.subject,
    message:req.body.message
  });

  newForm
    .save()
    .then((form) => res.json(form))
    .catch((err) => console.log(err));
});


router.delete("/deleterequest/:id", (req, res) => {
  Form.findByIdAndDelete(req.params.id, (err, result) => {
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