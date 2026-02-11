
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import dotenv from 'dotenv';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupSwagger } from './swagger.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve web path:
let webPath = path.join(__dirname, '../web');
if (!fs.existsSync(webPath)) {
  webPath = path.join(__dirname, '../../web');
}

const app = express();
const PORT = process.env.PORT || 3000;
const CACHE_FILE = path.join(__dirname, 'cache.json');
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Primary free data source
const PRIMARY_API = 'https://api.frankfurter.app';

interface CacheData {
  timestamp: number;
  rates: any;
  currencies: any;
  history: Record<string, any>;
}

let cache: CacheData = {
  timestamp: 0,
  rates: {},
  currencies: {},
  history: {},
};

// Load cache from file if exists
function loadCache() {
  if (fs.existsSync(CACHE_FILE)) {
    try {
      const data = fs.readFileSync(CACHE_FILE, 'utf-8');
      cache = JSON.parse(data);
    } catch (e) {
      console.error('Failed to load cache:', e);
      cache = { timestamp: 0, rates: {}, currencies: {}, history: {} };
    }
  }
}

function saveCache() {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache));
  } catch (e) {
    console.error('Failed to save cache:', e);
  }
}

// Fetch latest rates and currencies
async function fetchRatesAndCurrencies() {
  try {
    console.log('Fetching rates from Frankfurter...');
    const symbolsRes = await axios.get(`${PRIMARY_API}/currencies`);
    const currenciesData = symbolsRes.data;

    const ratesRes = await axios.get(`${PRIMARY_API}/latest?from=USD`);

    // Normalize currencies
    const normalizedCurrencies: Record<string, any> = {};
    for (const [code, desc] of Object.entries(currenciesData)) {
      normalizedCurrencies[code] = { code, description: desc };
    }
    cache.currencies = normalizedCurrencies;
    cache.rates = ratesRes.data;
    cache.timestamp = Date.now();
    saveCache();
    console.log('Rates updated successfully.');
    return true;
  } catch (e) {
    console.error('Error fetching rates:', (e as Error).message);
    return false;
  }
}

// Fetch historical rates
async function fetchHistory(base: string, date: string) {
  const key = `${base}_${date}`;
  if (cache.history[key]) return cache.history[key];
  try {
    const res = await axios.get(`${PRIMARY_API}/${date}`, { params: { from: base } });
    cache.history[key] = res.data;
    saveCache();
    return res.data;
  } catch (e) {
    console.error(`Error fetching history for ${base} on ${date}:`, (e as Error).message);
    throw new Error('Unable to fetch historical rates');
  }
}

// Schedule cache refresh every 30 minutes
cron.schedule('*/30 * * * *', fetchRatesAndCurrencies);

// Initial cache load
loadCache();
if (Date.now() - cache.timestamp > CACHE_DURATION || !cache.rates || !cache.rates.rates) {
  fetchRatesAndCurrencies();
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(webPath)); // Serve frontend from resolved path

app.use(rateLimit({ windowMs: 60 * 1000, max: 60 }));

// Swagger docs
setupSwagger(app);

// API routes below...

/**
 * @openapi
 * /api/v1/status:
 *   get:
 */
app.get('/api/v1/status', (req, res) => {
  res.json({ status: 'ok', updated: new Date(cache.timestamp).toISOString() });
});

/**
 * @openapi
 * /api/v1/currencies:
 *   get:
 */
app.get('/api/v1/currencies', async (req, res) => {
  if (!cache.currencies || Object.keys(cache.currencies).length === 0) {
    await fetchRatesAndCurrencies();
  }
  if (!cache.currencies || Object.keys(cache.currencies).length === 0) {
    return res.status(503).json({ error: 'Currencies unavailable' });
  }
  res.json(cache.currencies);
});

/**
 * @openapi
 * /api/v1/rates:
 *   get:
 */
app.get('/api/v1/rates', async (req, res) => {
  let base = (req.query.base as string)?.toUpperCase() || 'USD';

  if (!cache.rates || !cache.rates.rates) {
    await fetchRatesAndCurrencies();
  }
  if (!cache.rates || !cache.rates.rates) {
    return res.status(503).json({ error: 'Rates unavailable' });
  }

  const currentBase = cache.rates.base;

  if (base !== currentBase && !cache.rates.rates[base]) {
    return res.status(400).json({ error: 'Invalid base currency' });
  }

  // Helper to get rate vs currentBase
  const getRate = (curr: string) => {
    if (curr === currentBase) return 1;
    return cache.rates.rates[curr];
  };

  const baseRate = getRate(base);

  // Rebase
  const newRates: Record<string, number> = {};
  newRates[currentBase] = 1 / baseRate;

  for (const [code, rate] of Object.entries(cache.rates.rates)) {
    if (code === base) continue;
    newRates[code] = Number(rate) / baseRate;
  }

  res.json({ base, rates: newRates, date: cache.rates.date });
});

/**
 * @openapi
 * /api/v1/convert:
 *   get:
 */
app.get('/api/v1/convert', async (req, res) => {
  const from = (req.query.from as string)?.toUpperCase();
  const to = (req.query.to as string)?.toUpperCase();
  const amount = parseFloat(req.query.amount as string);

  if (!from || !to || isNaN(amount)) {
    return res.status(400).json({ error: 'Missing or invalid parameters' });
  }

  if (!cache.rates || !cache.rates.rates) {
    await fetchRatesAndCurrencies();
  }

  if (!cache.rates || !cache.rates.rates) {
    return res.status(503).json({ error: 'Rates unavailable' });
  }

  const getRate = (curr: string) => {
    if (curr === cache.rates.base) return 1;
    return cache.rates.rates[curr];
  };

  const rateFrom = getRate(from);
  const rateTo = getRate(to);

  if (!rateFrom || !rateTo) {
    return res.status(400).json({ error: 'Invalid currency code' });
  }

  const result = (amount / rateFrom) * rateTo;
  const exchangeRate = rateTo / rateFrom;

  res.json({
    from,
    to,
    amount,
    result,
    rate: exchangeRate,
    date: cache.rates.date
  });
});

/**
 * @openapi
 * /api/v1/history:
 *   get:
 */
app.get('/api/v1/history', async (req, res) => {
  const base = (req.query.base as string)?.toUpperCase() || 'USD';
  const date = req.query.date as string;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid or missing date' });
  }
  try {
    const data = await fetchHistory(base, date);
    res.json(data);
  } catch (e) {
    res.status(503).json({ error: 'History unavailable' });
  }
});

// Serve frontend for root if not matched by API
app.get('/', (req, res) => {
  // Check if webPath/index.html exists
  const indexPath = path.join(webPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend not found.');
  }
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`OpenCurrencyX API running on port ${PORT}`);
  console.log(`Serving frontend from ${webPath}`);
});
