var BK = new function() {
  var BK = this;

  this.ownAddress = null;
  this.identityContract = null;
  this.requests = [];
  this.PlainReference = null;
  this.mainContract = null;
  

  /* Contracts */
  this.loadContract = function(contractNames, url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var code = xhr.responseText;
        var compiled = web3.eth.compile.solidity(code);
        for (var i = 0; i < contractNames.length; i++) {
          BK[contractNames[i]] = new EmbarkJS.Contract({abi: compiled[contractNames[i]].info.abiDefinition, code: compiled[contractNames[i]].code});              
        }
        callback();
      }
    };
  };

  /* Initialize */
  this.init = function(addr) {
    this.ownAddress = addr ? addr : web3.eth.accounts[0];
    this.identityContract = null;
    this.requests = [];
    this.loadContract(["bkIdentity", "bkReference", "bkMembership", "bkRevocable"], "contracts/danish_contracts.sol", null);
    this.loadContract(["bkMain"], "contracts/bkMain.sol", () => {
      this.mainContract = new EmbarkJS.Contract({abi: BK.bkMain.abi, address: BkMainContractAddress});
    });
    
  }

  this.requestRecord = function(type, from) {
    //type.args = from;
    return type.deploy([from]).then(function(sc) {
      //sc.bkContract(from);
      //console.log(sc);
      BK.mainContract.addRequest(sc.address);
      return sc;
    }).then(function(sc) {
      BK.requests.push(sc);
      return sc;
    })
  };
  
  //create identityContract
  this.createId = function(fullname, dob) {
      return BK.bkIdentity.deploy([fullname, dob]);
  }
  

  this.provideRecord = function(record, str) {
    record.addref(str);
  };

  this.getRecord = function(record) {
    return record.reference();
  };
};
