const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 4000;

// MongoDB connection
mongoose
  .connect("mongodb+srv://dhruvujjain:Dhruv%402981@cluster0.lvmmjnp.mongodb.net/inquant?retryWrites=true&w=majority", {
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define schema and model
const contactSchema = new mongoose.Schema({
  name: String,
  organization: String,
  email: String,
  phone: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

// Middleware
app.use(cors());
app.use(express.json());

// POST: Save form submission
app.post("/api/contact", async (req, res) => {
  try {
    const { name, organization, email, phone, message } = req.body;
    const newContact = new Contact({ name, organization, email, phone, message });
    await newContact.save();
    res.status(201).json({ success: true, message: "Form saved to MongoDB!" });
  } catch (err) {
    console.error("Error saving contact:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// GET: Retrieve all contact submissions
app.get("/api/contact", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
