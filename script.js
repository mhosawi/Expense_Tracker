
var transactions = [];

try {
    transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    if (!Array.isArray(transactions)) {
        transactions = [];
    }
} catch (error) {
    transactions = [];
}

// Save transactions
function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Add a transaction
var form = document.getElementById("transactionForm");

if (form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        var date = document.getElementById("date").value;
        var type = document.getElementById("type").value;
        var category = document.getElementById("category").value;
        var amount = Number(document.getElementById("amount").value);

        if (!date || !type || !category || amount <= 0 || !Number.isFinite(amount)) {
            alert("Please enter valid information.");
            return;
        }

        var transaction = {
            id: Date.now() + Math.random(),
            date: date,
            type: type,
            category: category,
            amount: amount
        };

        transactions.push(transaction);
        saveData();

        form.reset();
        showTransactions();

        alert("Transaction added successfully!");
    });
}

// Delete a transaction
function deleteTransaction(id) {
    if (confirm("Delete this transaction?")) {
        transactions = transactions.filter(function(item) {
            return item.id !== id;
        });

        saveData();
        showTransactions();
    }
}

// Show transactions
var showAll = false;

function showTransactions() {
    var table = document.getElementById("transactionList");

    if (!table) {
        return;
    }

    table.innerHTML = "";

    var sorted = transactions.slice().sort(function(a, b) {
        return b.date.localeCompare(a.date);
    });

    var visible = showAll ? sorted : sorted.slice(0, 3);

    if (visible.length === 0) {
        var emptyRow = document.createElement("tr");
        var emptyCell = document.createElement("td");

        emptyCell.colSpan = 5;
        emptyCell.textContent = "No transactions yet.";

        emptyRow.appendChild(emptyCell);
        table.appendChild(emptyRow);
    }

    visible.forEach(function(item) {
        var row = document.createElement("tr");

        var dateCell = document.createElement("td");
        dateCell.textContent = item.date;

        var categoryCell = document.createElement("td");
        categoryCell.textContent = item.category;

        var typeCell = document.createElement("td");
        typeCell.textContent = item.type;

        var amountCell = document.createElement("td");
        amountCell.textContent = Number(item.amount).toFixed(2) + " SAR";

        var actionCell = document.createElement("td");
        var deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            deleteTransaction(item.id);
        });

        actionCell.appendChild(deleteButton);

        row.appendChild(dateCell);
        row.appendChild(categoryCell);
        row.appendChild(typeCell);
        row.appendChild(amountCell);
        row.appendChild(actionCell);

        table.appendChild(row);
    });

    var count = document.getElementById("transactionCount");

    if (count) {
        count.textContent = "Total Transactions: " + transactions.length;
    }

    var viewButton = document.getElementById("viewAllButton");

    if (viewButton) {
        viewButton.hidden = transactions.length <= 3;

        viewButton.textContent = showAll
            ? "Show Less"
            : "View All Transactions";
    }
}

// View All button
var viewButton = document.getElementById("viewAllButton");

if (viewButton) {
    viewButton.addEventListener("click", function() {
        showAll = !showAll;
        showTransactions();
    });
}

// Update Dashboard
function showDashboard() {
    var balance = document.getElementById("balance");

    if (!balance) {
        return;
    }

    var income = 0;
    var expenses = 0;

    transactions.forEach(function(item) {
        var amount = Number(item.amount);

        if (item.type === "income") {
            income += amount;
        } else if (item.type === "expense") {
            expenses += amount;
        }
    });

    document.getElementById("income").textContent =
        income.toFixed(2) + " SAR";

    document.getElementById("expenses").textContent =
        expenses.toFixed(2) + " SAR";

    balance.textContent =
        (income - expenses).toFixed(2) + " SAR";

    var recentTable = document.getElementById("recentTransactions");

    if (!recentTable) {
        return;
    }

    recentTable.innerHTML = "";

    var recent = transactions.slice().sort(function(a, b) {
        return b.date.localeCompare(a.date);
    }).slice(0, 5);

    if (recent.length === 0) {
        var emptyRow = document.createElement("tr");
        var emptyCell = document.createElement("td");

        emptyCell.colSpan = 4;
        emptyCell.textContent = "No transactions yet.";

        emptyRow.appendChild(emptyCell);
        recentTable.appendChild(emptyRow);
    }

    recent.forEach(function(item) {
        var row = document.createElement("tr");

        var dateCell = document.createElement("td");
        dateCell.textContent = item.date;

        var categoryCell = document.createElement("td");
        categoryCell.textContent = item.category;

        var typeCell = document.createElement("td");
        typeCell.textContent = item.type;

        var amountCell = document.createElement("td");
        amountCell.textContent = Number(item.amount).toFixed(2) + " SAR";

        row.appendChild(dateCell);
        row.appendChild(categoryCell);
        row.appendChild(typeCell);
        row.appendChild(amountCell);

        recentTable.appendChild(row);
    });
}

// Run functions
showTransactions();
showDashboard();
