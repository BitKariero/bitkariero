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
