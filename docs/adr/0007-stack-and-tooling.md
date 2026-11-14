# Stack and tooling: `<one line naming the stack>`

This is a skeleton. Fill it in before the first line of code of each app and delete the placeholders: a placeholder left behind is a decision still not made. Delete the rows and entries that do not apply, and never leave an entry as a default — name the choice and the reason it wins.

Every app in `apps/` runs `<language>` on `<runtime>`, backed by `<data store>`; `contracts/` is `<contract format>` and the only thing the two apps share. `<A sentence on why these follow from the architecture and the problem, not from familiarity.>`

| App   | Language | Runtime | Framework | Data |
| ----- | -------- | ------- | --------- | ---- |
| `api` | `<...>`  | `<...>` | `<...>`   | `<...>` |
| `web` | `<...>`  | `<...>` | `<...>`   | `<...>` |

## Tooling

- **Boundary check**: `<tool>` encodes the backend's role-import table and the frontend's layer order in one configuration for the whole repository.
- **Lint**: `<linter>`, with `<rule set>`.
- **Tests**: `<runner>` for domain and slice tests, `<runner>` for end-to-end tests over the contract, and `<real infrastructure>` for adapter tests.
- **Contract client**: `<generator>` turns `contracts/` into the frontend client; CI regenerates it and fails on a diff.
- **Local infrastructure**: `<how a developer runs the data store locally>`.

## Considered options

- **`<Option>`**: `<what it buys, and why it lost>`.
- **`<Option>`**: `<what it buys, and why it lost>`.

## Consequences

- Anything the two apps share must go through `contracts/`; neither imports the other's code.
- `<What is now cheap because of these choices.>`
- `<What is now hard or impossible because of these choices.>`
