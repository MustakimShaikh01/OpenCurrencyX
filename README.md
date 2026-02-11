# 🌍 OpenCurrencyX

**OpenCurrencyX** is a modern, open-source currency conversion and historical rates API, complete with a beautiful, responsive frontend. Built for developers and financial enthusiasts who need reliable, free execution exchange rate data.

![OpenCurrencyX Banner](https://via.placeholder.com/1200x400/0f172a/6366f1?text=OpenCurrencyX+API)

---

## 🚀 Features

- **Real-Time Conversions**: Instant currency conversion updates powered by reliable open-source feeds (Frankfurter).
- **Historical Data**: Access exchange rates for any date in the past 20 years.
- **Modern UI**: A fully responsive, glassmorphic interface that looks great on Mobile, Tablet, and Desktop.
- **Developer Ready**: Full Swagger/OpenAPI documentation included.
- **Free & Open**: No API keys required. No rate limits (within reason).

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: HTML5, Vanilla CSS (Glassmorphism), JavaScript (GSAP Animations)
- **Documentation**: Swagger UI (`swagger-ui-express`)
- **Data Source**: [Frankfurter API](https://www.frankfurter.app/)

---

## 🏁 Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MustakimShaikh01/OpenCurrencyX.git
   cd OpenCurrencyX
   ```

2. **Navigate to the API directory**
   The core logic and server live in `apps/api`.
   ```bash
   cd apps/api
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start the Application**
   ```bash
   npm run dev
   ```

   The server will start on port **3000**.

---

## 🖥️ Usage

Once the server is running, you can access:

- **Web Interface**: [http://localhost:3000](http://localhost:3000)
  - Interactive Currency Converter
  - Historical Rate Viewer
  - Developer Code Snippets

- **API Documentation**: [http://localhost:3000/docs](http://localhost:3000/docs)
  - Explore and test all API endpoints directly from your browser.

- **API Endpoints**:
  - `GET /api/v1/currencies` - List all supported currencies.
  - `GET /api/v1/rates?base=USD` - Get latest rates for a base currency.
  - `GET /api/v1/convert?from=USD&to=EUR&amount=100` - Convert an amount.
  - `GET /api/v1/history?base=USD&date=2023-01-01` - Get historical rates.

---

## 📂 Project Structure

```bash
OpenCurrencyX/
├── apps/
│   ├── api/          # Node.js/Express Backend
│   │   ├── index.ts  # Application Entry Point
│   │   └── ...
│   └── web/          # Frontend Static Files
│       ├── index.html
│       ├── style.css
│       └── main.js
├── README.md         # Project Documentation
└── ROADMAP.md        # Future Plans
```

---

## 🤝 Contributing

Contributions are always welcome! Please check out [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to help.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by Mustakim Shaikh
</p>
# OpenCurrencyX
