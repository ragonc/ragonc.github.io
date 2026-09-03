---
title: 'Long jobs in Claude Code: let the script do the work'
description: 'Anything over a few minutes dies with the turn. The fix is a pattern, not a trick: the agent writes the script, the script runs detached, the chat only reads a status file.'
pubDate: 'Sep 03 2026'
---

Claude Code is built around turns. You type, the model works, the turn ends. That shape is fine for editing a file or answering a question, and it breaks the moment the job is a two-hour loop over a few thousand rows. Anything running inside a turn dies when the turn ends. A subagent doing the loop dies with it. And if you keep the turn alive with progress messages, every one of those messages lands in the session, so each later reply gets slower and the context fills with "processed 1,340 of 2,000".

I hit this with a real job: extracting structure from a few hundred files, with a judgement call per file that needed a model. The first attempt ran in a subagent and was killed at a turn boundary. The second attempt went the other way, and it is the pattern I now use for anything longer than a few minutes.

## The rule

The agent writes the script. The script does the work. The script runs detached. The chat only launches it, reads a small status file, and approves the next phase.

That is the whole idea. Everything else is plumbing to make the rule cheap to follow.

## What the plumbing looks like

A runner starts the job as a user-level systemd unit (with a setsid double-fork fallback where systemd is not available), so it survives the end of the turn, the end of the session, and a closed terminal. It enforces one live process per job name, runs the command from the repo root, and appends stdout and stderr to a log file the chat never has to read in full.

A small library the job imports gives it a handful of calls. `progress(done, total)` writes a throttled status file. `checkpoint(data)` and `load_checkpoint()` make every phase resumable, so a crash costs minutes rather than hours. `phase_done(summary)` posts a one-line summary to a notification channel and exits. `fail(msg)` does the same with a non-zero exit. When the status file says running but the process is gone, the runner marks it as died and points at the log.

Per-row judgement goes through a headless `claude -p` call with no tools, checkpointed per item. The model decides one thing about one row, and the answer is written down before moving to the next. If the process dies at item 800, it restarts at item 800.

The job itself is one Python file, one function per phase, copied from a template. It reads inputs from where they already live and writes deliverables into an output folder that belongs to the job. If a source cannot be fetched or parsed, the row is flagged and skipped. It never invents data.

## How a job actually runs

The spec goes in a project file before any code is written: objective, input paths, output format, phases, decisions already taken. That file is the job's memory. The chat session is not, and should not be, because the session may be gone by the time phase two starts.

The agent writes the job script from the template. Then a dry run on five to ten items in the foreground, with a short timeout, and a look at the output. A wrong column name discovered after 1,400 fetches is the expensive kind of mistake, and the dry run is what catches it.

Then launch, detached, and end the turn. No waiting, no polling, no sleeping. Start, phase-done and failure land in a Discord channel, not in the conversation, because the conversation is for talking and the channel is for watching background work.

When someone asks how it is going, the answer comes from one command that prints state, progress, an error if any, and the last few log lines. Two-line reply. Nobody re-derives counts from the data.

Phases gate on a human. When phase one finishes, the process exits and posts its summary. Phase two starts only on an explicit go. Between phases, the phase result and any flagged gaps go into the project file, so the next phase can start from a fresh session with no chat history at all. If it cannot, the project file is incomplete, and that is the bug to fix.

## What this replaces

A subagent running for an hour inside a turn, killed at every boundary. Progress messages every few minutes, each one making the session heavier. Results that live only in the conversation and vanish on the next reset. Per-row judgement computed in chat instead of in a checkpointed loop.

## Where this stands

Honest provenance: I built this in early September 2026 and it has carried one real job so far, which is currently paused mid-way through phase one after a fix to how the systemd unit inherits PATH. The pattern is solid. The code is young and welded to my own setup, with a Discord notifier and a structured log it imports from the same repo. I am not publishing the code yet. If it carries a few more jobs end to end, I will strip the local dependencies and put the runner and library out as a standalone repo.

The skill file that tells the agent when and how to use this is short enough to include in full, and it is the part that transfers most directly. Everything above is a longer version of what it says.

---

*Appendix: the skill file as it stands.*

# Batch work

## When this applies

Any job where the work itself would take more than about five minutes of compute, touches
more than a few hundred rows, needs external fetches at scale, or comes in phases that
Carmine wants to approve one at a time. If you are about to spawn `argus` or `tiphys` to
*do* a long job, stop: this is a batch job.

## The one rule

**The agent writes the script; the script does the work; the script runs detached.**
Nothing long runs inside a chat turn or inside a subagent. A turn that ends kills whatever
it was running, and every progress message lands in the session and slows every later reply.

## Procedure

1. **Spec first, in the project file.** Create or update `state/projects/<slug>.md` with
   objective, inputs (absolute paths), output format, phases, and the decisions already
   made. This file is the job's memory; the chat session is not. Keep the slug short,
   lowercase, hyphenated. It names the job folder, the status file and the systemd unit.

2. **Write the job script.** Copy `scripts/batch/jobs/_template/job.py` to
   `scripts/batch/jobs/<slug>/job.py`. One function per phase. Dispatch `argus` for this
   only if the script is genuinely non-trivial, and tell it to write the script, not to run
   the job. Requirements for the script:
   - resumable: `job.load_checkpoint()` at the start of a phase, `job.checkpoint()` every
     few items, so a stop or a crash costs minutes, not hours
   - `job.progress(done, note=..., total=...)` per item (throttled, cheap)
   - deliverables in `job.out_dir` (`data/batch/<slug>/out/`), never in the inbox
   - when a source cannot be fetched or parsed, flag the row and move on; never invent
   - judgement per row goes through `job.map_with_claude(items)` or `ask_claude()`, both
     headless and tool-less, checkpointed per item

3. **Dry run on a slice.** Before launching, run the phase on 5–10 items in the foreground
   with a short timeout (`--limit` flag or a temporary slice) and look at the output. A
   wrong column name discovered after 1,400 fetches is the expensive kind of mistake.

4. **Launch detached.**
   ```
   python3 scripts/batch/runner.py start <slug> --phase 1 -- python3 scripts/batch/jobs/<slug>/job.py --phase 1
   ```
   Tell Carmine what started and the rough size. Start, phase-done and failure land in the
   Discord activity channel, never on Telegram: Telegram is the conversation, Discord is
   where background work is watched. Then end the turn. Do not wait, poll, or sleep in it.

5. **Answer status from the file.** When he asks how it is going:
   ```
   python3 scripts/batch/runner.py status <slug> --log 10
   ```
   One tool call, then a two-line answer with progress, ETA if derivable, and any error.
   Do not read the log in full, do not re-derive counts from the data.

6. **Phase gates.** `job.phase_done(summary)` posts the summary to Discord and the
   process exits. Next phase starts only on his go, with `start <slug> --phase 2`. Between
   phases, write the phase result and any flagged gaps to the project file.

7. **Failures.** `job.fail(msg)` posts to Discord and exits non-zero; a silent death is caught by
   `status` (state `died`, see `run.log`). Fix the script, restart the same phase: the
   checkpoint makes it pick up where it stopped. Never restart from zero without saying so.

8. **Session hygiene.** Each phase begins from a fresh chat session where possible. The
   project file plus `status.json` must be enough to resume the job with no chat history at
   all; if they are not, the project file is incomplete.

## Commands

```
python3 scripts/batch/runner.py list                       # every job, one line each
python3 scripts/batch/runner.py status <slug> [--log N]    # state, progress, error, log tail
python3 scripts/batch/runner.py log <slug> [-n 40]
python3 scripts/batch/runner.py stop <slug>                # keeps checkpoint
systemctl --user status batch-<slug>                       # the raw unit, if needed
```

## What lives where

- `scripts/batch/jobs/<slug>/job.py` — the job, under git
- `data/batch/<slug>/status.json` — what the chat reads
- `data/batch/<slug>/checkpoint.json` — what the job resumes from
- `data/batch/<slug>/run.log` — stdout and stderr of the detached process
- `data/batch/<slug>/out/` — deliverables; send them with `argo-send --file` when asked
- `state/projects/<slug>.md` — objective, decisions, phase results, next action

## Anti-patterns this replaces

- a subagent running for an hour inside a turn, killed at every turn boundary
- "still working on it" messages every few minutes, each one bloating the session
- results that live only in the conversation and are gone after `/new`
- computing per-row judgement in the chat instead of in a checkpointed loop
