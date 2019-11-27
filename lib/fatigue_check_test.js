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

function testCheckFatigueAllowResolutionFalse () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "namespace": "default"
  },
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
    console.log("testCheckFatigueAllowResolutionFalse FAILED, returned true"); 
  } else { 
    console.log("testCheckFatigueAllowResolutionFalse PASSED, returned false"); 
  }
}

function testCheckFatigueResolutionTrue () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "namespace": "default"
  },
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
    console.log("testCheckFatigueResolutionTrue PASSED, returned true"); 
  } else { 
    console.log("testCheckFatigueResolutionTrue FAILED, returned false"); 
  }
}

function testCheckFatigueResolutionFalse () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "namespace": "default"
  },
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
    console.log("testCheckFatigueResolutionFalse FAILED, returned true"); 
  } else { 
    console.log("testCheckFatigueResolutionFalse PASSED, returned false"); 
  }
}

function testCheckFatigueOccurrencesTrue () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "namespace": "default"
  },
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
    console.log("testCheckFatigueOccurrencesTrue PASSED, returned true"); 
  } else { 
    console.log("testCheckFatigueOccurrencesTrue FAILED, returned false"); 
  }
}

function testCheckFatigueOccurrencesFalse () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "namespace": "default"
  },
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
    console.log("testCheckFatigueOccurrencesFalse FAILED, returned true"); 
  } else { 
    console.log("testCheckFatigueOccurrencesFalse PASSED, returned false"); 
  }
}

function testCheckFatigueIntervalTrue () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "namespace": "default"
  },
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
    "occurrences_watermark": 15,
  },
  "is_incident": false,
  "is_resolution": false,
  }

  var result = fatigue_check(event); 

  if (result) { 
    console.log("testCheckFatigueIntervalTrue PASSED, returned true"); 
  } else { 
    console.log("testCheckFatigueIntervalTrue FAILED, returned false"); 
  }
}

function testCheckFatigueIntervalFalse () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "namespace": "default"
  },
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
    "occurrences_watermark": 14,
  },
  "is_incident": false,
  "is_resolution": false,
  }

  var result = fatigue_check(event); 

  if (result) { 
    console.log("testCheckFatigueIntervalFalse FAILED, returned true"); 
  } else { 
    console.log("testCheckFatigueIntervalFalse PASSED, returned false"); 
  }
}

function testCheckFatigueNonMultipleIntervalTrue () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "namespace": "default"
  },
  "check": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
      "fatigue_check/interval": "360"
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
    "interval": 25,
    "occurrences": 15, // Math.ceil(360/25)
    "occurrences_watermark": 15,
  },
  "is_incident": false,
  "is_resolution": false,
  }

  var result = fatigue_check(event); 

  if (result) { 
    console.log("testCheckFatigueNonMultipleIntervalTrue PASSED, returned true"); 
  } else { 
    console.log("testCheckFatigueNonMultipleIntervalTrue FAILED, returned false"); 
  }
}

function testCheckFatigueNonMultipleIntervalFalse () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "namespace": "default"
  },
  "check": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
      "fatigue_check/interval": "360"
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
    "interval": 25,
    "occurrences": 14, // not Math.ceil(360/25)
    "occurrences_watermark": 14,
  },
  "is_incident": false,
  "is_resolution": false,
  }

  var result = fatigue_check(event); 

  if (result) { 
    console.log("testCheckFatigueNonMultipleIntervalFalse FAILED, returned true"); 
  } else { 
    console.log("testCheckFatigueNonMultipleIntervalFalse PASSED, returned false"); 
  }
}

function testCheckFatigueFlappingTrue () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "namespace": "default"
  },
  "check": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
      "fatigue_check/interval": "900"
      "fatigue_check/suppress_flapping": "false"
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
    "occurrences": 15,
    "occurrences_watermark": 3,
    "state": "flapping",
  },
  "is_incident": false,
  "is_resolution": false,
  }

  var result = fatigue_check(event); 

  if (result) { 
    console.log("testCheckFatigueFlappingTrue PASSED, returned true"); 
  } else { 
    console.log("testCheckFatigueFlappingTrue FAILED, returned false"); 
  }
}

function testCheckFatigueFlappingFalse () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "namespace": "default"
  },
  "check": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
      "fatigue_check/interval": "900"
      "fatigue_check/suppress_flapping": "true"
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
    "occurrences": 15,
    "occurrences_watermark": 3,
    "state": "flapping",
  },
  "is_incident": false,
  "is_resolution": false,
  }

  var result = fatigue_check(event); 

  if (result) { 
    console.log("testCheckFatigueFlappingFalse FAILED, returned true"); 
  } else { 
    console.log("testCheckFatigueFlappingFalse PASSED, returned false"); 
  }
}

function testCheckFatigueNoAnnotations () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "namespace": "default"
  },
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
    console.log("testCheckFatigueNoAnnotations PASSED, didn't error out"); 
  }
  else {
    console.log("testCheckFatigueNoAnnotations FAILED, see error output above"); 
  }
}

function testCheckFatigueNonMultipleIntervalLoop () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "namespace": "default"
  },
  "check": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
      "fatigue_check/interval": "360"
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
    "interval": 25,
    "occurrences": 1
    "occurrences_watermark": 1,
  },
  "is_incident": false,
  "is_resolution": false,
  }

  console.log("Testing 1 .. 40 occurrences for non-multiple intervals");
  for (i = 1; i <= 40; i++) {
    event.check.occurrences = i;
    var result = fatigue_check(event);
    if(result) {
      console.log("Occurrence " , i , " returned " , result);
    }
  }
  console.log("Occurrences 3, 15, and 30 should have returned true.");
}

testCheckFatigueNoAnnotations();
testCheckFatigueResolutionTrue();
testCheckFatigueResolutionFalse();
testCheckFatigueAllowResolutionFalse();
testCheckFatigueOccurrencesTrue();
testCheckFatigueOccurrencesFalse();
testCheckFatigueIntervalTrue();
testCheckFatigueIntervalFalse();
testCheckFatigueNonMultipleIntervalFalse();
testCheckFatigueFlappingTrue();
testCheckFatigueFlappingFalse();
testCheckFatigueNonMultipleIntervalLoop();

function testEntityFatigueAllowResolutionFalse () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "false"
    }
  },
  "check": {
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
    console.log("testEntityFatigueAllowResolutionFalse FAILED, returned true"); 
  } else { 
    console.log("testEntityFatigueAllowResolutionFalse PASSED, returned false"); 
  }
}

function testEntityFatigueResolutionTrue () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
    },
  },
  "check": {
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
    console.log("testEntityFatigueResolutionTrue PASSED, returned true"); 
  } else { 
    console.log("testEntityFatigueResolutionTrue FAILED, returned false"); 
  }
}

function testEntityFatigueResolutionFalse () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
    },
  },
  "check": {
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
    console.log("testEntityFatigueResolutionFalse FAILED, returned true"); 
  } else { 
    console.log("testEntityFatigueResolutionFalse PASSED, returned false"); 
  }
}

function testEntityFatigueOccurrencesTrue () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "annotations": {
      "fatigue_check/interval": "60"
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
    },
  },
  "check": {
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
    console.log("testEntityFatigueOccurrencesTrue PASSED, returned true"); 
  } else { 
    console.log("testEntityFatigueOccurrencesTrue FAILED, returned false"); 
  }
}

function testEntityFatigueOccurrencesFalse () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "annotations": {
      "fatigue_check/interval": "60"
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
    },
  },
  "check": {
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
    console.log("testEntityFatigueOccurrencesFalse FAILED, returned true"); 
  } else { 
    console.log("testEntityFatigueOccurrencesFalse PASSED, returned false"); 
  }
}

function testEntityFatigueIntervalTrue () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
      "fatigue_check/interval": "900"
    },
  },
  "check": {
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
    "occurrences_watermark": 15,
  },
  "is_incident": false,
  "is_resolution": false,
  }

  var result = fatigue_check(event); 

  if (result) { 
    console.log("testEntityFatigueIntervalTrue PASSED, returned true"); 
  } else { 
    console.log("testEntityFatigueIntervalTrue FAILED, returned false"); 
  }
}

function testEntityFatigueIntervalFalse () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
      "fatigue_check/interval": "900"
    },
  },
  "check": {
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
    "occurrences_watermark": 14,
  },
  "is_incident": false,
  "is_resolution": false,
  }

  var result = fatigue_check(event); 

  if (result) { 
    console.log("testEntityFatigueIntervalFalse FAILED, returned true"); 
  } else { 
    console.log("testEntityFatigueIntervalFalse PASSED, returned false"); 
  }
}

function testEntityFatigueNonMultipleIntervalTrue () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
      "fatigue_check/interval": "360"
    },
  },
  "check": {
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
    "interval": 25,
    "occurrences": 15, // Math.ceil(360/25)
    "occurrences_watermark": 15,
  },
  "is_incident": false,
  "is_resolution": false,
  }

  var result = fatigue_check(event); 

  if (result) { 
    console.log("testEntityFatigueNonMultipleIntervalTrue PASSED, returned true"); 
  } else { 
    console.log("testEntityFatigueNonMultipleIntervalTrue FAILED, returned false"); 
  }
}

function testEntityFatigueNonMultipleIntervalFalse () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
      "fatigue_check/interval": "360"
    },
  },
  "check": {
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
    "interval": 25,
    "occurrences": 14, // not Math.ceil(360/25)
    "occurrences_watermark": 14,
  },
  "is_incident": false,
  "is_resolution": false,
  }

  var result = fatigue_check(event); 

  if (result) { 
    console.log("testEntityFatigueNonMultipleIntervalFalse FAILED, returned true"); 
  } else { 
    console.log("testEntityFatigueNonMultipleIntervalFalse PASSED, returned false"); 
  }
}

function testEntityFatigueFlappingTrue () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
      "fatigue_check/interval": "900"
      "fatigue_check/suppress_flapping": "false"
    },
  },
  "check": {
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
    "occurrences": 15,
    "occurrences_watermark": 3,
    "state": "flapping",
  },
  "is_incident": false,
  "is_resolution": false,
  }

  var result = fatigue_check(event); 

  if (result) { 
    console.log("testEntityFatigueFlappingTrue PASSED, returned true"); 
  } else { 
    console.log("testEntityFatigueFlappingTrue FAILED, returned false"); 
  }
}

function testEntityFatigueFlappingFalse () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
      "fatigue_check/interval": "900"
      "fatigue_check/suppress_flapping": "true"
    },
  },
  "check": {
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
    "occurrences": 15,
    "occurrences_watermark": 3,
    "state": "flapping",
  },
  "is_incident": false,
  "is_resolution": false,
  }

  var result = fatigue_check(event); 

  if (result) { 
    console.log("testEntityFatigueFlappingFalse FAILED, returned true"); 
  } else { 
    console.log("testEntityFatigueFlappingFalse PASSED, returned false"); 
  }
}

function testEntityFatigueNoAnnotations () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "namespace": "default"
  },
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
    console.log("testEntityFatigueNoAnnotations PASSED, didn't error out"); 
  }
  else {
    console.log("testEntityFatigueNoAnnotations FAILED, see error output above"); 
  }
}

function testEntityFatigueNonMultipleIntervalLoop () { 
  // This event is only a stub of a real event 
  var event = {
  "entity": {
    "annotations": {
      "fatigue_check/occurrences": "3"
      "fatigue_check/allow_resolution": "true"
      "fatigue_check/interval": "360"
    },
  },
  "check": {
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
    "interval": 25,
    "occurrences": 1
    "occurrences_watermark": 1,
  },
  "is_incident": false,
  "is_resolution": false,
  }

  console.log("Testing 1 .. 40 occurrences for non-multiple intervals");
  for (i = 1; i <= 40; i++) {
    event.check.occurrences = i;
    var result = fatigue_check(event);
    if(result) {
      console.log("Occurrence " , i , " returned " , result);
    }
  }
  console.log("Occurrences 3, 15, and 30 should have returned true.");
}

testEntityFatigueNoAnnotations();
testEntityFatigueResolutionTrue();
testEntityFatigueResolutionFalse();
testEntityFatigueAllowResolutionFalse();
testEntityFatigueOccurrencesTrue();
testEntityFatigueOccurrencesFalse();
testEntityFatigueIntervalTrue();
testEntityFatigueIntervalFalse();
testEntityFatigueNonMultipleIntervalFalse();
testEntityFatigueFlappingTrue();
testEntityFatigueFlappingFalse();
testEntityFatigueNonMultipleIntervalLoop();
