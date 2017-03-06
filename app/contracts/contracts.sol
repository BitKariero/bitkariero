pragma solidity ^0.4.0;

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
}

contract bkRevocable is bkContract {
    bool isRevoked = false;

    function bkRevocable(address _y) bkContract(_y) {}

    function revoke() public {
        isRevoked = true;
    }
}

contract bkMembership is bkRevocable {
    string public content;

    function bkMembership(address _y) bkRevocable(_y) {}

    function revoke() onlyProvider(){
        super.revoke();
    }

    function addContent(string _content) onlyProvider() public {
        content = _content;
    }
}

contract bkUnRevocable is bkContract {
    function bkUnRevocable(address _y) bkContract(_y) {}
}

contract bkReference is bkUnRevocable {
    /* reference string for now */
    string public reference;

    function bkReference(address _y) bkUnRevocable(_y) {}

    function addReference(string _reference) onlyProvider() public {
        reference = _reference;
    }
}

contract bkIdentity {
    address public owner;
    string public ownerName;
    string public ownerDOB;

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

    function bkIdentity(address _owner, string _ownerName, string _ownerDOB) {
        owner = _owner;
        ownerName = _ownerName;
        ownerDOB  = _ownerDOB;
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
