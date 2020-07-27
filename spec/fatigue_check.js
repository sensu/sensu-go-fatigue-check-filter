describe("fatigue_check", function() {
  it("returns true when no annotations and default(s) met", function() {
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
      expect(fatigue_check(event)).toBe(true);
  });

  it("returns true when no annotations and occurrences argument matched", function() {
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
      expect(fatigue_check(event, 2)).toBe(true);
  });

  it("returns false when no annotations and occurrences argument not matched", function() {
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
      expect(fatigue_check(event, 2)).toBe(false);
  });

  it("returns true when no annotations and interval argument matched", function() {
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
      expect(fatigue_check(event, 2, 300)).toBe(true);
  });

  it("returns false when no annotations and interval argument not matched", function() {
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
      expect(fatigue_check(event, 2, 300)).toBe(false);
  });

  it("returns false when is_resolution is true and check/allow_resolution is false", function() {
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
    expect(fatigue_check(event)).toBe(false);
  });

  it("returns true when is_resolution is true and check/allow_resolution is true", function() {
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
      expect(fatigue_check(event)).toBe(true);
  });

  it("returns false when is_resolution is true and check/allow_resolution is true, but insufficient occurrences", function() {
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
      expect(fatigue_check(event)).toBe(false);
  });

  it("returns true when the check/interval is matched", function() {
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
      expect(fatigue_check(event)).toBe(true);
  });

  it("returns false when the check/interval is not matched", function() {
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
      expect(fatigue_check(event)).toBe(false);
  });

  it("returns true when the non-multiple check/interval is matched", function() {
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
      expect(fatigue_check(event)).toBe(true);
  });

  it("returns false when the non-multiple check/interval is not matched", function() {
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
      expect(fatigue_check(event)).toBe(false);
  });

  it("returns true when the check/occurrences is matched", function() {
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
      expect(fatigue_check(event)).toBe(true);
  });

  it("returns false when the check/occurrences is not matched", function() {
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
      expect(fatigue_check(event)).toBe(false);
  });

  it("returns true when the check/suppress_flapping is false", function() {
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
      expect(fatigue_check(event)).toBe(true);
  });

  it("returns false when the check/suppress_flapping is true", function() {
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
      expect(fatigue_check(event)).toBe(false);
  });

  it("returns false when is_resolution is true and entity/allow_resolution is false", function() {
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
    expect(fatigue_check(event)).toBe(false);
  });

  it("returns true when is_resolution is true and entity/allow_resolution is true", function() {
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
      expect(fatigue_check(event)).toBe(true);
  });

  it("returns false when is_resolution is true and entity/allow_resolution is true, but insufficient occurrences", function() {
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
      expect(fatigue_check(event)).toBe(false);
  });

  it("returns true when the entity/interval is matched", function() {
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
      expect(fatigue_check(event)).toBe(true);
  });

  it("returns false when the entity/interval is not matched", function() {
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
      expect(fatigue_check(event)).toBe(false);
  });

  it("returns true when the non-multiple entity/interval is matched", function() {
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
      expect(fatigue_check(event)).toBe(true);
  });

  it("returns false when the non-multiple entity/interval is not matched", function() {
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
      expect(fatigue_check(event)).toBe(false);
  });

  it("returns true when the entity/occurrences is matched", function() {
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
      expect(fatigue_check(event)).toBe(true);
  });

  it("returns false when the entity/occurrences is not matched", function() {
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
      expect(fatigue_check(event)).toBe(false);
  });

  it("returns true when the entity/suppress_flapping is false", function() {
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
      expect(fatigue_check(event)).toBe(true);
  });

  it("returns false when the entity/suppress_flapping is true", function() {
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
      expect(fatigue_check(event)).toBe(false);
  });

  it("returns true when the entity/occurrences is matched, taking precedence over non-matching check/occurrences", function() {
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
      expect(fatigue_check(event)).toBe(true);
  });

  it("returns false when the entity/occurrences is not matched, taking precedence over matching check/occurrences", function() {
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
      expect(fatigue_check(event)).toBe(false);
  });

  it("returns true when the entity/keepalive_occurrences is matched for a keepalive", function() {
      var event = {
        "entity": {
          "annotations": {
            "fatigue_check/keepalive_occurrences": 2
          }
        },
        "check": {
          "interval": 30,
          "occurrences": 2,
          "occurrences_watermark": 2,
          "name": "keepalive"
        },
        "is_resolution": false
      }
      expect(fatigue_check(event)).toBe(true);
  });

  it("returns false when the entity/keepalive_occurrences is not matched for a keepalive", function() {
      var event = {
        "entity": {
          "annotations": {
            "fatigue_check/keepalive_occurrences": 3
          }
        },
        "check": {
          "interval": 30,
          "occurrences": 2,
          "occurrences_watermark": 2,
          "name": "keepalive"
        },
        "is_resolution": false
      }
      expect(fatigue_check(event)).toBe(false);
  });

  it("returns true when the entity/keepalive_interval is matched for a keepalive", function() {
      var event = {
        "entity": {
          "annotations": {
            "fatigue_check/keepalive_occurrences": 3,
            "fatigue_check/keepalive_interval": 600
          }
        },
        "check": {
          "interval": 30,
          "occurrences": 20,
          "occurrences_watermark": 20,
          "name": "keepalive"
        },
        "is_resolution": false
      }
      expect(fatigue_check(event)).toBe(true);
  });

  it("returns false when the entity/keepalive_interval is not matched for a keepalive", function() {
      var event = {
        "entity": {
          "annotations": {
            "fatigue_check/keepalive_occurrences": 3,
            "fatigue_check/keepalive_interval": 600
          }
        },
        "check": {
          "interval": 30,
          "occurrences": 19,
          "occurrences_watermark": 19,
          "name": "keepalive"
        },
        "is_resolution": false
      }
      expect(fatigue_check(event)).toBe(false);
  });

  it("returns true when the keepalive_occurrences argument is matched for a keepalive", function() {
      var event = {
        "entity": {
          "namespace": "default"
        },
        "check": {
          "interval": 30,
          "occurrences": 2,
          "occurrences_watermark": 2,
          "name": "keepalive"
        },
        "is_resolution": false
      }
      expect(fatigue_check(event, 3, 600, 2, 300)).toBe(true);
  });

  it("returns false when the keepalive_occurrences argument is not matched for a keepalive", function() {
      var event = {
        "entity": {
          "namespace": "default"
        },
        "check": {
          "interval": 30,
          "occurrences": 2,
          "occurrences_watermark": 2,
          "name": "keepalive"
        },
        "is_resolution": false
      }
      expect(fatigue_check(event, 2, 600, 3, 300)).toBe(false);
  });

  it("returns true when the keepalive_interval argument is matched for a keepalive", function() {
      var event = {
        "entity": {
          "namespace": "default"
        },
        "check": {
          "interval": 30,
          "occurrences": 20,
          "occurrences_watermark": 20,
          "name": "keepalive"
        },
        "is_resolution": false
      }
      expect(fatigue_check(event, 2, 300, 3, 600)).toBe(true);
  });

  it("returns false when the keepalive_interval argument is not matched for a keepalive", function() {
      var event = {
        "entity": {
          "namespace": "default"
        },
        "check": {
          "interval": 30,
          "occurrences": 19,
          "occurrences_watermark": 19,
          "name": "keepalive"
        },
        "is_resolution": false
      }
      expect(fatigue_check(event, 2, 600, 3, 300)).toBe(false);
  });

  it("returns false when the interval annotation is zero", function() {
      var event = {
        "entity": {
          "namespace": "default",
	  "annotations": {
            "fatigue_check/interval": 0
          }
        },
        "check": {
          "interval": 30,
          "occurrences": 2,
          "occurrences_watermark": 2,
        },
        "is_resolution": false
      }
      expect(fatigue_check(event, 1, 1800)).toBe(false);
  });

  it("returns false when the keepalive interval annotation is zero", function() {
      var event = {
        "entity": {
          "namespace": "default",
	  "annotations": {
            "fatigue_check/keepalive_interval": 0
          }
        },
        "check": {
          "interval": 30,
          "occurrences": 2,
          "occurrences_watermark": 2,
          "name": "keepalive"
        },
        "is_resolution": false
      }
      expect(fatigue_check(event, 3, 60, 1, 60)).toBe(false);
  });

});
