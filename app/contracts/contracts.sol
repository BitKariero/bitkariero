pragma solidity ^0.4.0;



contract bkIdentity {
    address public owner;
    string public info;
    string public pubKey;
    string public CV;

    mapping(address => bool) public providers;
    address[] public vouches;

    modifier onlyOwner() {
        if (msg.sender != owner) throw;
        _;
    }

    modifier onlyProviders() {
        if (providers[msg.sender] != true) throw;
        _;
    }

    function bkIdentity(string _info) {
        owner = msg.sender;
        info = _info;
    }

    function setOwner(address _owner) onlyOwner() {
        owner = _owner;
    }

    function updateCV(string _CV) onlyOwner() {
        CV = _CV;
    }

    function updatePubKey(string _pubKey) onlyOwner() {
        pubKey = _pubKey;
    }

    function updateInfo(string _info) onlyOwner() {
        info = _info;
    }

    function addProvider(address _provider) onlyOwner() {
        providers[_provider] = true;
    }

    function removeProvider(address _provider) onlyOwner() {
        providers[_provider] = false;
    }

    function vouch() onlyProviders() {
        vouches.push(msg.sender);
    }

    function unVouch() onlyProviders() {
        for(uint i = 0; i < vouches.length; i++) {
            if(vouches[i] == msg.sender) {
                if(i != vouches.length - 1) {
                    delete vouches[i];
                    vouches[i] = vouches[vouches.length - 1];
                    vouches.length--;
                }
                else {
                    delete vouches[vouches.length - 1];
                    vouches.length--;
                }
            }
        }
    }
}

contract bkContract {
    /* owner and organisation address */
    address public owner;
    address public provider;

    modifier onlyOwner() {
        if (msg.sender != owner) throw;
        _;
    }

    modifier onlyProvider() {
        if (msg.sender != provider) throw;
        _;
    }

    function bkContract(address _provider) {
        owner = msg.sender;
        provider = _provider;
    }

    function setOwner(address _owner) onlyOwner() {
        owner = _owner;
    }

    function setProvider(address _provider) onlyOwner() {
        provider = _provider;
    }
}

contract bkFloating {
    address public owner;
    address public provider;
    bytes32 public secret;

    modifier onlyOwner() {
        if (msg.sender != owner) throw;
        _;
    }

    modifier onlyProvider() {
        if (msg.sender != provider) throw;
        _;
    }

    function bkFloating(bytes32 _hash) {
        provider = msg.sender;
        secret = _hash;
    }

    function claim(string _guess) {
        if (sha3(_guess) == secret) {
            owner = msg.sender;
        }
    }
}

contract bkRevocable{
    bool public isRevoked = false;

    function revoke() public {
        isRevoked = true;
    }
}

contract bkReference is bkContract {
    /* reference string for now */
    string public reference;

    function bkReference(address _y) bkContract(_y) {}

    function addReference(string _reference) onlyProvider() public {
        reference = _reference;
    }
}

contract bkFloatingReference is bkFloating {
    /* reference string for now */
    string public reference;

    function bkFloatingReference(bytes32 _hash) bkFloating(_hash) {}

    function addReference(string _reference) onlyProvider() public {
        reference = _reference;
    }
}

contract bkMembership is bkContract, bkRevocable {
    string public content;

    function bkMembership(address _y) bkContract(_y) {}

    function revoke() onlyProvider {
        super.revoke();
    }

    function addContent(string _content) onlyProvider() public {
        content = _content;
    }
}
