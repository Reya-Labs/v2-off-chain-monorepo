## Pub/Sub

Pub/sub is a fully-managed real-time messaging service that allows sending and receiving messages
between independent applications. Once an event is successfully published as a message, it becomes the job
of the service to ensure that all the systems that need to react to this event get it. The idea behind async
integrations is to react to events represented as messages.
Messages can be received either by a push or a pull.

Pub/sub supports a Publisher-subscriber model:

- a publisher application creates and sends messages to a topic which is a named resource
- the messages are stored until acknowledged by all subscribers
- to receive these messages a subscriber application creates a subscription to a topic
- the subscriber receives the message by either cloud pub/sub pushing them to the subscribers chosen endpoint
- or by subscriber pulling them from the service

When a message is acknowledged by a subscriber, it is removed from the subscription backlog and not delivered again.
Communication can be: one to many (fan out), many to one (fan in) and many to many.

Publishers can be any application that can make http request to googleapis.com (e.g. app engine app, compute engine,
web-service or a browser). Pull subscribers can be any application that can make https requests to googleapis.com; push
subscribers must be webhook endpoints that can accept POST requests over https.

Key use-cases of pub/sub: streaming analytics or ingestion of data into ananlytical systems.
It is also great for implementing async workflows.

# Yarn

When you need to add dependencies to a specific package,
navigate to the package directory and use the yarn add command, e.g.,

```
cd packages/api
yarn add express
```

Yarn will manage the dependencies for each package separately while still allowing you to share common dependencies
across the monorepo.

# Prettier

https://prettier.io/docs/en/options.html