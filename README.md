# BitKariero

## Set-up

* Clone the repository
* Run `npm install` to get the project's dependencies
* Install IPFS

Configure IPFS:

```sh
ipfs init
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json Gateway.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
```

## Development
Run the following commands in this dir to get up and running:

* `embark blockchain` to launch a dev blockchain on localhost:8545  
* `ipfs daemon` to launch a local IPFS node  
* `gulp build` to build the app (this will run embark build as part of the process)  
* `gulp` to rebuild the front-end on change and launch a webserver on http://0.0.0.0:8000  

Note if you wish to access the app from a different machine, then you will need to modify
config/blockchain.info with the correct IP addresses

## Usage
Here are some of the functions you can use in the UI

* Create a new identity: Open the app. You don't have an identity, so you are prompted to provide 
details and register. You enter your name, date of birth and other information and confirm. The 
identity is created.
* Request a reference from a different user: Click the 'New request' button. Select the type of 
request you're making: reference request. Select the user you're requesting it from. Confirm and 
send.
* Fulfill an incoming request: Go to the 'Requests' section of the app. Find the request you want 
to fulfill. Click the 'Fulfill' button. Provide the neccessary details. Confirm and send.
* Consult your own records: Go to the 'Records' section of the app. Scroll to see all records that 
have been provided to you.
* See another user's CV: Go to the 'People' section of the app. Search for the name of the user 
you're looking for. Expand their details to see their CV and references.
*Create a CV: Go to the 'Records' section of the app. Select the records that should make up the 
CV. Add additional text. Create the CV. 

## Testing

For testing purposes, we have to use Embark Blockchain. The test will not work on the private testnet we have created.

For running the application, we have to remove contracts from Embark.JS to allow deployment to a private testnet.
