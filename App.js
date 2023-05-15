const mongoose = require('mongoose');
const cors = require("cors");

cors({
    origin:[
        "*",
        "http://localhost:3000/"
    ],
});


// Connection URL
const url = 'mongodb://localhost:27017/to_do';

const express = require('express');
const app = express();

// Define a schema for the documents collection
const documentSchema = new mongoose.Schema({
  text:{
    type:String,
    required : [true,"Please enter name!"]
  }, 
  completed: {
    type:Boolean,
    default:false
  }
});
const Document = mongoose.model('Document', documentSchema);

// Middleware to parse JSON request bodies
app.use(express.json());

app.use(cors());

// GET route to retrieve all documents
app.get('/documents', async (req, res) => {
    const data = await Document.find();
    res.json(data);
});

// POST route to create a new document
app.post('/documents', async (req, res) => {
  const { text } = req.body;

  const newDocument = new Document({ text:text});
  await newDocument.save();
  res.send(newDocument);
});

// DELETE route to remove a document by ID
app.post('/delete', async (req, res) => {
  const { id } = req.body;

    const task = await Document.findById(id);
    task.deleteOne();
    res.json(task);
});


// PUT route to update a document by ID
app.post('/update', async (req, res) => {
  const { id } = req.body;

  const task = await Document.findById(id);
    task.completed=true;
    await task.save();
    res.json(task);
});


// Connect to MongoDB and start the server
mongoose.connect(url)
  .then(() => {
    console.log('Connected successfully to MongoDB');
    app.listen(3100, () => {
      console.log('Server listening on port 3100');
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
