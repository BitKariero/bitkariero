pragma solidity ^0.4.0;

/* Main contract to log requests */

contract bkMain {
    
    event evAddRequest(
        address indexed from,
        address indexed to,
        address request
    );
    
    function addRequest(address to, address request) {
        evAddRequest(msg.sender, to, request);
    }

}
