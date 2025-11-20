// -------------------------------------------
// CALCIFY PRO — MAIN SERVER FILE (index.js)
// -------------------------------------------

const express = require('express');
const cors = require('cors');
const calcRoutes = require('./routes/calcRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Default Home Route
app.get('/', (req, res) => {
    res.send("Calcify Pro Backend is running successfully! 🚀");
});

// API Routes
app.use('/', calcRoutes);

// PORT setting (IMPORTANT FOR RENDER)
const PORT = process.env.PORT || 10000;

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Calcify Pro Backend is running on port ${PORT}`);
});
