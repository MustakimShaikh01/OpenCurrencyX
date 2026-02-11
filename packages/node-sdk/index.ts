import axios, { AxiosInstance } from 'axios';

export interface ConvertOptions {
  from: string;
  to: string;
  amount: number;
}

export interface HistoryOptions {
  base: string;
  date: string; // YYYY-MM-DD
}

export class OpenCurrencyX {
  private api: AxiosInstance;
  constructor(baseUrl = 'http://localhost:3000/api/v1', timeout = 5000, retries = 2) {
    this.api = axios.create({ baseURL: baseUrl, timeout });
    // Simple retry logic
    this.api.interceptors.response.use(undefined, async (error) => {
      let config = error.config;
      if (!config || !retries) throw error;
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount < retries) {
        config.__retryCount += 1;
        return this.api(config);
      }
      throw error;
    });
  }

  async status() {
    const res = await this.api.get('/status');
    return res.data;
  }

  async currencies() {
    const res = await this.api.get('/currencies');
    return res.data;
  }

  async rates(base = 'USD') {
    const res = await this.api.get('/rates', { params: { base } });
    return res.data;
  }

  async convert(opts: ConvertOptions) {
    const res = await this.api.get('/convert', { params: opts });
    return res.data;
  }

  async history(opts: HistoryOptions) {
    const res = await this.api.get('/history', { params: opts });
    return res.data;
  }
}

export default OpenCurrencyX;
