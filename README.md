# 🌍 OpenCurrencyX

**OpenCurrencyX** is an open-source currency converter and exchange-rate API with a clean, modern web interface.
It’s built for developers (and curious finance folks) who want **simple, reliable, and free** currency data—without API keys or annoying limits.

You can convert currencies in real time, check historical rates, and explore everything through a friendly UI or clear API docs.

---

## 🚀 What you can do with it

* **Instant currency conversion**
  Convert between currencies in real time using trusted open-source data (Frankfurter).

* **Historical exchange rates**
  Get rates from almost any date in the last 20 years.

* **Clean & modern UI**
  A responsive, glassmorphism-style interface that works smoothly on mobile, tablet, and desktop.

* **Developer-friendly API**
  Comes with Swagger/OpenAPI docs so you can test endpoints right in your browser.

* **Completely free & open-source**
  No API keys. No hidden limits (just don’t abuse it 😄).

---

## 🛠️ Tech stack (simple & solid)

* **Backend**: Node.js, Express, TypeScript
* **Frontend**: HTML, Vanilla CSS (Glassmorphism), JavaScript (GSAP animations)
* **API Docs**: Swagger UI
* **Exchange rate data**: Frankfurter API

---

## 🏁 Getting started locally

You can run everything on your machine in just a few steps.

### What you need first

* Node.js (v16 or newer)
* npm

### Installation steps

1. **Clone the repo**

   ```bash
   git clone https://github.com/MustakimShaikh01/OpenCurrencyX.git
   cd OpenCurrencyX
   ```

2. **Go to the API folder**

   ```bash
   cd apps/api
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Start the server**

   ```bash
   npm run dev
   ```

The app will run on **[http://localhost:3000](http://localhost:3000)**.

---

## 🖥️ How to use it

Once the server is running, you get three main things:

### 🌐 Web App

**[http://localhost:3000](http://localhost:3000)**

* Currency converter
* Historical rate viewer
* Example code snippets for developers

### 📘 API Documentation

**[http://localhost:3000/docs](http://localhost:3000/docs)**

* View all endpoints
* Try requests directly in your browser

### 🔌 API Endpoints

* `GET /api/v1/currencies`
  → List all supported currencies

* `GET /api/v1/rates?base=USD`
  → Get latest exchange rates

* `GET /api/v1/convert?from=USD&to=EUR&amount=100`
  → Convert an amount

* `GET /api/v1/history?base=USD&date=2023-01-01`
  → Get historical rates for a specific date

---

## 📂 Project structure (quick overview)

```bash
OpenCurrencyX/
├── apps/
│   ├── api/          # Backend (Node.js + Express)
│   │   ├── index.ts  # Entry point
│   │   └── ...
│   └── web/          # Frontend files
│       ├── index.html
│       ├── style.css
│       └── main.js
├── README.md
└── ROADMAP.md        # Future ideas & improvements
```

---

## 🤝 Want to contribute?

Contributions are very welcome ❤️
If you want to improve something or add a feature:

1. Fork the repo
2. Create a new branch

   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes
4. Push the branch
5. Open a Pull Request

Check `CONTRIBUTING.md` for more details.

---

## 📜 License

This project is released under the **MIT License**.
You’re free to use it, modify it, and build on top of it.

---

<p align="center">
  Built with ❤️ by Mustakim Shaikh
</p>


