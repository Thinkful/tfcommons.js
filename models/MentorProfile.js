var _ = require('lodash');

var Enrollment = require('./Enrollment');
var Agreement = require('./Agreement');

function MentorProfile (properties) {
    _.assign(this, properties);
    this.agreements = _.map(this.agreements, Agreement.create)
    // Initialize enrollment models
    this.enrollments = _(this.agreements).forEach(function (agreement) {
        agreement.enrollment = Enrollment.create(agreement.enrollment);
        agreement.enrollment.setAgreement(agreement);
    }).pluck('enrollment').value()
}

MentorProfile.create = function (properties) {
    return new MentorProfile(properties);
}

MentorProfile.prototype.getStudentsForEnrollment = function(enrollment) {
    return (
        _(this.enrollments)
        .where(_.pick(enrollment, 'curriculum_version_id'))
        .pluck('agreement')
        .sortBy('_priority')
        .value()
    );
};

module.exports = MentorProfile;