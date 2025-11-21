// routes/apiroutes.js
const express = require('express');
const router = express.Router();
const calc = require('../controllers/calcController');

// Test
router.get('/test', (req, res) => res.json({ status: "success", message: "API is working fine" }));

// Calculators
router.get('/emi', calc.emi);
router.get('/gst', calc.gst);            // expects ?amount=&gst=
router.get('/pf', calc.pf);              // expects ?basic=
router.get('/salary', calc.salary);      // supports ?annual=&hours=  OR  ?basic=&hra=&da=&bonus=
router.get('/unit', calc.unit);          // ?category=&from=&to=&value=
router.get('/fuel', calc.fuel);          // ?distance=&consumption=&pricePerUnit=
router.get('/bmi', calc.bmi);            // ?weight=&height=&unit=
router.get('/percentage', calc.percentage); // ?total=&obtained=
router.get('/time', calc.time);          // ?value=&from=&to=
router.get('/age', calc.age);            // ?dob=YYYY-MM-DD

module.exports = router;
