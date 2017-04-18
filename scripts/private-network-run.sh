#private network 
geth --datadir c3 --rpc --port "20202" --nodiscover  --rpcapi eth,web3,personal --rpc --rpcaddr 0.0.0.0 --rpccorsdomain "*" --ipcpath ~/.ethereum/geth.ipc --unlock 0
