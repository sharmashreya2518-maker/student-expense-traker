
const form = document.getElementById("expense-form");
const expenseName = document.getElementById("expense-name");
const expenseAmount = document.getElementById("expense-amount");
const category = document.getElementById("category");
const expenseList = document.getElementById("expense-list");

const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-amount");
const budgetDisplay = document.getElementById("budget-display");
const totalDisplay = document.getElementById("total");
const remainingDisplay = document.getElementById("remaining");
const progressBar = document.getElementById("progress-bar");
const budgetMessage = document.getElementById("budget-message");
const emptyMessage = document.getElementById("empty-message");

// Get the current month, for example: 2026-10
const now = new Date();
const currentMonth =
    now.getFullYear() + "-" +
    String(now.getMonth() + 1).padStart(2, "0");

// Load saved expenses
let expenses = [];

try {
    const savedExpenses = JSON.parse(
        localStorage.getItem("myExpenses") || "[]"
    );

    if (Array.isArray(savedExpenses)) {
        expenses = savedExpenses
            .filter(function(item) {
                return item &&
                    typeof item.name === "string" &&
                    Number.isFinite(Number(item.amount)) &&
                    Number(item.amount) > 0;
            })
            .map(function(item) {
                return {
                    id: item.id || Date.now() + Math.random(),
                    name: item.name,
                    amount: Number(item.amount),
                    category: item.category || "Other",
                    date: item.date || currentMonth
                };
            });
    }
} catch (error) {
    expenses = [];
}

// Load budgets saved for different months
let budgets = {};

try {
    const savedBudgets = JSON.parse(
        localStorage.getItem("myBudgets") || "{}"
    );

    if (
        savedBudgets &&
        typeof savedBudgets === "object" &&
        !Array.isArray(savedBudgets)
    ) {
        budgets = savedBudgets;
    }
} catch (error) {
    budgets = {};
}

// Current month's budget
let monthlyBudget = Number(budgets[currentMonth]) || 0;

// Save expenses
function saveExpenses() {
    localStorage.setItem("myExpenses", JSON.stringify(expenses));
}

// Save budgets
function saveBudgets() {
    localStorage.setItem("myBudgets", JSON.stringify(budgets));
}

// Update the budget, spending and remaining balance
function updateBudgetSummary() {
    const monthlyExpenses = expenses.filter(function(expense) {
        return expense.date === currentMonth;
    });

    const total = monthlyExpenses.reduce(function(sum, expense) {
        return sum + expense.amount;
    }, 0);

    const remaining = monthlyBudget - total;

    budgetDisplay.textContent = monthlyBudget.toFixed(2);
    totalDisplay.textContent = total.toFixed(2);
    remainingDisplay.textContent = remaining.toFixed(2);

    if (monthlyBudget > 0) {
        const percentage = (total / monthlyBudget) * 100;

        progressBar.style.width =
            Math.min(percentage, 100) + "%";

        if (percentage >= 100) {
            progressBar.style.backgroundColor = "#d64545";
            budgetMessage.textContent =
                "Budget limit reached or exceeded!";
            remainingDisplay.style.color = "#d64545";
        } else if (percentage >= 80) {
            progressBar.style.backgroundColor = "#e69b25";
            budgetMessage.textContent =
                "Warning! You have used " +
                percentage.toFixed(0) + "% of your budget.";
            remainingDisplay.style.color = "#e69b25";
        } else {
            progressBar.style.backgroundColor = "#6c4ab6";
            budgetMessage.textContent =
                "You have used " + percentage.toFixed(0) +
                "% of your monthly budget.";
            remainingDisplay.style.color = "#16803c";
        }
    } else {
        progressBar.style.width = "0%";
        progressBar.style.backgroundColor = "#6c4ab6";
        budgetMessage.textContent =
            "Set your monthly budget to track your spending.";
        remainingDisplay.style.color = "#16803c";
    }

    budgetInput.value = monthlyBudget > 0 ? monthlyBudget : "";
}

// Display current month's expenses
function displayExpenses() {
    expenseList.innerHTML = "";

    const monthlyExpenses = expenses.filter(function(expense) {
        return expense.date === currentMonth;
    });

    emptyMessage.style.display =
        monthlyExpenses.length === 0 ? "block" : "none";

    monthlyExpenses.forEach(function(expense) {
        const listItem = document.createElement("li");

        listItem.appendChild(
            document.createTextNode(
                expense.name + " - ₹" +
                expense.amount.toFixed(2) +
                " (" + expense.category + ") "
            )
        );

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            expenses = expenses.filter(function(item) {
                return item.id !== expense.id;
            });

            saveExpenses();
            displayExpenses();
            updateBudgetSummary();
        });

        listItem.appendChild(deleteButton);
        expenseList.appendChild(listItem);
    });

    updateBudgetSummary();
}

// Save the monthly budget
budgetForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const newBudget = Number(budgetInput.value);

    if (!Number.isFinite(newBudget) || newBudget <= 0) {
        alert("Please enter a budget greater than zero.");
        return;
    }

    monthlyBudget = newBudget;
    budgets[currentMonth] = monthlyBudget;

    saveBudgets();
    updateBudgetSummary();

    alert("Monthly budget saved successfully!");
});

// Add a new expense
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = expenseName.value.trim();
    const amount = Number(expenseAmount.value);
    const selectedCategory = category.value;

    if (
        name === "" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        alert("Please enter a valid name and amount!");
        return;
    }

    const newExpense = {
        id: Date.now() + Math.random(),
        name: name,
        amount: amount,
        category: selectedCategory,
        date: currentMonth
    };

    expenses.push(newExpense);

    saveExpenses();
    displayExpenses();

    form.reset();
});

// Show saved data when the website opens
displayExpenses();
