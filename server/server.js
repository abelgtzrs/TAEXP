// server.js
require('dotenv').config();

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- DB ----------
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/theAbelExperienceDB';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`✓ MongoDB connected → ${MONGO_URI}`))
  .catch((err) => {
    console.error('✗ Mongo connection error:', err.message);
    process.exit(1);
  });

// ---------- Routes ----------
const greentextPostRoutes = require('./routes/greentextPostRoutes');
app.use('/api/posts', greentextPostRoutes);
const glossaryItemRoutes = require('./routes/glossaryItemRoutes');
app.use('/api/glossary', glossaryItemRoutes);
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// ---------- Root ----------
app.get('/', (_req, res) =>
  res.json({ message: 'The Abel Experience™ API — Online' })
);

// ---------- 404 ----------
app.use((_req, res) =>
  res.status(404).json({ message: 'Endpoint not found.' })
);

// ---------- Error handler ----------
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || 'Internal server error.' });
});

// ---------- Start ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✓ Server running → http://localhost:${PORT}`)
);
