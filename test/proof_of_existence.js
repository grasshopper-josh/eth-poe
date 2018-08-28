var ProofOfExistence = artifacts.require("./ProofOfExistence.sol");

contract('ProofOfExistence', async (accounts) => {

  // Register a new user
  it("should register a new user", async () => {
    let instance = await ProofOfExistence.deployed();
    await instance.registerUser("Josh", "random_ipfs_address", { from: accounts[0] });

    let createdUser = await instance.checkUserExist.call({ from: accounts[0] });
    assert.equal(createdUser.valueOf(), true);
  });

  // Check that the user exists
  it("should check that the user exists", async () => {
    let instance = await ProofOfExistence.deployed();
    let userExists = await instance.checkUserExist.call({ from: accounts[0] });

    assert.equal(userExists.valueOf(), true);
  });

  // Return details for the registered user
  it("should return the registered user", async () => {
    let instance = await ProofOfExistence.deployed();
    let user = await instance.getUser.call({ from: accounts[0] });

    assert.equal(user.valueOf()[0], "Josh");
    assert.equal(user.valueOf()[1], "random_ipfs_address");
  });

  // Check that we can add more users
  it("should create a second user", async () => {
    let instance = await ProofOfExistence.deployed();
    await instance.registerUser("SomeGuy", "another_ipfs_address", { from: accounts[1] });

    let userExists = await instance.checkUserExist.call({ from: accounts[1] });
    let user = await instance.getUser.call({ from: accounts[1] });

    assert.equal(userExists.valueOf(), true);
    assert.equal(user.valueOf()[0], "SomeGuy");
    assert.equal(user.valueOf()[1], "another_ipfs_address");
  });

  // Check that we can create a file entry
  it("should create a file for the first address", async () => {
    let instance = await ProofOfExistence.deployed();
    await instance.createFile("JoshFile", "josh_file_address", { from: accounts[0] });

    let file = await instance.getFile.call(0, { from: accounts[0] });

    assert.equal(file.valueOf()[0], "JoshFile");
    assert.equal(file.valueOf()[1], "josh_file_address");
  })
})
