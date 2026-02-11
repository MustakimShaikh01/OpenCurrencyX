import fs from 'fs';
import path from 'path';
import os from 'os';

const CACHE_FILE = path.join(os.homedir(), '.ocx_cache.json');
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

function readCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      if (Date.now() - data.timestamp < CACHE_TTL) return data;
    }
  } catch {}
  return { timestamp: 0, rates: {}, currencies: {} };
}

function writeCache(data: any) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify({ ...data, timestamp: Date.now() }));
}

export { readCache, writeCache };
