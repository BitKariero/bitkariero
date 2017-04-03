var assert = require('assert');
var Embark = require('embark');
var EmbarkSpec = Embark.initTests({simulatorOptions: {total_accounts: 2}});
var web3 = EmbarkSpec.web3;

describe("Creating Reference Contract", function()
{
	before(function(done)
  {
			this.timeout(0);
  		var contractsConfig =
      {
  		    "ReferenceContract":
					{
							 instanceOf: "bkReference",
  			       args: [],
							 gas: 2000000,
  		    },
          "IdentityContract":
          {
               instanceOf: "bkIdentity",
               args: ["NAME: SUPER BIT MAN; DOB: 19971006; CITY OF BIRTH: NEW YORK, UNITED STATES; NATIONALITY: AMERICAN; PASSPORT NUMBER: 411762782"],
               gas: 2000000,
          }
  		};
      EmbarkSpec.deployAll(contractsConfig, function()
      {
          web3.eth.getAccounts(function(err, accounts)
          {
            ReferenceContract.setOwner(accounts[0], {from: accounts[0]}, function() {});
            ReferenceContract.setProvider(accounts[1], {from: accounts[0]}, function() {});
            IdentityContract.setOwner(accounts[0], {from: accounts[0]}, function() {});
            done();
          });
      });
  });



  it("Successully added reference to Reference contract.", function(done)
  {
    web3.eth.getAccounts(function(err, accounts)
    {
      ReferenceContract.addReference("Danish loves to learn. He however is a slow learner and believes slow and steady wins the race.", {from: accounts[1]}, function()
      {
        ReferenceContract.reference(function(err, result)
        {
          assert.equal(result.toString(), "Danish loves to learn. He however is a slow learner and believes slow and steady wins the race.");
          done();
        });
      });
    });
  });


});
