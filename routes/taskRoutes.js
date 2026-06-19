const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", async (req, res) => {
  const task = await Task.create(req.body);

  res.status(201).json({
    message: "Task Created",
    task,
  });
});

router.get("/",auth, async (req, res) => {
  const tasks = await Task.find();

  res.json(tasks);
});

router.put("/:id", async (req, res) => {
  await Task.findByIdAndUpdate(
    req.params.id,
    req.body
  );

  res.json({
    message: "Task Updated",
  });
});

router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message: "Task Deleted",
  });
});

module.exports = router;