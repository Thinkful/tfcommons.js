export const BUCKET = "//tf-assets-prod.s3.amazonaws.com/splash/courses";
export const COURSES = [
    {   displayName: "Android Development",
        code: "and",
    },
    {   displayName: "AngularJS",
        code: "ang",
    },
    {   displayName: "Become a Frontend Developer",
        code: "bfd",
    },
    {   displayName: "Data Science",
        code: "data",
    },
    {   displayName: "Modern Web Design",
        code: "des",
    },
    {   displayName: "Frontend Web Development",
        code: "fewd",
    },
    {   displayName: "Swift iOS Development",
        code: "ios",
        path: "swift"
    },
    {   displayName: "JavaScript @ MakerSquare",
        code: "mksq",
    },
    {   displayName: "NodeJS",
        code: "node",
    },
    {   displayName: "Programming in Python",
        code: "pip",
    },
    {   displayName: "Ruby on Rails",
        code: "ror",
    },
    {   displayName: "Application Design",
        code: "appdes",
        path: "uxd"
    },
    {   displayName: "Career Services",
        code: "career",
        path: "uxd"
    },
    {   displayName: "User Experience Design",
        code: "uxd",
        path: "uxd"
    }
];

export const COURSE_DEFAULT = {
    displayName: "ERROR: COURSE ICON MISSING",
    path: "uxd"
}

export function getCourseIcon (code) {
    var course = COURSES.filter(
            c => new RegExp(c.code, 'gi').test(code))[0] || COURSE_DEFAULT;
    course.url = `${BUCKET}/${course.path || course.code}/icon.svg`;
    return course;
}