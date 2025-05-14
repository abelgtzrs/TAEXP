//Importing modules
const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');
require('dotenv').config();

//Initializing express
const app = express();

//Enable Cors
app.use(cors());

//Parse JSON data
app.use(express.json())

const mongo_uri = process.env.MONGO_URI || 'mongodb://localhost:27017/notes';

mongoose.connect(mongo_uri)
    .then(() => {console.log('Connected to MongoDB');})
    .catch((err) => {console.error('Error connecting to MongoDB:', err);
    });

//Importing routes
app.get('/', (req, res) => {
    res.send('Welcome to The Abel Experience™ API System.');
});

//Server initialization
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Error: Resource Not Found. Check API endpoint.' });
});

// Basic global error handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(500).json({ message: 'Error: Internal Server Error.', error: err.message });
});
