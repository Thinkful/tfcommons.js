const React = require('react');
const cx = React.addons.classSet;

const {getCourseIcon} = require('../media/courseIcons');

/**
 * <CourseBadge code={course_code} scale={1}/>
 * @param  {Prop} code  a course code that will match COURSES.code
 * @param  {Prop} scale a number scaling the image below or above line height
 * @return {<img/>}     returns img element with src of course icon
 */
const CourseBadge = React.createClass({
    render() {
        var {className, code, scale, style} = this.props;
        var course = getCourseIcon(code);
        var src = course.url;

        className = `${className || ''} course-badge`;
        scale = scale || 1;
        style = style || {
            height: `${1.5 * scale}em`,
            marginBottom: `-${0.3 * scale}em`
        };

        return (
            <img alt={course.displayName}
                {...{className, src, style}} // object spread
            />
        );
    }
});

export default CourseBadge;
