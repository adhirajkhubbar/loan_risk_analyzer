function calculateRisk() {
    let income = parseFloat(document.getElementById("income").value);
    let expenses = parseFloat(document.getElementById("expenses").value);
    let emi = parseFloat(document.getElementById("emi").value) || 0;

    let loanAmount = parseFloat(document.getElementById("loanAmount").value);
    let interest = parseFloat(document.getElementById("interest").value);
    let tenure = parseFloat(document.getElementById("tenure").value);

    let job = document.getElementById("job").value;
    let credit = document.getElementById("credit").value;

    if (!income || income <= 0) {
        alert("Enter valid income");
        return;
    }

    let risk = 0;
    let reasons = [];

    let emiScore = 0, savingsScore = 0, creditScore = 0, jobScore = 0;

    let totalPayable = 0;
    let totalInterest = 0;

    // EMI calculation
    if (loanAmount && interest && tenure) {
        let r = interest / 12 / 100;
        let emiCalc = (loanAmount * r * Math.pow(1 + r, tenure)) /
                      (Math.pow(1 + r, tenure) - 1);

        emi += emiCalc;
        totalPayable = emiCalc * tenure;
        totalInterest = totalPayable - loanAmount;

        reasons.push("New Loan EMI: " + Math.round(emiCalc));
    }

    let emiRatio = emi / income;
    let savings = income - expenses - emi;

    if (emiRatio > 0.6) { risk += 50; emiScore = 50; reasons.push("Very high EMI"); }
    else if (emiRatio > 0.4) { risk += 30; emiScore = 30; reasons.push("Moderate EMI"); }
    else if (emiRatio > 0.2) { risk += 10; emiScore = 10; }

    if (savings < 0) { risk += 40; savingsScore = 40; reasons.push("Negative savings"); }
    else if (savings < income * 0.2) { risk += 20; savingsScore = 20; }

    if (job === "unstable") { risk += 25; jobScore = 25; reasons.push("Unstable job"); }

    if (credit === "bad") { risk += 40; creditScore = 40; reasons.push("Bad credit"); }
    else if (credit === "average") { risk += 20; creditScore = 20; }

    let decision = risk < 30 ? "Approved" : risk < 70 ? "Review" : "Rejected";

    // ML-like probability
    let probability = Math.max(5, Math.min(95, 100 - risk));

    // Risk Bar
    let riskBar = document.getElementById("riskBar");
    let riskPercent = Math.min(risk, 100);
    riskBar.style.width = riskPercent + "%";

    if (riskPercent < 30) riskBar.style.background = "#00ff9d";
    else if (riskPercent < 70) riskBar.style.background = "#ffd966";
    else riskBar.style.background = "#ff4d4d";

    let resultDiv = document.getElementById("result");
    let contentDiv = document.getElementById("resultContent");

    resultDiv.className = "card result-card " + decision.toLowerCase();

    contentDiv.innerHTML = `
        <h2>${decision}</h2>
        <h1>${risk}</h1>

        <p><strong>Approval Probability:</strong> ${probability}%</p>

        <p><strong>Total EMI:</strong> ₹${Math.round(emi)}</p>
        <p><strong>Total Payable:</strong> ₹${Math.round(totalPayable)}</p>
        <p><strong>Total Interest:</strong> ₹${Math.round(totalInterest)}</p>

        <p><strong>Issues:</strong><br>${reasons.join("<br>")}</p>
    `;

    loadChart();
}

function loadChart() {
    new Chart(document.getElementById("loanChart"), {
        type: "doughnut",
        data: {
            labels: ["Approved", "Rejected", "Review"],
            datasets: [{
                data: [3, 2, 1]
            }]
        }
    });
}

loadChart();