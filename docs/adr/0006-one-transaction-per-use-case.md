# One transaction per use case

The transaction is opened by `shared/` around each endpoint and subscriber, never by repositories or adapters, and events go to an outbox inside it. A handler that reads, applies domain rules and writes is then atomic, row locks taken while reading hold until the write, and saving and publishing either both happen or neither does.
