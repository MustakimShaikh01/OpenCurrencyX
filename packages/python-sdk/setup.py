from setuptools import setup, find_packages

setup(
    name='opencurrencyx',
    version='1.0.0',
    description='OpenCurrencyX Python SDK - Free, open-source currency conversion and history API client.',
    author='OpenCurrencyX Contributors',
    author_email='opensource@opencurrencyx.org',
    packages=find_packages(),
    install_requires=[
        'requests>=2.25.0'
    ],
    python_requires='>=3.7',
    license='MIT',
    url='https://github.com/opencurrencyx/opencurrencyx',
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
    ],
)
