const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); 
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const uri = 'mongodb+srv://devesh:admin@test.m2erqon.mongodb.net/'; 
const client = new MongoClient(uri);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connecting to MongoDB
let db;
client.connect()
  .then(() => {
    db = client.db('contentDB'); 
    console.log('Connected to MongoDB');
  })
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// POST to Add Content
app.post('/addContent', async (req, res) => {
  try {
    const { heading, description, picture } = req.body;
    const content = { heading, description, picture };
    await db.collection('content').insertOne(content);
    res.status(201).json({ message: 'Content added successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding content', error });
  }
});

// GET to Fetch Content
app.get('/getContent', async (req, res) => {
  try {
    const content = await db.collection('content').find().toArray();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content', error });
  }
});

// DELETE to Remove Content 
app.delete('/deleteContent/:id', async (req, res) => {
  const contentId = req.params.id;

  try {
    const result = await db.collection('content').deleteOne({ _id: new ObjectId(contentId) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Content deleted successfully!' });
    } else {
      res.status(404).json({ message: 'Content not found!' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting content', error });
  }
});

// Server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
