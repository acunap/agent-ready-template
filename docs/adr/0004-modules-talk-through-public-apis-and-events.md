# Modules talk through public APIs and events, in an acyclic graph

A module reaches another only through its `.module` file: synchronously through a port in the caller's own words, implemented by an adapter over the other module's public API, or asynchronously through events whose types the publisher owns. The module graph must be acyclic, so a module that is called learns about its caller only through the caller's events. This keeps every module replaceable and prevents modules from becoming entangled.
