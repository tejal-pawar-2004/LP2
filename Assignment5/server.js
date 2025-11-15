const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

mongoose
  .connect("mongodb+srv://tejaldp724_db_user:WecrOv3Z7WQTjAwk@cluster0.fncdpdg.mongodb.net/?appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB error"));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const newUser = new User({ name, email, password, phone });
    await newUser.save();
    res.send("Registration successful!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving data.");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
