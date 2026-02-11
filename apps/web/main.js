
// GSAP Animations
gsap.from('header', { y: -50, opacity: 0, duration: 1, ease: 'power3.out' });
gsap.from('#intro', { opacity: 0, y: 30, duration: 1, delay: 0.3, ease: 'power3.out' });
gsap.from('section', { opacity: 0, y: 50, duration: 0.8, stagger: 0.2, scrollTrigger: 'section' });

// API Endpoint (Relative path handled by backend serving)
const API = '/api/v1';

async function fetchCurrencies() {
  try {
    const res = await fetch(`${API}/currencies`);
    if (!res.ok) throw new Error('Failed to fetch currencies');
    return await res.json();
  } catch (e) {
    console.error(e);
    return {};
  }
}

function fillCurrencySelects(currencies) {
  const selects = [
    document.getElementById('from'),
    document.getElementById('to'),
    document.getElementById('history-base')
  ];

  // Sort logic could go here
  const sortedKeys = Object.keys(currencies).sort();

  selects.forEach(sel => {
    sel.innerHTML = '';
    sortedKeys.forEach(code => {
      const opt = document.createElement('option');
      opt.value = code;
      // Handle both structure formats just in case { code, description } or { USD:Description }
      const desc = currencies[code].description || currencies[code].name || currencies[code];
      opt.textContent = `${code} - ${desc}`;
      sel.appendChild(opt);
    });
  });

  // Set defaults
  if (document.getElementById('from')) document.getElementById('from').value = 'USD';
  if (document.getElementById('to')) document.getElementById('to').value = 'EUR';
  if (document.getElementById('history-base')) document.getElementById('history-base').value = 'USD';
}

// Helper to show loading state
function setLoading(btn, isLoading) {
  if (isLoading) {
    btn.dataset.text = btn.textContent;
    btn.textContent = 'Loading...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
  } else {
    btn.textContent = btn.dataset.text;
    btn.disabled = false;
    btn.style.opacity = '1';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Set max date for history
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('history-date').max = today;
  document.getElementById('history-date').value = today;

  const currencies = await fetchCurrencies();
  fillCurrencySelects(currencies);
});

document.getElementById('convert-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  setLoading(btn, true);

  const amount = document.getElementById('amount').value;
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const resultDiv = document.getElementById('convert-result');

  resultDiv.style.opacity = '0.5';

  try {
    const res = await fetch(`${API}/convert?from=${from}&to=${to}&amount=${amount}`);
    const data = await res.json();

    if (data.result !== undefined) {
      // Format numbers nicely
      const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: to });
      const formattedResult = formatter.format(data.result);

      resultDiv.innerHTML = `
                <div style="font-size: 0.9em; color: #64748b;">${amount} ${from} =</div>
                <div style="font-size: 2em; font-weight: bold; color: #4f46e5;">${formattedResult}</div>
                <div style="font-size: 0.85em; margin-top: 5px; opacity: 0.8">1 ${from} = ${data.rate.toFixed(4)} ${to}</div>
                <div style="font-size: 0.7em; color: #94a3b8; margin-top: 5px;">Rate as of ${data.date}</div>
            `;
    } else {
      resultDiv.textContent = data.error || 'Conversion failed.';
    }
  } catch (err) {
    resultDiv.textContent = 'Network error. Please try again.';
  } finally {
    resultDiv.style.opacity = '1';
    setLoading(btn, false);
  }
});

document.getElementById('history-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  setLoading(btn, true);

  const base = document.getElementById('history-base').value;
  const date = document.getElementById('history-date').value;
  const resultDiv = document.getElementById('history-result');

  resultDiv.innerHTML = 'Fetching...';

  try {
    const res = await fetch(`${API}/history?base=${base}&date=${date}`);
    const data = await res.json();

    if (data.rates) {
      let html = `<b style="display:block; margin-bottom:1rem;color:#4f46e5;">Exchange Rates for ${base} on ${date}</b>`;
      html += `<ul style="display:grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.5rem; list-style:none; padding:0;">`;

      Object.entries(data.rates).forEach(([k, v]) => {
        html += `<li style="background:#f8fafc; padding:0.5rem; border-radius:6px; font-size:0.9rem;">
                    <strong style="color:#334155;">${k}</strong>: <span style="color:#64748b;">${v}</span>
                </li>`;
      });
      html += '</ul>';
      resultDiv.innerHTML = html;
    } else {
      resultDiv.textContent = data.error || 'Failed to fetch history.';
    }
  } catch (err) {
    resultDiv.textContent = 'Error fetching history.';
  } finally {
    setLoading(btn, false);
  }
});
