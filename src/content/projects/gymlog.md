---
title: 'GymLog'
description: "A phone form that writes training sets straight into the sheet I already used — one screen, no app store, readable at arm's length between sets."
state: 'live'
meta: 'gymlog.runthenumbers.ch · Flask · Google Sheets'
figure:
  value: '51'
  label: 'sets in'
  live: 'sets'
order: 10
standfirst: 'A phone form that appends training sets to a Google Sheet. Built because the sheet was already the system and the phone keyboard was the problem.'
link:
  href: 'https://gymlog.runthenumbers.ch'
  label: 'Open gymlog.runthenumbers.ch →'
spec:
  - { term: 'Runs on', value: 'a small VPS, behind Caddy' }
  - { term: 'Built with', value: 'Flask · Sheets API · SQLite' }
  - { term: 'Screens', value: '11' }
  - { term: 'Sets logged', value: '51', live: 'sets' }
  - { term: 'Type floor', value: '17px · 56px taps' }
  - { term: 'Written', value: 'Sep 2026, still changing' }
steps:
  - 'Set the session up once — lift, programme, one-rep max, how many sets you are down for.'
  - 'Log a round: the main set and its superset, typed together, written as two rows.'
  - 'Tap any set to correct it. The sheet is written the moment you add it, so a fix is a fix in the sheet.'
  - 'Close the session. A nightly job pulls the rows into SQLite, where the figures on the home page come from.'
shot:
  src: '/images/gymlog-showcase.webp'
  alt: 'Three GymLog screens on a phone: the session setup, the log mid-session with the done sets folded, and the review with sets, volume and top weight.'
  width: 3200
  height: 2000
  caption: 'Set up, log, read back. Screens captured from the test environment, September 2026.'
---

Training already lived in a spreadsheet. What it did not have was a way in: typing a set
into a mobile sheet, one thumb, standing up, is a minute of work for five seconds of data.
So the sheet stayed the database and the phone got a form in front of it.

Every rule in the design came out of the gym rather than the desk — dark ground under bad
light, nothing tappable under 56 pixels, nothing to read under 17, and the numbers you are
chasing set larger than the words that label them.
