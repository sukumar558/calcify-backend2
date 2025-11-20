const express = require('express');
const router = express.Router();
const calcController = require('../controllers/calcController');

// Test Route (for checking API is working)
router.get('/test', (req, res) => {
    res.json({
        status: "success",
        message: "API is working fine!"
    });
});

// Existing API routes
router.get('/emi', calcController.emi);
router.get('/gst', calcController.gst);
router.get('/pf', calcController.pf);
router.get('/salary', calcController.salary);

module.exports = router;
