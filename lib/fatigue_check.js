function fatigue_check(event) {

    // my defaults
    var occurrences = 1;          // only the first occurrence
    var interval = 1800;          // and every 30 minutes thereafter
    var allow_resolution = true;  // allow resolution events through
    var suppress_flapping = true; // suppress when flapping

    // Use the above variable name with the check annotations fatigue_check/
    // (e.g. fatigue_check/occurrences) to override the defaults above

    // Slashes make for easier reading, but need to be converted here to
    // access the objects
    var event_no_slashes = JSON.parse(JSON.stringify(event).replace(/\//g,"_"));

    // Check annotations first
    try {
        if (event.check.hasOwnProperty("annotations")) {
            if (event.check.annotations.hasOwnProperty("fatigue_check/occurrences")) {
                occurrences = parseInt(event_no_slashes.check.annotations.fatigue_check_occurrences, 10);
            }
            if (event.check.annotations.hasOwnProperty("fatigue_check/interval")) {
                interval = parseInt(event_no_slashes.check.annotations.fatigue_check_interval, 10);
            }
            if (event.check.annotations.hasOwnProperty("fatigue_check/allow_resolution")) {
                // anything other than explicitly false == true
                allow_resolution = !(/false/i).test(event_no_slashes.check.annotations.fatigue_check_allow_resolution);
            }
            if (event.check.annotations.hasOwnProperty("fatigue_check/suppress_flapping")) {
                // anything other than explicitly false == true
                suppress_flapping = !(/false/i).test(event_no_slashes.check.annotations.fatigue_check_suppress_flapping);
            }
        }
    }

    catch(err) {
        console.log("failed to get check annotations:");
        console.log(err.message);
        return false;
    }

    // Entity annotations second, to take precedence over check annotations
    try {
        if (event.entity.hasOwnProperty("annotations")) {
            if (event.entity.annotations.hasOwnProperty("fatigue_check/occurrences")) {
                occurrences = parseInt(event_no_slashes.entity.annotations.fatigue_check_occurrences, 10);
            }
            if (event.entity.annotations.hasOwnProperty("fatigue_check/interval")) {
                interval = parseInt(event_no_slashes.entity.annotations.fatigue_check_interval, 10);
            }
            if (event.entity.annotations.hasOwnProperty("fatigue_check/allow_resolution")) {
                // anything other than explicitly false == true
                allow_resolution = !(/false/i).test(event_no_slashes.entity.annotations.fatigue_check_allow_resolution);
            }
            if (event.entity.annotations.hasOwnProperty("fatigue_check/suppress_flapping")) {
                // anything other than explicitly false == true
                suppress_flapping = !(/false/i).test(event_no_slashes.entity.annotations.fatigue_check_suppress_flapping);
            }
        }
    }

    catch(err) {
        console.log("failed to get entity annotations:");
        console.log(err.message);
        return false;
    }

    if ((/flapping/i).test(event.check.state) && (/true/i).test(suppress_flapping)) {
        return false;
    }
    if (event.is_resolution && (/true/i).test(allow_resolution)) {
        // Check the event.occurrences_watermark to see if we would
        // have allowed the event into the pipeline. This is to prevent
        // resolution event into the pipeline if we've not previously allowed
        // through based on the desired occurrences
        if (event.check.occurrences_watermark >= occurrences) {
            return true;
        }
        else {
            return false;
        }
    }
    if (event.check.occurrences === occurrences) {
        return true;
    }
    // The Math.ceil rounds up in the event that the interval requested is not
    // multiple of the check interval
    if (event.check.occurrences > occurrences && (event.check.occurrences % (Math.ceil(interval / event.check.interval))) === 0) {
        return true;
    }

    return false;
}
