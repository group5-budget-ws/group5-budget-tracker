let type = "income";
let transactions = [];
let chart;

const incomeCategories = ["Salary","Freelance","Business","Other"];
const expenseCategories = ["Food","Rent","Transport","Shopping","Other"];

/* Set type */
function setType(t) {
    type = t;

    const incomeBtn = document.getElementById("incomeBtn");
    const expenseBtn = document.getElementById("expenseBtn");

    if (t === "income") {
        incomeBtn.classList.add("active");
        expenseBtn.classList.remove("active");
    } else {
        expenseBtn.classList.add("active");
        incomeBtn.classList.remove("active");
    }

    loadCategories();
}

/* Load categories */
function loadCategories() {
    const category = document.getElementById("category");
    category.innerHTML = "";

    let selected = (type === "income") ? incomeCategories : expenseCategories;

    selected.forEach(cat => {
        let option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        category.appendChild(option);
    });
}

/* Add transaction */
document.getElementById("addBtn").addEventListener("click", () => {

  const amount = parseFloat(document.getElementById("amount").value);
  const desc = document.getElementById("desc").value.trim();
  const date = document.getElementById("date").value;
  const category = document.getElementById("category").value;

  if (!amount || desc === "" || date === "") {
    alert("Fill all fields");
    return;
  }

  transactions.push({
    id: Date.now(),
    type,
    amount,
    desc,
    date,
    category
  });

  updateUI();
  updateChart();
  renderMonthlySummary();

  document.getElementById("amount").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("date").value = "";
});

/* Update UI */
function updateUI() {
  let income = 0, expense = 0;
  const list = document.getElementById("list");
  list.innerHTML = "";

  transactions.forEach(t => {

    if (t.type === "income") income += t.amount;
    else expense += t.amount;

    const div = document.createElement("div");
    div.className = "transaction-card";

    div.innerHTML = `
      <div class="transaction-row">
        <div class="left">
          <b>${t.type.toUpperCase()}</b>
          <p>${t.category} - ${t.desc}</p>
          <small>${t.date}</small>
        </div>
        <div class="right">₹${t.amount}</div>
        <button class="delete-btn" onclick="deleteTransaction(${t.id})">✖</button>
      </div>
    `;

    list.appendChild(div);
  });

  document.getElementById("income").innerText = income;
  document.getElementById("expense").innerText = expense;
  document.getElementById("balance").innerText = income - expense;
}

/* Delete */
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateUI();
  updateChart();
  renderMonthlySummary();
}

/* Chart */
function updateChart() {
  const data = {};

  transactions.forEach(t => {
    if (t.type === "expense") {
      data[t.category] = (data[t.category] || 0) + t.amount;
    }
  });

  const labels = Object.keys(data);
  const values = Object.values(data);

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("chart"), {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: ["#e74c3c", "#3498db", "#2ecc71", "#f39c12"]
      }]
    }
  });
}

/* ✅ Monthly Summary (MAIN FEATURE) */
function renderMonthlySummary() {
  const container = document.getElementById("monthlyList");
  if (!container) return;

  let MonthlyData = {};

  transactions.forEach(t => {
    const Month = t.date.slice(0, 7);

    if (!MonthlyData[Month]) {
      MonthlyData[Month] = { income: 0, expense: 0 };
    }

    if (t.type === "income") {
      MonthlyData[Month].income += t.amount;
    } else {
      MonthlyData[Month].expense += t.amount;
    }
  });

  container.innerHTML = "<h2>Monthly Summary</h2>";

  for (let M in MonthlyData) {
    let data = MonthlyData[M];
    let net = data.income - data.expense;

    let className = "month-card";
    if (data.expense > data.income) {
      className += " loss"; // highlight
    }

    container.innerHTML += `
      <div class="${className}">
        <b>${M}</b><br>
        Income: ₹${data.income} | Expense: ₹${data.expense} | Net: ₹${net}
      </div>
    `;
  }
}

/* Init */
window.onload = function () {
  loadCategories();
  updateUI();
  updateChart();
  renderMonthlySummary();
};