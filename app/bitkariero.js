var BK = new function() {
  var BK = this;

  this.ownAddress = null;
  this.identityContract = null;
  this.requests = [];
  this.PlainReference = null;

  /* Contracts */
  this.loadContract = function(contractName, url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var code = xhr.responseText;
        var compiled = web3.eth.compile.solidity(code);
        var abi = compiled[contractName].info.abiDefinition;
        BK[contractName] = new EmbarkJS.Contract({abi: abi, code: compiled[contractName].code});
      }
    };
  };

  /* IPFS */
  this.get = function(hash) {
    return new Promise(function (resolve, reject) {
      // If we have the content locally, no need for a request
      var local = localStorage.getItem(hash);
      if (local) {
        resolve(local);
      }

      else {
        var url = EmbarkJS.Storage.getUrl(hash)
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);

        xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            // Store valid responses locally
            localStorage.setItem(hash, xhr.response);

            resolve(xhr.response);
          } else {
            reject({
              status: this.status,
              statusText: xhr.statusText
            });
          }
        };

        xhr.onerror = function () {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        };

        xhr.send();
      }
    });
  }

  this.put = function(content){
    return EmbarkJS.Storage.saveText(content);
  }

  this.log = function(content) {
    console.log(content);
  }

  /* Initialize */
  this.init = function(addr) {
    this.ownAddress = addr ? addr : web3.eth.accounts[0];
    this.identityContract = null;
    this.requests = [];
    this.loadContract("PlainReference", "contracts/plain_reference.sol");
  }

  this.requestRecord = function(type, from) {
    return type.deploy().then(function(sc) {
      sc.bkref(from);
      return sc;
    }).then(function(sc) {
      BK.requests.push(sc);
      return sc;
    })
  };

  this.provideRecord = function(record, str) {
    record.addref(str);
  };

  this.getRecord = function(record) {
    return record.reference();
  };
};
