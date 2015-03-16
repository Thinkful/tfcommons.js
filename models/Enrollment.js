var _ = require('lodash');
var moment = require('moment');

function Enrollment (properties) {
    _.assign(this, properties);
}

Enrollment.create = function (properties) {
    return new Enrollment(properties);
}

Enrollment.activityDurationThreshold = 1000 * 60 * 60 * 24 * 5;


Enrollment.prototype.setAgreement =
function setEnrollmentAgreement (agreement) {
    this.agreement = agreement;
};

/**
 * @return {Boolean} startDate < currentDate
 */
Enrollment.prototype.hasStarted =
function hasEnrollmentStarted () {
    return this.curriculum_access_start &&
        moment(this.curriculum_access_start).isBefore();
}

/**
 * @return {Boolean} endDate < currentDate
 */
Enrollment.prototype.hasEnded =
function hasEnrollmentEnded () {
    return this.curriculum_access_end &&
        moment(this.curriculum_access_end).isBefore()
}


/**
 * @return {Date} enrollment start date
 */
Enrollment.prototype.getStartDate =
function getEnrollmentStartDate () {
    return this.curriculum_access_start &&
        moment(this.curriculum_access_start).toDate();
}

/**
 * @return {Date} enrollment end date
 */
Enrollment.prototype.getEndDate =
function getEnrollmentEndDate () {
    return this.curriculum_access_end &&
        moment(this.curriculum_access_end).toDate();
}

Enrollment.prototype.hasMentorship =
function hasMentorship () {
    return !! this.agreement;
};

/**
 * Sorts pageviews in descending order, then chooses page where [x][ ]
 * @param {[enrollment]} enrollments an array of enrollment objects
 * @param {[pageview]} pageviews     an array of pageviews
 */
Enrollment.prototype.setActivity =
function setEnrollmentActivity (mongoPageviews) {
    this.activity = _(mongoPageviews)
        .where({ handler: { label:'pageviews' }})
        .where({ document: { root: { code: this.course_code }}});

    var pageviews = this.activity.map(function (pageview) {
        return pageview.object.data
    })

    var sortedPageviews = pageviews
        .each(function (page) {
            // Update pageview.next compelte state with available pageviews
            if (page.next) {
                page.next =
                    pageviews.find({ path: page.next.path }) ||
                    page.next;
            }
        })
        .sortBy(function (data) {
            return data.createdAt
        })
        .reverse()

    var page = sortedPageviews
        .reduce(function (newer, older) {
            // from the newest, sticks to newest complete where newest next is not complete
            return newer ?
                isReadyToProgress(newer) ? newer : older
            :   false
        })
    ;

    this.nextPage = page ?
            isReadyToProgress(page) ? page.next : page
        :   false
    ;
}

Enrollment.prototype.getActivitySummary =
function summarizeStudentActivity() {
    var pageviews = _(this.activity)
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

Enrollment.prototype.hasShownActivity =
function hasEnrollmentShownActivity() {
    return this.getActivitySummary().duration > 0;
}

Enrollment.prototype.hasStartedShowingActivity =
function hasEnrollmentStartedShowingActivity() {
    return (
        Enrollment.activityDurationThreshold
        <   this.getActivitySummary().duration);
}

Enrollment.prototype.hasStartedRecently =
function hasEnrollmentJustBegun () {
    return (
            this.hasStarted()
        &&  ! this.hasEnded()
        &&  ! this.hasStartedShowingActivity());
}

module.exports = Enrollment;

/**
 * Returns true where the current page is complete, but the next is incomplete
 * @param  {Pageview}  page a pageview event
 * @return {Boolean}        true when current page is complete and next is not
 */
function isReadyToProgress (page) {
    return page && page.completed &&
        page.next && !page.next.completed;
}