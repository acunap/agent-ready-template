# Monorepo with an OpenAPI contract between web and api

The frontend (`apps/web`) and the backend (`apps/api`) live in one repository and share nothing but an OpenAPI definition in `contracts/`. The web client is generated from it and the api validates requests against it, so every API change is explicit in one place and neither app imports the other's code.

## Considered options

- **A shared types package**: less tooling, but couples the code of both apps and their builds.
- **Each side defines its own types**: nothing shared, but front and back drift silently.
