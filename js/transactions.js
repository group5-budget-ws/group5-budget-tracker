let transactions = [];

// ===== LOCAL STORAGE =====
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadTransactions() {
    const data = localStorage.getItem("transactions");
    if (data) {
        transactions = JSON.parse(data);
        renderTransactions();
    }
}

// ===== CALCULATE TOTAL =====
function getTotal() {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
}

// ===== RENDER LIST =====
function renderTransactions() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    transactions.forEach(t => {
        const li = document.createElement("li");

        // ✅ FIXED ₹ SYMBOL HERE
        li.innerText = `${t.desc} - ₹${t.amount}`;

        list.appendChild(li);
    });

    document.getElementById("total").innerText =
        "Total: ₹" + getTotal();
}

// ===== UI CONNECTION =====
const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const addBtn = document.getElementById("addBtn");

// ===== BUTTON CLICK =====
addBtn.addEventListener("click", () => {
    const desc = descInput.value;
    const amount = Number(amountInput.value);

    if (desc === "" || amount === 0) {
        alert("Enter valid data");
        return;
    }

    const transaction = {
        id: Date.now(),
        desc: desc,
        amount: amount
    };

    transactions.push(transaction);

    saveTransactions();
    renderTransactions();

    descInput.value = "";
    amountInput.value = "";
});

// ===== LOAD ON START =====
loadTransactions();
renderTransactions();