const STORAGE_KEY = "studentExpenseTrackerData";

let expenses = [];
let budget = 0;
let categoryChart = null;

const budgetForm = document.getElementById("budgetForm");
const budgetInput = document.getElementById("budgetInput");
const budgetMessage = document.getElementById("budgetMessage");

const expenseForm = document.getElementById("expenseForm");
const expenseNameInput = document.getElementById("expenseName");
const expenseAmountInput = document.getElementById("expenseAmount");
const expenseCategoryInput = document.getElementById("expenseCategory");
const expenseDateInput = document.getElementById("expenseDate");
const expenseMessage = document.getElementById("expenseMessage");

const budgetTotal = document.getElementById("budgetTotal");
const monthlyTotal = document.getElementById("monthlyTotal");
const remainingTotal = document.getElementById("remainingTotal");
const expenseList = document.getElementById("expenseList");
const emptyMessage = document.getElementById("emptyMessage");

function loadData() {
  try {
    const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (savedData) {
      expenses = Array.isArray(savedData.expenses) ? savedData.expenses : [];
      budget = Number(savedData.budget) || 0;
    }
  } catch (error) {
    expenses = [];
    budget = 0;
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ expenses, budget }));
}

function formatMoney(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
}

function getCurrentMonthExpenses() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return expenses.filter((expense) => {
    const date = new Date(`${expense.date}T00:00:00`);
    return date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear;
  });
}

function renderSummary() {
  const monthExpenses = getCurrentMonthExpenses();
  const total = monthExpenses.reduce(
    (sum, expense) => sum + (Number(expense.amount) || 0),
    0
  );

  budgetTotal.textContent = formatMoney(budget);
  monthlyTotal.textContent = formatMoney(total);
  remainingTotal.textContent = formatMoney(budget - total);
}

function renderExpenses() {
  const monthExpenses = getCurrentMonthExpenses();

  expenseList.innerHTML = "";
  emptyMessage.hidden = monthExpenses.length > 0;

  monthExpenses
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .forEach((expense) => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = expense.name;

      const categoryCell = document.createElement("td");
      categoryCell.textContent = expense.category;

      const dateCell = document.createElement("td");
      dateCell.textContent = expense.date;

      const amountCell = document.createElement("td");
      amountCell.textContent = formatMoney(Number(expense.amount) || 0);

      const actionCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete-button";
      deleteButton.textContent = "Delete";
      deleteButton.dataset.id = expense.id;
      actionCell.appendChild(deleteButton);

      row.append(nameCell, categoryCell, dateCell, amountCell, actionCell);
      expenseList.appendChild(row);
    });
}

function updateCategoryChart() {
  const canvas = document.getElementById("categoryChart");

  if (!canvas || typeof Chart === "undefined") {
    return;
  }

  const categoryTotals = {};

  getCurrentMonthExpenses().forEach((expense) => {
    const category = expense.category || "Other";
    const amount = Number(expense.amount) || 0;

    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
  });

  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  if (categoryChart) {
    categoryChart.destroy();
  }

  categoryChart = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: labels.length ? labels : ["No expenses yet"],
      datasets: [{
        data: values.length ? values : [1],
        backgroundColor: [
          "#4f46e5",
          "#06b6d4",
          "#f59e0b",
          "#10b981",
          "#ef4444",
          "#8b5cf6",
          "#ec4899"
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

function renderApp() {
  renderSummary();
  renderExpenses();
  updateCategoryChart();
}

budgetForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newBudget = Number(budgetInput.value);

  if (!Number.isFinite(newBudget) || newBudget < 0) {
    budgetMessage.textContent = "Please enter a valid budget.";
    return;
  }

  budget = newBudget;
  saveData();
  renderApp();

  budgetInput.value = "";
  budgetMessage.textContent = "Budget saved.";
});

expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = expenseNameInput.value.trim();
  const amount = Number(expenseAmountInput.value);
  const category = expenseCategoryInput.value;
  const date = expenseDateInput.value;

  if (!name || !Number.isFinite(amount) || amount <= 0 || !category || !date) {
    expenseMessage.textContent = "Please fill in all fields correctly.";
    return;
  }

  expenses.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    amount,
    category,
    date
  });

  saveData();
  renderApp();
  expenseForm.reset();
  setTodayAsDefaultDate();
  expenseMessage.textContent = "Expense added.";
});

expenseList.addEventListener("click", (event) => {
  const button = event.target.closest(".delete-button");

  if (!button) {
    return;
  }

  expenses = expenses.filter((expense) => expense.id !== button.dataset.id);
  saveData();
  renderApp();
});

function setTodayAsDefaultDate() {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

  expenseDateInput.value = localDate;
}

loadData();
setTodayAsDefaultDate();
renderApp();
