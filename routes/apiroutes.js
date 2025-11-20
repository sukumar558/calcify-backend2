const express = require('express');
const router = express.Router();
const calccontroller = require('../controllers/calccontroller');

// Test Route (for checking API is working)
router.get('/test', (req, res) => {
    res.json({
        status: "success",
        message: "API is working fine!"
    });
});

// Existing API routes
router.get('/emi', calccontroller.emi);
router.get('/gst', calccontroller.gst);
router.get('/pf', calcvontroller.pf);
router.get('/salary', calccontroller.salary);

module.exports = router;
