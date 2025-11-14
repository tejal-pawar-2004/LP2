const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/eventdb")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB error"));

// Schema
const eventSchema = new mongoose.Schema({
  name: String,
  date: String,
  location: String,
});
const Event = mongoose.model("Event", eventSchema);

// Auto create events
async function initEvents() {
  if ((await Event.countDocuments()) === 0) {
    await Event.insertMany([
      { name: "Tech Conference", date: "2025-12-01", location: "Main Hall" },
      { name: "Hackathon", date: "2025-12-15", location: "IT Building" },
    ]);
    console.log("Events created");
  }
}

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/dashboard", (req, res) =>
  res.sendFile(__dirname + "/dashboard.html")
);

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@gmail.com" && password === "admin123") {
    res.json({ success: true, token: "token" });
  } else {
    res.json({ success: false, message: "Invalid" });
  }
});

app.get("/api/events", async (req, res) => {
  res.json(await Event.find());
});

app.put("/api/events/:id", async (req, res) => {
  res.json(
    await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
  );
});

app.delete("/api/events/:id", async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

initEvents();
app.listen(3000, () => console.log("http://localhost:3000"));
