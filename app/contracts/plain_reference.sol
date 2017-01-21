pragma solidity ^0.4.8;

contract PlainReference {
    /* reference string for now */
    string public reference;

    /* owner and organisation addres */
    address public owner;
    address public organisation;

    /* init */
    function bkref(address _organisation) {
        owner = msg.sender;
        organisation = _organisation;
    }

    /* function to add ref */
    function addref(string _reference) public {
        if(msg.sender == owner) {
            reference = _reference;
        }
    }

}
