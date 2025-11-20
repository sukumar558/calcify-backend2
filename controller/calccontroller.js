// -------------------------------------------
// CALCIFY PRO — FULL WORKING CONTROLLER FILE
// -------------------------------------------

// Function to calculate Monthly EMI
const calculateEMI = (principal, annualRate, tenureMonths) => {
    if (principal <= 0 || annualRate < 0 || tenureMonths <= 0) {
        return { error: "Invalid input: Principal, Rate & Tenure must be valid." };
    }

    const monthlyRate = annualRate / (12 * 100);

    if (monthlyRate === 0) {
        const emi = principal / tenureMonths;
        return {
            emi: parseFloat(emi.toFixed(2)),
            totalInterest: 0,
            totalPayment: principal
        };
    }

    const emi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - principal;

    return {
        emi: parseFloat(emi.toFixed(2)),
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        totalPayment: parseFloat(totalPayment.toFixed(2))
    };
};


// Function to calculate GST
const calculateGST = (amount, rate, isInclusive) => {
    if (amount <= 0 || rate < 0) {
        return { error: "Invalid input: Amount must be positive & rate non-negative." };
    }

    const gstRate = rate / 100;
    let gstAmount, netAmount, grossAmount;

    if (isInclusive === "true") {
        netAmount = amount / (1 + gstRate);
        gstAmount = amount - netAmount;
        grossAmount = amount;
    } else {
        gstAmount = amount * gstRate;
        grossAmount = amount + gstAmount;
        netAmount = amount;
    }

    return {
        gstAmount: parseFloat(gstAmount.toFixed(2)),
        netAmount: parseFloat(netAmount.toFixed(2)),
        grossAmount: parseFloat(grossAmount.toFixed(2))
    };
};


// Function to calculate PF/EPF
const calculatePF = (basicSalary, da, employeeRate = 12, employerRate = 12) => {
    if (basicSalary < 0 || da < 0) {
        return { error: "Invalid input: salary values cannot be negative." };
    }

    const totalEarning = basicSalary + da;
    const employeeShare = totalEarning * (employeeRate / 100);
    const employerShare = totalEarning * (employerRate / 100);
    const totalContribution = employeeShare + employerShare;

    return {
        totalEarning: parseFloat(totalEarning.toFixed(2)),
        employeeShare: parseFloat(employeeShare.toFixed(2)),
        employerShare: parseFloat(employerShare.toFixed(2)),
        totalContribution: parseFloat(totalContribution.toFixed(2))
    };
};


// Function to convert Annual Salary to Hourly Rate
const calculateSalaryToHourly = (annualSalary, workingHoursPerWeek) => {
    if (annualSalary <= 0 || workingHoursPerWeek <= 0) {
        return { error: "Invalid salary or working hours." };
    }

    const annualWorkingWeeks = 50; // Standard: 2 weeks off
    const annualWorkingHours = annualWorkingWeeks * workingHoursPerWeek;

    const hourlyRate = annualSalary / annualWorkingHours;

    return {
        annualWorkingWeeks,
        annualWorkingHours: parseFloat(annualWorkingHours.toFixed(2)),
        hourlyRate: parseFloat(hourlyRate.toFixed(2))
    };
};


// -------------------------------------------------------
//               EXPRESS CONTROLLER EXPORTS
// -------------------------------------------------------


// 1️⃣ EMI CONTROLLER (months & years both supported)
exports.emi = (req, res) => {
    let { principal, rate, months, years } = req.query;

    const principalAmt = parseFloat(principal);
    const annualRate = parseFloat(rate);

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
