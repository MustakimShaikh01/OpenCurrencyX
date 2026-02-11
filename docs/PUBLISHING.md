# Publishing & Versioning Instructions

## 1. Publishing to npm (Node SDK & CLI)

### Prerequisites
- Node.js & npm installed
- npm account (https://www.npmjs.com/signup)

### Steps
1. Navigate to the package directory (e.g. `packages/node-sdk` or `packages/cli`).
2. Update the version in `package.json` as needed.
3. Build the package (if TypeScript):
   ```sh
   npm run build
   ```
4. Login to npm (first time only):
   ```sh
   npm login
   ```
5. Publish:
   ```sh
   npm publish --access public
   ```

## 2. Publishing to PyPI (Python SDK)

### Prerequisites
- Python 3.7+
- pip, setuptools, wheel, and twine installed
- PyPI account (https://pypi.org/account/register/)

### Steps
1. Navigate to `packages/python-sdk`.
2. Update the version in `setup.py` as needed.
3. Build the package:
   ```sh
   python setup.py sdist bdist_wheel
   ```
4. Upload to PyPI:
   ```sh
   twine upload dist/*
   ```

## 3. Versioning
- Use [Semantic Versioning](https://semver.org/): MAJOR.MINOR.PATCH
- Bump version in `package.json` or `setup.py` for each release.
- Tag releases in git: `git tag v1.0.0 && git push --tags`

## 4. CI/CD (GitHub Actions Example)
- Add `.github/workflows/publish.yml` for automated tests and publishing.
- Example for npm:
  ```yaml
  name: Node.js Package
  on:
    push:
      tags:
        - 'v*.*.*'
  jobs:
    publish:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: '20'
            registry-url: 'https://registry.npmjs.org/'
        - run: npm ci
        - run: npm run build
        - run: npm publish --access public
          env:
            NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
  ```
- Example for PyPI:
  ```yaml
  name: Python Package
  on:
    push:
      tags:
        - 'v*.*.*'
  jobs:
    publish:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-python@v5
          with:
            python-version: '3.10'
        - run: pip install build twine
        - run: python -m build
        - run: twine upload dist/*
          env:
            TWINE_USERNAME: ${{ secrets.PYPI_USERNAME }}
            TWINE_PASSWORD: ${{ secrets.PYPI_PASSWORD }}
  ```

## 5. Notes
- Always test locally before publishing.
- Use `npm version` and `python setup.py --version` to check versions.
- For CLI, ensure the `bin` field is set in `package.json`.
