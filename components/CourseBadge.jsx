const React = require('react');

/**
 * <CourseBadge code={course_code} scale={1}/>
 * @param  {Prop} code  a course code that will match COURSES.code
 * @param  {Prop} scale a number scaling the image below or above line height
 * @return {<img/>}     returns img element with src of course icon
 */
const CourseBadge = React.createClass({
    render() {
        var {code, scale, style} = this.props;
        var course = COURSES.filter(
            c => new RegExp(c.code, 'gi').test(code))[0] || COURSE_DEFAULT;
        var src = `${BUCKET}/${course.path || course.code}/icon.svg`;

        scale = scale || 1;
        style = style || {
            height: `${1.5 * scale}em`,
            marginBottom: `-${0.3 * scale}em`
        };

        return (
            <img alt={course.displayName} className="course-badge"
                {...{src, style}} // object spread
            />
        );
    }
});

const BUCKET = "//tf-assets-prod.s3.amazonaws.com/splash/courses";
const COURSES = [
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
const COURSE_DEFAULT = {
    displayName: "ERROR: COURSE ICON MISSING",
    path: "uxd"
}

module.exports = CourseBadge;
