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
        return true;
    }
    if (event.check.occurrences == occurrences) {
        return true;
    }
    if ((event.check.occurrences % (interval / event.check.interval)) == 0) {
        return true;
    }

    return false;

}
