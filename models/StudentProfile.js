var _ = require('lodash');

var Agreement = require('./Agreement');

function StudentProfile (properties) {
    _.assign(this, properties);
    this.agreements = _.map(this.agreements, Agreement.create);
}

StudentProfile.create = function (properties) {
    return new StudentProfile(properties);
}

module.exports = StudentProfile;