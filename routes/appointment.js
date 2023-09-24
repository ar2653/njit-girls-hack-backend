const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Planets = require("./planets");

const appointmentSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  cosmic_handle: String,
  displayName: String,
  appointment_date: Date,
  price: String,
  package: String,
  planet_image: String
});

const Appointment = mongoose.model("appointment", appointmentSchema);
router.post("/book", async (req, res) => {
  try {
    let appointment = new Appointment(req.body);
    const { displayName } = req.body;
    const planet = await Planets.findOne({ displayName });
    console.log(planet.price, "sdsdsd")
    var price =
    req.body.package === "Basic"
      ? planet.price * 1.2
      : req.body.package === "Premium"
      ? planet.price * 1.3
      : req.body.package === "Luxury"
      ? planet.price * 1.4
      : planet.price;
    appointment.price = price;
    const savedAppointment = await appointment.save();
    res.status(200).json(savedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/bookings", async (req, res) => {
  const { cosmic_handle } = req.query;
  try {
    const appointment = await Appointment.find({ cosmic_handle });
    if (!appointment) {
      return res.status(401).json({ message: "No bookings found" });
    }
    res.status(200).json({
      data: appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
