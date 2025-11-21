// controllers/calcController.js
// -------------------------------------------
// SINGLE CONTROLLER — All calculator APIs
// -------------------------------------------

const success = (data) => ({ status: "success", data });
const failure = (msg) => ({ status: "error", message: msg });

// helper: parse float safely
const toNum = (v) => {
    if (v === undefined || v === null || v === "") return NaN;
    return Number(v);
};

// ----------------------
// 1) EMI
// GET /emi?principal=...&rate=...&months=...
// ----------------------
exports.emi = (req, res) => {
    const principal = toNum(req.query.principal);
    const rate = toNum(req.query.rate);
    const months = parseInt(req.query.months, 10);

    if (!principal || !rate || !months) {
        return res.json(failure("Missing or invalid inputs (principal, rate, months required)"));
    }

    const monthlyRate = rate / (12 * 100);
    const emiValue =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

    return res.json(success({
        principal,
        rate,
        months,
        emi: Number(emiValue.toFixed(2))
    }));
};

// ----------------------
// 2) GST
// GET /gst?amount=...&gst=...   (note: param name 'gst')
// ----------------------
exports.gst = (req, res) => {
    const amount = toNum(req.query.amount);
    const gst = toNum(req.query.gst);

    if (!amount && amount !== 0) return res.json(failure("Missing amount"));
    if (!gst && gst !== 0) return res.json(failure("Missing gst rate"));

    const gstAmount = (amount * gst) / 100;
    const total = amount + gstAmount;

    return res.json(success({
        amount: Number(amount.toFixed ? amount.toFixed(2) : Number(amount)),
        gst,
        gstAmount: Number(gstAmount.toFixed(2)),
        total: Number(total.toFixed(2))
    }));
};

// ----------------------
// 3) PF
// GET /pf?basic=...
// ----------------------
exports.pf = (req, res) => {
    const basic = toNum(req.query.basic);

    if (!basic && basic !== 0) return res.json(failure("Missing basic salary"));

    const employeePF = (basic * 12) / 100;
    const employerPF = (basic * 12) / 100;
    const totalPF = employeePF + employerPF;

    return res.json(success({
        basic: Number(basic.toFixed(2)),
        employeePF: Number(employeePF.toFixed(2)),
        employerPF: Number(employerPF.toFixed(2)),
        totalPF: Number(totalPF.toFixed(2))
    }));
};

// ----------------------
// 4) SALARY — supports both:
//    A) hourly calculation: /salary?annual=...&hours=...
//    B) gross breakdown: /salary?basic=...&hra=...&da=...&bonus=...
// GET /salary?... (auto detects by provided params)
// ----------------------
exports.salary = (req, res) => {
    // Option A: annual -> hourly
    const annual = toNum(req.query.annual);
    const hours = toNum(req.query.hours);

    if (!isNaN(annual) && !isNaN(hours) && annual !== 0 && hours !== 0) {
        const hourly = annual / (52 * hours);
        return res.json(success({
            mode: "hourly",
            annual: Number(annual.toFixed(2)),
            hoursPerWeek: Number(hours.toFixed(2)),
            hourly: Number(hourly.toFixed(2))
        }));
    }

    // Option B: gross calculation from parts
    const basic = toNum(req.query.basic);
    const hra = toNum(req.query.hra);
    const da = toNum(req.query.da);
    const bonus = toNum(req.query.bonus);

    if (!isNaN(basic) && !isNaN(hra) && !isNaN(da) && !isNaN(bonus)) {
        if (basic === 0 && hra === 0 && da === 0 && bonus === 0) {
            return res.json(failure("Provide either annual & hours OR basic,hra,da,bonus values"));
        }
        const gross = basic + hra + da + bonus;
        return res.json(success({
            mode: "gross",
            basic: Number(basic.toFixed(2)),
            hra: Number(hra.toFixed(2)),
            da: Number(da.toFixed(2)),
            bonus: Number(bonus.toFixed(2)),
            grossSalary: Number(gross.toFixed(2))
        }));
    }

    return res.json(failure("Missing inputs: either (annual & hours) OR (basic,hra,da,bonus) required"));
};


// ----------------------
// 5) UNIT Converter
// GET /unit?category=length|weight|temperature&from=Meter&to=Kilometer&value=...
// ----------------------
exports.unit = (req, res) => {
    const { category, from, to } = req.query;
    const value = toNum(req.query.value);

    if (!category || !from || !to) return res.json(failure("Missing category/from/to"));
    if (isNaN(value)) return res.json(failure("Missing or invalid value"));

    // length base in meters
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

    // weight base in kg
    const weight = {
        Kilogram: 1,
        Gram: 0.001,
        Pound: 0.453592,
        Ounce: 0.0283495
    };

    const tempConvert = (v, f, t) => {
        let C;
        if (f === "Celsius") C = v;
        else if (f === "Fahrenheit") C = (v - 32) * (5 / 9);
        else if (f === "Kelvin") C = v - 273.15;
        else return NaN;

        if (t === "Celsius") return C;
        if (t === "Fahrenheit") return (C * 9 / 5) + 32;
        if (t === "Kelvin") return C + 273.15;
        return NaN;
    };

    let result = null;
    if (category === "length") {
        if (!length[from] || !length[to]) return res.json(failure("Unsupported length unit"));
        result = value * length[from] / length[to];
    } else if (category === "weight") {
        if (!weight[from] || !weight[to]) return res.json(failure("Unsupported weight unit"));
        result = value * weight[from] / weight[to];
    } else if (category === "temperature") {
        result = tempConvert(value, from, to);
        if (isNaN(result)) return res.json(failure("Unsupported temperature unit"));
    } else {
        return res.json(failure("Unsupported category"));
    }

    return res.json(success({
        category,
        from,
        to,
        value: Number(value.toFixed ? value.toFixed(4) : value),
        result: Number(result.toFixed(4))
    }));
};


// ----------------------
// 6) FUEL Calculator
// GET /fuel?distance=...&consumption=...&pricePerUnit=...
// - distance: total km
// - consumption: km per litre (or mpg if you change)
// - pricePerUnit: price per litre
// ----------------------
exports.fuel = (req, res) => {
    const distance = toNum(req.query.distance);
    const consumption = toNum(req.query.consumption);
    const pricePerUnit = toNum(req.query.pricePerUnit);

    if (isNaN(distance) || isNaN(consumption)) return res.json(failure("Missing distance or consumption"));
    if (consumption === 0) return res.json(failure("Consumption can't be zero"));

    const litersNeeded = distance / consumption;
    const cost = isNaN(pricePerUnit) ? null : litersNeeded * pricePerUnit;

    return res.json(success({
        distance: Number(distance.toFixed(2)),
        consumption: Number(consumption.toFixed(2)),
        litersNeeded: Number(litersNeeded.toFixed(3)),
        estimatedCost: cost === null ? null : Number(cost.toFixed(2))
    }));
};


// ----------------------
// 7) BMI Calculator
// GET /bmi?weight=...&height=...&unit=kg-m or unit=lb-in
// ----------------------
exports.bmi = (req, res) => {
    let { weight, height, unit } = req.query;
    weight = toNum(weight);
    height = toNum(height);

    if (isNaN(weight) || isNaN(height)) return res.json(failure("Missing weight or height"));

    let bmiValue;
    if (!unit || unit === "kg-m") {
        // height in meters expected
        bmiValue = weight / (height * height);
    } else if (unit === "kg-cm") {
        // height in cm
        const h = height / 100;
        bmiValue = weight / (h * h);
    } else if (unit === "lb-in") {
        // weight in pounds, height in inches
        bmiValue = (weight / (height * height)) * 703;
    } else {
        return res.json(failure("Unsupported unit"));
    }

    let category = "Unknown";
    if (bmiValue < 18.5) category = "Underweight";
    else if (bmiValue < 25) category = "Normal";
    else if (bmiValue < 30) category = "Overweight";
    else category = "Obese";

    return res.json(success({
        weight,
        height,
        unit: unit || "kg-m",
        bmi: Number(bmiValue.toFixed(2)),
        category
    }));
};


// ----------------------
// 8) Percentage
// GET /percentage?total=...&obtained=...
// ----------------------
exports.percentage = (req, res) => {
    const total = toNum(req.query.total);
    const obtained = toNum(req.query.obtained);

    if (isNaN(total) || isNaN(obtained) || total === 0) return res.json(failure("Missing or invalid total/obtained"));

    const percent = (obtained / total) * 100;

    return res.json(success({
        total: Number(total.toFixed(2)),
        obtained: Number(obtained.toFixed(2)),
        percentage: Number(percent.toFixed(2))
    }));
};


// ----------------------
// 9) Time Converter (simple examples: hours<->minutes<->seconds)
// GET /time?value=...&from=hours|minutes|seconds&to=...
// ----------------------
exports.time = (req, res) => {
    const value = toNum(req.query.value);
    const from = req.query.from;
    const to = req.query.to;

    if (isNaN(value) || !from || !to) return res.json(failure("Missing value/from/to"));

    const toSeconds = (v, unit) => {
        if (unit === "hours") return v * 3600;
        if (unit === "minutes") return v * 60;
        if (unit === "seconds") return v;
        return NaN;
    };

    const seconds = toSeconds(value, from);
    if (isNaN(seconds)) return res.json(failure("Unsupported from unit"));

    let result;
    if (to === "hours") result = seconds / 3600;
    else if (to === "minutes") result = seconds / 60;
    else if (to === "seconds") result = seconds;
    else return res.json(failure("Unsupported to unit"));

    return res.json(success({
        from,
        to,
        input: value,
        result: Number(result.toFixed(4))
    }));
};


// ----------------------
// 10) Age Calculator
// GET /age?dob=YYYY-MM-DD
// ----------------------
exports.age = (req, res) => {
    const dob = req.query.dob;
    if (!dob) return res.json(failure("Missing dob"));

    const d = new Date(dob);
    if (isNaN(d.getTime())) return res.json(failure("Invalid dob format"));

    const now = new Date();
    let years = now.getFullYear() - d.getFullYear();
    let months = now.getMonth() - d.getMonth();
    let days = now.getDate() - d.getDate();

    if (days < 0) {
        months -= 1;
        // get days in previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return res.json(success({
        dob,
        years,
        months,
        days
    }));
};
