// THis represetns the contract configuration for DEX integration
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

export const ASSET_TOKEN_BYTECODE = "0x608060405234801562000010575f80fd5b5060405162001d7238038062001d72833981810160405281019062000036919062000635565b33838381600390816200004a9190620008fa565b5080600490816200005c9190620008fa565b5050505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620000d2575f6040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401620000c9919062000a21565b60405180910390fd5b620000e3816200010760201b60201c565b506001600681905550620000fe3382620001ca60201b60201c565b50505062000b0a565b5f60055f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160055f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036200023d575f6040517fec442f0500000000000000000000000000000000000000000000000000000000815260040162000234919062000a21565b60405180910390fd5b620002505f83836200025460201b60201c565b5050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603620002a8578060025f8282546200029b919062000a69565b9250508190555062000379565b5f805f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205490508181101562000334578381836040517fe450d38c0000000000000000000000000000000000000000000000000000000081526004016200032b9392919062000ab4565b60405180910390fd5b8181035f808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603620003c2578060025f82825403925050819055506200040c565b805f808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516200046b919062000aef565b60405180910390a3505050565b5f604051905090565b5f80fd5b5f80fd5b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b620004d98262000491565b810181811067ffffffffffffffff82111715620004fb57620004fa620004a1565b5b80604052505050565b5f6200050f62000478565b90506200051d8282620004ce565b919050565b5f67ffffffffffffffff8211156200053f576200053e620004a1565b5b6200054a8262000491565b9050602081019050919050565b5f5b838110156200057657808201518184015260208101905062000559565b5f8484015250505050565b5f62000597620005918462000522565b62000504565b905082815260208101848484011115620005b657620005b56200048d565b5b620005c384828562000557565b509392505050565b5f82601f830112620005e257620005e162000489565b5b8151620005f484826020860162000581565b91505092915050565b5f819050919050565b6200061181620005fd565b81146200061c575f80fd5b50565b5f815190506200062f8162000606565b92915050565b5f805f606084860312156200064f576200064e62000481565b5b5f84015167ffffffffffffffff8111156200066f576200066e62000485565b5b6200067d86828701620005cb565b935050602084015167ffffffffffffffff811115620006a157620006a062000485565b5b620006af86828701620005cb565b9250506040620006c2868287016200061f565b9150509250925092565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806200071b57607f821691505b602082108103620007315762000730620006d6565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f60088302620007957fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000758565b620007a1868362000758565b95508019841693508086168417925050509392505050565b5f819050919050565b5f620007e2620007dc620007d684620005fd565b620007b9565b620005fd565b9050919050565b5f819050919050565b620007fd83620007c2565b620008156200080c82620007e9565b84845462000764565b825550505050565b5f90565b6200082b6200081d565b62000838818484620007f2565b505050565b5b818110156200085f57620008535f8262000821565b6001810190506200083e565b5050565b601f821115620008ae57620008788162000737565b620008838462000749565b8101602085101562000893578190505b620008ab620008a28562000749565b8301826200083d565b50505b505050565b5f82821c905092915050565b5f620008d05f1984600802620008b3565b1980831691505092915050565b5f620008ea8383620008bf565b9150826002028217905092915050565b6200090582620006cc565b67ffffffffffffffff811115620009215762000920620004a1565b5b6200092d825462000703565b6200093a82828562000863565b5f60209050601f83116001811462000970575f84156200095b578287015190505b620009678582620008dd565b865550620009d6565b601f198416620009808662000737565b5f5b82811015620009a95784890151825560018201915060208501945060208101905062000982565b86831015620009c95784890151620009c5601f891682620008bf565b8355505b6001600288020188555050505b505050505050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f62000a0982620009de565b9050919050565b62000a1b81620009fd565b82525050565b5f60208201905062000a365f83018462000a10565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f62000a7582620005fd565b915062000a8283620005fd565b925082820190508082111562000a9d5762000a9c62000a3c565b5b92915050565b62000aae81620005fd565b82525050565b5f60608201905062000ac95f83018662000a10565b62000ad8602083018562000aa3565b62000ae7604083018462000aa3565b949350505050565b5f60208201905062000b045f83018462000aa3565b92915050565b61125a8062000b185f395ff3fe608060405234801561000f575f80fd5b50600436106100cd575f3560e01c806370a082311161008a57806395d89b411161006457806395d89b41146101ff578063a9059cbb1461021d578063dd62ed3e1461024d578063f2fde38b1461027d576100cd565b806370a08231146101a7578063715018a6146101d75780638da5cb5b146101e1576100cd565b806306fdde03146100d1578063095ea7b3146100ef57806318160ddd1461011f57806323b872dd1461013d578063313ce5671461016d57806340c10f191461018b575b5f80fd5b6100d9610299565b6040516100e69190610e6b565b60405180910390f35b61010960048036038101906101049190610f1c565b610329565b6040516101169190610f74565b60405180910390f35b61012761034b565b6040516101349190610f9c565b60405180910390f35b61015760048036038101906101529190610fb5565b610354565b6040516101649190610f74565b60405180910390f35b610175610382565b6040516101829190611020565b60405180910390f35b6101a560048036038101906101a09190610f1c565b61038a565b005b6101c160048036038101906101bc9190611039565b61040c565b6040516101ce9190610f9c565b60405180910390f35b6101df610451565b005b6101e9610464565b6040516101f69190611073565b60405180910390f35b61020761048c565b6040516102149190610e6b565b60405180910390f35b61023760048036038101906102329190610f1c565b61051c565b6040516102449190610f74565b60405180910390f35b6102676004803603810190610262919061108c565b61053e565b6040516102749190610f9c565b60405180910390f35b61029760048036038101906102929190611039565b6105c0565b005b6060600380546102a8906110f7565b80601f01602080910402602001604051908101604052809291908181526020018280546102d4906110f7565b801561031f5780601f106102f65761010080835404028352916020019161031f565b820191905f5260205f20905b81548152906001019060200180831161030257829003601f168201915b5050505050905090565b5f80610333610644565b905061034081858561064b565b600191505092915050565b5f600254905090565b5f8061035e610644565b905061036b85828561065d565b6103768585856106f0565b60019150509392505050565b5f6012905090565b6103926107e0565b61039a610867565b6103a261034b565b816103ab61034b565b6103b59190611154565b10156103f6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ed906111d1565b60405180910390fd5b61040082826108ad565b61040861092c565b5050565b5f805f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b6104596107e0565b6104625f610936565b565b5f60055f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60606004805461049b906110f7565b80601f01602080910402602001604051908101604052809291908181526020018280546104c7906110f7565b80156105125780601f106104e957610100808354040283529160200191610512565b820191905f5260205f20905b8154815290600101906020018083116104f557829003601f168201915b5050505050905090565b5f80610526610644565b90506105338185856106f0565b600191505092915050565b5f60015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905092915050565b6105c86107e0565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610638575f6040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260040161062f9190611073565b60405180910390fd5b61064181610936565b50565b5f33905090565b61065883838360016109f9565b505050565b5f610668848461053e565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8110156106ea57818110156106db578281836040517ffb8f41b20000000000000000000000000000000000000000000000000000000081526004016106d2939291906111ef565b60405180910390fd5b6106e984848484035f6109f9565b5b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610760575f6040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016107579190611073565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036107d0575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016107c79190611073565b60405180910390fd5b6107db838383610bc8565b505050565b6107e8610644565b73ffffffffffffffffffffffffffffffffffffffff16610806610464565b73ffffffffffffffffffffffffffffffffffffffff161461086557610829610644565b6040517f118cdaa700000000000000000000000000000000000000000000000000000000815260040161085c9190611073565b60405180910390fd5b565b6002600654036108a3576040517f3ee5aeb500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6002600681905550565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361091d575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016109149190611073565b60405180910390fd5b6109285f8383610bc8565b5050565b6001600681905550565b5f60055f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160055f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610a69575f6040517fe602df05000000000000000000000000000000000000000000000000000000008152600401610a609190611073565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610ad9575f6040517f94280d62000000000000000000000000000000000000000000000000000000008152600401610ad09190611073565b60405180910390fd5b8160015f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055508015610bc2578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610bb99190610f9c565b60405180910390a35b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610c18578060025f828254610c0c9190611154565b92505081905550610ce6565b5f805f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905081811015610ca1578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610c98939291906111ef565b60405180910390fd5b8181035f808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610d2d578060025f8282540392505081905550610d77565b805f808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610dd49190610f9c565b60405180910390a3505050565b5f81519050919050565b5f82825260208201905092915050565b5f5b83811015610e18578082015181840152602081019050610dfd565b5f8484015250505050565b5f601f19601f8301169050919050565b5f610e3d82610de1565b610e478185610deb565b9350610e57818560208601610dfb565b610e6081610e23565b840191505092915050565b5f6020820190508181035f830152610e838184610e33565b905092915050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610eb882610e8f565b9050919050565b610ec881610eae565b8114610ed2575f80fd5b50565b5f81359050610ee381610ebf565b92915050565b5f819050919050565b610efb81610ee9565b8114610f05575f80fd5b50565b5f81359050610f1681610ef2565b92915050565b5f8060408385031215610f3257610f31610e8b565b5b5f610f3f85828601610ed5565b9250506020610f5085828601610f08565b9150509250929050565b5f8115159050919050565b610f6e81610f5a565b82525050565b5f602082019050610f875f830184610f65565b92915050565b610f9681610ee9565b82525050565b5f602082019050610faf5f830184610f8d565b92915050565b5f805f60608486031215610fcc57610fcb610e8b565b5b5f610fd986828701610ed5565b9350506020610fea86828701610ed5565b9250506040610ffb86828701610f08565b9150509250925092565b5f60ff82169050919050565b61101a81611005565b82525050565b5f6020820190506110335f830184611011565b92915050565b5f6020828403121561104e5761104d610e8b565b5b5f61105b84828501610ed5565b91505092915050565b61106d81610eae565b82525050565b5f6020820190506110865f830184611064565b92915050565b5f80604083850312156110a2576110a1610e8b565b5b5f6110af85828601610ed5565b92505060206110c085828601610ed5565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061110e57607f821691505b602082108103611121576111206110ca565b5b50919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61115e82610ee9565b915061116983610ee9565b925082820190508082111561118157611180611127565b5b92915050565b7f546f74616c20737570706c79206f766572666c6f7700000000000000000000005f82015250565b5f6111bb601583610deb565b91506111c682611187565b602082019050919050565b5f6020820190508181035f8301526111e8816111af565b9050919050565b5f6060820190506112025f830186611064565b61120f6020830185610f8d565b61121c6040830184610f8d565b94935050505056fea2646970667358221220f5b9e38f88fa52d92e5692dca50767df4fe8b97a47caf81008f8ed9d4189594164736f6c63430008140033";
