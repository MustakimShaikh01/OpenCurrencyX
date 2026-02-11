import { OpenCurrencyX } from './index';

(async () => {
  const cx = new OpenCurrencyX();
  const result = await cx.convert({ from: 'USD', to: 'INR', amount: 100 });
  console.log(result);
})();
