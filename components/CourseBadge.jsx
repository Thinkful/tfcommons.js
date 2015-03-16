/**
 * <CourseBadge/>
 * @type {[type]}
 */
const React = require('react');
/**
 * <CourseBadge code={course_code} scale={1}/>
 * @param  {Prop} code  a course code that will match COURSES.code
 * @param  {Prop} scale a number scaling the image below or above line height
 * @return {<img/>}     returns img element with src of course icon
 */
const CourseBadge = React.createClass({
    render() {
        var {code, scale} = this.props;
        var course = COURSES.filter(
            c => new RegExp(c.code, 'gi').test(code))[0] || COURSE_DEFAULT;
        var src = `${BUCKET}/${course.icon}`;

        scale = scale || 1;

        return (
            <img
                alt={course.displayName}
                className="course-badge"
                src={src}
                style={{
                    height: `${1.5 * scale}em`,
                    marginBottom: `-${0.3 * scale}em`}}/>
        );
    }
});

const BUCKET = "//tf-assets-prod.s3.amazonaws.com/splash/courses";
const COURSES = [
    {   code: "AND",
        displayName: "Android Development",
        icon: "and/icon.svg"
    },
    {   code: "ANG",
        displayName: "AngularJS",
        icon: "ang/icon.svg"
    },
    {   code: "BFD",
        displayName: "Become a Frontend Developer",
        icon: "//tf-assets-prod.s3.amazonaws.com/splash/courses/bfd/icon.svg"
    },
    {   code: "DATA",
        displayName: "Data Science",
        icon: "//tf-assets-prod.s3.amazonaws.com/splash/courses/data/icon.svg"
    },
    {   code: "DES",
        displayName: "Modern Web Design",
        icon: "des/icon.svg"
    },
    {   code: "FEWD",
        displayName: "Frontend Web Development",
        icon: "fewd/icon.svg"
    },
    {   code: "IOS",
        displayName: "Swift iOS Development",
        icon: "swift/icon.svg"
    },
    {   code: "MKSQ",
        displayName: "JavaScript @ MakerSquare",
        icon: "https://s3.amazonaws.com/tf-assets-prod/splash/courses/mksq/icon.png"
    },
    {   code: "NODE",
        displayName: "NodeJS",
        icon: "node/icon.svg"
    },
    {   code: "PIP",
        displayName: "Programming in Python",
        icon: "pip/icon.svg"
    },
    {   code: "ROR",
        displayName: "Ruby on Rails",
        icon: "ror/icon.svg"
    },
    {   code: "APPDES",
        displayName: "Application Design",
        icon: "ror/icon.svg"
    },
    {   code: "CAREER",
        displayName: "Career Services",
        icon: "uxd/icon.svg"
    },
    {   code: "UXD",
        displayName: "User Experience Design",
        icon: "uxd/icon.svg"
    },
    {   code: "XYZ",
        displayName: "XYZ",
        icon: "uxd/icon.svg"
    }
];
const COURSE_DEFAULT = {
    displayName: "XYZ",
    icon: "uxd/icon.svg"
}

module.exports = CourseBadge;
