var assert = require('assert');
var Embark = require('embark');
var EmbarkSpec = Embark.initTests({simulatorOptions: {total_accounts: 3}});
var web3 = EmbarkSpec.web3;

describe("Creating 3 identities ...", function()
{
  	before(function(done)
    {
  			this.timeout(0);
    		var contractsConfig = {
    		    "bkIdentity01":
  					{
  							 instanceOf: "bkIdentity",
    			       args: ["NAME: SUPER BIT MAN; DOB: 19971006; CITY OF BIRTH: NEW YORK, UNITED STATES; NATIONALITY: AMERICAN; PASSPORT NUMBER: 411762782"],
  							 gas: 2000000,
    		    },
  					"bkIdentity02":
  					{
  							 instanceOf: "bkIdentity",
    			       args: ["NAME: BITKARIERO MAN; DOB: 19951125; CITY OF BIRTH: LONDON, UNITED KINGDOM; NATIONALITY: BRITISH; PASSPORT NUMBER: 711862472"],
  							 gas: 2000000
    		    },
  					"bkIdentity03":
  					{
  							 instanceOf: "bkIdentity",
    			       args: ["NAME: SUPER KARIERO MAN, DOB: 20001112; CITY OF BIRTH: LAHORE, PAKISTAN; NATIONALITY: PAKISTANI; PASSPORT NUMBER: 812762582"],
  							 gas: 2000000
    		    }
    		};
        EmbarkSpec.deployAll(contractsConfig, function()
        {
            web3.eth.getAccounts(function(err, accounts)
            {
              bkIdentity01.setOwner(accounts[0], {from: accounts[0]}, function() {});
              bkIdentity02.setOwner(accounts[1], {from: accounts[1]}, function() {});
              bkIdentity03.setOwner(accounts[2], {from: accounts[2]}, function() {});
              done();
            });
        });
    });

    it("Use constructor to sucessfully initialise 'info' field of 'bkIdentity01' contract.", function(done)
    {
    	bkIdentity01.info(function(err, result)
      {
        assert.equal(result.toString(), "NAME: SUPER BIT MAN; DOB: 19971006; CITY OF BIRTH: NEW YORK, UNITED STATES; NATIONALITY: AMERICAN; PASSPORT NUMBER: 411762782");
  			done();
      });
    });

  	it("Use constructor to sucessfully initialise 'info' field of 'bkIdentity02' contract.", function(done)
    {
  		bkIdentity02.info(function(err, result)
      {
        assert.equal(result.toString(), "NAME: BITKARIERO MAN; DOB: 19951125; CITY OF BIRTH: LONDON, UNITED KINGDOM; NATIONALITY: BRITISH; PASSPORT NUMBER: 711862472");
  			done();
      });
    });

  	it("Use constructor to sucessfully initialise 'info' field of 'bkIdentity03' contract.", function(done)
  	{
  		bkIdentity03.info(function(err, result)
      {
        assert.equal(result.toString(), "NAME: SUPER KARIERO MAN, DOB: 20001112; CITY OF BIRTH: LAHORE, PAKISTAN; NATIONALITY: PAKISTANI; PASSPORT NUMBER: 812762582");
  			done();
      });
  	});

  	it("Use updateCV() method to sucessfully change the CV field of 'bkIdentity01' contract.", function(done)
  	{
  		bkIdentity01.updateCV("DEGREE: UNIVERSITY COLLEGE LONDON, INTERNSHIP: GOOGLE", function()
  		{
  			bkIdentity01.CV(function(err, result)
  			{
  				assert.equal(result.toString(), "DEGREE: UNIVERSITY COLLEGE LONDON, INTERNSHIP: GOOGLE");
  				done();
  			});
  		});
  	});

  	it("Use updateCV() method to sucessfully change the CV field of 'bkIdentity02' contract.", function(done)
  	{
  		bkIdentity02.updateCV("DEGREE: IMPERIAL COLLEGE LONDON, INTERNSHIP: FACEBOOK", function()
  		{
  			bkIdentity02.CV(function(err, result)
  			{
  				assert.equal(result.toString(), "DEGREE: IMPERIAL COLLEGE LONDON, INTERNSHIP: FACEBOOK");
  				done();
  			});
  		});
  	});

  	it("Use updateCV() method to sucessfully change the CV field of 'bkIdentity03' contract.", function(done)
  	{
  		bkIdentity03.updateCV("DEGREE: KINGS COLLEGE LONDON, INTERNSHIP: MCJOB", function()
  		{
  			bkIdentity03.CV(function(err, result)
  			{
  				assert.equal(result.toString(), "DEGREE: KINGS COLLEGE LONDON, INTERNSHIP: MCJOB");
  				done();
  			});
  		});
  	});

  	it("Use updateInfo() method to sucessfully change the 'info' field of 'bkIdentity01' contract.", function(done)
  	{
  		bkIdentity01.updateInfo("NAME: SUPER BIT MAN; DOB: 19971006; CITY OF BIRTH: KANDAHAR, AFGHANISTAN; NATIONALITY: ILLEGAL IMMIGRANT; PASSPORT NUMBER: NAN", function()
  		{
  			bkIdentity01.info(function(err, result)
  			{
  				assert.equal(result.toString(), "NAME: SUPER BIT MAN; DOB: 19971006; CITY OF BIRTH: KANDAHAR, AFGHANISTAN; NATIONALITY: ILLEGAL IMMIGRANT; PASSPORT NUMBER: NAN");
  				done();
  			});
  		});
  	});

    it("Use updatePubKey() method to sucessfully change the CV field of 'bkIdentity01' contract.", function(done)
    {
      bkIdentity01.updatePubKey("mQINBFb+9aoBEACwnEcP+fQy5TUrln14M9PxRlLUisAUzPFpjI2PsWMCIPWd+VNAOxbYjWteVSllj2ssl4twinL7sowft7Hr6llhyXoIx4fE1iiTK8+2lr99EHYRrcA0", function()
      {
        bkIdentity01.pubKey(function(err, result)
        {
          assert.equal(result.toString(), "mQINBFb+9aoBEACwnEcP+fQy5TUrln14M9PxRlLUisAUzPFpjI2PsWMCIPWd+VNAOxbYjWteVSllj2ssl4twinL7sowft7Hr6llhyXoIx4fE1iiTK8+2lr99EHYRrcA0");
          done();
        });
      });
    });

  	it("Adding 'bkIdentity02' as a provider of 'bkIdentity01'.", function(done)
  	{
        web3.eth.getAccounts(function(err, accounts)
        {
      		bkIdentity01.addProvider(accounts[1], function()
      		{
      			bkIdentity01.providers(accounts[1], function(err, result)
      			{
      				assert.equal(result.toString(), "true");
      				done();
      			});
      		});
        });
  	});

    it("Adding 'bkIdentity03' as a provider of 'bkIdentity01'.", function(done)
  	{
        web3.eth.getAccounts(function(err, accounts)
        {
      		bkIdentity01.addProvider(accounts[2], function()
      		{
      			bkIdentity01.providers(accounts[2], function(err, result)
      			{
      				assert.equal(result.toString(), "true");
      				done();
      			});
      		});
        });
  	});

    it("'bkIdentity02' vouching 'bkIdentity01'.", function(done)
    {
        web3.eth.getAccounts(function(err, accounts)
        {
          bkIdentity01.vouch({from: accounts[1]}, function()
          {
            bkIdentity01.vouches(0,function(err, result)
            {
              assert.equal(result, accounts[1]);
              done();
            });
          });
        });
      });

      it("'bkIdentity03' vouching 'bkIdentity01'.", function(done)
      {
          web3.eth.getAccounts(function(err, accounts)
          {
            bkIdentity01.vouch({from: accounts[2]}, function()
            {
              bkIdentity01.vouches(1, function(err, result)
              {
                assert.equal(result, accounts[2]);
                done();
              });
            });
          });
        });

        it("Removing 'bkIdentity03' as a provider for 'bkIdentity01'.", function(done)
        {
            web3.eth.getAccounts(function(err, accounts)
            {
              bkIdentity01.removeProvider(accounts[1], {from: accounts[0]}, function()
              {
                bkIdentity01.providers(accounts[1], function(err, result)
                {
                  assert.equal(result.toString(), "false");
                  done();
                });
              });
            });
          });

          it("Removing 'bkIdentity03' as a voucher for 'bkIdentity01'.", function(done)
          {
              web3.eth.getAccounts(function(err, accounts)
              {
                bkIdentity01.unVouch(accounts[1], {from: accounts[0]}, function()
                {
                  bkIdentity01.vouches(accounts[1], function(err, result)
                  {
                    assert.notEqual(result, accounts[1]);
                    done();
                  });
                });
              });
            });
  });
