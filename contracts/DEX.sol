// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DEX is ReentrancyGuard {
    struct Order {
        uint256 id;
        address trader;
        bool isBuyOrder;
        address buyToken;
        address sellToken;
        uint256 amount; // for buy: desired buyToken amount; for sell: offered sellToken amount
        uint256 price;  // sellToken per 1 buyToken
        bool isFilled;
    }

    mapping(address => mapping(address => uint256)) public balances;

    mapping(address => Order[]) public orderBook;

    uint256 public nextOrderId;

    event Deposit(address indexed user, address indexed token, uint256 amount);

    event Withdraw(address indexed user, address indexed token, uint256 amount);

    event NewOrder(
        uint256 indexed id,
        address indexed trader,
        bool isBuyOrder,
        address indexed buyToken,
        address sellToken,
        uint256 amount,
        uint256 price
    );

    event TradeExecuted(
        uint256 indexed buyOrderId,
        uint256 indexed sellOrderId,
        uint256 amount,
        uint256 price
    );

    event OrderCanceled(
        uint256 indexed id,
        address indexed trader,
        address indexed refundToken,
        uint256 refundAmount
    );

    // This updates the internal balance after a successful transfer.
    function deposit(address token, uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        balances[token][msg.sender] += amount;
        emit Deposit(msg.sender, token, amount);
    }

    function withdraw(address token, uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(balances[token][msg.sender] >= amount, "Insufficient balance");
        // Update state before external call (Checks-Effects-Interactions pattern)
        balances[token][msg.sender] -= amount;
        IERC20(token).transfer(msg.sender, amount);
        emit Withdraw(msg.sender, token, amount);
    }

    function createBuyOrder(address buyToken, address sellToken, uint256 amount, uint256 price) external nonReentrant {
        // validate inputs
        require(amount > 0, "Amount must be > 0");
        require(price > 0, "Price must be > 0");
        
        //price is in sellToken per buyToken (in wei), so we divide by 1e18
        uint256 requiredSellAmount = (amount * price) / 1e18;
        
        require(balances[sellToken][msg.sender] >= requiredSellAmount, "Insufficient sell token balance");
        
        balances[sellToken][msg.sender] -= requiredSellAmount;
        
        uint256 orderId = nextOrderId++;  // new buy order
        Order memory newOrder = Order({
            id: orderId,
            trader: msg.sender,
            isBuyOrder: true,
            buyToken: buyToken,
            sellToken: sellToken,
            amount: amount,
            price: price,
            isFilled: false
        });
        
        //add order to order book for the buy token
        orderBook[buyToken].push(newOrder);
        emit NewOrder(orderId, msg.sender, true, buyToken, sellToken, amount, price);
        matchOrders(buyToken);
    }

    function createSellOrder(address sellToken, address buyToken, uint256 amount, uint256 price) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(price > 0, "Price must be > 0");
        
        require(balances[sellToken][msg.sender] >= amount, "Insufficient sell token balance");
        
        balances[sellToken][msg.sender] -= amount;
        
        //create new sell order
        uint256 orderId = nextOrderId++;
        Order memory newOrder = Order({
            id: orderId,
            trader: msg.sender,
            isBuyOrder: false,
            buyToken: buyToken,
            sellToken: sellToken,
            amount: amount,
            price: price,
            isFilled: false
        });
        
        orderBook[sellToken].push(newOrder);
        emit NewOrder(orderId, msg.sender, false, buyToken, sellToken, amount, price);
        //try to match orders
        matchOrders(sellToken);
    }

    function matchOrders(address token) public {
        Order[] storage orders = orderBook[token];
        
        //find buy & sell orders that can be matched
        for (uint256 i = 0; i < orders.length; i++) {
            if (orders[i].isFilled || !orders[i].isBuyOrder) continue;
            
            for (uint256 j = 0; j < orders.length; j++) {
                if (orders[j].isFilled || orders[j].isBuyOrder) continue;
                
                //if orders can be matched (buy price >= sell price)
                // and both orders are for the same token pair 
                // buy order -- wants buyToken pays sellToken
                // sell order -- sells sellToken wants buyToken
                if (orders[i].price >= orders[j].price && 
                    orders[i].buyToken == orders[j].sellToken && 
                    orders[i].sellToken == orders[j].buyToken) {
                    
                    // Determine trade amount (minimum of both order amounts)
                    uint256 tradeAmount = orders[i].amount < orders[j].amount 
                        ? orders[i].amount 
                        : orders[j].amount;
                    
                    uint256 paymentAmount = (tradeAmount * orders[j].price) / 1e18;
                    
                    balances[orders[i].buyToken][orders[i].trader] += tradeAmount;
                    
                    balances[orders[i].sellToken][orders[j].trader] += paymentAmount;
                    
                    // Reduce order amounts
                    orders[i].amount -= tradeAmount;
                    orders[j].amount -= tradeAmount;
                    
                    // mark as filled if completely executed
                    if (orders[i].amount == 0) {
                        orders[i].isFilled = true;
                    }
                    if (orders[j].amount == 0) {
                        orders[j].isFilled = true;
                    }
                    emit TradeExecuted(
                        orders[i].id,
                        orders[j].id,
                        tradeAmount,
                        orders[j].price
                    );
                    // to avoid double-matching
                    break;
                }
            }
        }
    }

    function cancelOrder(address token, uint256 orderId) external nonReentrant {
        Order[] storage orders = orderBook[token];

        // linear search of the order by id 
        for (uint256 i = 0; i < orders.length; i++) {
            if (orders[i].id != orderId) continue;

            require(!orders[i].isFilled, "Order already filled or canceled :(");
            require(orders[i].trader == msg.sender, "Not order owner :(");

            uint256 remainingAmount = orders[i].amount; // remaining amount
            require(remainingAmount > 0, "Nothing to cancel :(");

            address refundToken;
            uint256 refundAmount;
            if (orders[i].isBuyOrder) {
                // price is in sellToken per 1 buyToken (1e18 decimals)
                refundToken = orders[i].sellToken;
                refundAmount = (remainingAmount * orders[i].price) / 1e18;
            } else {
                // Refund remaining sell tokens
                refundToken = orders[i].sellToken;
                refundAmount = remainingAmount;
            }

            orders[i].amount = 0;
            orders[i].isFilled = true;

            balances[refundToken][msg.sender] += refundAmount;

            emit OrderCanceled(orderId, msg.sender, refundToken, refundAmount);
            return;
        }

        revert("Order not found :(");
    }
}
