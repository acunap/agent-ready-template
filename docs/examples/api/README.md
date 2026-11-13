# Reference example: backend modules

A worked example of the backend architecture in [`docs/architecture.md`](../../architecture.md): three modules, twelve use cases, cross-module calls and events.

- The rules live in `docs/architecture.md`. When this example and that document disagree, the document wins.
- It is written in TypeScript only to make the shape concrete. `docs/architecture.md` is language-agnostic.
- Choices visible here but absent from `docs/architecture.md` are illustration, not rules.
- It covers domain and slice tests only. A real module also needs the adapter integration tests and end-to-end tests that `docs/architecture.md` requires; they are left out because the infrastructure here is imagined.

## What is real and what is imagined

`src/modules/` stands for `apps/api/src/modules/`. Everything outside it is imagined and only imported as types, which are erased at runtime:

| Imagined                         | Provides                                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------- |
| `src/shared/database/sql.ts`     | `Sql`: a Postgres client bound to the current use case's transaction                              |
| `src/shared/http/route.ts`       | `HttpRoute`, `HttpRequest`, `HttpResponse`; validates bodies against `contracts/`; one transaction per request |
| `src/shared/events/event-bus.ts` | `EventBus` (outbox, written in the use case's transaction), `EventSubscriber` (deduplicating inbox, one transaction per event) |
| `src/shared/time/clock.ts`       | `Clock`                                                                                           |
| `src/main`                       | Creates `sql`, `clock` and `events`, builds the modules in dependency order, mounts routes and subscribers |

## Modules

```
customers  <── sync API ──  orders  ── events ──>  inventory
             canPlaceOrders          OrderPlaced / OrderCancelled
```

| Module      | Use cases                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------- |
| `customers` | `register-customer`, `block-customer`, `get-customer`, `check-ordering-eligibility` (public API only) |
| `orders`    | `place-order`, `cancel-order`, `get-order`, `list-customer-orders`                           |
| `inventory` | `restock`, `get-stock`, `reserve-stock-for-order` (event), `release-stock-for-order` (event) |

## Run the tests

```bash
node --test 'docs/examples/**/*.test.ts'
```

Requires Node 23.6+ (native TypeScript type stripping).
