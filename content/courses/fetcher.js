

import courses from './index.json';

export const getAllCourses = () => {
    return {
        data: courses,
        courseMap: courses.reduce((acc, course, indx) => {
            acc[course.id] = course;
            acc[course.id].index = indx;
            return acc;
        }, {})
    }
}