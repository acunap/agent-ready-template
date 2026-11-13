# Each module owns its data

Each module owns one database schema, written and read only by its own adapters, with its migrations inside the module. There are no joins or foreign keys across schemas, and other modules' ids are plain references. This gives up database-level referential integrity between modules in exchange for modules that can change their storage, or move it out, without touching anyone else.
