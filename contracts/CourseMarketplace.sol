// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


contract CourseMarketplace {

    enum State {
        Purchased,
        Activated,
        Deactivated
    }

    struct Course {
        uint id; //32 bytes
        uint price; //32 bytes
        bytes32 proof; //32 bytes
        address owner; //20 bytes
        State state; //1 byte
    }

    // mapping of courseHash to Course data
    mapping(bytes32 => Course) private ownedCourses;

    // mapping of courseId to courseHash
    mapping(uint => bytes32) private ownedCourseHash;

    // number of all courses + id of the course
    uint private totalOwnedCourses;

    function purchaseCourse(bytes16 courseId, bytes32 proof) 
    external payable
    {
        bytes32 courseHash = keccak256(abi.encodePacked(courseId, msg.sender));
        uint id = totalOwnedCourses++;
        
        ownedCourseHash[id] = courseHash;
        ownedCourses[courseHash] = Course({
            id: id,
            price: msg.value,
            proof: proof,
            owner: msg.sender,
            state: State.Purchased
        });
    }

}