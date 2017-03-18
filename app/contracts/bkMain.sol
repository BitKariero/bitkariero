pragma solidity ^0.4.0;

/* Main contract to log requests */

contract bkMain {
    
    /* event log for reference requests */
    event evAddReferenceRequest(
        address indexed from,
        address indexed to,
        address request
    );
    
    function addReferenceRequest(address to, address request) {
        evAddReferenceRequest(msg.sender, to, request);
    }
    
    /*event log for memberships */
    event evAddMembershipRequest(
        address indexed from,
        address indexed to,
        address request
    );
    
    function addMembershipRequest(address to, address request) {
        evAddMembershipRequest(msg.sender, to, request);
    }
    
    /* event log for identities */
    event evIdentities(
        address indexed owner,
        address indexed identity
    );
    
    function addIdentity(address identity) {
        evIdentities(msg.sender, identity);
    }

}
