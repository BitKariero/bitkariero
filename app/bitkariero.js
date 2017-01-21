var BitKariero = new function() {
  var BK = this;

  this.ownAddress = web3.eth.accounts[0];
  this.requests = [];

  this.switchAddress = function(addr) {
    this.ownAddress = addr;
  };

  this.requestRecord = function(type, from) {
    type.deploy().then(function(sc) {
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
