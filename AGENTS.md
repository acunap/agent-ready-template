# AGENTS.md

## Architecture

Before creating, moving or renaming any file, folder, module or dependency, read `docs/architecture.md`. It is binding. When it does not cover the case, stop and ask the human, record the answer in it, then write the code.

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
