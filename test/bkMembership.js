var assert = require('assert');
var Embark = require('embark');
var EmbarkSpec = Embark.initTests({simulatorOptions: {total_accounts: 2}});
var web3 = EmbarkSpec.web3;

describe("Creating Membership Contract", function()
{
	before(function(done)
  {
			this.timeout(0);
  		var contractsConfig =
      {
  		    "MembershipContract":
					{
							 instanceOf: "bkMembership",
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
            MembershipContract.setOwner(accounts[0], {from: accounts[0]}, function() {});
            MembershipContract.setProvider(accounts[1], {from: accounts[0]}, function() {});
            IdentityContract.setOwner(accounts[0], {from: accounts[0]}, function() {});
            done();
          });
      });
  });

  it("Successully revoked Membership contract.", function(done)
  {
    web3.eth.getAccounts(function(err, accounts)
    {
        MembershipContract.isRevoked(function(err, result)
        {
          //console.log(result.toString());
          assert.equal(result.toString(), "false");
          done();
        });
    });
  });


  it("Successully added content to Membership contract.", function(done)
  {
    web3.eth.getAccounts(function(err, accounts)
    {
      MembershipContract.addContent("NAME: DANISH AMJAD ALVI; DOB: 19971006; CITY OF BIRTH: LAHORE, PAKISTAN; NATIONALITY: PAKISTANI; PASSPORT NUMBER: 411762782; MEMBERSHIP INITITAION: 20160901; MASONRY DEGREE: 22 DEGREES", {from: accounts[1]}, function()
      {
        MembershipContract.content(function(err, result)
        {
          assert.equal(result, "NAME: DANISH AMJAD ALVI; DOB: 19971006; CITY OF BIRTH: LAHORE, PAKISTAN; NATIONALITY: PAKISTANI; PASSPORT NUMBER: 411762782; MEMBERSHIP INITITAION: 20160901; MASONRY DEGREE: 22 DEGREES");
          done();
        });
      });
    });
  });

  it("Successully revoked Membership contract.", function(done)
  {
    web3.eth.getAccounts(function(err, accounts)
    {
      MembershipContract.revoke({from: accounts[1]}, function()
      {
        MembershipContract.isRevoked(function(err, result)
        {
          assert.equal(result.toString(), "true");
          done();
        });
      });
    });
  });

});
