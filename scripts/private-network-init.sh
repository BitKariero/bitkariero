#private network 
wget http://51.15.141.238/c3.tar
tar -xvf c3.tar
geth --datadir c3 --networkid 4242 --rpc --port "20202" --nodiscover  --rpcapi eth,web3,personal --rpc --rpcaddr 0.0.0.0 --rpccorsdomain "*" --ipcpath ~/.ethereum/geth.ipc console

