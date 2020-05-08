[![Sensu Bonsai Asset](https://img.shields.io/badge/Bonsai-Download%20Me-brightgreen.svg?colorB=89C967&logo=sensu)](https://bonsai.sensu.io/assets/nixwiz/sensu-go-fatigue-check-filter)
![Karma Test](https://github.com/nixwiz/sensu-go-fatigue-check-filter/workflows/Karma%20Test/badge.svg)
![release](https://github.com/nixwiz/sensu-go-fatigue-check-filter/workflows/release/badge.svg)

## Sensu Go Fatigue Check Filter

- [Overview](#overview)
- [Files](#files)
- [Usage examples](#usage-examples)
- [Configuration](#configuration)
  - [Sensu Go](#sensu-go)
    - [Asset registration](#asset-registration)
    - [Asset definition](#asset-definition)
    - [Filter definition](#filter-definition)
    - [Handler definition](#handler-definition)
    - [Check definition](#check-definition)
    - [Entity definition](#entity-definition)
    - [Annotations](#annotations)
    - [Arguments](#arguments)
- [Sensu Core](#sensu-core)
- [Installation from source](#installation-from-source)
- [Additional notes](#additional-notes)
- [Contributing](#contributing)

### Overview

The Sensu Go Fatigue Check Filter is a [Sensu Event Filter][1] for managing alert fatigue.

A typical use of filters is to reduce [alert fatigue][2].  One of the most typical examples of this is create the following filter that only passes through events on their first occurrence and every hour after that.

```yml
---
type: EventFilter
api_version: core/v2
metadata:
  name: hourly
  namespace: default
spec:
  action: allow
  expressions:
  - event.check.occurrences == 1 || event.check.occurrences % (3600 / event.check.interval)
    == 0
  runtime_assets: []
```

However, the use of the filter above creates some limitations.  Suppose you have one check in particular that you want to change to only alert after three (3) occurrences.  Typically that might mean creating another handler and filter pair to assign to that check.  If you have to do this often enough and you start to have an unwieldy mass of handlers and filters.

That's where this Fatigue Check Filter comes in.  Using annotations, it makes the number of occurrences and the interval tunable on a per-check or per-entity basis.  It also allows you to control whether or not resolution events are passed through.

### Files

N/A

## Usage examples

N/A

## Configuration
### Sensu Go
#### Asset registration

Assets are the best way to make use of this plugin. If you're not using an asset, please consider doing so! If you're using sensuctl 5.13 or later, you can use the following command to add the asset: 

`sensuctl asset add nixwiz/sensu-go-fatigue-check-filter --rename fatigue-check-filter`

Note that the `--rename` is not necessary, but references to the runtime asset in the filter definition as in the example below would need to be updated to match. 

If you're using an earlier version of sensuctl, you can download the asset definition from [this project's Bonsai asset index page][7].

You can create your own [asset][3] by creating a tar file containing `lib/fatigue_check.js` and creating your asset definition accordingly.

#### Asset definition

If not using `sensuctl asset add`:

```yml
---
type: Asset
api_version: core/v2
metadata:
  name: fatigue-check-filter
  namespace: default
spec:
  sha512: 2e67975df7d993492cd5344edcb9eaa23b38c1eef7000576b396804fc2b33362b02a1ca2f7311651c175c257b37d8bcbbce1e18f6dca3ca04520e27fda552856
  url: http://example.com/sensu/assets/fatigue-check.tar.gz
```

#### Filter definition

```yml
---
type: EventFilter
api_version: core/v2
metadata:
  name: fatigue_check
  namespace: default
spec:
  action: allow
  expressions:
  - fatigue_check(event)
  runtime_assets:
  - fatigue-check-filter
```

#### Handler definition

```yml
---
type: Handler
api_version: core/v2
metadata:
  namespace: default
  name: email
spec:
  type: pipe
  command: sensu-email-handler -f from@example.com -t to@example.com -s smtp.example.com
    -u emailuser -p sup3rs3cr3t
  timeout: 10
  filters:
  - is_incident
  - not_silenced
  - fatigue_check
```

#### Check definition

```yml
---
type: CheckConfig
api_version: core/v2
metadata:
  name: linux-cpu-check
  namespace: default
  annotations:
    fatigue_check/occurrences: '3'
    fatigue_check/interval: '900'
    fatigue_check/allow_resolution: 'false'
spec:
  command: check-cpu -w 90 c 95
  handlers:
  - email
  interval: 60
  publish: true
  runtime_assets: 
  subscriptions:
  - linux
```

#### Entity definition

Via the agent.yml:

```
---
##
# agent configuration
##

#name: ""

#namespace: "default"

#subscriptions: 
#  - "localhost"

annotations:
  fatigue_check/occurrences: "3"
  fatigue_check/interval: "900"
  fatigue_check/allow_resolution: "false"

[...]
```
#### Annotations
The Fatigue Check Filter makes use of four annotations within the check and/or entity metadata, with the entity annotations taking precedence.

|Annotation|Default|Usage|
|----------|-------|-----|
|fatigue_check/occurrences|1|On which occurrence to allow the initial event to pass through|
|fatigue_check/interval|1800|In seconds, at what interval to allow subsequent events to pass through, ideally a multiple of the check interval|
|fatigue_check/allow_resolution|true|Determines whether or not a resolution event is passed through|
|fatigue_check/suppress_flapping|true|Determines whether or not to suppress events for checks that are marked as flapping|

#### Arguments
The `fatigue_check()` function can take up to three arguments, the first one is the event and is required.  The optional second and
third arguments allow you to override the built-in defaults for occurrences and interval, respectively.  For example, if you'd
like a version of the filter that, by default, matches on the second occurrence instead of the first you could create a filter
similar to below:

```yml
---
type: EventFilter
api_version: core/v2
metadata:
  name: fatigue_check_two_occurrences
  namespace: default
spec:
  action: allow
  expressions:
  - fatigue_check(event, 2)
  runtime_assets:
  - fatigue-check-filter
```

If you'd like one that overrides the default 30 minute interval with a 10 minute one you could create one similar to below
(note that in order to specify the third argument, you have to provide the second):

```yml
---
type: EventFilter
api_version: core/v2
metadata:
  name: fatigue_check_10m_interval
  namespace: default
spec:
  action: allow
  expressions:
  - fatigue_check(event, 1, 600)
  runtime_assets:
  - fatigue-check-filter
```

### Sensu Core

N/A

## Installation from source

### Sensu Go

See the instructions above for [asset registration][6].

### Sensu Core

Install and setup plugins on [Sensu Core][5].

## Additional notes

* This filter makes use of the occurrences_watermark attribute that was buggy up until Sensu Go 5.9. Your mileage may vary on prior versions.

* If the interval is not a multiple of the check's interval, then the actual interval is computed by rounding up the result of dividing the interval by the check's interval.  For example, an interval of 180s with a check interval of 25s would pass the event through on every 8 occurrences (200s).

## Contributing

N/A

[1]: https://docs.sensu.io/sensu-go/latest/reference/filters/
[2]: https://docs.sensu.io/sensu-go/latest/guides/reduce-alert-fatigue/
[3]: https://docs.sensu.io/sensu-go/latest/reference/assets/
[4]: https://bonsai.sensu.io/
[5]: https://docs.sensu.io/sensu-core/latest/installation/installing-plugins/
[6]: #asset-registration
[7]: https://bonsai.sensu.io/assets/nixwiz/sensu-go-fatigue-check-filter
