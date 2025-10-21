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
        address token;
        uint256 amount;
        uint256 price;
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
    /// @param token The ERC-20 token being traded
    /// @param amount The order size (in token units)
    /// @param price The limit price (quote per token unit)
    event NewOrder(
        uint256 indexed id,
        address indexed trader,
        bool isBuyOrder,
        address indexed token,
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

    /// @notice Create a buy order for `amount` of `token` at `price`.
    function createBuyOrder(address token, uint256 amount, uint256 price) external {
        // Implementation to be added in a subsequent step.
        // Suggested logic:
        // - Validate inputs
        // - Assign id = nextOrderId++
        // - orderBook[token].push(Order({ ... }))
        // - emit NewOrder(id, msg.sender, true, token, amount, price)
    }

    /// @notice Create a sell order for `amount` of `token` at `price`.
    function createSellOrder(address token, uint256 amount, uint256 price) external {
        // Implementation to be added in a subsequent step.
        // Suggested logic:
        // - Validate inputs
        // - Assign id = nextOrderId++
        // - orderBook[token].push(Order({ ... }))
        // - emit NewOrder(id, msg.sender, false, token, amount, price)
    }
}
