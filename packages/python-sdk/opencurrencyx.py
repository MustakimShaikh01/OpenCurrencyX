import requests

class OpenCurrencyXException(Exception):
    pass

class OpenCurrencyX:
    def __init__(self, base_url='http://localhost:3000/api/v1', timeout=5, retries=2):
        self.base_url = base_url
        self.timeout = timeout
        self.retries = retries

    def _request(self, path, params=None):
        url = f"{self.base_url}{path}"
        for attempt in range(self.retries + 1):
            try:
                resp = requests.get(url, params=params, timeout=self.timeout)
                resp.raise_for_status()
                return resp.json()
            except Exception as e:
                if attempt == self.retries:
                    raise OpenCurrencyXException(str(e))

    def status(self):
        return self._request('/status')

    def currencies(self):
        return self._request('/currencies')

    def rates(self, base='USD'):
        return self._request('/rates', params={'base': base})

    def convert(self, from_currency, to_currency, amount):
        params = {'from': from_currency, 'to': to_currency, 'amount': amount}
        return self._request('/convert', params=params)

    def history(self, base, date):
        params = {'base': base, 'date': date}
        return self._request('/history', params=params)
