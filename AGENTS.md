# AGENTS.md

## Architecture

Before creating, moving or renaming any file, folder, module or dependency, read `docs/architecture.md`. It is binding. When it does not cover the case, stop and ask the human, record the answer in it, then write the code.

## Git

- **One commit per ticket.** A ticket's work, including everything a code review or a later adjustment changes about it, lands in a single commit: amend it (`git commit --amend`). Never stack a follow-up commit ("fix review findings") on top of it.
- **Amend unpublished work only.** While a branch is local, amend freely. Once it is pushed or a PR is open, feedback arrives as new commits; rewriting shared history is the human's call (`git push --force-with-lease`), never the agent's.
- **A commit for something else is a different commit.** Work that belongs to another ticket, or that the human asked for explicitly as a follow-up, gets its own commit and its own ticket reference.

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
