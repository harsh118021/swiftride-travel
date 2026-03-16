const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/search', (req, res) => {
  res.json({ success: true, message: 'Search received' });
});

app.post('/api/enquiry', (req, res) => {
  const { name, phone } = req.body;
  res.json({ success: true, message: `Thank you ${name}! We will call you at ${phone} within 15 minutes.` });
});

// ✅ Noida page route
app.get('/swiftride/travel-in-noida', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'travel-in-noida.html'));
});

// Catch all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('SwiftRide running at http://localhost:' + PORT));

module.exports = app;