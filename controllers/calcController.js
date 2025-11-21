// -------------------------------------------
// CALCIFY PRO — PROFESSIONAL CONTROLLER FILE
// -------------------------------------------

// UNIVERSAL SUCCESS RESPONSE
const success = (data) => ({ status: "success", data });
const error = (msg) => ({ status: "error", message: msg });

// 1️⃣ EMI CALCULATOR
exports.emi = (req, res) => {
    let { principal, rate, months } = req.query;

    if (!principal || !rate || !months) {
        return res.json(error("Missing inputs"));
    }

    principal = parseFloat(principal);
    rate = parseFloat(rate);
    months = parseInt(months);

    const monthlyRate = rate / (12 * 100);
    const emi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

    return res.json(success({
        principal,
        rate,
        months,
        emi: emi.toFixed(2)
    }));
};


// 2️⃣ GST CALCULATOR
exports.gst = (req, res) => {
    let { amount, gst } = req.query;

    if (!amount || !gst) {
        return res.json(error("Missing inputs"));
    }

    amount = parseFloat(amount);
    gst = parseFloat(gst);

    const gstAmount = (amount * gst) / 100;
    const total = amount + gstAmount;

    return res.json(success({
        amount,
        gst,
        gstAmount: gstAmount.toFixed(2),
        total: total.toFixed(2)
    }));
};


// 3️⃣ PF CALCULATOR
exports.pf = (req, res) => {
    let { basic } = req.query;

    if (!basic) {
        return res.json(error("Missing input"));
    }

    basic = parseFloat(basic);

    const employeePF = (basic * 12) / 100;
    const employerPF = (basic * 12) / 100;
    const totalPF = employeePF + employerPF;

    return res.json(success({
        basic,
        employeePF: employeePF.toFixed(2),
        employerPF: employerPF.toFixed(2),
        totalPF: totalPF.toFixed(2)
    }));
};


// 4️⃣ SALARY TO HOURLY (NEW + IMPROVED)
exports.salary = (req, res) => {
    let { annual, hours } = req.query;

    if (!annual || !hours) {
        return res.json(error("Missing inputs"));
    }

    annual = parseFloat(annual);
    hours = parseFloat(hours);

    const hourly = annual / (52 * hours);

    return res.json(success({
        annual,
        hours,
        hourly: hourly.toFixed(2)
    }));
};


// 5️⃣ UNIT CONVERTER (FULLY ADDED)
exports.unit = (req, res) => {
    const { category, from, to, value } = req.query;

    if (!category || !from || !to || !value) {
        return res.json(error("Missing inputs"));
    }

    const val = parseFloat(value);
    let result = null;

    // LENGTH
    const length = {
        Meter: 1,
        Kilometer: 1000,
        Centimeter: 0.01,
        Millimeter: 0.001,
        Mile: 1609.34,
        Yard: 0.9144,
        Foot: 0.3048,
        Inch: 0.0254
    };

    // WEIGHT
    const weight = {
        Kilogram: 1,
        Gram: 0.001,
        Pound: 0.453592,
        Ounce: 0.0283495
    };

    // TEMPERATURE
    const tempConvert = (v, f, t) => {
        let C;
        if (f === "Celsius") C = v;
        if (f === "Fahrenheit") C = (v - 32) * (5 / 9);
        if (f === "Kelvin") C = v - 273.15;

        if (t === "Celsius") return C;
        if (t === "Fahrenheit") return C * 9/5 + 32;
        if (t === "Kelvin") return C + 273.15;
    };

    if (category === "length") {
        result = val * length[from] / length[to];
    }
    else if (category === "weight") {
        result = val * weight[from] / weight[to];
    }
    else if (category === "temperature") {
        result = tempConvert(val, from, to);
    }

    return res.json(success({
        category,
        from,
        to,
        value,
        result: result.toFixed(4)
    }));
};
