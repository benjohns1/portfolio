---
title: 'Commands and Queries with a Message Broker'
date: 2020-11-15T11:13:00.008-08:00
summary: Modern message brokers provide many important benefits to a distributed system...
categories:
  - Blog
  - Software-Architecture
draft: true
---

Modern message brokers provide many important benefits to a distributed system:  

1.  Flexible Routing: support for multiple distribution modes (e.g. fan-out, round-robin, priority queues, etc)
2.  High-Throughput: designed for large scalable infrastructures
3.  Durability: resilient against intermittent network connections and provide message buffering during downstream service outages
4.  Service Decoupling: each system component only needs to know about the location of the broker and can be decoupled from other components
5.  Asynchronous Messaging: decoupling requests from responses frees up services so they don't need to wait for downstream replies  
    

On the other hand, message brokers add complexity and a single point of failure that must be managed, so may not be a great fit for systems that are small or have simple communication models. But those kinds of systems are no fun, are they? Larger systems gain a lot of architectural benefits, and the downsides can bit mitigated via clustering and redundancy, which all modern brokers support in some form.

This post digs into asynchronous messaging flows to consider when using a message broker, and how async messaging can be implemented behind a synchronous API.

Handling Large Data Sets
------------------------

Many applications require processing on larger data sets like media file attachments, data migrations, or batch processing. Modern brokers are optimized for large numbers of small messages rather than the reverse, so it's not efficient to send the entire data set in one message. There are two standard approaches for handling this:

### 1\. Reference Message

Store the data externally and send a message over the broker with a reference to the data.

This approach works well if the entire data set needs to be consumed at once, like a file attachment. The data itself can be retrieved using a more appropriate protocol like FTP or HTTP. For example: a producer stores a file in an AWS S3 bucket, sends a message with the object's URI, and the consumer pulls the file back down from S3 when the message is received.

### 2\. Streaming

Split the data into chunks and stream them over multiple messages.

This approach works well if the client can start processing the data without needing the entire set, like video streaming. This leans more heavily on the message broker, and the consumer needs to know how to reassemble the chunks.

Commands and Queries
--------------------

Even without using formal CQRS, it's still helpful to separate the concept of a command vs query message. Requests could come from any agent, be it an automated system or a user of a web app. Requests that modify the state of the system are _commands_; requests that retrieve data without modifying the system are _queries_. In event-driven systems, an _event_ message type may be used to notify subscribers that a command has modified the state of the system. If any of these messages require a large amount of data to be sent over the wire, one of the approaches in the previous section should be used to keep payloads small and streamlined.

Async Flows
-----------

These messaging flows do not describe the various routing mechanisms that are possible with a message broker and only focus on the request and response flows.

To relate the terms in this section to a client-server setup, the _producer_ is the client sending requests, while the _consumer_ is the server receiving requests and responding.

### Queries

Queries are fairly straightforward, and there is really only one async flow, but consideration should be taken if the amount of data being returned is large (as described previously).

1.  Producer listens on a reply-to channel
2.  Producer sends query and includes a reference the reply-to channel
3.  Consumer processes query and sends query data back on the reply channel
4.  Producer receives data from the reply channel

### Commands

Commands should not require synchronous replies, if possible. The success or failure result of the command should be handled asynchronously via one of the variants below. There are pragmatic approaches, however, to allow interoperability with synchronous web standards that return a success or failure result; these are discussed in the next section.

#### No Reply

This fire-and-forget approach only works if the producer does not care whether the command succeeded or failed.

1.  Producer sends command
2.  Consumer processes command, no reply necessary

#### Poll for Result

The producer must poll for a reply via a subsequent query, in this approach.

1.  Producer generates a unique ID for the command
2.  Producer sends command
3.  Consumer processes command, no reply necessary
4.  Producer polls via a query using the unique command ID

#### Reply via Events

Even if you're using an event-driven system, I don't recommend this approach, as it requires emitting an event on command success _and_ on failure, which can clutter up the event streams. But in situations where a failed command truly represents a meaningful domain event, it could be useful.

1.  Producer listens for events
2.  Producer sends command
3.  Consumer processes command and publishes event

#### With Reply-To

This, in my opinion, is the cleanest approach to handling commands if the producer architecture supports listening. It also mirrors the asynchronous query flow.

1.  Producer listens on a reply-to channel
2.  Producer sends command and includes a reference to the reply channel
3.  Consumer processes command and sends reply upon completion
4.  Producer receives reply

Web Frontend Flows
------------------

The async flows described are all fine-and-dandy if the entire stack you are working with is setup for asynchronous messaging. But of course, we all have to make pragmatic concessions for the real world. As with any important architectural decision, the answer to which flow we should adopt is "it depends". For instance: we may have a fully asynchronous, distributed backend system that needs to support a synchronous HTTP 1.1 web API, or perhaps our legacy backend system has a web frontend that makes use of GraphQL subscriptions over web sockets. The following flows build upon the asynchronous flows and describe how they can be adapted to support a variety of common real-world communication patterns.

### HTTP Proxy API Flows

These flows are useful to support a synchronous REST or GraphQL API, where the web clients do not listen for push messages.

#### API with HTTP Proxy Flows

Using an HTTP proxy layer insulates services from HTTP 1.1 so they can communicate solely with async messaging protocols, and it frees the frontend up to communicate via common synchronous web protocols like REST.

##### Synchronous Command or Query

Use a reverse proxy layer that waits for asynchronous replies:

1.  Web client makes API request
2.  Proxy sends an async command or query
3.  Proxy blocks and returns response from async command or query when it is returned via a separate asynchronous channel

##### Asynchronous Command

Use a reverse proxy layer that simply converts to/from the message protocol for commands. The client is then responsible for asynchronously retrieving the command results:

1.  Web client makes API request
2.  Proxy sends async command with no reply expected
3.  Proxy immediately returns a 202 Accepted
4.  Web client polls for result using a Sync Query

### Direct API Flows

One option is to simply not use a message broker at all; the services themselves process a synchronous requests. This approach requires a load balancer for scaling.

1.  Web client makes API request
2.  API sends synchronous command or query directly to service
3.  Service processes command or query and synchronously replies

### Hybrid Flows

This hybrid approach uses both direct and proxy flows, and can work well with CQRS. The main benefit of this approach is to lighten the load on the message broker since it is only used for commands.

*   Command: use one of the HTTP Proxy API flows
*   Query: use the synchronous Direct API flow

### Web Socket Flows

If you're building a realtime web app whose users have highly available network connections and maintaining web socket connections is an option, this approach brings the full advantage of asynchronous messaging all the way to the web client.

*   Backend routes bi-directional messages (via load balancer or routing layer that converts between web socket and internal messaging protocols)
*   Frontend subscribes to queries that the backend will push to the client in realtime
