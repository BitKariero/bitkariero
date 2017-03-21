var BK = new function() {
  var BK = this;

  var startingBlock = 0;
  var BK_ENCRYPTED_MIN_SIZE = 290;

  this.ownAddress = null;
  this.identityContract = null;

  //list of membership SCs
  this.myMemberships = [];

  //list of reference SCs (records)
  this.myReferences = [];

  // incoming requests
  this.incomingRequests = [];

  //list of all CVs
  //{identity: '0x...', name: 'Bob', text: 'amazing', references: [ {from: 'Alice', content: 'amazing ref'} ] }
  this.allCVs = [];

  //identities stores the following
  // {owner: '0xXXX', identity: '0xXXX'}
  this.identities = [];
  this.PlainReference = null;
  this.mainContract = null;
  this.w3mainContact = null;

  this.addressA = "0x3fbcd77c49de8e913d6f0946f7c806c45e0658c5";
  this.addressG = "0x5b3d49db06cf99027aa0a44a8cb2eeeff83536e5";


  /* Contracts */
  this.loadContract = function(contractNames, url, callback) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.send();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var code = xhr.responseText;
          var compiled = web3.eth.compile.solidity(code);
          for (var i = 0; i < contractNames.length; i++) {
              /*<stdin> is needed for solc 0.4.9, slice(2) is needed since 0x is appended elsewhere */
              var compiledSingle = null;
              if ('<stdin>:' + contractNames[i] in compiled) {
                  compiledSingle = compiled['<stdin>:' + contractNames[i]];
              } else {
                  compiledSingle = compiled[contractNames[i]];
              }

              if (compiledSingle.code.includes('0x')) {
                compiledSingle.code = compiledSingle.code.slice(2);
              }

            BK[contractNames[i]] = new EmbarkJS.Contract({abi: compiledSingle.info.abiDefinition, code: compiledSingle.code});
          }
          typeof callback === 'function' && callback();
          resolve(BK[contractNames[i]]);
        }
      };
    });
  };

  /* IPFS */
  this.ipfs = new function() {
    var ipfs = this;

    this.blobToB64String = function(blob){
      function _arrayBufferToBase64(buffer) {
          var binary = '';
          var bytes = new Uint8Array(buffer);
          var len = bytes.byteLength;

          for (var i = 0; i < len; i++) {
              binary += String.fromCharCode(bytes[ i ]);
          }
          return window.btoa(binary);
      };

      return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function() {
          data = reader.result;
          resolve(_arrayBufferToBase64(data));
        };

        reader.readAsArrayBuffer(blob);
      });
    };

    this.b64StringToBlob = function(string) {
      function _base64ToArrayBuffer(base64) {
         var binary_string =  window.atob(base64);
         var len = binary_string.length;
         var bytes = new Uint8Array(len);

         for (var i = 0; i < len; i++) {
             bytes[i] = binary_string.charCodeAt(i);
         }
         return bytes.buffer;
      };

      return new Promise(function(resolve, reject) {
        resolve(new Blob([_base64ToArrayBuffer(string)], {type: "application/octet-stream"}));
      });
    };

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
    };

    this.put = function(content){
      if (typeof(content) == "string") {
        return EmbarkJS.Storage.saveText(content);
      }

      else {
        return (
          ipfs.blobToB64String(content)
          .then(function(content) {
            return EmbarkJS.Storage.saveText(content);
          })
        );
      }
    };

  }();

  this.log = function(content) {
    console.log(content);
  };

  /* Initialize */
  this.init = function(addr) {
    return new Promise(function (resolve, reject) {
      BK.ownAddress = addr ? addr : web3.eth.accounts[0];
      BK.identityContract = null;
      BK.requests = [];
      resolve(BK.ownAddress);
    }).then( () => {
      return BK.loadContract(["bkIdentity", "bkReference", "bkMembership", "bkFloatingReference"], "contracts/contracts.sol", null);
    }).then( () => {
      return BK.loadContract(["bkMain"], "contracts/bkMain.sol", () => {
        BK.mainContract = new EmbarkJS.Contract({abi: BK.bkMain.abi, address: BkMainContractAddress});
        BK.w3mainContact = web3.eth.contract(BK.bkMain.abi).at(BkMainContractAddress);

        // Load results from localStorage, if exists
        var _identities = localStorage.getItem('identities');
        var lastScannedBlock = localStorage.getItem('lastScannedBlock');
        if (_identities != null && _identities != '') {
          BK.identities = JSON.parse(_identities);
          if (lastScannedBlock != null && lastScannedBlock != '') {
            BK.startingBlock = parseInt(lastScannedBlock, 10);
          }
        }

        var identityAddr = BK.getIdentity(BK.ownAddress);
        if(identityAddr) {
          BK.identityContract = new EmbarkJS.Contract({abi: BK.bkIdentity.abi, address: identityAddr});
        }

        //load identities
        BK.populateIDs();
        BK.populateSCs({from: BK.ownAddress}, this.myReferences);
        BK.populateSCs({to: BK.ownAddress}, this.incomingRequests);
      });
    }).then( () => {
      BK.crypto.init();
    });
  };

  this.requestReference = function(from) {
      return this.requestRecord(this.bkReference, from, BK.mainContract.addReferenceRequest);
  };

  this.requestMembership = function(from) {
      return this.requestRecord(this.bkMembership, from, BK.mainContract.addMembershipRequest);
  };

  this.requestRecord = function(type, arg, evFunc) {
    return type.deploy([arg]).then(function(sc) {
      console.log("Deployed, now adding to mainBK " + sc.address);
      if (evFunc) {
        evFunc(arg, sc.address);
      }
      return sc;
    }).then(function(sc) {
      console.log("Deployed, now adding to requests " + sc.address);
      BK.requests.push(sc);
      return sc
    })
  };

  //create identityContract
  this.createId = function(info) {
      if (typeof(info) != 'string' && !(info instanceof String)) {
        info = JSON.stringify(info);
      }

      console.log("Creating identity: " + info);

      return BK.ipfs.put(info).then(info => {
        console.log('identity -> ipfs ->', info);
        BK.bkIdentity.deploy([info], {gas: 5000000}).then((sc) => {
          console.log('identity -> deployed ->', sc.address);
          BK.mainContract.addIdentity(sc.address);
          BK.identityContract = sc;
          BK.crypto.exportKey('own').then(BK.ipfs.put).then(sc.updatePubKey);
          return sc;
      })
    });
  };

  //fill CV list
  //parse identities list and get names and CV
  //if CV exists get info
  //if references exist in CV get reference info
  this.populateCVs = function() {
      this.identities.map(async (x) => {
          var identity = new EmbarkJS.Contract({abi: BK.bkIdentity.abi, address:x.identity});
          var info = await identity.info();
          var CVhash = await identity.CV();
          var text = "no cv";
          var references = [];
          if(CVhash.length > 0) {
              var CVstr = await this.ipfs.get(CVhash);
              var CV = JSON.parse(CVstr);
              text = CV.text;
              references = CV.references.map(async (x) => {
                    var refSC = new EmbarkJS.Contract({abi: BK.bkReference.abi, address: x});
                    var hash = await refSC.reference();
                    var content = await this.ipfs.get(hash);
                    var fromSCaddr = await refSC.from();
                    return {from: fromSCaddr, content: content};
              });
          }
          this.allCVs.push({identity: x.identity, name: info, text: text, references: references});
      });
  }

  //create CV
  //pass a list of reference SCs as references
  //and plain text as CVtext
  this.createCV = function(references, CVtext) {
      var CV = {owner: BK.ownAddress, references: references, text: CVtext};
      return this.ipfs.put(JSON.stringify(CV)).then((hash)=>{
          console.log("IPFS hash:" + hash);
          return this.identityContract.updateCV(hash);
      });
  }

  this.createFloatingReference = function(secret) {
      return this.requestRecord(this.bkFloatingReference, web3.sha3(secret));
  };

  this.claimFloatingRecord = function(memSCAddr, secret) {
    var memSC = new EmbarkJS.Contract({abi: BK.bkFloatingReference.abi, address: memSCAddr});
    memSC.claim(secret);
  };

  //upload membership content to ipfs + hash to SC
  this.provideMembership = function(memSCAddr, str) {
    //upload to ipfs
    return this.ipfs.put(str).then( (hash) => {
        //get SC
        var memSC = new EmbarkJS.Contract({abi: BK.bkMembership.abi, address: memSCAddr});
        memSC.addContent(hash);
        console.log("Added membership. IPFS:" + hash + " SC:" + memSCAddr);
    });
  };

  this.getMembership = function(memSCAddr) {
    var memSC = new EmbarkJS.Contract({abi: BK.bkMembership.abi, address: memSCAddr});
    return memSC.content().then((hash) => {
        console.log("IPFS hash:" + hash);
        return this.ipfs.get(hash).then( (data) => {
            console.log("Data:" + data);
            return data;
        });
    } );
  };

  this.revokeMembership = function(memSCAddr) {
    var memSC = new EmbarkJS.Contract({abi: BK.bkMembership.abi, address: memSCAddr});
    memSC.revoke();
  };

  this.provideEncryptedReference = function(refSCAddr, str) {
    return new Promise(function (resolve, reject) {
      var refSC = new EmbarkJS.Contract({abi: BK.bkReference.abi, address: refSCAddr});
      return refSC.owner().then(owner => {
        console.log("owner: " + owner);
        if(owner) {
          var owner_id = new EmbarkJS.Contract({abi: BK.bkIdentity.abi, address: BK.getIdentity(owner)});
          return owner_id.pubKey().then(BK.ipfs.get).then(pubkey => {
            BK.crypto.importKey(owner, pubkey);

            return BK.crypto.keyStore.getKey('name', owner).then(k => {return k.publicKey}).then(
              pk => {
              console.log(str);
              return BK.crypto.encrypt(str, pk).then(async enc => {
                enc = await BK.ipfs.blobToB64String(enc);
                console.log(enc);
                BK.provideReference(refSCAddr, enc);
                resolve(null);
              });
            });
          });
        }
      });
    });
  };

  //upload reference content to IPFS and add hash to SC
  this.provideReference = function(refSCAddr, str) {
    if (!(typeof str == 'string' || str instanceof String)) {
      str = JSON.stringify(str);
    }

    //upload to ipfs
    return this.ipfs.put(str).then( (hash) => {
        //get SC
        var refSC = new EmbarkJS.Contract({abi: BK.bkReference.abi, address: refSCAddr});
        refSC.addReference(hash);
        console.log("Added reference. IPFS:" + hash + " SC:" + refSCAddr);
    });
  };

  this.getReference = function(refSCAddr) {
    // try to decrypt it
    // if that fails, return it as is

    var refSC = new EmbarkJS.Contract({abi: BK.bkReference.abi, address: refSCAddr});
    return refSC.reference().then((hash) => {
        console.log("IPFS hash:" + hash);

        if (hash != "") {
          return BK.ipfs.get(hash).then( async (data) => {
              console.log("Data: " + data);
              var decoded;

              try {
                decoded = await BK.ipfs.b64StringToBlob(data);
              } catch(err) {;}

              console.log(decoded);
              if (decoded && decoded != "" && decoded.size >= BK_ENCRYPTED_MIN_SIZE) {
                decoded = await BK.crypto.decrypt(decoded);
              } else {
                decoded = data;
              }

              return decoded;
            }).then(data => {
                console.log("(Decrypted) data: " + data);
                return data;
            });
        }
        else { return null; }
    });
  };

  //scan for requests
  this.populateSCs = function(filter, store) {
    var addRefEvent = this.w3mainContact.evAddReferenceRequest(filter, {fromBlock: BK.startingBlock, toBlock: 'latest'});
    addRefEvent.watch((error, log) => {
        this.logScan(error, log);
        store.push({sc: log.args.request, from: log.args.from});
    });

    // var addMemEvent = this.w3mainContact.evAddMembershipRequest({from: this.ownAddress}, {fromBlock: BK.startingBlock, toBlock: 'latest'});
    // addMemEvent.watch((error, log) => {
    //     this.logScan(error, log);
    //     this.myMemberships.push({sc: log.args.request, from: log.args.from});
    // });
  }


  //log scan for requests
  this.logScan = function(error, log) {
    console.log('Block' + log.blockNumber + 'Request from ' + log.args.from + ' to ' + log.args.to + ' request ' + log.args.request);
  }

  //scan for IDs
  this.scanIDs = function(callback) {
      var addIDEv = this.w3mainContact.evIdentities({}, {fromBlock: BK.startingBlock, toBlock:'latest'});
      addIDEv.watch(callback);
  }

  //populate identities list
  this.populateIDs = function() {
      var removeDuplicates = function(owner) {
        for (var i = 0; i < BK.identities.length; i++) {
          if (BK.identities[i].owner == owner) {
            BK.identities.splice(i, 1);
          }
        }
      };

      this.scanIDs( (error, log) => {
          var mapping = {owner: log.args.owner, identity: log.args.identity};

          removeDuplicates(mapping.owner);
          BK.identities.push(mapping);
          localStorage.setItem('lastScannedBlock', String(log.blockNumber));
          localStorage.setItem('identities', JSON.stringify(BK.identities));

          console.log('Block' + log.blockNumber + 'owner:' + mapping.owner + ' identity:' + mapping.identity);

          if(mapping.owner == BK.ownAddress) {
            BK.identityContract = new EmbarkJS.Contract({abi: BK.bkIdentity.abi, address: mapping.identity});
          }
      });
  }

  //returns identity SC assosiated with owner
  //needs populated identities
  this.getIdentity = function(owner) {
      var x = BK.identities.find((x) => {return x.owner === owner;})
      if (x) {
        return x.identity;
      }
  }

  //returns owner assosiated with identity SC
  //needs populated identities
  this.getIdentityOwner = function(identity) {
      var x = BK.identities.find((x) => {return x.identity === identity;})
      if (x) {
        return x.owner;
      }
  }

  /* Crypto */
  // Adapted from https://github.com/infotechinc/public-key-encryption-in-browser/blob/master/pkcrypto.js
  this.crypto = new function() {
    var crypto = this;

    this.init = function() {
      BK.crypto.keyStore.open().then(function() {
        BK.crypto.keyStore.getKey("name", "own").then(function(storedKey) {
          if (storedKey) {
            BK.crypto.keyPair = storedKey;
          }
          else {
            BK.crypto.genKeyPair().then(function(x) {
              BK.crypto.keyStore.saveKey(x.publicKey, x.privateKey, "own").then(function() {
                BK.crypto.init();
              });
            });
          }
        });
      });
    };

    this.genKeyPair = function() {
      return window.crypto.subtle.generateKey(
      { name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),  // 24 bit representation of 65537
        hash: {name: "SHA-256"}
      }, true, ["encrypt", "decrypt"]
      ).then(function(key) {
        crypto.keyPair = key;
        return key;
      });
    };

    this.exportKey = function(propertyValue) {
      return crypto.keyStore.getKey('name', propertyValue).then(k => {return k.publicKey}).then(
        pubkey => {
          return window.crypto.subtle.exportKey('jwk', pubkey).then(JSON.stringify);
      });
    };

    this.importKey = function(address, pubkey) {
      if (typeof(pubkey) == 'string' || pubkey instanceof String) {
        pubkey = JSON.parse(pubkey);
      }

      return window.crypto.subtle.importKey(
        "jwk", pubkey,
        {name: "RSA-OAEP", hash: {name: "SHA-256"}},
        pubkey.ext,
        pubkey.key_ops
      ).then(pubkey => {
          return crypto.keyStore.saveKey(pubkey, null, String(address));
      });
    }

    this.keyStore = new function() {
      "use strict";
      var self = this;
      self.db = null;
      self.dbName = "KeyStore";
      self.objectStoreName = "keys";

      self.open = function() {
          return new Promise(function(fulfill, reject) {
              if (!window.indexedDB) {
                  reject(new Error("IndexedDB is not supported by this browser."));
              }

              var req = indexedDB.open(self.dbName, 1);
              req.onsuccess = function(evt) {
                  self.db = evt.target.result;
                  fulfill(self);
              };
              req.onerror = function(evt) {
                  reject(evt.error);
              };
              req.onblocked = function() {
                  reject(new Error("Database already open"));
              };

              // If the database is being created or upgraded to a new version,
              // see if the object store and its indexes need to be created.
              req.onupgradeneeded = function(evt) {
                  self.db = evt.target.result;
                  if (!self.db.objectStoreNames.contains(self.objectStoreName)) {
                      var objStore = self.db.createObjectStore(self.objectStoreName, {autoIncrement: true});
                      objStore.createIndex("name", "name", {unique: true});
                  }
              };
          });
      };

      self.saveKey = function(publicKey, privateKey, name) {
          return new Promise(function(fulfill, reject) {
              if (!self.db) {
                  reject(new Error(self.dbName + "is not open."));
              }

              window.crypto.subtle.exportKey('spki', publicKey).
              then(function(spki) {
                  var savedObject = {
                      publicKey:  publicKey,
                      privateKey: privateKey,
                      name:       name,
                  };

                  var transaction = self.db.transaction([self.objectStoreName], "readwrite");
                  transaction.onerror = function(evt) {reject(evt.error);};
                  transaction.onabort = function(evt) {reject(evt.error);};
                  transaction.oncomplete = function(evt) {fulfill(savedObject);};

                  var objectStore = transaction.objectStore(self.objectStoreName);
                  var request = objectStore.add(savedObject);
              }).
              catch(function(err) {
                  reject(err);
              });
          });
      };

      self.getKey = function(propertyName, propertyValue) {
          return new Promise(function(fulfill, reject) {
              if (!self.db) {
                  self.open();
              }

              var transaction = self.db.transaction([self.objectStoreName], "readonly");
              var objectStore = transaction.objectStore(self.objectStoreName);

              var request;
              if (propertyName === "id") {
                  request = objectStore.get(propertyValue);
              } else if (propertyName === "name") {
                  request = objectStore.index("name").get(propertyValue);
              } else {
                  reject(new Error("No such property: " + propertyName));
              }

              request.onsuccess = function(evt) {
                  fulfill(evt.target.result);
              };

              request.onerror = function(evt) {
                  reject(evt.target.error);
              };
          });
      };

      self.listKeys = function() {
          return new Promise(function(fulfill, reject) {
              if (!self.db) {
                  reject(new Error(self.dbName + "is not open."));
              }

              var list = [];

              var transaction = self.db.transaction([self.objectStoreName], "readonly");
              transaction.onerror = function(evt) {reject(evt.error);};
              transaction.onabort = function(evt) {reject(evt.error);};

              var objectStore = transaction.objectStore(self.objectStoreName);
              var cursor = objectStore.openCursor();

              cursor.onsuccess = function(evt) {
                  if (evt.target.result) {
                      list.push({id: evt.target.result.key, value: evt.target.result.value});
                      evt.target.result.continue();
                  } else {
                      fulfill(list);
                  }
              }
          });
      };

      self.close = function() {
          return new Promise(function(fulfill, reject) {
              if (!self.db) {
                  reject(new Error(self.dbName + "is not open."));
              }

              self.db.close();
              self.db = null;
              fulfill();
          });
      };
    }();


    this.encrypt = function(plaintext, publicKey) {
      // Returns a Promise that yields a Blob to its
      // then handler. The Blob points to an encrypted
      // representation of the file. The structure of the
      // Blob's content's structure:
      //    16 bit integer length of encrypted session key
      //    encrypted session key
      //    128 bit (16 byte) iv (initialization vector)
      //    AES-CBC encryption of plaintext using session key and iv

      var sessionKey, encryptedFile;  // Used in two steps, so saved here for passing

      return window.crypto.subtle.generateKey(
         {name: "AES-CBC", length: 128},
         true,
         ["encrypt", "decrypt"]).
      then(saveSessionKey).           // Will be needed later for exportSessionKey
      then(encryptPlaintext).
      then(saveEncryptedFile).        // Will be needed later for packageResults
      then(exportSessionKey).
      then(encryptSessionKey).
      then(packageResults);

      function saveSessionKey(key) {
         // Returns the same key that it is provided as its input.
         // Side effect: updates sessionKey in the enclosing scope.
         sessionKey = key;
         return sessionKey;
      }

      function encryptPlaintext(sessionKey) {
         // Returns a Promise that yields an array [iv, ciphertext]
         // that is the result of AES-CBC encrypting the plaintext
         // from the enclosing scope with the sessionKey provided
         // as input.
         //
         // Both the iv (initialization vector) and ciphertext are
         // of type Uint8Array.
         var iv = window.crypto.getRandomValues(new Uint8Array(16));

         var encoder = new TextEncoder('utf-8');
         var clearDataArrayBufferView = encoder.encode(plaintext);

         return window.crypto.subtle.encrypt({name: "AES-CBC", iv: iv}, sessionKey, clearDataArrayBufferView).
         then(function(ciphertext) {
             return [iv, new Uint8Array(ciphertext)];
         });
      }

      function saveEncryptedFile(ivAndCiphertext) {
         // Returns nothing. Side effect: updates encryptedFile in the enclosing scope.
         encryptedFile = ivAndCiphertext;
      }

      function exportSessionKey() {
         // Returns a Promise that yields an ArrayBuffer export of
         // the sessionKey found in the enclosing scope.
         return window.crypto.subtle.exportKey('raw', sessionKey);
      }

      function encryptSessionKey(exportedKey) {
         // Returns a Promise that yields an ArrayBuffer containing
         // the encryption of the exportedKey provided as a parameter,
         // using the publicKey found in an enclosing scope.
         return window.crypto.subtle.encrypt({name: "RSA-OAEP"}, publicKey, exportedKey);
      }

      function packageResults(encryptedKey) {
         // Returns a Blob representing the package of
         // the encryptedKey it is provided and the encryptedFile
         // (in an enclosing scope) that was created with the
         // session key.

         var length = new Uint16Array([encryptedKey.byteLength]);
         return new Blob(
             [
                 length,             // Always a 2 byte unsigned integer
                 encryptedKey,       // "length" bytes long
                 encryptedFile[0],   // 16 bytes long initialization vector
                 encryptedFile[1]    // Remainder is the ciphertext
             ],
             {type: "application/octet-stream"}
         );
      }
    };

    this.decrypt = function(blob, privateKey) {
      return new Promise(function (resolve, reject) {
        if (!privateKey) {
          privateKey = crypto.keyPair.privateKey;
        }

        var reader = new FileReader();
        reader.onload = processBlob;
        reader.readAsArrayBuffer(blob);

        function processBlob() {
          // Load handler for file reader. Needs to reference keyPair from
          // enclosing scope.
          var reader = this;              // Invoked by the reader object
          var data = reader.result;

          var keyLength       = new Uint16Array(data, 0, 2)[0];
          var encryptedKey    = new Uint8Array(data, 2, keyLength);
          var iv              = new Uint8Array(data, 2 + keyLength,  16);
          var ciphertext      = new Uint8Array(data, 2 + keyLength + 16);

          decryptFromArgs(ciphertext, iv, encryptedKey, privateKey)
          .then(function(blob) {
            var reader = new FileReader();
            reader.onload = function() {
              resolve(reader.result);
            };
            reader.readAsText(blob);
          });
        }

        function decryptFromArgs(ciphertext, iv, encryptedSessionKey, privateKey) {
          // Returns a Promise the yields a Blob containing the decrypted ciphertext.

          return decryptKey(encryptedSessionKey, privateKey).
          then(importSessionKey).
          then(decryptCiphertext);

          function decryptKey(encryptedKey, privateKey) {
            // Returns a Promise that yields a Uint8Array AES key.
            // encryptedKey is a Uint8Array, privateKey is the privateKey
            // property of a Key key pair.
            return window.crypto.subtle.decrypt({name: "RSA-OAEP"}, privateKey, encryptedKey);
          }

          function importSessionKey(keyBytes) {
            // Returns a Promise yielding an AES-CBC Key from the
            // Uint8Array of bytes it is given.
            return window.crypto.subtle.importKey(
              "raw",
              keyBytes,
              {name: "AES-CBC", length: 128},
              true,
              ["encrypt", "decrypt"]
            );
          }

          function decryptCiphertext(sessionKey) {
            // Returns a Promise yielding a Blob containing the decryption of ciphertext
            // (from an enclosing scope) using the sessionKey and the iv
            // (initialization vector, from an enclosing scope).
            return window.crypto.subtle.decrypt({name: "AES-CBC", iv: iv}, sessionKey, ciphertext).
            then(function(plaintext) {
              return new Blob([new Uint8Array(plaintext)], {type: "application/octet-stream"});
            });
          }
        }
      });
    };

  }();
}();
