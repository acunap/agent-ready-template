# Frontend: Feature-Sliced Design

The frontend follows Feature-Sliced Design because its layers and import rules give every piece of UI exactly one place to live, and those rules can be checked in CI. The generated API client is reached only through entities, so a contract change touches one place per entity.

## Considered options

- **Folders by feature** without layer rules: rejected because placement rules stay implicit.
- **Folders by technical type** (`components/`, `hooks/`, `services/`): rejected because a feature is spread across the tree.
