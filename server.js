const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// === API Endpoints ===
app.post('/encode', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  try {
    const encoded = Buffer.from(text, 'utf8').toString('base64');
    res.json({ result: encoded });
  } catch (err) {
    res.status(500).json({ error: 'Encoding failed' });
  }
});

app.post('/decode', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Base64 string is required' });
  try {
    const decoded = Buffer.from(text, 'base64').toString('utf8');
    res.json({ result: decoded });
  } catch (err) {
    res.status(400).json({ error: 'Invalid Base64 string' });
  }
});

// === HTML Routes ===
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/encode', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'encode.html'));
});

app.get('/decode', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'decode.html'));
});

// === 404 Fallback ===
app.use((req, res) => {
  res.status(404).send(`
    <h1>404 - Page Not Found</h1>
    <p><a href="/">Go Home</a></p>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`→ Home: http://localhost:${PORT}`);
  console.log(`→ Encode: http://localhost:${PORT}/encode`);
  console.log(`→ Decode: http://localhost:${PORT}/decode`);
});
