const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

var userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  cosmic_handle: String,
  email_address: String,
  phone_number: String,
  password: String,
});

// declare table with the above schema
var UserRegister = mongoose.model("user", userSchema);

// register user
router.post("/register", async (req, res) => {
    try {
      const { email_address, cosmic_handle } = req.body;
      // Check if a user with the provided email already exists
      const existingUser = await UserRegister.findOne({ email_address });
      const existingHandle = await UserRegister.findOne({ cosmic_handle });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (existingHandle) {
        return res.status(400).json({ message: "Cosmic handle already exists" });
      }
      // If the email is not found, create a new user and save it
      const user = new UserRegister(req.body);
      const savedUser = await user.save();
      res.status(200).json(savedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
});

  
// login
router.get("/login", async (req, res) => {
  const { email_address, password } = req.body;
  try {
    const user = await UserRegister.findOne({ email_address });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    res
      .status(200)
      .json({
        data: {
          first_name: user.first_name,
          last_name: user.last_name,
          cosmic_handle: user.cosmic_handle
        },
        message: "Login successful",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
