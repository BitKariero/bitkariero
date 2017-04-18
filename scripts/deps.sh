#!/bin/bash
#bitkariero setup script for debian / ubuntu based distros

sudo apt-get install -y nodejs nodejs-legacy npm 

#my bins
mkdir ~/bin
export PATH=$PATH:~/bin

cd /tmp/

#ipfs
wget https://dist.ipfs.io/go-ipfs/v0.4.8/go-ipfs_v0.4.8_linux-amd64.tar.gz
tar -xvf go-ipfs_v0.4.8_linux-amd64.tar.gz
cp ./go-ipfs/ipfs ~/bin/
ipfs init
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json Gateway.HTTPHeaders.Access-Control-Allow-Origin '["*"]'

#embark
sudo npm install -g embark

#gulp
sudo npm install -g gulp

#geth
wget https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.6.0-facc47cb.tar.gz
tar -xvf geth-linux-amd64-1.6.0-facc47cb.tar.gz
mv ./geth-linux-amd64-1.6.0-facc47cb/geth ~/bin/

#solc
wget https://github.com/ethereum/solidity/releases/download/v0.4.10/solc
chmod 777 ./solc
mv ./solc ~/bin/



