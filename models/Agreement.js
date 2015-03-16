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
    // next_session is a fickle mistress, instead we'll use the day of the week
    // and construct a new date
    var session = moment(this.next_session_iso);
    var current = moment();
    var next;

    if(!this.hasBegun()) {
        next = this.getFirstSession();
    }
    else if(session.weekday() === current.weekday()) {
        try {
            next = moment(session).set({
                month: current.month(),
                date: current.date(),
                year: current.year()
            })
        } catch (e) {}
    }

    if (!next || moment(next).add(45, 'minutes').isBefore()) {
        // next_session may still be behind, safe bet it's seven days from now
        next = session.isBefore() ? session.add(7, 'days') : session;
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