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

// Sort transactions by date and time added
function sortTransactions() {

    return transactions.slice().sort(function(a, b) {

        if (a.date === b.date) {
            return b.id - a.id;
        }

        return b.date.localeCompare(a.date);
    });
}

// Get HTML elements
var form = document.getElementById("transactionForm");
var message = document.getElementById("transactionMessage");
var typeInput = document.getElementById("type");
var categoryInput = document.getElementById("category");

// Show messages
function showMessage(text, color) {

    if (message) {
        message.textContent = text;
        message.style.color = color;
    }
}

// Change categories based on transaction type
function updateCategories() {

    if (!typeInput || !categoryInput) {
        return;
    }

    var type = typeInput.value;

    categoryInput.innerHTML =
        '<option value="">Select Category</option>';

    var categories;

    if (type === "income") {

        categories = ["Salary", "Other"];

    } else if (type === "expense") {

        categories = [
            "Food",
            "Shopping",
            "Bills",
            "Transportation",
            "Other"
        ];

    } else {

        categories = [];
    }

    categories.forEach(function(category) {

        var option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryInput.appendChild(option);
    });
}

if (typeInput) {
    typeInput.addEventListener("change", updateCategories);
    updateCategories();
}

// Add a transaction
if (form) {

    form.addEventListener("submit", function(event) {

        event.preventDefault();

        var date = document.getElementById("date").value;
        var type = typeInput.value;
        var category = categoryInput.value;

        var amountText =
            document.getElementById("amount").value;

        var amount = Number(amountText);

        // Form Validation
        if (!date || !type || !category || amountText === "") {

            showMessage("Please fill in all fields.", "red");
            return;

        } else if (!Number.isFinite(amount) || amount <= 0) {

            showMessage(
                "Amount must be greater than zero.",
                "red"
            );
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
        updateCategories();

        showAll = false;
        showTransactions();

        showMessage(
            "Transaction added successfully!",
            "green"
        );
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

        showMessage(
            "Transaction deleted successfully!",
            "green"
        );
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

    // Newest transactions first
    var sorted = sortTransactions();

    var visible;

    if (showAll) {
        visible = sorted;
    } else {
        visible = sorted.slice(0, 3);
    }

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
        amountCell.textContent =
            Number(item.amount).toFixed(2) + " SAR";

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

    // Transaction count
    var count = document.getElementById("transactionCount");

    if (count) {
        count.textContent =
            "Total Transactions: " + transactions.length;
    }

    // View All / Show Less
    var viewButton = document.getElementById("viewAllButton");

    if (viewButton) {

        viewButton.hidden = transactions.length <= 3;

        if (showAll) {
            viewButton.textContent = "Show Less";
        } else {
            viewButton.textContent = "View All Transactions";
        }

        viewButton.setAttribute(
            "aria-expanded",
            String(showAll)
        );
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

    // Calculate income and expenses
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

    // Recent transactions
    var recentTable =
        document.getElementById("recentTransactions");

    if (!recentTable) {
        return;
    }

    recentTable.innerHTML = "";

    // Show latest 5 transactions
    var recent = sortTransactions().slice(0, 5);

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
        amountCell.textContent =
            Number(item.amount).toFixed(2) + " SAR";

        row.appendChild(dateCell);
        row.appendChild(categoryCell);
        row.appendChild(typeCell);
        row.appendChild(amountCell);

        recentTable.appendChild(row);
    });
}

// Run when the page opens
showTransactions();
showDashboard();