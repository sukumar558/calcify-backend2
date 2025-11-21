// index.js
const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes/apiroutes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount APIs under / (or change to /api if you want)
app.use('/', routes);

// simple root
app.get('/', (req, res) => {
    res.send("Calcify Backend — APIs are running. Try /test");
});

// port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
