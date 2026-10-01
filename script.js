const form = document.querySelector("#expense-form");
const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const categoryInput = document.querySelector("#category");
const dateInput = document.querySelector("#date");
const expenseList = document.querySelector("#expense-list");
const totalDisplay = document.querySelector("#total");
const emptyMessage = document.querySelector("#empty-message");

let expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR"
});

// Set the date field to today.
dateInput.value = new Date().toLocaleDateString("en-CA");

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function renderExpenses() {
  expenseList.replaceChildren();

  let total = 0;

  expenses.forEach((expense) => {
    total += expense.amount;

    const item = document.createElement("li");

    const details = document.createElement("span");
    details.textContent =
      `${expense.description} · ${expense.category} · ${expense.date}`;

    const amount = document.createElement("strong");
    amount.textContent = money.format(expense.amount);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute(
      "aria-label",
      `Delete ${expense.description}`
    );

    deleteButton.addEventListener("click", () => {
      expenses = expenses.filter((entry) => entry.id !== expense.id);
      saveExpenses();
      renderExpenses();
    });

    item.append(details, amount, deleteButton);
    expenseList.append(item);
  });

  totalDisplay.textContent = money.format(total);
  emptyMessage.hidden = expenses.length > 0;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);

  if (!description || !Number.isFinite(amount) || amount <= 0) {
    return;
  }

  expenses.unshift({
    id: crypto.randomUUID(),
    description,
    amount,
    category: categoryInput.value,
    date: dateInput.value
  });

  saveExpenses();
  renderExpenses();
  form.reset();
  dateInput.value = new Date().toLocaleDateString("en-CA");
});

renderExpenses();
