# 💸 Expense Tracker

A clean, modern, and fully client-side expense tracking web app built with vanilla HTML, CSS, and JavaScript. No frameworks, no backend, no dependencies beyond a couple of font and icon CDNs.

---

## ✨ Features

- **Add transactions** — log income or expenses with a description and amount
- **Live balance** — total balance, total income, and total expenses update instantly
- **Edit transactions** — update any existing entry in place
- **Delete with confirmation** — a modal dialog prevents accidental deletions
- **Export to CSV** — download all transactions as a dated `.csv` file
- **Persistent storage** — data is saved to `localStorage` and survives page refreshes
- **Dark / Light mode** — toggle between themes; preference is remembered across sessions
- **Fully responsive** — works on mobile, tablet, and desktop
- **Inline validation** — field-level error messages for empty or invalid inputs
- **Toast notifications** — non-intrusive feedback for every action

---

## 🚀 Getting Started

No build step, no npm install. Just open the file.

```bash
# Clone or download the project
git clone https://github.com/your-username/expense-tracker.git

# Open in your browser
open index.html
```

Or simply drag `index.html` into any browser window and it works immediately.

---

## 📁 Project Structure

```
expense-tracker/
└── index.html       
└── style.css       
└── script.js       
└── README.md
```

All styles and scripts are embedded directly in `index.html` for zero-dependency portability. The app can be hosted on any static file host (GitHub Pages, Vercel, Netlify) by uploading a single file.

---

## 🛠️ Tech Stack

| Layer   | Technology                                          |
| ------- | --------------------------------------------------- |
| Markup  | HTML5                                               |
| Styling | CSS3 (custom properties, flexbox, grid, animations) |
| Logic   | Vanilla JavaScript (ES6+)                           |
| Storage | Browser `localStorage`                              |
| Icons   | Font Awesome 6.5                                    |
| Fonts   | Plus Jakarta Sans · Geist (Google Fonts)            |

---

## 📖 How to Use

### Adding a Transaction

1. Enter a description (e.g. _Grocery run_)
2. Enter the amount in ETB
3. Select **Income** or **Expense**
4. Click **Add Transaction** — the balance updates immediately

### Editing a Transaction

1. Click the ✏️ edit icon on any transaction in the list
2. The form pre-fills with the existing values
3. Make your changes and click **Save Changes**

### Deleting a Transaction

1. Click the 🗑️ delete icon on any transaction
2. A confirmation modal appears showing the transaction details
3. Click **Delete** to confirm or **Cancel** to go back

### Exporting to CSV

1. Click the **Export CSV** button in the Transactions header
2. A file named `transactions-YYYY-MM-DD.csv` is downloaded automatically
3. Open it in Excel, Google Sheets, or any spreadsheet app

The CSV includes these columns:

```
Date, Description, Type, Amount (ETB)
```

### Switching Themes

Click the 🌙 / ☀️ icon in the top-right corner. Your preference is saved and restored on your next visit.

---

## 💾 Data Storage

All data is stored in your browser's `localStorage` under the key `exp_transactions`. This means:

- Data is **private to your device and browser** — nothing is sent to any server
- Clearing your browser data or `localStorage` will erase your transaction history
- Data does **not** sync across devices or browsers

To back up your data, use the **Export CSV** feature regularly.

---

```bash
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/kalabGoitom/Expense-Tracker-V2.0.git
git push -u origin main
# Then enable GitHub Pages in repository Settings → Pages → Deploy from main
```

**Vercel**

```bash
npx vercel
# Follow the prompts — select the project folder and deploy
```

**Netlify**

Drag and drop the project folder onto [netlify.com/drop](https://netlify.com/drop).

---

## 🗺️ Roadmap

Planned features for future versions:

- [ ] Transaction categories (Food, Transport, Rent, etc.)
- [ ] Monthly spending breakdown chart
- [ ] Date range filter
- [ ] Currency selector
- [ ] Import from CSV
- [ ] PWA support (offline-first, installable)

---

## 🤝 Contributing

Contributions are welcome. To get started:

```bash
git clone https://github.com/kalabGoitom/Expense-Tracker-V2.0.git
cd expense-tracker
# Make your changes to index.html
# Open in browser to test
# Submit a pull request
```

Please keep the zero-dependency, single-file philosophy in mind when contributing.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

Built using plain HTML, CSS, and JavaScript.
