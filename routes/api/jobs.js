const router = require("express").Router();
const Job = require("../../models/Job");

router.get("/getjobs", (req, res) => {
  Job.find()
    .then((jobs) => res.json(jobs))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/getjobs/:uid", (req, res) => {
  Job.find({postedBy:req.params.uid})
    .then((jobs) => res.json(jobs))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/addjob", async (req, res) => {
  console.log(req);
  const newJob = new Job(req.body);

  try {
    const savedJob = await newJob.save();
    res.status(200).json(savedJob);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/deleteJob/:id", (req, res) => {
  Job.findByIdAndDelete(req.params.id, (err, result) => {
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
