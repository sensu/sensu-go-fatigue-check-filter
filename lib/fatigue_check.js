function fatigue_check(event) {

    // my defaults
    var occurrences = 1;          //only the first occurrence
    var interval = 1800;          //and every 30 minutes thereafter
    var allow_resolution = true;  // allow resolution events through

    // Use the above variable name with the check annotations fatigue_check/
    // (e.g. fatigue_check/occurrences) to override the defaults above

    // Slashes make for easier reading, but need to be converted here to
    // access the objects
    var event_no_slashes = JSON.parse(JSON.stringify(event).replace(/\//g,"_"));

    // countFailure is a callback that counts the number of check that have
    // non-zero status
    var countFailure = function(count, check) {
        if (check.status != 0) {
            return count + 1;
        }
        // we only want consecutive failures, so reset to zero
        count = 0;
        return count;
    }

    if (event.check.annotations.hasOwnProperty("fatigue_check/occurrences")) {
        occurrences = event_no_slashes.check.annotations.fatigue_check_occurrences;
    }
    if (event.check.annotations.hasOwnProperty("fatigue_check/interval")) {
        interval = event_no_slashes.check.annotations.fatigue_check_interval;
    }
    if (event.check.annotations.hasOwnProperty("fatigue_check/allow_resolution")) {
        allow_resolution = event_no_slashes.check.annotations.fatigue_check_allow_resolution;
    }

    if (event.is_resolution && (/true/i).test(allow_resolution)) {
        // Go through the history, minus the last (which would be zero, the resolution)
        // If the sum of those is >= occurrences, we should have fired, so allow this
        // into the pipeline.  This is to prevent resolution event into the pipeline
        // if we've not previously allowd through based on the desired occurrences
        var history = event.check.history;
        history.pop();
        hasFired = history.reduce(countFailure, 0);
        if (hasFired >= occurrences) {
            return true;
        }
        else {
            return false;
        }
    }
    if (event.check.occurrences == occurrences) {
        return true;
    }
    if ((event.check.occurrences % (interval / event.check.interval)) == 0) {
        return true;
    }

    return false;

}
