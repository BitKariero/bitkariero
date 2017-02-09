#!/bin/bash

embark build testnet

#massive hack for changing gas params
sed -i -e 's/gasPrice: 1000/gasPrice: 10/g' dist/bundle.js
sed -i -e 's/gas: 500000/gas: 1000000/g' dist/bundle.js
