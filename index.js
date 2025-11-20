const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows frontend running on a different port/domain to access the API
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Simple health check route
app.get('/', (req, res) => {
    res.send(`Calcify Pro Backend is running on port ${PORT}!`);
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: 'Something broke!' });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
