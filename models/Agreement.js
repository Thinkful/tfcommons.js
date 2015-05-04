var _ = require('lodash');
var moment = require('moment');

var IMAGE_BASE_URL = 'http://www.thinkful.com/splash/static/homepage/mentor-pics/mentor-page/';

function Agreement (properties) {
    _.assign(this, properties);
    _.assign(this, {
        _priority: this.getNextSession().unix()
    });
}

Agreement.create = function (properties) {
    return new Agreement(properties);
}

Agreement.prototype.getFirstSession = function() {
    return moment(this.first_session_iso)
}

Agreement.prototype.getNextSession = function() {
    // note next_session is in student's tz.
    var next = moment(this.next_session_iso);

    if (next && moment(next).add(45, 'minutes').isBefore()) {
        // next session is happening now (according to browser's tz). 
        // let's continue to show it as happening now instead of a
        // week from now.
        next = next.isBefore() ? next.add(7, 'days') : next;
    }

    return next;
}

Agreement.prototype.getLastSession = function() {
    return moment(this.last_session_iso)
}

Agreement.prototype.hasEnded =
function hasMentorshipEnded () {
    return this.getLastSession().isBefore()
}

Agreement.prototype.hasBegun =
function hasMentorshipBegun () {
    return this.getFirstSession().isBefore()
}

Agreement.prototype.isCurrent =
function hasMentorshipCurrently () {
    return this.hasBegun() && !this.hasEnded();
}

Agreement.prototype.hasSessionTomorrow =
function isSessionOccuringTomorrow () {
    var next = this.getNextSession();
    return next && next.date() === moment().add(1, 'day').date()
}

Agreement.prototype.hasSessionToday =
function isSessionOccuringToday () {
    var next = this.getNextSession();
    return next && next.date() === moment().date() &&
        next.add(45, 'minutes').isAfter(moment());
}

Agreement.prototype.hasSessionCurrently =
function isSessionOccuringRecently () {
    var next = this.getNextSession();
    return next && next.isBetween(
        moment().subtract(45, 'minutes'), moment().add(45, 'minutes'))
}

Agreement.prototype.hasSessionNow =
function isSessionOccuringNow () {
    var next = this.getNextSession();
    return next && moment().isBetween(next, moment(next).add(45, 'minutes'))
}

Agreement.getMentorImageURL = function getMentorImageURL (obj) {
    return obj && obj.mentor_name &&
    (   IMAGE_BASE_URL
    +   _(obj.mentor_name.split(' ')).compact().map(function (val) {
                val = val.split('');
                val[0] = val[0].toUpperCase();
                return val.join(''); })
            .join('')
    +   '.png'
    );
};

module.exports = Agreement;
