
export const COURSE_STATE = {
    0: "purchased",
    1: "activated",
    2: "deactivated",
}

export const normalizeOwnedCourse = web3 => (course, ownedCourse) => {
    return {
        ...course,
        ownedCourseId: ownedCourse.id,
        proof: ownedCourse.proof,
        owned: ownedCourse.owner,
        price: web3.utils.fromWei(ownedCourse.price, "ether"),
        state: COURSE_STATE[ownedCourse.state],
    }
}