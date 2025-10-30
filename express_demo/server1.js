const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
const mongoURI = "mongodb+srv://databaseneed:riDwZCfT1rIgWftb@cluster0.fiitzef.mongodb.net/";

mongoose.connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection to MongoDB shows an error:", err));

// Schema
const newSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

// Model
const Item = mongoose.model('Item', newSchema);

// Routes
app.post('/', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/product/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully", deletedItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/product/:id', async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    // Find and update item
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      req.body, // Data to update
      { new: true, runValidators: true } // Return updated item
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item updated successfully", updatedItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
