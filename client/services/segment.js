/**
 * Returns SegmentIO analytics objects, mounts and configures once
 * @param  {String} writeKey the project write key
 * @return {Object}          a configured SegmentIO analytics object
 */
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

    return analytics;
};

module.exports = {
    load: load
};
