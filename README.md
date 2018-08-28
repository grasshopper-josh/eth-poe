# Ethereum Proof of Existence

## Tools

* truffle
* npm
* ganache cli
* MetaMask browser extension
* Ubuntu 18.04 (Not required but makes things easier)

## Steps to get set up
1. npm install
2. Run ganache-cli in a seperate terminal and make sure that your truffle.js or truffle-config.js is pointing to the ganache network on localhost.
3. truffle compile
4. truffle test
5. truffle migrate

## Interacting with the web app
1. npm run dev
2. Visit localhost:8080 in your metamask enabled browser

Unfortunately the front-end is incomplete and can only perform the register user function, however the contract is fully functional as indicated by the tests.
