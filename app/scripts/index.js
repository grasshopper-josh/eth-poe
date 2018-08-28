// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import proofOfExistenceArtifact from '../../build/contracts/ProofOfExistence.json';

const ProofOfExistence = contract(proofOfExistenceArtifact);

let accounts
let account

const App = {
  start: function () {
    const self = this
    ProofOfExistence.setProvider(web3.currentProvider)

    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]
      self.setAccountAddress(account);
      web3.eth.getBalance(account, function(error, result){
        if (!error)
          self.setAccountBalance(result);
        else
          console.error(error);
      })
    })
  },

  checkUserRegistered: function () {
    const self = this;
    ProofOfExistence.deployed().then(function (instance) {
      return instance.checkUserExist.call({ from: account });
    }).then(function (data) {
      if (data) {
        self.setRegistrationStatus("Fetching user info");
        return instance.getUser.call({ from: account });
      } else {
        self.setRegistrationStatus("Please register your account");
      }
    }).then(function (userData) {
      let name = userData.valueOf()[0];
      self.setRegistrationStatus("Welcome " + name);
    }).catch(function (e) {
      console.log("Error checking if user exists: ", e);
      self.setRegistrationStatus("Error checking if user exists. Please refresh the page to try again");
    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  setRegistrationStatus: function (message) {
    const regStatus = document.getElementById('reg-status');
    regStatus.innerHTML = message;
  },
  
  setAccountAddress: function (address) {
    const ethAddress = document.getElementById('eth-address');
    ethAddress.innerHTML = address;
  },

  setAccountBalance: function (balance) {
    const ethBalance = document.getElementById('eth-balance');
    ethBalance.innerHTML = balance;
  },

  registerUser: function () {
    const self = this;

    const userName = document.getElementById('name').value;
    const ipfsAddress = document.getElementById('ipfs-address').value;

    this.setStatus('Initiating transaction... (please wait)')

    let poe;

    ProofOfExistence.deployed().then(function (instance) {
      poe = instance;
      return poe.registerUser(userName, ipfsAddress, { from: account });
    }).then(function () {
      self.setStatus('User registered!');
      self.checkUserRegistered();
    }).catch(function (e) {
      console.log("Error registering user: ", e);
      self.setStatus("Error registering user. See log.");
    })
  }
}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }

  App.start()
})
