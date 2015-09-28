/**
 * Returns SegmentIO analytics objects, mounts and configures once
 * @param  {String} writeKey the project write key
 * @return {Object}          a configured SegmentIO analytics object
 */

var QueryString = function() {
    // Originally from
    // http://stackoverflow.com/questions/979975/
    // how-to-get-the-value-from-the-url-parameter

    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var queryString = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof queryString[pair[0]] === "undefined") {
            queryString[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
        } else if (typeof queryString[pair[0]] === "string") {
            var arr = [ queryString[pair[0]], decodeURIComponent(pair[1]) ];
            queryString[pair[0]] = arr;
        // If third or later entry with this name
        } else {
            queryString[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return queryString;
}();

function load(writeKey) {
    if (global.analytics) {
        return global.analytics;
    }

    var head = global.document.head;
    var meta;

    // Select from <meta property="x-tf-segmentio-token" content={writeKey} />
    if (!writeKey) {
        meta = head.querySelector('meta[property=x-tf-segmentio-token]');
        writeKey = meta && meta.content;
    }
    // Select from <meta content="segmentio" data-token={writeKey} />
    if (!writeKey) {
        meta = head.querySelector('meta[content=segmentio]');
        writeKey = meta && meta.dataset.token;

    }
    // Raise visibility of error… analytics are important
    if (!writeKey) {
        throw new Error('SegmentIO write key is undefined');
    }

    // Mount segment script and global analytics object
    mountSegmentIO();
    // Configure with write key
    global.analytics.load(writeKey);

    return global.analytics;
}

/**
 * The default SegmentIO snippet
 * @return {Object} returns the global SegmentIO instance
 */
function mountSegmentIO() {
    var analytics = global.analytics = global.analytics || [];
    if (!analytics.initialize) {
        if (analytics.invoked) global.console && console.error && console.error("Segment snippet included twice.");
        else {
            analytics.invoked = !0;
            analytics.methods = ["trackSubmit", "trackClick", "trackLink", "trackForm", "pageview", "identify", "group", "track", "ready", "alias", "page", "once", "off", "on"];
            analytics.factory = function(t) {
                return function() {
                    var e = Array.prototype.slice.call(arguments);
                    e.unshift(t);
                    analytics.push(e);
                    return analytics
                }
            };
            for (var t = 0; t < analytics.methods.length; t++) {
                var e = analytics.methods[t];
                analytics[e] = analytics.factory(e)
            }
            analytics.load = function(t) {
                var e = global.document.createElement("script");
                e.type = "text/javascript";
                e.async = !0;
                e.src = ("https:" === global.document.location.protocol ? "https://" : "http://") + "cdn.segment.com/analytics.js/v1/" + t + "/analytics.min.js";
                var n = global.document.getElementsByTagName("script")[0];
                n.parentNode.insertBefore(e, n)
            };
            analytics.SNIPPET_VERSION = "3.0.1";
        }
    }

    // Wrap page calls in a function which adds user
    // variables if they exist but are not present.
    userDataWrapper = function(func) {
        return function() {
            var user = __env.user;
            var args = Array.prototype.slice.call(arguments);

            dataArgs = args[1] || {}
            for (var key in user) {
                if (!dataArgs.hasOwnProperty(key)) {
                    dataArgs[key] = user[key];
                }
            }
            args[1] = dataArgs;

            return func.apply(this, args);;
        }
    };

    identifyQsWrapper = function(func) {
        return function() {
            var args = Array.prototype.slice.call(arguments);

            if (args.length == 0) {
                var qs = {};
                if (typeof QueryString !== 'undefined') {
                    qs = QueryString;
                }

                var user = {};
                if (typeof __env !== 'undefined') {
                    if (typeof __env.user !== 'undefined') {
                        user = __env.user;
                    }
                }

                if (user.email || qs.email) {
                    args[0] = user.email || qs.email;
                }
            }
            return func.apply(this, args);;
        }
    };

    analytics.page = userDataWrapper(analytics.page);
    analytics.track = userDataWrapper(analytics.track);
    analytics.identify = identifyQsWrapper(analytics.identify);

    return analytics;
};

module.exports = {
    load: load
};
