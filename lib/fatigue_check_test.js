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
        }
    }

    catch(err) {
        console.log("failed to get check annotations:");
        console.log(err.message);
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
    if (event.check.occurrences > occurrences && (event.check.occurrences % (interval / event.check.interval)) === 0) {
        return true;
    }

    return false;
}

function testFatigueAllowResolutionFalse () { 
  // This event is only a stub of a real event 
  var event = {
  "check": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "false"
    },
    "history": [
      {
        "executed": 1555523962,
        "status": 0
      },
      {
        "executed": 1555524022,
        "status": 2
      },
      {
        "executed": 1555524082,
        "status": 2
      },
      {
        "executed": 1555524142,
        "status": 2
      },
      {
        "executed": 1555524202,
        "status": 2
      },
      {
        "executed": 1555524262,
        "status": 0
      }
    ],
    "interval": 60,
    "occurrences": 1,
    "occurrences_watermark": 4,
  },
  "is_incident": false,
  "is_resolution": true,
  }

  var result = fatigue_check(event); 

  if (result) { 
    console.log("testFatigueAllowResolutionFalse FAILED, returned true"); 
  } else { 
    console.log("testFatigueAllowResolutionFalse PASSED, returned false"); 
  }
}

function testFatigueResolutionTrue () { 
  // This event is only a stub of a real event 
  var event = {
  "check": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
    },
    "history": [
      {
        "executed": 1555523962,
        "status": 0
      },
      {
        "executed": 1555524022,
        "status": 2
      },
      {
        "executed": 1555524082,
        "status": 2
      },
      {
        "executed": 1555524142,
        "status": 2
      },
      {
        "executed": 1555524202,
        "status": 2
      },
      {
        "executed": 1555524262,
        "status": 0
      }
    ],
    "interval": 60,
    "occurrences": 1,
    "occurrences_watermark": 4,
  },
  "is_incident": false,
  "is_resolution": true,
  }

  var result = fatigue_check(event); 

  if (result) { 
    console.log("testFatigueResolutionTrue PASSED, returned true"); 
  } else { 
    console.log("testFatigueResolutionTrue FAILED, returned false"); 
  }
}

function testFatigueResolutionFalse () { 
  // This event is only a stub of a real event 
  var event = {
  "check": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
    },
    "history": [
      {
        "executed": 1555523962,
        "status": 0
      },
      {
        "executed": 1555524022,
        "status": 2
      },
      {
        "executed": 1555524082,
        "status": 0
      },
      {
        "executed": 1555524142,
        "status": 2
      },
      {
        "executed": 1555524202,
        "status": 2
      },
      {
        "executed": 1555524262,
        "status": 0
      }
    ],
    "interval": 60,
    "occurrences": 1,
    "occurrences_watermark": 2,
  },
  "is_incident": false,
  "is_resolution": true,
  }

  var result = fatigue_check(event); 

  if (result) { 
    console.log("testFatigueResolutionFalse FAILED, returned true"); 
  } else { 
    console.log("testFatigueResolutionFalse PASSED, returned false"); 
  }
}

function testFatigueOccurrencesTrue () { 
  // This event is only a stub of a real event 
  var event = {
  "check": {
    "annotations": {
      "fatigue_check/interval": "60"
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
    },
    "history": [
      {
        "executed": 1555523962,
        "status": 0
      },
      {
        "executed": 1555524022,
        "status": 2
      },
      {
        "executed": 1555524082,
        "status": 0
      },
      {
        "executed": 1555524142,
        "status": 2
      },
      {
        "executed": 1555524202,
        "status": 2
      },
      {
        "executed": 1555524262,
        "status": 2
      }
    ],
    "interval": 60,
    "occurrences": 3,
    "occurrences_watermark": 3,
  },
  "is_incident": false,
  "is_resolution": false,
  }

  var result = fatigue_check(event); 

  if (result) { 
    console.log("testFatigueOccurrencesTrue PASSED, returned true"); 
  } else { 
    console.log("testFatigueOccurrencesTrue FAILED, returned false"); 
  }
}

function testFatigueOccurrencesFalse () { 
  // This event is only a stub of a real event 
  var event = {
  "check": {
    "annotations": {
      "fatigue_check/interval": "60"
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
    },
    "history": [
      {
        "executed": 1555523962,
        "status": 0
      },
      {
        "executed": 1555524022,
        "status": 2
      },
      {
        "executed": 1555524082,
        "status": 0
      },
      {
        "executed": 1555524142,
        "status": 0
      },
      {
        "executed": 1555524202,
        "status": 2
      },
      {
        "executed": 1555524262,
        "status": 2
      }
    ],
    "interval": 60,
    "occurrences": 2,
    "occurrences_watermark": 2,
  },
  "is_incident": false,
  "is_resolution": false,
  }

  var result = fatigue_check(event); 

  if (result) { 
    console.log("testFatigueOccurrencesFalse FAILED, returned true"); 
  } else { 
    console.log("testFatigueOccurrencesFalse PASSED, returned false"); 
  }
}

function testFatigueIntervalTrue () { 
  // This event is only a stub of a real event 
  var event = {
  "check": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
      "fatigue_check/interval": "900"
    },
    "history": [
      {
        "executed": 1555523962,
        "status": 0
      },
      {
        "executed": 1555524022,
        "status": 2
      },
      {
        "executed": 1555524082,
        "status": 0
      },
      {
        "executed": 1555524142,
        "status": 2
      },
      {
        "executed": 1555524202,
        "status": 2
      },
      {
        "executed": 1555524262,
        "status": 2
      }
    ],
    "interval": 60,
    "occurrences": 15, // 900 / 60
    "occurrences_watermark": 3,
  },
  "is_incident": false,
  "is_resolution": false,
  }

  var result = fatigue_check(event); 

  if (result) { 
    console.log("testFatigueIntervalTrue PASSED, returned true"); 
  } else { 
    console.log("testFatigueIntervalTrue FAILED, returned false"); 
  }
}

function testFatigueIntervalFalse () { 
  // This event is only a stub of a real event 
  var event = {
  "check": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
      "fatigue_check/interval": "900"
    },
    "history": [
      {
        "executed": 1555523962,
        "status": 0
      },
      {
        "executed": 1555524022,
        "status": 2
      },
      {
        "executed": 1555524082,
        "status": 0
      },
      {
        "executed": 1555524142,
        "status": 0
      },
      {
        "executed": 1555524202,
        "status": 2
      },
      {
        "executed": 1555524262,
        "status": 2
      }
    ],
    "interval": 60,
    "occurrences": 14, // not 900 / 60
    "occurrences_watermark": 2,
  },
  "is_incident": false,
  "is_resolution": false,
  }

  var result = fatigue_check(event); 

  if (result) { 
    console.log("testFatigueIntervalFalse FAILED, returned true"); 
  } else { 
    console.log("testFatigueIntervalFalse PASSED, returned false"); 
  }
}

function testFatigueNoAnnotations () { 
  // This event is only a stub of a real event 
  var event = {
  "check": {
    "history": [
      {
        "executed": 1555523962,
        "status": 0
      },
      {
        "executed": 1555524022,
        "status": 0
      },
      {
        "executed": 1555524082,
        "status": 0
      },
      {
        "executed": 1555524142,
        "status": 0
      },
      {
        "executed": 1555524202,
        "status": 0
      },
      {
        "executed": 1555524262,
        "status": 2
      }
    ],
    "interval": 60,
    "occurrences": 1,
    "occurrences_watermark": 1,
  },
  "is_incident": false,
  "is_resolution": false,
  }

  // should return true, if fatigue_check does not error for lack of annotations
  var result = fatigue_check(event); 

  if (result) { 
    console.log("testFatigueNoAnnotations PASSED, didn't error out"); 
  }
  else {
    console.log("testFatigueNoAnnotations FAILED, see error output above"); 
  }
}

testFatigueNoAnnotations();
testFatigueResolutionTrue();
testFatigueResolutionFalse();
testFatigueAllowResolutionFalse();
testFatigueOccurrencesTrue();
testFatigueOccurrencesFalse();
testFatigueIntervalTrue();
testFatigueIntervalFalse();

