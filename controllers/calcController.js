const express = require('express');
const router = express.Router();
const calcController = require('../controllers/calcController');

// Test Route
router.get('/test', (req, res) => {
    res.json({
        status: "success",
        message: "API is working fine!"
    });
});

// Main API routes
router.get('/emi', calcController.emi);
router.get('/gst', calcController.gst);
router.get('/pf', calcController.pf);
router.get('/salary', calcController.salary);

module.exports = router;    const annualRate = parseFloat(rate);

    let tenureMonths = 0;

    if (months) {
        tenureMonths = parseFloat(months);
    } else if (years) {
        tenureMonths = parseFloat(years) * 12;
    } else {
        return res.status(400).json({
            status: "error",
            message: "Please provide months or years"
        });
    }

    const result = calculateEMI(principalAmt, annualRate, tenureMonths);

    if (result.error) {
        return res.status(400).json({ status: "error", message: result.error });
    }

    res.json({ status: "success", data: result });
};


// 2️⃣ GST CONTROLLER
exports.gst = (req, res) => {
    const { amount, rate, isInclusive } = req.query;

    const amountVal = parseFloat(amount);
    const rateVal = parseFloat(rate);

    const result = calculateGST(amountVal, rateVal, isInclusive);

    if (result.error) {
        return res.status(400).json({ status: "error", message: result.error });
    }

    res.json({ status: "success", data: result });
};


// 3️⃣ PF CONTROLLER
exports.pf = (req, res) => {
    const { basic, da } = req.query;

    const basicVal = parseFloat(basic);
    const daVal = parseFloat(da || 0);

    const result = calculatePF(basicVal, daVal);

    if (result.error) {
        return res.status(400).json({ status: "error", message: result.error });
    }

    res.json({ status: "success", data: result });
};


// 4️⃣ SALARY TO HOURLY CONTROLLER
exports.salary = (req, res) => {
    const { annual, hours } = req.query;

    const annualVal = parseFloat(annual);
    const hoursVal = parseFloat(hours);

    const result = calculateSalaryToHourly(annualVal, hoursVal);

    if (result.error) {
        return res.status(400).json({ status: "error", message: result.error });
    }

    res.json({ status: "success", data: result });
};
