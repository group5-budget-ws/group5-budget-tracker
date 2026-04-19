let transactions = [];
let currentType = "income";

// CATEGORY DATA
const incomeCategories = ["Salary", "Freelance", "Other"];
const expenseCategories = ["Rent", "Shopping", "Transport", "Entertainment", "Other"];

// SET TYPE (Income / Expense)
function setType(type) {
    currentType = type;
    updateCategories();
}

// UPDATE DROPDOWN
function updateCategories() {
    const category = document.getElementById("category");
    category.innerHTML = "";

    let list = currentType === "income" ? incomeCategories : expenseCategories;

    list.forEach(cat => {
        let option = document.createElement("option");
        option.value = cat;
        option.text = cat;
        category.appendChild(option);
    });
}

function addTransaction() {
    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;

    if (!amount || description === "" || date === "") {
        alert("Please fill all fields");
        return;
    }

    const transaction = {
        id: Date.now(),
        type: currentType,
        amount: amount,
        category: category,
        description: description,
        date: date
    };

    transactions.push(transaction);

    saveTransactions();
    renderTransactions();

    // CLEAR INPUTS
    document.getElementById("amount").value = "";
    document.getElementById("description").value = "";
    document.getElementById("date").value = "";

    document.getElementById("confirmMsg").innerText = "Transaction Added!";
}

// SAVE TO LOCAL STORAGE
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadTransactions() {
    const data = localStorage.getItem("transactions");
    if (data) {
        transactions = JSON.parse(data);
    }
}

// RENDER TRANSACTIONS (DAY 3)
function renderTransactions() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    let total = 0;

    transactions.forEach(t => {

        const card = document.createElement("div");
        card.classList.add("card");
        card.classList.add(t.type);

        card.innerHTML = `
            <div>₹${t.amount}</div>
            <div>${t.category}</div>
            <div>${t.description}</div>
            <div>${t.date}</div>
        `;

        list.appendChild(card);

        if (t.type === "income") {
            total += t.amount;
        } else {
            total -= t.amount;
        }
    });

    document.getElementById("total").innerText = "Total: ₹" + total;
}

// RUN ON LOAD
window.onload = function () {
    loadTransactions();
    updateCategories();
    renderTransactions();
};