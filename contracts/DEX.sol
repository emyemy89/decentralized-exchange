// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title Decentralized Exchange (DEX) - Base Structure
/// @notice This contract only defines storage, events, and function skeletons.
///         Business logic for deposits, withdrawals, and order handling will be
///         implemented in subsequent steps.
contract DEX {
    /// @notice Order model held in the on-chain order book.
    /// @dev    `id` is assigned from `nextOrderId` when creating a new order.
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

    /// @notice balances[token][user] -> amount of `token` deposited by `user` in the DEX.
    mapping(address => mapping(address => uint256)) public balances;

    /// @notice orderBook[token] holds all buy/sell orders for a given `token`.
    mapping(address => Order[]) public orderBook;

    /// @notice Incremental counter used to assign unique order IDs.
    uint256 public nextOrderId;

    /// @notice Emitted when a user deposits tokens into the DEX.
    /// @param user The account that made the deposit
    /// @param token The ERC-20 token address
    /// @param amount The amount deposited
    event Deposit(address indexed user, address indexed token, uint256 amount);

    /// @notice Emitted when a user withdraws tokens from the DEX.
    /// @param user The account that made the withdrawal
    /// @param token The ERC-20 token address
    /// @param amount The amount withdrawn
    event Withdraw(address indexed user, address indexed token, uint256 amount);

    /// @notice Emitted when a new order is created.
    /// @param id The unique order ID
    /// @param trader The account placing the order
    /// @param isBuyOrder True for buy order; false for sell order
    /// @param buyToken The token being bought
    /// @param sellToken The token being sold
    /// @param amount The order size (in token units)
    /// @param price The limit price (sellToken per 1 buyToken)
    event NewOrder(
        uint256 indexed id,
        address indexed trader,
        bool isBuyOrder,
        address indexed buyToken,
        address sellToken,
        uint256 amount,
        uint256 price
    );

    /// @notice Emitted when a trade is executed between buy and sell orders.
    /// @param buyOrderId The ID of the buy order that was matched
    /// @param sellOrderId The ID of the sell order that was matched
    /// @param amount The amount of tokens traded
    /// @param price The execution price
    event TradeExecuted(
        uint256 indexed buyOrderId,
        uint256 indexed sellOrderId,
        uint256 amount,
        uint256 price
    );

    /// ---------------------------------------------------------------------
    /// Function skeletons (implementation to be added in later steps)
    /// ---------------------------------------------------------------------

    /// @notice Deposit `amount` of `token` into the DEX.
    /// @dev Security assumptions: caller approved this contract to spend `amount` tokens.
    ///      This updates the internal balance after a successful transfer.
    function deposit(address token, uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        balances[token][msg.sender] += amount;
        emit Deposit(msg.sender, token, amount);
    }

    /// @notice Withdraw `amount` of `token` from the DEX back to the user.
    /// @dev Security assumptions: token follows ERC-20 and does not reenter.
    ///      We optimistically update balance before transfer; standard ERC-20
    ///      implementations should not allow reentrancy through `transfer`.
    function withdraw(address token, uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(balances[token][msg.sender] >= amount, "Insufficient balance");
        balances[token][msg.sender] -= amount;
        IERC20(token).transfer(msg.sender, amount);
        emit Withdraw(msg.sender, token, amount);
    }

    /// @notice Create a buy order for `amount` of `buyToken` using `sellToken` as payment.
    /// @dev User must have sufficient `sellToken` balance deposited in the DEX.
    ///      The order is recorded in the order book for potential matching.
    function createBuyOrder(address buyToken, address sellToken, uint256 amount, uint256 price) external {
        // Validate inputs
        require(amount > 0, "Amount must be > 0");
        require(price > 0, "Price must be > 0");
        
        // Calculate required sell token amount (amount * price / 1e18)
        // Price is in sellToken per buyToken (in wei), so we divide by 1e18
        uint256 requiredSellAmount = (amount * price) / 1e18;
        
        // Check user has enough deposited balance of the sell token
        require(balances[sellToken][msg.sender] >= requiredSellAmount, "Insufficient sell token balance");
        
        // Deduct the sell token amount from user balance (reserve for the order)
        balances[sellToken][msg.sender] -= requiredSellAmount;
        
        // Create new buy order
        uint256 orderId = nextOrderId++;
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
        
        // Add order to the order book for the buy token
        // Both buy and sell orders for the same token are stored in the same orderBook
        orderBook[buyToken].push(newOrder);
        
        // Emit event
        emit NewOrder(orderId, msg.sender, true, buyToken, sellToken, amount, price);
        
        // Try to match orders immediately
        matchOrders(buyToken);
    }

    /// @notice Create a sell order for `amount` of `sellToken` to receive `buyToken`.
    /// @dev User must have sufficient `sellToken` balance deposited in the DEX.
    ///      The order is recorded in the order book for potential matching.
    function createSellOrder(address sellToken, address buyToken, uint256 amount, uint256 price) external {
        // Validate inputs
        require(amount > 0, "Amount must be > 0");
        require(price > 0, "Price must be > 0");
        
        // Check user has enough deposited balance of the sell token
        require(balances[sellToken][msg.sender] >= amount, "Insufficient sell token balance");
        
        // Deduct the sell token amount from user balance (reserve for the order)
        balances[sellToken][msg.sender] -= amount;
        
        // Create new sell order
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
        
        // Add order to the order book for the sellToken (the token being sold)
        // This ensures both buy and sell orders for the same token are in the same orderBook
        // For a sell order: selling sellToken -> store in orderBook[sellToken]
        // Buy orders for sellToken are also stored in orderBook[sellToken]
        orderBook[sellToken].push(newOrder);
        
        // Emit event
        emit NewOrder(orderId, msg.sender, false, buyToken, sellToken, amount, price);
        
        // Try to match orders immediately - match orders for the sellToken
        matchOrders(sellToken);
    }

    /// @notice Match compatible buy and sell orders for a given token.
    /// @dev Uses checks-effects-interactions pattern to avoid reentrancy.
    ///      Matches orders where buy.price >= sell.price and executes trades.
    function matchOrders(address token) public {
        Order[] storage orders = orderBook[token];
        
        // Find buy and sell orders that can be matched
        for (uint256 i = 0; i < orders.length; i++) {
            if (orders[i].isFilled || !orders[i].isBuyOrder) continue;
            
            for (uint256 j = 0; j < orders.length; j++) {
                if (orders[j].isFilled || orders[j].isBuyOrder) continue;
                
                // Check if orders can be matched (buy price >= sell price)
                // and both orders are for the same token pair (inverse relationship)
                // Buy order: wants buyToken, pays sellToken
                // Sell order: sells sellToken, wants buyToken
                if (orders[i].price >= orders[j].price && 
                    orders[i].buyToken == orders[j].sellToken && 
                    orders[i].sellToken == orders[j].buyToken) {
                    
                    // Determine trade amount (minimum of both order amounts)
                    uint256 tradeAmount = orders[i].amount < orders[j].amount 
                        ? orders[i].amount 
                        : orders[j].amount;
                    
                    // Calculate payment amount (trade amount * sell price / 1e18)
                    uint256 paymentAmount = (tradeAmount * orders[j].price) / 1e18;
                    
                    // Update balances (checks-effects-interactions pattern)
                    // Give buyer the tokens they wanted
                    balances[orders[i].buyToken][orders[i].trader] += tradeAmount;
                    
                    // Give seller the payment tokens (from buyer's reserved balance)
                    balances[orders[i].sellToken][orders[j].trader] += paymentAmount;
                    
                    // Reduce order amounts
                    orders[i].amount -= tradeAmount;
                    orders[j].amount -= tradeAmount;
                    
                    // Mark orders as filled if completely executed
                    if (orders[i].amount == 0) {
                        orders[i].isFilled = true;
                    }
                    if (orders[j].amount == 0) {
                        orders[j].isFilled = true;
                    }
                    
                    // Emit trade execution event
                    emit TradeExecuted(
                        orders[i].id,
                        orders[j].id,
                        tradeAmount,
                        orders[j].price
                    );
                    
                    // Break inner loop to avoid double-matching
                    break;
                }
            }
        }
    }
}
