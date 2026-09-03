---
title: 'Your Garmin data is yours. Here is how to get it out.'
description: 'Garmin has no public API for the data your own watch records. garmin-pull is a small standard-library Python tool, also packaged as a Claude Code plugin, that pulls sleep, HRV, stress, body battery and every workout into CSV and SQLite. Written by an AI agent under my direction, ten days old, and this post says exactly that.'
pubDate: 'Sep 04 2026'
---

I wear a Garmin all day and all night. It records my heart rate every two minutes, my stress and body battery every three, my steps every quarter hour, my breathing, my SpO2, my HRV through the night, and every workout down to the second. All of that goes to Garmin Connect, and Garmin Connect shows it back to me one screen at a time, one day at a time, on a phone.

For a training log that is fine. For the kind of question I want to ask of a year of data (what a late hard session does to that night's HRV, say, or how resting heart rate moves through a taper) I need the numbers in a table. Garmin does not offer that. There is no public API for your own data, and the official "Export Your Data" request comes back as a zip of FIT files, a good format for a watch and a poor one for a spreadsheet.

So I have a tool that does it. It is called garmin-pull and it lives at [github.com/ragonc/argo-plugins](https://github.com/ragonc/argo-plugins). Before anything else, the two facts that frame everything below.

I did not write the code. I run a personal Claude Code setup that handles my admin, training data and side projects, and it wrote this, first as a private daily pull for my own account on 24 August 2026, then as a public plugin on 3 September. I directed it, decided what it should and should not do, asked for the review described below, and use the output daily. If "an AI wrote it" changes how much you trust it, that is fair, and the code is small enough to read.

And it is ten days old as a private tool and one day old as a public one. It works against my account. It has not yet been used by anyone else.

## What it does

One command, your data in files:

```
python3 scripts/garmin_setup.py                  # once: email, password, 2FA code if asked
python3 scripts/garmin_pull.py --last 1y         # daily summaries for the last year
python3 scripts/garmin_pull.py --full-day --last 7d   # every data point of each day
```

You get one CSV per category (sleep, HRV, daily summary, VO2max, activities), one SQLite database with the same tables, and the raw JSON exactly as Garmin sent it. Pick a date range with `--last 6m` or `--since` and `--until`, pick categories with `--what sleep,hrv`, or ask for `--all-history` and it pages back to your first workout and pulls from there.

`--full-day` is the part I wanted most. Instead of one row per day you get every measurement the watch made: a `timeline.csv` with date, series, timestamp and value, around 4,000 to 5,000 rows per day across 22 series on my account, plus a `snapshots.csv` with the day's training readiness, hydration, training status, endurance score and fitness age.

It is pure Python standard library, 3.11 or newer. Nothing to pip install. It talks only to Garmin's own login and API hosts, and every line that touches your password is in one file.

It is also a Claude Code plugin. Install it and say "get my Garmin data for the last three months, sleep and HRV only" and a skill walks you through the login and runs the pull. The plugin is a convenience layer; the scripts work on their own.

## What it is built to survive

Five failure modes shaped the design. To be clear about where they came from: one is documented Garmin behaviour, and most of the rest came out of a review, not out of my own pain. I have not been throttled by Garmin. I have not lost data. The tool is built for those cases because they are the known ways this kind of tool dies, not because they happened to me.

**Log in once, not once per run.** Garmin's login flow is the one the phone app uses: a single sign-on page, then an OAuth1 token, then a short-lived OAuth2 bearer token. Repeated logins are what Garmin throttles with HTTP 429, so the tool caches the session and re-mints the hour-long bearer token from the OAuth1 token, which stays valid for about a year. One login and one two-factor code should cover roughly a year of pulls. I say "should" because the tool is ten days old and nobody has run it for a year yet.

**Stop at the first 429.** The pull reads Garmin's Retry-After header. Up to two minutes it waits and tries once more; anything longer and it stops cleanly and prints how long to wait. Rerun the same command later and it continues from the last day on disk.

**Checkpoint per day.** Every day is written as soon as it is fetched, so a stop, a crash or a rate limit costs nothing. The README says a five-year full history is around 7,000 requests and will probably be throttled partway. That is an estimate from the per-day request count, not a measurement. I have not pulled five years.

**Never fill a gap with a guess.** An empty cell means Garmin did not report that metric that day. Nothing is interpolated. The first version of the generic flattener would pick a numeric column when the data did not say which one was the value; the review caught it, and now it leaves the series out and names it in the report instead.

**Expect the schema to move.** Garmin can change its response shapes without notice. The tool assumes it will, which is the most interesting part of it.

## Flattening without assuming

The intraday endpoints return arrays of arrays, and next to each array Garmin ships a small descriptor list saying which column is the timestamp and what the others mean. The flattener reads those descriptors instead of hard-coding positions, so a reordered or extended array still lands in the right place.

The rules are simple. Any list with a time field and one clear value column becomes a timeline series. Any scalar becomes a snapshot metric. Unknown fields get a generated name rather than being dropped. When a list has several numeric columns and nothing says which one is the value, it is left out and listed in the end-of-pull report under "not flattened". A plausible wrong number is worse than a gap, and the raw JSON is still on disk.

The plugin ships with a `schema_baseline.json` listing the 539 field names seen in real responses when it was built. Every pull compares what it saw against that list and the report says what Garmin added or removed. The idea is that you hear about a change from the report rather than from a column that has quietly been empty for a month. Whether that works in practice depends on how Garmin changes things, and it has not been tested by a real change yet.

For the same reason there is a canary. `garmin_canary.py --install` schedules a weekly check on your own machine (systemd on Linux, launchd on macOS, instructions for Task Scheduler on Windows). It restores the cached session, fetches yesterday's data, flattens it and diffs the field names. Exit 0 is healthy, 2 means Garmin changed something but the pull still works, 1 means broken. Give it a webhook and it posts only when the verdict is not healthy. Nothing runs anywhere except your own computer. It has run twice, both times healthy.

## The review

After the first public version I asked for a review, and this too was done by AI: three separate agents, each briefed to read the plugin as a different person. A beginner installing it for the first time, a security reader following the password, and a maintainer who inherits the code in a year. They scored it 4, 6 and 6 out of 10 and produced a ranked list of fixes.

The top finding was a real bug: the session code threw away a perfectly usable cache whenever the short-lived token expired, which would have forced a fresh login roughly monthly, which was the only reason the password was being stored at all. The fix removed the bug and with it the need to store the password by default. The no-guess rule in the flattener, the status-coded error handling, and streaming the flattened data into SQLite one day at a time instead of holding a full history in memory all came from the same list. All of it shipped the same day, which is why the repository shows six versions dated 3 September.

There are 95 unit tests, none of which need a Garmin account. The OAuth1 signing is checked against the worked example in RFC 5849, and the shaping functions against captured response shapes.

## Try it

```
/plugin marketplace add ragonc/argo-plugins
/plugin install garmin-pull@argo-plugins
```

Or clone the repo and run the scripts directly. If something does not work, `garmin_doctor.py` checks your Python version, credentials, session and last pull, and makes one small request to prove the session is alive. If it breaks on your account, open an issue with the raw JSON from `raw/detail/` attached, since a response shape I have not seen is the most likely cause.
