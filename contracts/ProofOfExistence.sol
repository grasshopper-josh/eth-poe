pragma solidity ^0.4.22;

// Import the Ownable contract from openzeppelin.
// This allows us to set and transfer ownership of a contract
// and limit function accessibility using modifiers.
import "./openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract ProofOfExistence is Ownable {

  /// ===========================
  /// Structs
  /// ===========================

  // Struct describing a user
  struct UserStruct {
    string name;
    string ipfsAddress;
    bool isValue;
  }

  // Struct describing a file
  struct FileStruct {
    string name;
    string ipfsAddress;
    uint createdBlockNumber;
  }

  /// ===========================
  /// Storage
  /// ===========================

  // One user per address
  mapping (address => UserStruct) users;

  // Many files per user
  mapping (address => FileStruct[]) files;

  // Used to check if the contract is paused or not
  bool private contractPaused = false;

  /// ===========================
  /// Modifiers
  /// ===========================

  /// Make sure the contract isn't paused for some functions
  modifier contractNotPaused() {
    require(!contractPaused, "Contract is paused");
    _;
  }

  /// Make sure the user exists
  modifier userMustExist() {
    require(users[msg.sender].isValue, "User with this address doesn't exist");
    _;
  }

  /// Make sure the user doesn't already exist
  modifier userMustNotExist() {
    require(!users[msg.sender].isValue, "User with this address already exists");
    _;
  }

  /// ===========================
  /// Constructor
  /// ===========================

  constructor() public {
  }

  /// ===========================
  /// Functions
  /// ===========================

  /// USER ======================

  /** @dev Check if a user exists or not
  * @return boolean indicating whether or not the user exists
  */
  function checkUserExist() public view returns (bool) {
    return users[msg.sender].isValue;
  }

  /** @dev Register a user
  * @param _name Name of the user
  * @param _ipfsAddress The ipfs address of the user
  */
  function registerUser(string _name, string _ipfsAddress) public contractNotPaused userMustNotExist {
    users[msg.sender].name = _name;
    users[msg.sender].ipfsAddress = _ipfsAddress;
    users[msg.sender].isValue = true;
  }

  /** @dev Fetch a user's details
  * @return name, ipfsAddress of the user
  */
  function getUser() public view returns (string name, string ipfsAddress) {
    UserStruct memory currentUser = users[msg.sender];
    return (currentUser.name, currentUser.ipfsAddress);
  }

  /// FILES =====================

  /** @dev Create a file
  * @param _name Name of the file
  * @param _ipfsAddress the ipfs address of the file
  */
  function createFile(string _name, string _ipfsAddress) public contractNotPaused userMustExist {
    FileStruct memory newFile = FileStruct(_name, _ipfsAddress, block.number);
    files[msg.sender].push(newFile);
  }

  /** @dev Get a file's details
  * @param _index The index of the file in the user's files array
  * @return name, ipfsAddress, createdBlockNumber of the file
  */
  function getFile(uint256 _index) public view returns (string name, string ipfsAddress, uint createdBlockNumber) {
    FileStruct memory currentFile = files[msg.sender][_index];
    return (currentFile.name, currentFile.ipfsAddress, currentFile.createdBlockNumber);
  }

  /// CIRCUIT BREAKING ===========

  /** @dev Circuit break the contract to disallow certain functionality
  */
  function pauseContract() public onlyOwner
  {
    contractPaused = true;
  }

  /** @dev Turn off the circuit breaker of the contract
  */
  function unpauseContract() public onlyOwner
  {
    contractPaused = false;
  }
}
