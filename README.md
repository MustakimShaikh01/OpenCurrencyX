
# OpenCurrencyX

OpenCurrencyX is a modern, open-source currency conversion and historical rates API with a beautiful frontend.

## Features
- **Real-time Exchange Rates**: Powered by reliable open-source data.
- **Historical Data**: Access past exchange rates easily.
- **REST API**: Simple, documented API for developers.
- **Modern UI**: A responsive, aesthetic frontend built with Vanilla JS and CSS.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Navigate to the API directory:
   ```bash
   cd apps/api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To run the full stack (API + Frontend):

```bash
# In apps/api directory
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api/v1
- **Swagger Docs**: http://localhost:3000/docs

## API Endpoints

- `GET /api/v1/currencies`: List supported currencies.
- `GET /api/v1/rates?base=USD`: Get latest rates.
- `GET /api/v1/convert?from=USD&to=EUR&amount=100`: Convert currency.
- `GET /api/v1/history?base=USD&date=2023-01-01`: Get historical rates.

## License
MIT
