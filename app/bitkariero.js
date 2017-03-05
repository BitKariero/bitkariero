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
            /*<stdin> is needed for solc 0.4.9, slice(2) is needed since 0x is appended elsewhere */
            var compiledSingle = null;
            if ('<stdin>:' + contractNames[i] in  compiled) {
                compiledSingle = compiled['<stdin>:' + contractNames[i]];
            } else {
                compiledSingle = compiled[contractNames[i]];
            }
          BK[contractNames[i]] = new EmbarkJS.Contract({abi: compiledSingle.info.abiDefinition, code: compiledSingle.code.slice(2)});              
        }
        typeof callback === 'function' && callback();
      }
    };
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

  /* Crypto */
  // Adapted from https://github.com/infotechinc/public-key-encryption-in-browser/blob/master/pkcrypto.js
  this.crypto = new function() {
    var crypto = this;

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
