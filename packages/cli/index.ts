#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import axios from 'axios';
import { readCache, writeCache } from './cache';
import os from 'os';

const API = process.env.OCX_API || 'http://localhost:3000/api/v1';

async function handleConvert(argv: any) {
  try {
    const { from, to, amount, fast } = argv;
    if (fast) {
      const cache = readCache();
      if (cache.rates && cache.rates.rates && cache.rates.rates[from] && cache.rates.rates[to]) {
        const result = (amount / cache.rates.rates[from]) * cache.rates.rates[to];
        console.log(chalk.green(`\n${amount} ${from} = ${result} ${to} (rate: ${cache.rates.rates[to] / cache.rates.rates[from]})\n`));
        return;
      }
    }
    const res = await axios.get(`${API}/convert`, { params: { from, to, amount } });
    console.log(chalk.green(`\n${amount} ${from} = ${res.data.result} ${to} (rate: ${res.data.rate})\n`));
  } catch (e: any) {
    console.error(chalk.red('Error:'), e.response?.data?.error || e.message);
  }
}

async function handleRates(argv: any) {
  try {
    const { base, fast } = argv;
    if (fast) {
      const cache = readCache();
      if (cache.rates && cache.rates.rates && cache.rates.rates[base]) {
        console.log(chalk.blue(`\nRates for ${base} (cached):`));
        Object.entries(cache.rates.rates).forEach(([k, v]: [string, number]) => {
          console.log(`${k}: ${v}`);
        });
        console.log('');
        return;
      }
    }
    const res = await axios.get(`${API}/rates`, { params: { base } });
    writeCache({ ...readCache(), rates: res.data });
    console.log(chalk.blue(`\nRates for ${base}:`));
    Object.entries(res.data.rates).forEach(([k, v]: [string, number]) => {
      console.log(`${k}: ${v}`);
    });
    console.log('');
  } catch (e: any) {
    console.error(chalk.red('Error:'), e.response?.data?.error || e.message);
  }
}

async function handleCurrencies(argv: any) {
  try {
    const { fast } = argv;
    if (fast) {
      const cache = readCache();
      if (cache.currencies && Object.keys(cache.currencies).length > 0) {
        console.log(chalk.yellow('\nSupported currencies (cached):'));
        Object.entries(cache.currencies).forEach(([k, v]: [string, any]) => {
          console.log(`${k}: ${v.description || ''}`);
        });
        console.log('');
        return;
      }
    }
    const res = await axios.get(`${API}/currencies`);
    writeCache({ ...readCache(), currencies: res.data });
    console.log(chalk.yellow('\nSupported currencies:'));
    Object.entries(res.data).forEach(([k, v]: [string, any]) => {
      console.log(`${k}: ${v.description || ''}`);
    });
    console.log('');
  } catch (e: any) {
    console.error(chalk.red('Error:'), e.response?.data?.error || e.message);
  }
}

async function handleHistory(argv: any) {
  try {
    const { base, date, fast } = argv;
    if (fast) {
      const cache = readCache();
      const key = `${base}_${date}`;
      if (cache.history && cache.history[key]) {
        const data = cache.history[key];
        console.log(chalk.magenta(`\nRates for ${base} on ${date} (cached):`));
        Object.entries(data.rates).forEach(([k, v]: [string, number]) => {
          console.log(`${k}: ${v}`);
        });
        console.log('');
        return;
      }
    }
    const res = await axios.get(`${API}/history`, { params: { base, date } });
    // Save to cache
    const cache = readCache();
    const key = `${base}_${date}`;
    writeCache({ ...cache, history: { ...cache.history, [key]: res.data } });
    console.log(chalk.magenta(`\nRates for ${base} on ${date}:`));
    Object.entries(res.data.rates).forEach(([k, v]: [string, number]) => {
      console.log(`${k}: ${v}`);
    });
    console.log('');
  } catch (e: any) {
    console.error(chalk.red('Error:'), e.response?.data?.error || e.message);
  }
}

const argv = yargs(hideBin(process.argv))
  .scriptName('ocx')
  .usage('$0 <cmd> [args]')
  .command('convert <from> <to> <amount>', 'Convert currency', (yargs) => {
    yargs.positional('from', { describe: 'Source currency', type: 'string' })
      .positional('to', { describe: 'Target currency', type: 'string' })
      .positional('amount', { describe: 'Amount', type: 'number' })
      .option('fast', { type: 'boolean', default: false, describe: 'Use cached data if available' });
  }, handleConvert)
  .command('rates <base>', 'Show rates for base currency', (yargs) => {
    yargs.positional('base', { describe: 'Base currency', type: 'string' })
      .option('fast', { type: 'boolean', default: false, describe: 'Use cached data if available' });
  }, handleRates)
  .command('currencies', 'List supported currencies', (yargs) => {
    yargs.option('fast', { type: 'boolean', default: false, describe: 'Use cached data if available' });
  }, handleCurrencies)
  .command('history <base> <date>', 'Show historical rates', (yargs) => {
    yargs.positional('base', { describe: 'Base currency', type: 'string' })
      .positional('date', { describe: 'Date YYYY-MM-DD', type: 'string' })
      .option('fast', { type: 'boolean', default: false, describe: 'Use cached data if available' });
  }, handleHistory)
  .option('api', { alias: 'a', type: 'string', description: 'API base URL' })
  .help()
  .version('1.0.0')
  .argv;
