// Contains all of the test cases from ../spec/fatigue_check.js such
// that they can be ran using the Otto JS VM.  During the test, the
// current version of lib/fatigue_check.js is appended to this file
// and ran with Otto

// Please ensure this file stays in sync with ../spec/fatigue_check.js

function test_case1() {
    var event = {
      "entity": {
        "namespace": "default"
      },
      "check": {
        "occurrences": 1,
        "occurrences_watermark": 1
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (result) {
        console.log("# 1 PASSED - returns true when no annotations and default(s) met");
    } else {
        console.log("# 1 FAILED - returns true when no annotations and default(s) met");
    }
}

function test_case2() {
    var event = {
      "entity": {
        "namespace": "default"
      },
      "check": {
        "occurrences": 2,
        "occurrences_watermark": 2
      },
      "is_resolution": false
    }
    var result = fatigue_check(event, 2);
    if (result) {
        console.log("# 2 PASSED - returns true when no annotations and occurrences argument matched");
    } else {
        console.log("# 2 FAILED - returns true when no annotations and occurrences argument matched");
    }
}

function test_case3() {
    var event = {
      "entity": {
        "namespace": "default"
      },
      "check": {
        "occurrences": 1,
        "occurrences_watermark": 1
      },
      "is_resolution": false
    }
    var result = fatigue_check(event, 2);
    if (! result) {
        console.log("# 3 PASSED - returns false when no annotations and occurrences argument not matched");
    } else {
        console.log("# 3 FAILED - returns false when no annotations and occurrences argument not matched");
    }
}

function test_case4() {
    var event = {
      "entity": {
        "namespace": "default"
      },
      "check": {
        "interval": 10,
        "occurrences": 30,
        "occurrences_watermark": 30
      },
      "is_resolution": false
    }
    var result = fatigue_check(event, 2, 300);
    if  (result) {
        console.log("# 4 PASSED - returns true when no annotations and interval argument matched");
    } else {
        console.log("# 4 FAILED - returns true when no annotations and interval argument matched");
    }
}


function test_case5() {
    var event = {
      "entity": {
        "namespace": "default"
      },
      "check": {
        "interval": 10,
        "occurrences": 29,
        "occurrences_watermark": 29
      },
      "is_resolution": false
    }
    var result = fatigue_check(event, 2, 300);
    if (! result) {
        console.log("# 5 PASSED - returns false when no annotations and interval argument not matched");
    } else {
        console.log("# 5 FAILED - returns false when no annotations and interval argument not matched");
    }
}

function test_case6() {
    var event = {
      "entity": {
        "namespace": "default"
      },
      "check": {
        "annotations": {
          "fatigue_check/allow_resolution": false
        },
        "occurrences": 1,
        "occurrences_watermark": 4
      },
      "is_resolution": true
    }
    var result = fatigue_check(event);
      if (! result) {
          console.log("# 6 PASSED - returns false when is_resolution is true and check/allow_resolution is false");
      } else {
          console.log("# 6 FAILED - returns false when is_resolution is true and check/allow_resolution is false");
      }
}

function test_case7() {
    var event = {
      "entity": {
        "namespace": "default"
      },
      "check": {
        "annotations": {
          "fatigue_check/allow_resolution": true
        },
        "occurrences": 1,
        "occurrences_watermark": 4
      },
      "is_resolution": true
    }
    var result = fatigue_check(event);
    if (result) {
        console.log("# 7 PASSED - returns true when is_resolution is true and check/allow_resolution is true");
    } else {
        console.log("# 7 FAILED - returns true when is_resolution is true and check/allow_resolution is true");
    }
}

function test_case8() {
    var event = {
      "entity": {
        "namespace": "default"
      },
      "check": {
        "annotations": {
          "fatigue_check/occurrences": 3,
          "fatigue_check/allow_resolution": true
        },
        "occurrences": 1,
        "occurrences_watermark": 2
      },
      "is_resolution": true
    }
    var result = fatigue_check(event);
    if (! result) {
        console.log("# 8 PASSED - returns false when is_resolution is true and check/allow_resolution is true, but insufficient occurrences");
    } else {
        console.log("# 8 FAILED - returns false when is_resolution is true and check/allow_resolution is true, but insufficient occurrences");
    }
}

function test_case9() {
    var event = {
      "entity": {
        "namespace": "default"
      },
      "check": {
        "annotations": {
          "fatigue_check/occurrences": 3,
          "fatigue_check/interval": 300
        },
        "interval": 30,
        "occurrences": 10,
        "occurrences_watermark": 10
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (result) {
        console.log("# 9 PASSED - returns true when the check/interval is matched");
    } else {
        console.log("# 9 FAILED - returns true when the check/interval is matched");
    }
}

function test_case10() {
    var event = {
      "entity": {
        "namespace": "default"
      },
      "check": {
        "annotations": {
          "fatigue_check/occurrences": 3,
          "fatigue_check/interval": 300
        },
        "interval": 30,
        "occurrences": 9,
        "occurrences_watermark": 9,
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (! result) {
        console.log("#10 PASSED - returns false when the check/interval is not matched");
    } else {
        console.log("#10 FAILED - returns false when the check/interval is not matched");
    }
}

function test_case11() {
    var event = {
      "entity": {
        "namespace": "default"
      },
      "check": {
        "annotations": {
          "fatigue_check/occurrences": 3,
          "fatigue_check/interval": 360
        },
        "interval": 25,
        "occurrences": 15,
        "occurrences_watermark": 15
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (result) {
        console.log("#11 PASSED - returns true when the non-multiple check/interval is matched");
    } else {
        console.log("#11 FAILED - returns true when the non-multiple check/interval is matched");
    }
}

function test_case12() {
    var event = {
      "entity": {
        "namespace": "default"
      },
      "check": {
        "annotations": {
          "fatigue_check/occurrences": 3,
          "fatigue_check/interval": 360
        },
        "interval": 25,
        "occurrences": 14,
        "occurrences_watermark": 14,
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (! result) {
        console.log("#12 PASSED - returns false when the non-multiple check/interval is not matched");
    } else {
        console.log("#12 FAILED - returns false when the non-multiple check/interval is not matched");
    }
}

function test_case13() {
    var event = {
      "entity": {
        "namespace": "default"
      },
      "check": {
        "annotations": {
          "fatigue_check/occurrences": 3
        },
        "interval": 30,
        "occurrences": 3,
        "occurrences_watermark": 3
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (result) {
        console.log("#13 PASSED - returns true when the check/occurrences is matched");
    } else {
        console.log("#13 FAILED - returns true when the check/occurrences is matched");
    }
}

function test_case14() {
    var event = {
      "entity": {
        "namespace": "default"
      },
      "check": {
        "annotations": {
          "fatigue_check/occurrences": 3
        },
        "interval": 30,
        "occurrences": 2,
        "occurrences_watermark": 2,
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (! result) {
        console.log("#14 PASSED - returns false when the check/occurrences is not matched");
    } else {
        console.log("#14 FAILED - returns false when the check/occurrences is not matched");
    }
}

function test_case15() {
    var event = {
      "entity": {
        "namespace": "default"
      },
      "check": {
        "annotations": {
          "fatigue_check/suppress_flapping": false
        },
        "interval": 30,
        "occurrences": 1,
        "occurrences_watermark": 1,
        "state": "flapping"
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (result) {
        console.log("#15 PASSED - returns true when the check/suppress_flapping is false");
    } else {
        console.log("#15 FAILED - returns true when the check/suppress_flapping is false");
    }
}

function test_case16() {
    var event = {
      "entity": {
        "namespace": "default"
      },
      "check": {
        "annotations": {
          "fatigue_check/suppress_flapping": true
        },
        "interval": 30,
        "occurrences": 1,
        "occurrences_watermark": 1,
        "state": "flapping"
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (! result) {
        console.log("#16 PASSED - returns false when the check/suppress_flapping is true");
    } else {
        console.log("#16 FAILED - returns false when the check/suppress_flapping is true");
    }
}

function test_case17() {
    var event = {
      "entity": {
        "annotations": {
          "fatigue_check/allow_resolution": false
        }
      },
      "check": {
        "occurrences": 1,
        "occurrences_watermark": 4
      },
      "is_resolution": true
    }
    var result = fatigue_check(event);
    if (! result) {
        console.log("#17 PASSED - returns false when is_resolution is true and entity/allow_resolution is false");
    } else {
        console.log("#17 FAILED - returns false when is_resolution is true and entity/allow_resolution is false");
    }
}

function test_case18() {
    var event = {
      "entity": {
        "annotations": {
          "fatigue_check/allow_resolution": true
        }
      },
      "check": {
        "occurrences": 1,
        "occurrences_watermark": 4
      },
      "is_resolution": true
    }
    var result = fatigue_check(event);
    if (result) {
        console.log("#18 PASSED - returns true when is_resolution is true and entity/allow_resolution is true");
    } else {
        console.log("#18 FAILED - returns true when is_resolution is true and entity/allow_resolution is true");
    }
}

function test_case19() {
    var event = {
      "entity": {
        "annotations": {
          "fatigue_check/occurrences": 3,
          "fatigue_check/allow_resolution": true
        }
      },
      "check": {
        "occurrences": 1,
        "occurrences_watermark": 2
      },
      "is_resolution": true
    }
    var result = fatigue_check(event);
    if (! result) {
        console.log("#19 PASSED - returns false when is_resolution is true and entity/allow_resolution is true, but insufficient occurrences");
    } else {
        console.log("#19 FAILED - returns false when is_resolution is true and entity/allow_resolution is true, but insufficient occurrences");
    }
}

function test_case20() {
    var event = {
      "entity": {
        "annotations": {
          "fatigue_check/occurrences": 3,
          "fatigue_check/interval": 300
        }
      },
      "check": {
        "interval": 30,
        "occurrences": 10,
        "occurrences_watermark": 10
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (result) {
        console.log("#20 PASSED - returns true when the entity/interval is matched");
    } else {
        console.log("#20 FAILED - returns true when the entity/interval is matched");
    }
}

function test_case21() {
    var event = {
      "entity": {
	"annotations": {
	  "fatigue_check/occurrences": 3,
	  "fatigue_check/interval": 300
	}
      },
      "check": {
	"interval": 30,
	"occurrences": 9,
	"occurrences_watermark": 9,
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (! result) {
        console.log("#21 PASSED - returns false when the entity/interval is not matched");
    } else {
        console.log("#21 FAILED - returns false when the entity/interval is not matched");
    }
}

function test_case22() {
    var event = {
      "entity": {
	"annotations": {
	  "fatigue_check/occurrences": 3,
	  "fatigue_check/interval": 360
	}
      },
      "check": {
	"interval": 25,
	"occurrences": 15,
	"occurrences_watermark": 15
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (result) {
        console.log("#22 PASSED - returns true when the non-multiple entity/interval is matched");
    } else {
        console.log("#22 FAILED - returns true when the non-multiple entity/interval is matched");
    }
}

function test_case23() {
    var event = {
      "entity": {
	"annotations": {
	  "fatigue_check/occurrences": 3,
	  "fatigue_check/interval": 360
	}
      },
      "check": {
	"interval": 25,
	"occurrences": 14,
	"occurrences_watermark": 14,
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (! result) {
        console.log("#23 PASSED - returns false when the non-multiple entity/interval is not matched");
    } else {
        console.log("#23 FAILED - returns false when the non-multiple entity/interval is not matched");
    }
}

function test_case24() {
    var event = {
      "entity": {
	"annotations": {
	  "fatigue_check/occurrences": 3
	}
      },
      "check": {
	"interval": 30,
	"occurrences": 3,
	"occurrences_watermark": 3
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (result) {
        console.log("#24 PASSED - returns true when the entity/occurrences is matched");
    } else {
        console.log("#24 FAILED - returns true when the entity/occurrences is matched");
    }
}

function test_case25() {
    var event = {
      "entity": {
	"annotations": {
	  "fatigue_check/occurrences": 3
	}
      },
      "check": {
	"interval": 30,
	"occurrences": 2,
	"occurrences_watermark": 2,
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (! result) {
        console.log("#25 PASSED - returns false when the entity/occurrences is not matched");
    } else {
        console.log("#25 FAILED - returns false when the entity/occurrences is not matched");
    }
}

function test_case26() {
    var event = {
      "entity": {
	"annotations": {
	  "fatigue_check/suppress_flapping": false
	}
      },
      "check": {
	"interval": 30,
	"occurrences": 1,
	"occurrences_watermark": 1,
	"state": "flapping"
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (result) {
        console.log("#26 PASSED - returns true when the entity/suppress_flapping is false");
    } else {
        console.log("#26 FAILED - returns true when the entity/suppress_flapping is false");
    }
}

function test_case27() {
    var event = {
      "entity": {
	"annotations": {
	  "fatigue_check/suppress_flapping": true
	}
      },
      "check": {
	"interval": 30,
	"occurrences": 1,
	"occurrences_watermark": 1,
	"state": "flapping"
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (! result) {
        console.log("#27 PASSED - returns false when the entity/suppress_flapping is true");
    } else {
        console.log("#27 FAILED - returns false when the entity/suppress_flapping is true");
    }
}

function test_case28() {
    var event = {
      "entity": {
	"annotations": {
	  "fatigue_check/occurrences": 2
	}
      },
      "check": {
	"annotations": {
	  "fatigue_check/occurrences": 3
	},
	"interval": 30,
	"occurrences": 2,
	"occurrences_watermark": 2
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (result) {
        console.log("#28 PASSED - returns true when the entity/occurrences is matched, taking precedence over non-matching check/occurrences");
    } else {
        console.log("#28 FAILED - returns true when the entity/occurrences is matched, taking precedence over non-matching check/occurrences");
    }
}

function test_case29() {
    var event = {
      "entity": {
	"annotations": {
	  "fatigue_check/occurrences": 3
	}
      },
      "check": {
	"annotations": {
	  "fatigue_check/occurrences": 2
	},
	"interval": 30,
	"occurrences": 2,
	"occurrences_watermark": 2,
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (! result) {
        console.log("#29 PASSED - returns false when the entity/occurrences is not matched, taking precedence over matching check/occurrences");
    } else {
        console.log("#29 FAILED - returns false when the entity/occurrences is not matched, taking precedence over matching check/occurrences");
    }
}

function test_case30() {
    var event = {
      "entity": {
	"annotations": {
	  "fatigue_check/keepalive_occurrences": 2
	}
      },
      "check": {
	"interval": 30,
	"occurrences": 2,
	"occurrences_watermark": 2
	"name": 'keepalive'
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (result) {
        console.log("#30 PASSED - returns true when the entity/keepalive_occurrences is matched for a keepalive");
    } else {
        console.log("#30 FAILED - returns true when the entity/keepalive_occurrences is matched for a keepalive");
    }
}

function test_case31() {
    var event = {
      "entity": {
	"annotations": {
	  "fatigue_check/keepalive_occurrences": 3
	}
      },
      "check": {
	"interval": 30,
	"occurrences": 2,
	"occurrences_watermark": 2
	"name": 'keepalive'
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (result) {
        console.log("#30 FAILED - returns false when the entity/keepalive_occurrences is not matched for a keepalive");
    } else {
        console.log("#30 PASSED - returns false when the entity/keepalive_occurrences is not matched for a keepalive");
    }
}

function test_case32() {
    var event = {
      "entity": {
	"annotations": {
	  "fatigue_check/keepalive_occurrences": 3
	  "fatigue_check/keepalive_interval": 600
	}
      },
      "check": {
	"interval": 30,
	"occurrences": 20,
	"occurrences_watermark": 20
	"name": 'keepalive'
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (result) {
        console.log("#32 PASSED - returns true when the entity/keepalive_interval is matched for a keepalive");
    } else {
        console.log("#32 FAILED - returns true when the entity/keepalive_interval is matched for a keepalive");
    }
}

function test_case33() {
    var event = {
      "entity": {
	"annotations": {
	  "fatigue_check/keepalive_occurrences": 3
	  "fatigue_check/keepalive_interval": 600
	}
      },
      "check": {
	"interval": 30,
	"occurrences": 19,
	"occurrences_watermark": 19
	"name": 'keepalive'
      },
      "is_resolution": false
    }
    var result = fatigue_check(event);
    if (result) {
        console.log("#33 FAILED - returns false when the entity/keepalive_interval is not matched for a keepalive");
    } else {
        console.log("#33 PASSED - returns false when the entity/keepalive_interval is not matched for a keepalive");
    }
}

function test_case34() {
    var event = {
      "entity": {
	"namespace": 'default'
      },
      "check": {
	"interval": 30,
	"occurrences": 2,
	"occurrences_watermark": 2
	"name": 'keepalive'
      },
      "is_resolution": false
    }
    var result = fatigue_check(event, 3, 600, 2, 300);
    if (result) {
        console.log("#34 PASSED - returns true when the keepalive_occurrences argument is matched for a keepalive");
    } else {
        console.log("#34 FAILED - returns true when the keepalive_occurrences argument is matched for a keepalive");
    }
}

function test_case35() {
    var event = {
      "entity": {
	"namespace": 'default'
      },
      "check": {
	"interval": 30,
	"occurrences": 2,
	"occurrences_watermark": 2
	"name": 'keepalive'
      },
      "is_resolution": false
    }
    var result = fatigue_check(event, 2, 600, 3, 300);
    if (result) {
        console.log("#35 FAILED - returns false when the keepalive_occurrences argument is not matched for a keepalive");
    } else {
        console.log("#35 PASSED - returns false when the keepalive_occurrences argument is not matched for a keepalive");
    }
}

function test_case36() {
    var event = {
      "entity": {
	"namespace": 'default'
      },
      "check": {
	"interval": 30,
	"occurrences": 20,
	"occurrences_watermark": 20
	"name": 'keepalive'
      },
      "is_resolution": false
    }
    var result = fatigue_check(event, 2, 300, 3, 600);
    if (result) {
        console.log("#36 PASSED - returns true when the keepalive_interval argument is matched for a keepalive");
    } else {
        console.log("#36 FAILED - returns true when the keepalive_interval argument is matched for a keepalive");
    }
}

function test_case37() {
    var event = {
      "entity": {
	"namespace": 'default'
      },
      "check": {
	"interval": 30,
	"occurrences": 19,
	"occurrences_watermark": 19
	"name": 'keepalive'
      },
      "is_resolution": false
    }
    var result = fatigue_check(event, 2, 600, 3, 300);
    if (result) {
        console.log("#37 FAILED - returns false when the keepalive_interval argument is not matched for a keepalive");
    } else {
        console.log("#37 PASSED - returns false when the keepalive_interval argument is not matched for a keepalive");
    }
}
test_case1();
test_case2();
test_case3();
test_case4();
test_case5();
test_case6();
test_case7();
test_case8();
test_case9();
test_case10();
test_case11();
test_case12();
test_case13();
test_case14();
test_case15();
test_case16();
test_case17();
test_case18();
test_case19();
test_case20();
test_case21();
test_case22();
test_case23();
test_case24();
test_case25();
test_case26();
test_case27();
test_case28();
test_case29();
test_case30();
test_case31();
test_case32();
test_case33();
test_case34();
test_case35();
test_case36();
test_case37();

