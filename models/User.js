var _ = require('lodash');

var Enrollment = require('./Enrollment');
var MentorProfile = require('./MentorProfile');
var StudentProfile = require('./StudentProfile');

function User (properties) {
    _.assign(this, properties);

    // Create enrollments
    this.enrollments = _.map(this.enrollments, Enrollment.create);

    // Create profiles
    if (this.profiles.student) {
        this.profiles.student = StudentProfile.create(this.profiles.student)
        // Set the agreement on the student enrollments (user.enrollments)
        // Matches 30% of the time to the correct curriculum version
        // otherwise takes first matching course code from user enrollments
        _.each(this.profiles.student.agreements, function (agreement) {
            var enrollment =
                    _.find(
                        this.enrollments,
                        _.pick(agreement.enrollment, 'curriculum_version_id'))
                ||  _.find(
                        this.enrollments,
                        _.pick('agreement', 'course_code'));

            enrollment && enrollment.setAgreement(agreement);
        }, this);
    }
    if (this.profiles.mentor) {
        this.profiles.mentor = MentorProfile.create(this.profiles.mentor)
    }
}

User.create = function (properties) {
    return new User(properties);
}

User.prototype.setActivity =
function setUserActivity (mongoActivity) {
    this.activity = mongoActivity;
    // Set the content the student should view next
    _.each(this.enrollments, function (enrollment) {
        enrollment.setActivity(mongoActivity);
    });
};

User.prototype.getActivitySummary =
function summarizeStudentActivity() {
    // Filter to pageviews, acitivty requires denormalized content metadata
    var pageviews = _(this.activity).where({ handler: { label:'pageviews' }})
    .   map(function (entry) {
            // Clone to avoid modifying persisted object
            return _.assign(
                _.clone(entry.object.data, true),
                { getEntry:_.constant(entry) }); });

    var activityByDate = pageviews.sortBy('createdAt').reverse();

    var timeSinceFirstActivity = activityByDate.size() ?
        activityByDate.first().createdAt - activityByDate.last().createdAt : 0;

    var courseByDate = activityByDate
    .   map(function (view){
            return view.getEntry().document.root; })
    .   unique(function (root) {
            return root.code + root.version; })
    ;

    return {
        duration: timeSinceFirstActivity,
        byRecency: activityByDate,
        byCourseRecency: courseByDate
    }
}

User.prototype.hasAvailability = function userHasAvailability () {
    return this.profiles && _.pluck(this.profiles, 'availability').length > 0
}

User.prototype.hasRole = function userHasRole (role) {
    return _.indexOf(this.roles, role) >= 0;
};

User.prototype.hasAccess = function userHasAccess (role) {
    return this.hasRole('admin') || this.hasRole(role);
}

module.exports = User;