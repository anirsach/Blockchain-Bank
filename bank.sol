pragma solidity ^0.4.17;

contract Bank {
    struct Customer {
        address customerAddress;
        uint256 balance;
        uint256 timeStamp;
        uint256 fdAmount;
        uint256 lockIn;
        uint256 fdTimeStamp;
    }

    Customer[] public customers;
    address public manager;
    uint256 public bankBalance;

    function Bank() public payable {
        manager = msg.sender;
        bankBalance = msg.value;
    }

    function rebalance(uint256 userId) private returns (uint256 balance) {
        Customer memory editCustomer = customers[userId];
        require(editCustomer.customerAddress == msg.sender);
        editCustomer.balance =
            editCustomer.balance +
            ((editCustomer.balance / 300) *
                (block.timestamp - editCustomer.timeStamp));
        return editCustomer.balance;
    }

    function Deposit(uint256 userId) public payable {
        bankBalance = bankBalance + msg.value;

        if (userId != 99) {
            Customer storage editCustomer = customers[userId];
            uint256 newBalance = rebalance(userId);
            editCustomer.balance = newBalance + msg.value;
            editCustomer.timeStamp = block.timestamp;
        } else {
            Customer memory newcustomer = Customer({
                customerAddress: msg.sender,
                balance: msg.value,
                timeStamp: block.timestamp,
                fdAmount: 0,
                lockIn: 0,
                fdTimeStamp: 0
            });

            customers.push(newcustomer);
        }
    }

    function Withdraw(uint256 userId, uint256 amount) public payable {
        Customer storage editCustomer = customers[userId];

        require(editCustomer.customerAddress == msg.sender);
        require(editCustomer.balance != 0);
        require(amount <= editCustomer.balance);

        editCustomer.balance = rebalance(userId);
        editCustomer.timeStamp = block.timestamp;

        editCustomer.customerAddress.transfer(amount);
        editCustomer.balance = editCustomer.balance - amount;
        bankBalance = this.balance;
    }

    function createFD(uint256 userId, uint256 amount) public {
        Customer storage editCustomer = customers[userId];

        require(editCustomer.customerAddress == msg.sender);
        require(editCustomer.balance != 0);
        require(amount <= editCustomer.balance);

        editCustomer.balance = rebalance(userId);
        editCustomer.timeStamp = block.timestamp;

        editCustomer.balance = editCustomer.balance - amount;
        editCustomer.fdAmount = amount;
        editCustomer.lockIn = 120;
        editCustomer.fdTimeStamp = block.timestamp;
    }

    function breakFD(uint256 userId) public {
        Customer storage editCustomer = customers[userId];

        require(editCustomer.customerAddress == msg.sender);
        require(editCustomer.fdAmount > 0);
        require(
            block.timestamp - editCustomer.fdTimeStamp >= editCustomer.lockIn
        );

        editCustomer.balance = rebalance(userId);
        editCustomer.timeStamp = block.timestamp;

        editCustomer.balance =
            editCustomer.balance +
            (editCustomer.fdAmount +
                (editCustomer.fdAmount *
                    ((block.timestamp - editCustomer.fdTimeStamp) /
                        editCustomer.lockIn)));
        editCustomer.fdAmount = 0;
        editCustomer.fdTimeStamp = 0;
    }
}
