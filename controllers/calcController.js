// -------------------------------------------
// CONTROLLER FILE — Handles All Calculations
// -------------------------------------------

// EMI Calculator
exports.emi = (req, res) => {
    let { principal, rate, months } = req.query;

    principal = parseFloat(principal);
    rate = parseFloat(rate);
    months = parseInt(months);

    if (!principal || !rate || !months) {
        return res.json({ error: "Missing inputs" });
    }

    const monthlyRate = rate / (12 * 100);
    const emi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

    res.json({
        principal,
        rate,
        months,
        emi: emi.toFixed(2)
    });
};

// GST Calculator
exports.gst = (req, res) => {
    let { amount, gst } = req.query;

    amount = parseFloat(amount);
    gst = parseFloat(gst);

    if (!amount || !gst) {
        return res.json({ error: "Missing inputs" });
    }

    const gstAmount = (amount * gst) / 100;
    const total = amount + gstAmount;

    res.json({
        amount,
        gst,
        gstAmount: gstAmount.toFixed(2),
        total: total.toFixed(2)
    });
};

// PF Calculator
exports.pf = (req, res) => {
    let { basic } = req.query;
    basic = parseFloat(basic);

    if (!basic) {
        return res.json({ error: "Missing input" });
    }

    const employeePF = (basic * 12) / 100;
    const employerPF = (basic * 12) / 100;
    const totalPF = employeePF + employerPF;

    res.json({
        basic,
        employeePF: employeePF.toFixed(2),
        employerPF: employerPF.toFixed(2),
        totalPF: totalPF.toFixed(2)
    });
};

// Salary Calculator
exports.salary = (req, res) => {
    let { basic, hra, da, bonus } = req.query;

    basic = parseFloat(basic);
    hra = parseFloat(hra);
    da = parseFloat(da);
    bonus = parseFloat(bonus);

    if (!basic || !hra || !da || !bonus) {
        return res.json({ error: "Missing inputs" });
    }

    const gross = basic + hra + da + bonus;

    res.json({
        basic,
        hra,
        da,
        bonus,
        grossSalary: gross.toFixed(2)
    });
};
