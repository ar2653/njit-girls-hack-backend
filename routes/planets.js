const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const planetSchema = new mongoose.Schema({
  name: String,
  displayName: String,
  caption: String,
  description: String,
  year: String,
  day: String,
  radius: Number,
  meanTemp: Number,
  timesLarger: Number,
  orbitalVelocity: Number,
  orbitObject: String,
  orbitalRadius: Number,
  scaledOrbitalRadius: Number,
  rotationVelocity: Number,
  orbitalInclination: Number,
  axialTilt: Number,
  price: Number,
  resources: Array,
});

const Planets = mongoose.model("planets", planetSchema);

router.get("/resources", async (req, res) => {
  console.log(req.query, "ssss");
  const { displayName } = req.query;
  console.log(displayName);
  try {
    const planet = await Planets.findOne({ displayName });
    if (!planet) {
      return res.status(404).json({ message: "Planet not found" });
    }
    const resources = planet.resources;
    res.status(200).json({
      data: resources,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/allPlanets", async (req, res) => {
  try {
    const planets = await Planets.find();
    
    if (!planets || planets.length === 0) {
      return res.status(404).json({ message: "No planets found" });
    }
    
    res.status(200).json({
      data: planets,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// module.exports = router;
module.exports = Planets;

