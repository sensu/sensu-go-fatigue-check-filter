# sensu-go-fatigue-check-filter

The Sensu Go Fatigue Check Filter is a [Sensu Event Filter][1] for managing alert fatigue.

A typical use of filters is to reduce [alert fatigue][2].  One of the most typical examples of this is create the following filter that only passes through events on their first occurrence and every hour after that.

```json
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "hourly",
    "namespace": "default"
  },
  "spec": {
    "action": "allow",
    "expressions": [
      "event.check.occurrences == 1 || event.check.occurrences % (3600 / event.check.interval) == 0"
    ],
    "runtime_assets": []
  }
}
```

However, the use of the filter above creates some limitations.  Suppose you have one check in particular that you want to change to only alert after three (3) occurrences.  Typically that might mean creating another handler and filter pair to assign to that check.  If you have to do this often enough and you start to have an unwieldy mass of handlers and filters.

That's where this Fatigue Check Filter comes in.  Using annotations, it makes the number of occurrences and the interval tunable on a per-check basis.  It also allows you to control whether or not resolution events are passed through.

## Installation

You can create your own [asset][3] by creating a tar file containing `lib/fatigue_check.js` and creating your asset definition accordingly.

Future:  releases on [Bonsai][4]

## Configuration

The Fatigue Check Filter makes use of three annotations within a check's metadata.

|Annotation|Default|Usage|
|----------|-------|-----|
|fatigue_check/occurrences|1|On which occurrence to allow the initial event to pass through|
|fatigue_check/interval|1800|In seconds, at what interval to allow subsequent events to pass through|
|fatigue_check/allow_resolution|true|Determines whether or not a resolution event is passed through|
|fatigue_check/suppress_flapping|true|Determines whether or not to suppress events for checks that are flapping|

**Note:**  This filter makes use of the occurrences_watermark attribute that was buggy up until
Sensu Go 5.9.

#### Definition Examples
Asset:
```json
{
  "type": "Asset",
  "api_version": "core/v2",
  "metadata": {
    "name": "fatigue-check-filter",
    "namespace": "default"
  },
  "spec": {
    "sha512": "2e67975df7d993492cd5344edcb9eaa23b38c1eef7000576b396804fc2b33362b02a1ca2f7311651c175c257b37d8bcbbce1e18f6dca3ca04520e27fda552856",
    "url": "http://example.com/sensu/assets/fatigue-check.tar.gz"
  }
}
```
Filter:

```json
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "fatigue_check",
    "namespace": "default"
  },
  "spec": {
    "action": "allow",
    "expressions": [
      "fatigue_check(event)"
    ],
    "runtime_assets": [
      "fatigue-check-filter"
    ]
  }
}
```

Handler:

```json
{
    "api_version": "core/v2",
    "type": "Handler",
    "metadata": {
        "namespace": "default",
        "name": "email"
    },
    "spec": {
        "type": "pipe",
        "command": "sensu-email-handler -f from@example.com -t to@example.com -s smtp.example.com -u emailuser -p sup3rs3cr3t",
        "timeout": 10,
        "filters": [
            "is_incident",
            "not_silenced",
            "fatigue_check"
        ]
    }
}
```
Check:
```json
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "linux-cpu-check",
    "namespace": "default",
    "annotations": {
      "fatigue_check/occurrences": "3",
      "fatigue_check/interval": "900",
      "fatigue_check/allow_resolution": "false"
    },
  },
  "spec": {
    "command": "check-cpu -w 90 c 95",
    "env_vars": null,
    "handlers": [
      "email"
    ],
    "high_flap_threshold": 0,
    "interval": 60,
    "low_flap_threshold": 0,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": null,
    "stdin": false,
    "subdue": null,
    "subscriptions": [
      "linux"
    ],
    "timeout": 0,
    "ttl": 0
  }
}

```

[1]: https://docs.sensu.io/sensu-go/latest/reference/filters/
[2]: https://docs.sensu.io/sensu-go/latest/guides/reduce-alert-fatigue/
[3]: https://docs.sensu.io/sensu-go/latest/reference/assets/
[4]: https://bonsai.sensu.io/
