// -------------------------------
// CALCIFY PRO — MAIN SERVER FILE
// -------------------------------

const express = require('express');
const cors = require('cors');
const calcRoutes = require('./routes/calcRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Home Route
app.get('/', (req, res) => {
    res.send("Calcify Pro Backend is Live 🚀");
});

// Attach All API Routes
app.use('/', calcRoutes);

// -------------------------------
// IMPORTANT FOR RENDER HOSTING
// -------------------------------
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Calcify Pro Backend running on port ${PORT}`);
});
