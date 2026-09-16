---
title: 'How the setup works'
description: 'The three rules, where things live, and the folder trick — the origin story of the tools in this section.'
pubDate: 'Sep 03 2026'
---

Argo is the name of the setup that runs a good part of my admin and side projects.
It is a Claude Code session, a folder of plain-text files, a task manager it is
allowed to write to, and a handful of rules. This is why it exists. The other posts
in this section are the tools that came out of it.

## The problem was never memory

I have never had trouble remembering that the tax thing exists. I have trouble
starting it. Knowing about a task costs nothing. Opening the portal, finding the
login, working out which document they actually want: that is the wall. Every
productivity system I have tried asked me to maintain it, which is the same wall
wearing a different hat. The notebook needs reviewing, the app needs tagging, the
weekly review needs doing. So the system becomes one more thing I know about and do
not start.

I have ADHD, which is the one-word version of the paragraph above.

What I wanted was not a better memory. I wanted something that holds all the pieces
and hands me back exactly one physical next step, small enough to start in the next
fifteen minutes.

## Three rules

In late August 2026 I set up a Claude Code project with one file at the top that says
who I am and how the assistant should behave. Most of that file is plumbing. Three
rules in it do almost all the work, and they are the part anyone can copy.

**Never make me choose.** If there is a decision to make, make it, state it in one
line, and move on. Offer an alternative only when it changes the outcome. A menu of
options is a question, and a question is a wall.

**Never hand back a project without a next action.** "Sort out taxes" is not a task.
"Download last year's salary certificate from the portal" is. If the assistant cannot
name a physical first step that takes under fifteen minutes, the step is wrong and it
has to try again.

**Never ask what you can infer.** Check the task list, the calendar and the files
before asking me anything. Ask only when the answer changes what happens next.

These are sentences in a text file. They change the behaviour of the thing more than
any tool I have plugged into it.

## Where things live

One place per kind of thing, and no copies.

- Tasks and projects live in Todoist. It is the only task list. The assistant reads it
  and writes to it, and never keeps a list of its own.
- Time lives in the calendar. Tasks compete with meetings, so it checks the calendar
  before promising me a day.
- Documents live in a folder on a small server.
- Every live project has a resume file: what it is for, what has been decided, what the
  last action was, what the next one is. That is what makes a project survive two weeks
  of neglect.
- Settled questions go in a decisions log, with the reasoning, so nothing gets reopened
  by accident.
- Anything ambiguous goes into a raw inbox with a timestamp. Capture first, sort later,
  never interrogate. If I dump five things at once it writes five lines and says "got
  it".

## The folder trick

This is the part you can copy this afternoon. The assistant can only read what is on
disk, so I put things on disk. A lease, an insurance policy, a payment plan go into a
folder and I say "read the admin folder". It renames the files, pulls out every date
and obligation, writes the tasks with proper lead time, and files a one-paragraph
summary so it never has to reread the document.

One morning in late August it went through a stack of PDFs. A rental contract turned
out to contain a claim I did not know I had. A health-insurance file produced one hard
deadline and one recurring reminder. A pension letter produced a tax question nobody
had asked. Four hours, most of them spent by me finding the PDFs.

## What it does not do

It is a few weeks old. The results so far are real, and early.

It runs on a small VPS and needs a laptop to drop files into. It is not zero-setup, and
it is not a product.

It reads everything it is given. That is the point, and also the warning: do not put in
what you would not want read in full.

It is not a chatbot. Most of the value is in what it writes down while I am not talking
to it: the morning brief, the weekly sweep, the log of what it did and why.

## The minimal version

If you want to start tonight, in this order:

1. One text file with the three rules and a sentence about who you are.
2. A task manager the assistant can write to, and the rule that it is the only list.
3. A folder for documents and a folder for state, both under git.
4. A morning brief that runs by itself. Nothing else until that has worked for a week.

The admin did not get smaller. It got a place to sit that is not my head, and the next
step is always visible.
