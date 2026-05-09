// ── DOM refs ────────────────────────────────────────────
const balanceEl = document.getElementById("show-balance");
const incomeEl = document.getElementById("show-income");
const expenseEl = document.getElementById("show-expense");
const descInput = document.getElementById("description-input");
const amountInput = document.getElementById("amount-input");
const txList = document.getElementById("transactionHistory");
const addBtn = document.getElementById("add-btn");
const themeBtn = document.getElementById("theme-btn");
const txCountEl = document.getElementById("tx-count");
const formLabel = document.getElementById("form-mode-label");
const incomeRadio = document.getElementById("income");
const expenseRadio = document.getElementById("expense");
const toastEl = document.getElementById("toast");
const toastMsg = document.getElementById("toast-msg");
const toastIcon = document.getElementById("toast-icon");
const btnLabel = document.getElementById("btn-label");
const themeIcon = document.getElementById("theme-icon");
const descError = document.getElementById("desc-error");
const amountError = document.getElementById("amount-error");
const confirmModal = document.getElementById("confirm-modal");
const modalCancel = document.getElementById("modal-cancel");
const modalConfirm = document.getElementById("modal-confirm");
const modalTxName = document.getElementById("modal-tx-name");
const modalTxAmt = document.getElementById("modal-tx-amount");
const exportBtn = document.getElementById("export-btn");
let pendingDeleteId = null;

// ── State ───────────────────────────────────────────────
let transactions = JSON.parse(localStorage.getItem("exp_transactions") || "[]");
let editingId = null;
let toastTimer = null;
let isDark = localStorage.getItem("exp_theme") !== "light";

// ── Theme ───────────────────────────────────────────────
function applyTheme() {
  document.body.classList.toggle("light", !isDark);
  document.body.classList.toggle("night", isDark);
  themeIcon.className = isDark ? "fa-solid fa-moon" : "fa-solid fa-sun";
}

themeBtn.addEventListener("click", () => {
  isDark = !isDark;
  localStorage.setItem("exp_theme", isDark ? "dark" : "light");
  applyTheme();
});

// ── Toast ───────────────────────────────────────────────
function showToast(msg, type = "success") {
  toastMsg.textContent = msg;
  toastEl.className = `toast ${type} show`;
  const iconMap = {
    success: "fa-circle-check",
    danger: "fa-circle-xmark",
    warning: "fa-triangle-exclamation",
  };
  toastIcon.className = `fa-solid ${iconMap[type] || "fa-circle-check"} toast-icon`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
}

// ── Validation ──────────────────────────────────────────
function validate() {
  let ok = true;
  descError.textContent = "";
  amountError.textContent = "";
  descInput.classList.remove("error");
  amountInput.classList.remove("error");

  if (!descInput.value.trim()) {
    descError.textContent = "Description is required";
    descInput.classList.add("error");
    ok = false;
  }

  const amt = parseFloat(amountInput.value);
  if (!amountInput.value || isNaN(amt) || amt <= 0) {
    amountError.textContent = "Enter a valid amount";
    amountInput.classList.add("error");
    ok = false;
  }

  return ok;
}

// ── Format helpers ──────────────────────────────────────
function formatAmount(n) {
  return Number(n).toLocaleString("en-ET", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-ET", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Persist ─────────────────────────────────────────────
function save() {
  localStorage.setItem("exp_transactions", JSON.stringify(transactions));
}

// ── Render ──────────────────────────────────────────────
function render() {
  txCountEl.textContent = transactions.length;
  exportBtn.disabled = transactions.length === 0;

  if (!transactions.length) {
    txList.innerHTML = `
          <li class="empty-state">
            <div class="empty-icon"><i class="fa-regular fa-folder-open"></i></div>
            <p>No transactions yet.<br>Add your first one above.</p>
          </li>`;
    return;
  }

  const html = [...transactions]
    .reverse()
    .map(
      (tx) => `
        <li class="tx-item ${tx.type}" data-id="${tx.id}">
          <span class="tx-dot"></span>
          <div class="tx-info">
            <div class="tx-desc">${escHtml(tx.description)}</div>
            <div class="tx-date">${formatDate(tx.id)}</div>
          </div>
          <span class="tx-amount">${tx.type === "income" ? "+" : "-"}${formatAmount(tx.amount)}</span>
          <div class="tx-actions">
            <button class="tx-btn edit" data-id="${tx.id}" title="Edit" aria-label="Edit transaction"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="tx-btn delete" data-id="${tx.id}" title="Delete" aria-label="Delete transaction"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </li>`,
    )
    .join("");

  txList.innerHTML = html;
}

// ── Export CSV ──────────────────────────────────────────
function exportCSV() {
  const headers = ["Date", "Description", "Type", "Amount (ETB)"];
  const rows = [...transactions]
    .sort((a, b) => a.id - b.id)
    .map((tx) => [
      formatDate(tx.id),
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
      (tx.type === "expense" ? "-" : "") + Number(tx.amount).toFixed(2),
    ]);

  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `transactions-${date}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("CSV exported successfully", "success");
}

exportBtn.addEventListener("click", exportCSV);

// ── Balance ─────────────────────────────────────────────
function updateBalance() {
  let income = 0,
    expenses = 0;
  transactions.forEach((tx) => {
    if (tx.type === "income") income += parseFloat(tx.amount);
    else expenses += parseFloat(tx.amount);
  });
  const balance = income - expenses;

  balanceEl.innerHTML = `${formatAmount(Math.abs(balance))} <span class="currency">ETB</span>`;
  balanceEl.className = `balance-amount${balance < 0 ? " negative" : ""}`;

  incomeEl.textContent = formatAmount(income);
  expenseEl.textContent = formatAmount(expenses);
}

// ── XSS guard ───────────────────────────────────────────
function escHtml(s) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

// ── Add / Edit ──────────────────────────────────────────
addBtn.addEventListener("click", () => {
  if (!validate()) return;

  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = incomeRadio.checked ? "income" : "expense";

  if (editingId !== null) {
    transactions = transactions.map((tx) =>
      tx.id === editingId ? { ...tx, description: desc, amount, type } : tx,
    );
    editingId = null;
    addBtn.querySelector("i").className = "fa-solid fa-plus";
    btnLabel.textContent = "Add Transaction";
    addBtn.classList.remove("editing");
    formLabel.textContent = "New Transaction";
    showToast("Transaction updated", "success");
  } else {
    transactions.push({ id: Date.now(), description: desc, amount, type });
    showToast("Transaction added", "success");
  }

  save();
  render();
  updateBalance();
  resetForm();
});

// ── Delete / Edit (event delegation) ────────────────────
txList.addEventListener("click", (e) => {
  const btn = e.target.closest(".tx-btn");
  if (!btn) return;
  const id = Number(btn.dataset.id);

  if (btn.classList.contains("delete")) {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;
    pendingDeleteId = id;
    modalTxName.textContent = tx.description;
    modalTxAmt.textContent =
      (tx.type === "income" ? "+" : "-") + formatAmount(tx.amount);
    modalTxAmt.className = `modal-tx-amount ${tx.type}`;
    confirmModal.classList.add("show");
    modalConfirm.focus();
  }

  if (btn.classList.contains("edit")) {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;
    editingId = id;
    descInput.value = tx.description;
    amountInput.value = tx.amount;
    if (tx.type === "income") incomeRadio.checked = true;
    else expenseRadio.checked = true;
    addBtn.querySelector("i").className = "fa-solid fa-floppy-disk";
    btnLabel.textContent = "Save Changes";
    addBtn.classList.add("editing");
    formLabel.textContent = "Edit Transaction";
    descInput.focus();
    descInput.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

// ── Modal handlers ───────────────────────────────────────
function closeModal() {
  confirmModal.classList.remove("show");
  pendingDeleteId = null;
}

modalCancel.addEventListener("click", closeModal);

modalConfirm.addEventListener("click", () => {
  if (pendingDeleteId === null) return;
  transactions = transactions.filter((tx) => tx.id !== pendingDeleteId);
  save();
  render();
  updateBalance();
  showToast("Transaction deleted", "danger");
  closeModal();
});

confirmModal.addEventListener("click", (e) => {
  if (e.target === confirmModal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && confirmModal.classList.contains("show"))
    closeModal();
});

// ── Reset form ──────────────────────────────────────────
function resetForm() {
  descInput.value = "";
  amountInput.value = "";
  incomeRadio.checked = true;
  descError.textContent = "";
  amountError.textContent = "";
  descInput.classList.remove("error");
  amountInput.classList.remove("error");
  addBtn.querySelector("i").className = "fa-solid fa-plus";
  btnLabel.textContent = "Add Transaction";
  addBtn.classList.remove("editing");
  formLabel.textContent = "New Transaction";
  editingId = null;
}

// Allow Enter key to submit
[descInput, amountInput].forEach((el) => {
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addBtn.click();
  });
});

// ── Init ────────────────────────────────────────────────
applyTheme();
render();
updateBalance();
