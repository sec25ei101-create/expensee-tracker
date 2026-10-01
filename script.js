const form = document.querySelector("#expensee-form");
const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const categoryInput = document.querySelector("#category");
const dateInput = document.querySelector("#date");
const expenseeList = document.querySelector("#expensee-list");
const totalDisplay = document.querySelector("#total");
const emptyMessage = document.querySelector("#empty-message");

let expensees = JSON.parse(localStorage.getItem("expensees") || "[]");

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR"
});

dateInput.value = new Date().toLocaleDateString("en-CA");

function saveExpensees() {
  localStorage.setItem("expensees", JSON.stringify(expensees));
}

function renderExpensees() {
  expenseeList.replaceChildren();

  let total = 0;

  expensees.forEach((expensee) => {
    total += expensee.amount;

    const item = document.createElement("li");

    const details = document.createElement("span");
    details.textContent =
      `${expensee.description} · ${expensee.category} · ${expensee.date}`;

    const amount = document.createElement("strong");
    amount.textContent = money.format(expensee.amount);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      expensees = expensees.filter((entry) => entry.id !== expensee.id);
      saveExpensees();
      renderExpensees();
    });

    item.append(details, amount, deleteButton);
    expenseeList.append(item);
  });

  totalDisplay.textContent = money.format(total);
  emptyMessage.hidden = expensees.length > 0;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);

  if (!description || !Number.isFinite(amount) || amount <= 0) {
    return;
  }

  expensees.unshift({
    id: Date.now().toString() + Math.random(),
    description,
    amount,
    category: categoryInput.value,
    date: dateInput.value
  });

  saveExpensees();
  renderExpensees();
  form.reset();
  dateInput.value = new Date().toLocaleDateString("en-CA");
});

renderExpensees();
