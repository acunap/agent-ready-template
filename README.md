# agent-ready-template

A starting point for projects built with coding agents, where the architecture is decided up front and written down so agents follow it instead of improvising.

## What's inside

| Path                   | What it is                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| `AGENTS.md`            | Always-loaded agent instructions: read the architecture before touching structure; stop and ask when it does not cover the case |
| `docs/architecture.md` | The binding architecture: repository layout, backend modules (hexagonal, cut into vertical slices), frontend (Feature-Sliced Design), dependency rules, testing |
| `docs/adr/`            | Architecture decision records: the reasons behind each hard-to-reverse decision                |
| `docs/examples/api/`   | A worked backend example: three modules, twelve use cases, cross-module calls and events      |
| `docs/agents/`         | Configuration for the engineering skills: issue tracker, triage labels, domain docs            |

## Using it

1. Create a repository from this template.
2. Choose the stack of each app and record it in an ADR, as `docs/architecture.md` asks.
3. Add the project's first modules to the module table in `docs/architecture.md`.

Run the example's tests (Node 23.6+):

```bash
node --test 'docs/examples/**/*.test.ts'
```
