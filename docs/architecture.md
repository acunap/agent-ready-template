# Architecture

This document is binding. Every file, folder, module and dependency follows it from the first line of code, whatever the size of the project. The reasons behind each rule live in [`docs/adr/`](adr/).

Prototype code built with the `prototype` skill is exempt.

## When this document does not cover the case

Stop before writing code and ask the human. Record the answer here, plus an ADR in `docs/adr/` when the decision is hard to reverse, and only then continue. A gap in this document is a question for the human, never a choice for the agent.

## Repository layout

```
apps/
  web/            frontend, Feature-Sliced Design
  api/            backend, hexagonal modules cut into vertical slices
contracts/        OpenAPI: the only thing web and api share
docs/
  architecture.md
  adr/
  agents/
  examples/       reference examples, not production code
```

## Language and naming

- Everything in the repository is written in English: code, file names, docs, ADRs, commit messages.
- This document is language-agnostic. The stack of each app is recorded in an ADR before its first line of code.
- Identifiers, files and folders follow the naming convention of the app's language.
- Slice files, the module file and tests carry their **role** in their name: `request`, `handler`, `endpoint`, `subscriber`, `module`, `test`. The exact form follows the language (for TypeScript: `cancel-order.handler.ts`).
- Code has no comments. Names carry the intent; the reasons go in `docs/`.

## Contracts

- `contracts/` holds the OpenAPI definition of the api. It is the single source of truth for every request and response.
- `web` uses a client generated from it. `api` validates incoming requests against it.
- An API change starts in `contracts/`.

## Backend: `apps/api`

```
apps/api/src/
  main                              composition root: builds shared services and modules, mounts routes and subscribers
  shared/                           technical cross-cutting code only
  modules/
    <module>/
      domain/                       entities, value objects, domain events, domain errors
      ports/
        <port>                      an interface the module needs from the outside world
      features/
        <use-case>/                 one vertical slice per use case
          <use-case>.request        the use case's input, in the slice's own words
          <use-case>.handler        orchestrates the domain through ports
          <use-case>.endpoint       driving adapter: HTTP           (when exposed over HTTP)
          <use-case>.subscriber     driving adapter: event          (when triggered by an event)
          <use-case>.test           slice test
      adapters/
        <technology>/               driven adapters implementing ports, grouped by technology
          <port>                    e.g. adapters/postgres/order-repository
        <database>/migrations/      this module's schema, and only this module's
      <module>.module               composition root and public API of the module
```

### Modules

Modules are created by the human only. This table is the complete list; a use case that fits none of them is a question for the human. Adding a module means adding a row here and an ADR.

| Module | Owns |
| ------ | ---- |
| _none yet_ | |

### Dependency rules

Each role may import only what its row lists. "Own" means the same module; "slice" means the same `features/<use-case>/` folder.

| Role                    | May import                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| `domain/`               | own `domain/`                                                                                  |
| `ports/<port>`          | own `domain/`, `shared/`                                                                       |
| `.request`, `.handler`  | own `domain/`, own `ports/`, own slice, `shared/`                                              |
| `.endpoint`             | own `domain/`, own slice, `shared/`                                                            |
| `.subscriber`           | own slice, `shared/`, another module's `.module` (event contract types only)                   |
| `adapters/`             | own `domain/`, own `ports/`, `shared/`, another module's `.module` (public API)                |
| `.module`               | anything in its own module, `shared/`, another module's `.module`                              |
| `shared/`               | `shared/`                                                                                      |
| `main`                  | `shared/`, every `.module`                                                                     |
| tests                   | what their subject may import                                                                  |

Consequences worth stating on their own:

- A slice never imports another slice.
- Only `.module` references concrete adapters. Handlers receive ports injected.
- Outside a module, only its `.module` exists.

### Use cases

- Every use case is its own slice under `features/`, whatever its size.
- Each module reads and writes its data through one repository port per entity, which loads and saves domain entities.
- **Commands** load entities through the repository, apply domain rules, and save through the same repository.
- **Queries** load entities through the repository and map them, inside the handler, to the view the caller needs. They never save.
- A slice may have no driving adapter when it exists only for other modules; it is reached through the module's public API.

### Public API of a module

- `<module>.module` wires adapters into handlers and returns what the module exposes: routes, subscribers, an API for other modules, and the types of the events it publishes.
- The public API delegates to slices. It holds no logic of its own.

### Communication between modules

- **Asking another module** (synchronous): the caller declares a port in its own words, and an adapter in `adapters/<other-module>-module/` implements it over the other module's public API.
- **Reacting to another module** (asynchronous): the publisher owns its event types and exports them from its `.module`. The consumer's `.subscriber` imports them as types only and translates the event into its own `.request`.
- The graph of dependencies between modules is acyclic. When A calls B, B learns about A only through A's events.

### Data

- Each module owns one database schema. Its tables are read and written only by its own adapters.
- No joins or foreign keys across schemas. Another module's ids are plain references.
- Migrations live inside the module, in `adapters/<database>/migrations/`.

### Transactions

- One transaction per use case, opened by `shared/` around each endpoint and each subscriber.
- Repositories and adapters never open a transaction of their own.
- Events are published to an outbox inside that same transaction.

### Shared code

- `shared/` holds technical cross-cutting code only: configuration, logging, base errors, server start-up, and technical clients such as the database client, the event bus or the clock.
- `shared/` has no business logic and imports no module.

## Frontend: `apps/web`

Feature-Sliced Design.

```
apps/web/src/
  app/          app setup, providers, routing
  pages/        one slice per page
  widgets/      composed blocks reused across pages
  features/     user actions
  entities/     business entities
  shared/       infrastructure with no business knowledge; shared/api holds the generated client
```

- Layer order, top to bottom: `app`, `pages`, `widgets`, `features`, `entities`, `shared`. A layer imports only from layers below it.
- Slices on the same layer never import each other.
- Each slice exposes a public API, and other code imports only through it.
- Segments inside a slice: `ui`, `model`, `api`, `lib`, `config`.
- Only `entities/<entity>/api` uses the generated client in `shared/api`. Features and everything above reach the backend through an entity.

## Testing

- **Domain**: unit tests, no fakes.
- **Use case**: every use case has at least one slice test, driving its handler with fakes of its ports.
- **Adapters**: integration tests against real infrastructure (for example a database in a container).
- **End to end**: a few, over the contract.
- Tests sit next to the code they test.
- Test code lives only in files the language's test tooling treats as test files.
- Each test file defines the fakes it needs, inside the file. Fakes are never shared between test files.

## Enforcement

The first scaffold of each app includes a boundary check in CI that encodes the dependency rules above. The tool is chosen with the app's stack.

## Open decisions

These are not decided. Ask the human before any work that depends on them.

- Stack of each app: language, runtime, framework, database.
- Boundary-check tool.
- Frontend testing strategy.
- Event bus, outbox and inbox implementation.
- Authentication and authorisation.
- Deployment.

## Reference example

[`docs/examples/api/`](examples/api/README.md) is a worked example of the backend rules. Where they disagree, this document wins.

| To see                                    | Look at                                                                                          |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| A command slice                           | `src/modules/orders/features/cancel-order/`                                                      |
| A query mapping entities to a paged view  | `src/modules/orders/features/list-customer-orders/`                                              |
| A slice reached only through the module API | `src/modules/customers/features/check-ordering-eligibility/`                                   |
| A module's composition root               | `src/modules/orders/orders.module.ts`                                                            |
| Asking another module                     | `src/modules/orders/ports/customer-directory.ts`, `src/modules/orders/adapters/customers-module/` |
| Publishing events                         | `src/modules/orders/domain/order-events.ts`, re-exported by `orders.module.ts`                   |
| Reacting to another module's events       | `src/modules/inventory/features/reserve-stock-for-order/`                                        |
| Fakes defined inside a test               | `src/modules/orders/features/cancel-order/cancel-order.test.ts`                                  |
| Migrations                                | `src/modules/orders/adapters/postgres/migrations/`                                               |
