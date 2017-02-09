pragma solidity ^0.4.0;

contract bkContract
{
    /* owner and organisation address */
    address public owner;
    address public organisation;
    function bkContract(address _organisation)
    {
      /* owner and organisation address */
      owner = msg.sender;
      organisation = _organisation;
    }
}

contract bkRevocable is bkContract
{
    bool isRevoked = false;
    function bkRevocable(address _y) bkContract(_y)
    {

    }
    function revoke() public
    {
      isRevoked = true;
    }
}

contract bkMembership is bkRevocable
{
    string public content;

    function bkMembership(address _y) bkRevocable(_y)
    {

    }
    function revoke()
    {
      if(msg.sender == organisation)
      {
        super.revoke();
      }
    }
    function addContent(string _content) public
    {
        if(msg.sender == organisation)
        {
            content = _content;
        }
    }
}

contract bkUnRevocable is bkContract
{
    function bkUnRevocable(address _y) bkContract(_y)
    {

    }
}

contract bkReference is bkUnRevocable
{
    /* reference string for now */
    string public reference;

    function bkReference(address _y) bkUnRevocable(_y)
    {

    }
    function addReference(string _reference) public
    {
        if(msg.sender == organisation)
        {
            reference = _reference;
        }
    }
}

contract bkIdentity
{
    address public owner;
    string public ownerName;  // If your name is Danish Amjad Alavi, your name would go as 'Danish Amjad Alavi'
    string public ownerDOB;   // String in strict format DDMMYYYY for example, 6th September 1997 is 06-09-1997

    address[] public providers;
    address[] public vouches;

    function getProvidersCount() public constant returns(uint)
    {
      return providers.length;
    }

    function bkIdentity(address _owner, string _ownerName, string _ownerDOB)
    {
        owner = _owner;
        ownerName = _ownerName;
        ownerDOB  = _ownerDOB;
    }

    function addProvider(address _provider) returns (bool)
    {
      bool added = false;
      if(msg.sender == owner)
      {
        providers.push(_provider);
        added = true;
      }
      return added;
    }

    function removeProvider(address _provider) returns (bool)
    {
      bool isRemoved = false;
      if(msg.sender == owner)
      {
        bool removedProvider = false;
        for(uint i = 0; i < providers.length; i++)
        {
          if(providers[i] == _provider)
          {
            delete providers[i];
            isRemoved = true;
          }
        }
      }
      return isRemoved;
    }

    function vouch() returns (bool)
    {
      address voucher = msg.sender;
      bool canVouch = false;

      for(uint i = 0; i < providers.length; i++)      // O(N) search
      {
        if(providers[i] == voucher)
        {
          canVouch = true;
        }
      }

      if(canVouch)
      {
        vouches.push(voucher);
      }
      return canVouch;
    }

    function unVouch() returns (bool)
    {
      bool hasUnVouched = false;

      for(uint i = 0; i < vouches.length; i++)      // O(N) search
      {
        if(vouches[i] == msg.sender)
        {
          if(i != vouches.length - 1)
          {
            delete vouches[i];
            vouches[i] = vouches[vouches.length - 1];
            vouches.length--;
          }
          else
          {
            delete vouches[vouches.length - 1];
            vouches.length--;
          }
          hasUnVouched = true;
        }
      }
      return hasUnVouched;
    }
}
