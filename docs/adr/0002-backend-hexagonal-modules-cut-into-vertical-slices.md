# Backend: hexagonal modules cut into vertical slices

Each backend module is hexagonal (a pure domain, ports, and adapters grouped by technology) and its use cases are cut into vertical slices, one folder per use case. Hexagonal keeps the domain isolated from infrastructure; slices keep each use case's code together and independent of the others. The shape applies from the first use case, however small, so every module looks the same and none has to be restructured as it grows.

## Considered options

- **Fully self-contained slices**, each with its own domain and adapters: rejected because it duplicates the domain and loses a shared model.
- **Classic layers** (controllers, services, repositories): rejected because a use case ends up spread across the whole tree.
