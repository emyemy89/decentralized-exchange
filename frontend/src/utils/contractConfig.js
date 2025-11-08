// Contract configuration for DEX integration
export const DEX_CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // deployed dex contract address

export const DEX_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "trader", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "refundToken", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "refundAmount", "type": "uint256" }
    ],
    "name": "OrderCanceled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isBuyOrder",
        "type": "bool"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "buyToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "sellToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "NewOrder",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "uint256", "name": "orderId", "type": "uint256" }
    ],
    "name": "cancelOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "buyOrderId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "sellOrderId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "TradeExecuted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Withdraw",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "balances",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "buyToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "sellToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "createBuyOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sellToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "buyToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "createSellOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "matchOrders",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextOrderId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "orderBook",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "isBuyOrder",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "buyToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "sellToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isFilled",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// ERC20 ABI for token interactions
export const ERC20_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// AssetToken ABI (for token issuance)
export const ASSET_TOKEN_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol_",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "initialSupply_",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  ...ERC20_ABI
];

export const ASSET_TOKEN_BYTECODE = "0x608060405234801562000010575f80fd5b5060405162001c4638038062001c4683398181016040528101906200003691906200062d565b33838381600390816200004a9190620008f2565b5080600490816200005c9190620008f2565b5050505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620000d2575f6040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401620000c9919062000a19565b60405180910390fd5b620000e381620000ff60201b60201c565b50620000f63382620001c260201b60201c565b50505062000b02565b5f60055f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160055f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160362000235575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016200022c919062000a19565b60405180910390fd5b620002485f83836200024c60201b60201c565b5050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603620002a0578060025f82825462000293919062000a61565b9250508190555062000371565b5f805f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050818110156200032c578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401620003239392919062000aac565b60405180910390fd5b8181035f808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603620003ba578060025f828254039250508190555062000404565b805f808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405162000463919062000ae7565b60405180910390a3505050565b5f604051905090565b5f80fd5b5f80fd5b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b620004d18262000489565b810181811067ffffffffffffffff82111715620004f357620004f262000499565b5b80604052505050565b5f6200050762000470565b9050620005158282620004c6565b919050565b5f67ffffffffffffffff82111562000537576200053662000499565b5b620005428262000489565b9050602081019050919050565b5f5b838110156200056e57808201518184015260208101905062000551565b5f8484015250505050565b5f6200058f62000589846200051a565b620004fc565b905082815260208101848484011115620005ae57620005ad62000485565b5b620005bb8482856200054f565b509392505050565b5f82601f830112620005da57620005d962000481565b5b8151620005ec84826020860162000579565b91505092915050565b5f819050919050565b6200060981620005f5565b811462000614575f80fd5b50565b5f815190506200062781620005fe565b92915050565b5f805f6060848603121562000647576200064662000479565b5b5f84015167ffffffffffffffff8111156200066757620006666200047d565b5b6200067586828701620005c3565b935050602084015167ffffffffffffffff8111156200069957620006986200047d565b5b620006a786828701620005c3565b9250506040620006ba8682870162000617565b9150509250925092565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806200071357607f821691505b602082108103620007295762000728620006ce565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026200078d7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000750565b62000799868362000750565b95508019841693508086168417925050509392505050565b5f819050919050565b5f620007da620007d4620007ce84620005f5565b620007b1565b620005f5565b9050919050565b5f819050919050565b620007f583620007ba565b6200080d6200080482620007e1565b8484546200075c565b825550505050565b5f90565b6200082362000815565b62000830818484620007ea565b505050565b5b8181101562000857576200084b5f8262000819565b60018101905062000836565b5050565b601f821115620008a65762000870816200072f565b6200087b8462000741565b810160208510156200088b578190505b620008a36200089a8562000741565b83018262000835565b50505b505050565b5f82821c905092915050565b5f620008c85f1984600802620008ab565b1980831691505092915050565b5f620008e28383620008b7565b9150826002028217905092915050565b620008fd82620006c4565b67ffffffffffffffff81111562000919576200091862000499565b5b620009258254620006fb565b620009328282856200085b565b5f60209050601f83116001811462000968575f841562000953578287015190505b6200095f8582620008d5565b865550620009ce565b601f19841662000978866200072f565b5f5b82811015620009a1578489015182556001820191506020850194506020810190506200097a565b86831015620009c15784890151620009bd601f891682620008b7565b8355505b6001600288020188555050505b505050505050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f62000a0182620009d6565b9050919050565b62000a1381620009f5565b82525050565b5f60208201905062000a2e5f83018462000a08565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f62000a6d82620005f5565b915062000a7a83620005f5565b925082820190508082111562000a955762000a9462000a34565b5b92915050565b62000aa681620005f5565b82525050565b5f60608201905062000ac15f83018662000a08565b62000ad0602083018562000a9b565b62000adf604083018462000a9b565b949350505050565b5f60208201905062000afc5f83018462000a9b565b92915050565b6111368062000b105f395ff3fe608060405234801561000f575f80fd5b50600436106100cd575f3560e01c806370a082311161008a57806395d89b411161006457806395d89b41146101ff578063a9059cbb1461021d578063dd62ed3e1461024d578063f2fde38b1461027d576100cd565b806370a08231146101a7578063715018a6146101d75780638da5cb5b146101e1576100cd565b806306fdde03146100d1578063095ea7b3146100ef57806318160ddd1461011f57806323b872dd1461013d578063313ce5671461016d57806340c10f191461018b575b5f80fd5b6100d9610299565b6040516100e69190610daf565b60405180910390f35b61010960048036038101906101049190610e60565b610329565b6040516101169190610eb8565b60405180910390f35b61012761034b565b6040516101349190610ee0565b60405180910390f35b61015760048036038101906101529190610ef9565b610354565b6040516101649190610eb8565b60405180910390f35b610175610382565b6040516101829190610f64565b60405180910390f35b6101a560048036038101906101a09190610e60565b61038a565b005b6101c160048036038101906101bc9190610f7d565b6103a0565b6040516101ce9190610ee0565b60405180910390f35b6101df6103e5565b005b6101e96103f8565b6040516101f69190610fb7565b60405180910390f35b610207610420565b6040516102149190610daf565b60405180910390f35b61023760048036038101906102329190610e60565b6104b0565b6040516102449190610eb8565b60405180910390f35b61026760048036038101906102629190610fd0565b6104d2565b6040516102749190610ee0565b60405180910390f35b61029760048036038101906102929190610f7d565b610554565b005b6060600380546102a89061103b565b80601f01602080910402602001604051908101604052809291908181526020018280546102d49061103b565b801561031f5780601f106102f65761010080835404028352916020019161031f565b820191905f5260205f20905b81548152906001019060200180831161030257829003601f168201915b5050505050905090565b5f806103336105d8565b90506103408185856105df565b600191505092915050565b5f600254905090565b5f8061035e6105d8565b905061036b8582856105f1565b610376858585610684565b60019150509392505050565b5f6012905090565b610392610774565b61039c82826107fb565b5050565b5f805f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b6103ed610774565b6103f65f61087a565b565b5f60055f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60606004805461042f9061103b565b80601f016020809104026020016040519081016040528092919081815260200182805461045b9061103b565b80156104a65780601f1061047d576101008083540402835291602001916104a6565b820191905f5260205f20905b81548152906001019060200180831161048957829003601f168201915b5050505050905090565b5f806104ba6105d8565b90506104c7818585610684565b600191505092915050565b5f60015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905092915050565b61055c610774565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036105cc575f6040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016105c39190610fb7565b60405180910390fd5b6105d58161087a565b50565b5f33905090565b6105ec838383600161093d565b505050565b5f6105fc84846104d2565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81101561067e578181101561066f578281836040517ffb8f41b20000000000000000000000000000000000000000000000000000000081526004016106669392919061106b565b60405180910390fd5b61067d84848484035f61093d565b5b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036106f4575f6040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016106eb9190610fb7565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610764575f6040517fec442f0500000000000000000000000000000000000000000000000000000000815260040161075b9190610fb7565b60405180910390fd5b61076f838383610b0c565b505050565b61077c6105d8565b73ffffffffffffffffffffffffffffffffffffffff1661079a6103f8565b73ffffffffffffffffffffffffffffffffffffffff16146107f9576107bd6105d8565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016107f09190610fb7565b60405180910390fd5b565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361086b575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016108629190610fb7565b60405180910390fd5b6108765f8383610b0c565b5050565b5f60055f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160055f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16036109ad575f6040517fe602df050000000000000000000000000000000000000000000000000000000081526004016109a49190610fb7565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610a1d575f6040517f94280d62000000000000000000000000000000000000000000000000000000008152600401610a149190610fb7565b60405180910390fd5b8160015f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055508015610b06578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610afd9190610ee0565b60405180910390a35b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610b5c578060025f828254610b5091906110cd565b92505081905550610c2a565b5f805f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905081811015610be5578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610bdc9392919061106b565b60405180910390fd5b8181035f808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610c71578060025f8282540392505081905550610cbb565b805f808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610d189190610ee0565b60405180910390a3505050565b5f81519050919050565b5f82825260208201905092915050565b5f5b83811015610d5c578082015181840152602081019050610d41565b5f8484015250505050565b5f601f19601f8301169050919050565b5f610d8182610d25565b610d8b8185610d2f565b9350610d9b818560208601610d3f565b610da481610d67565b840191505092915050565b5f6020820190508181035f830152610dc78184610d77565b905092915050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610dfc82610dd3565b9050919050565b610e0c81610df2565b8114610e16575f80fd5b50565b5f81359050610e2781610e03565b92915050565b5f819050919050565b610e3f81610e2d565b8114610e49575f80fd5b50565b5f81359050610e5a81610e36565b92915050565b5f8060408385031215610e7657610e75610dcf565b5b5f610e8385828601610e19565b9250506020610e9485828601610e4c565b9150509250929050565b5f8115159050919050565b610eb281610e9e565b82525050565b5f602082019050610ecb5f830184610ea9565b92915050565b610eda81610e2d565b82525050565b5f602082019050610ef35f830184610ed1565b92915050565b5f805f60608486031215610f1057610f0f610dcf565b5b5f610f1d86828701610e19565b9350506020610f2e86828701610e19565b9250506040610f3f86828701610e4c565b9150509250925092565b5f60ff82169050919050565b610f5e81610f49565b82525050565b5f602082019050610f775f830184610f55565b92915050565b5f60208284031215610f9257610f91610dcf565b5b5f610f9f84828501610e19565b91505092915050565b610fb181610df2565b82525050565b5f602082019050610fca5f830184610fa8565b92915050565b5f8060408385031215610fe657610fe5610dcf565b5b5f610ff385828601610e19565b925050602061100485828601610e19565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061105257607f821691505b6020821081036110655761106461100e565b5b50919050565b5f60608201905061107e5f830186610fa8565b61108b6020830185610ed1565b6110986040830184610ed1565b949350505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f6110d782610e2d565b91506110e283610e2d565b92508282019050808211156110fa576110f96110a0565b5b9291505056fea26469706673582212206793294dc95dc3412a025dfadd3e8b03347350289ad1b75e428d5321d2335f3764736f6c63430008140033";
