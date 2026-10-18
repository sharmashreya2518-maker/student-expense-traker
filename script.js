* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 24px 16px;
  font-family: Arial, sans-serif;
  color: #1f2937;
  background: #f3f4f6;
}

.app {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

header {
  margin-bottom: 24px;
  text-align: center;
}

header h1 {
  margin-bottom: 8px;
  color: #3730a3;
}

header p {
  margin-top: 0;
  color: #6b7280;
}

.card {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
}

.card h2 {
  margin-top: 0;
  font-size: 20px;
}

.budget-form label,
.expense-form label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: bold;
}

.input-row {
  display: flex;
  gap: 10px;
}

input,
select,
button {
  min-height: 42px;
  padding: 10px 12px;
  font: inherit;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

input,
select {
  width: 100%;
  background: #fff;
}

button {
  color: #fff;
  background: #4f46e5;
  border: 0;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background: #4338ca;
}

.input-row button {
  flex-shrink: 0;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.summary-card {
  margin: 0;
}

.summary-card h2 {
  color: #6b7280;
  font-size: 15px;
}

.summary-card p {
  margin: 0;
  color: #3730a3;
  font-size: 24px;
  font-weight: bold;
}

.expense-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.add-button {
  align-self: end;
}

.message {
  min-height: 18px;
  margin-bottom: 0;
  color: #047857;
  font-size: 14px;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 320px;
}

.empty-message {
  color: #6b7280;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th,
td {
  padding: 12px 8px;
  border-bottom: 1px solid #e5e7eb;
}

th {
  color: #6b7280;
  font-size: 14px;
}

.delete-button {
  min-height: auto;
  padding: 7px 10px;
  background: #dc2626;
}

.delete-button:hover {
  background: #b91c1c;
}

@media (max-width: 600px) {
  body {
    padding: 16px 10px;
  }

  .card {
    padding: 16px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .expense-form {
    grid-template-columns: 1fr;
  }

  .input-row {
    flex-direction: column;
  }

  .chart-container {
    height: 260px;
  }
}
