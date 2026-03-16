const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const vehicles = [
  { id: 1, type: 'Sedan', brand: 'Dzire / Etios', seats: 4, pricePerKm: 12 },
  { id: 2, type: 'SUV', brand: 'Innova / Ertiga', seats: 7, pricePerKm: 16 },
  { id: 3, type: 'Tempo 9-Seater', brand: 'Force Traveller', seats: 9, pricePerKm: 22 },
  { id: 4, type: 'Tempo 12-Seater', brand: 'Force / Mobi', seats: 12, pricePerKm: 24 },
  { id: 5, type: 'Urbania 16-Seater', brand: 'Force Urbania', seats: 16, pricePerKm: 28 },
  { id: 6, type: 'Mini Bus', brand: 'Winger / Tata', seats: 26, pricePerKm: 18 },
  { id: 7, type: 'Full Bus', brand: 'Volvo / Scania', seats: 49, pricePerKm: 22 },
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/vehicles', (req, res) => {
  res.json({ success: true, vehicles });
});

app.post('/api/search', (req, res) => {
  const { from, to, date, vehicleType } = req.body;
  if (!from || !to) return res.status(400).json({ success: false, message: 'From and To required.' });
  let results = vehicles;
  if (vehicleType) results = vehicles.filter(v => v.type.toLowerCase().includes(vehicleType.toLowerCase()));
  res.json({ success: true, from, to, date, vehicles: results });
});

app.post('/api/enquiry', (req, res) => {
  const { name, phone, from, to, vehicle, message } = req.body;
  if (!name || !phone) return res.status(400).json({ success: false, message: 'Name and phone required.' });
  const enquiry = { id: Date.now(), name, phone, from, to, vehicle, message };
  console.log('[ENQUIRY]', enquiry);
  res.json({ success: true, message: 'Thank you ' + name + '! We will call you at ' + phone + ' within 15 minutes.' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('SwiftRide running at http://localhost:' + PORT));

