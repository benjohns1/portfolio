---
title: 'Orchestrate or Choreograph?'
date: 2021-01-16T14:42:00.000-08:00
summary: When is it appropriate to use centralized orchestration versus event-driven choreography?
categories:
  - Blog
  - Software-Architecture
draft: true
---

When building a distributed system it's important to consider how to handle business flows that span across multiple aggregates or services. Firstly, we should try to simplify the flow so that a single user action only modifies one aggregate at a time. But sometimes that is not possible so we must decide how to coordinate our components.

_Orchestration_ is when a central controller manages the interactions between services; it explicitly models business logic in one place. In microservice terminology, this is called the _Saga_ pattern.

_Choreography_ is when services communicate by emitting and listening to events; it fully decouples communication.

Both of these approaches are useful in different situations. At the end of this post I boil this "it depends" down to a simple rule of thumb. I use terminology in the examples from domain-driven design and microservice architectures, but this is also relevant for monolithic systems.

For the examples below, imagine we're designing a travel booking system that allows end-users to book a trip across multiple travel services, such as airlines, hotels, rental car agencies, etc.

Cross-Context Example
---------------------

We need to communicate between two subdomains that have different business responsibilities, each managed by separate engineering teams. The subdomains are implemented as bounded contexts:

1.  **Booking** allows an end-user to book services with external providers.
2.  **CRM** allows external providers to manage their end-user customer base and communications.

In Booking, the end-user creates an account with a basic email. CRM eventually needs to know about that user account and create a profile, so that our providers can track their communication history and preferences.

### Orchestration

The Booking context, acting as an orchestrator, sends a direct command to CRM to create a new user profile.

_Pros:_

*   Booking's code explicitly shows each context with which it is communicating.

_Cons:_

*   Booking directly depends on CRM's command structure.
*   If another system wants to know about booking accounts, Booking must also be updated.
*   Booking's responsibility bleeds into needing to directly communicate with other contexts.

### Choreography

Using choreography, on the other hand, Booking emits a User Account Created event, then the CRM listens to the event and creates a new user profile.

_Pros:_

*   Booking has no need to know that CRM is listening.
*   If another system wants to know about booking user accounts, they simply need to listen to the event.
*   Booking's responsibility is solely focused on booking travel, and not communicating with other contexts.

_Cons:_

*   It takes more work to determine who is reacting to the events.
*   CRM needs to keep track of which events it has processed, and ensure it doesn't miss any.

### Winner for Cross-Context Communication?

**Choreography!**

*   Decoupling across bounded contexts is extremely important.
*   Specific business flows shouldn't span across multiple contexts (if they do, then the boundaries should be re-thought).
*   If CRM needs to create user profiles based on other events from other contexts, it is the CRM's responsibility to know about that and listen for them.

In-Context Example
------------------

Within the Booking bounded context, there are multiple services: Reservation, Provider, and Payment.

A user completes a reservation for multiple travel services then enters payment details. When the user confirms, the travel reservation is confirmed for each external service provider, then the payment is processed.

### Orchestration

The Reservation service, acting as an orchestrator, sends a direct command to the Provder service (which communicates to the external travel providers), and if all succeed, sends a direct command to the Payment service.

_Pros:_

*   The Reservation service code clearly shows the order in which the business logic is executed.

_Cons:_

*   The Reservation service directly depends on the Provider and Payment services' command structures.
*   When another provider or service needs to needs to be added to the reservation flow, the Reservation service must be updated.
*   The Reservation service responsibility includes communicating with the Provider and Payment services.
*   The Reservation service must handle compensating actions if a failure occurs anywhere in the flow.

### Choreography

Using choreography:

1.  The Reservation service emits a Reservation Created event.
2.  The Provider service handles this event and communicates with the external service providers.
3.  The Payment service handles this event and processes payment.
4.  Upon failure, compensating events must be emitted and handled where appropriate.

_Pros:_

*   The Reservation service doesn't need to know about the other services.
*   If another system wants to know about reservations, they just need to listen to the events.
*   Reservation's responsibility is solely focused on creating reservations in our system, and not coordinating with other services.

_Cons:_

*   It is hard to follow the basic business logic that a reservation entry results in a provider reservation and a processed payment.
*   To view the current state of the end-user's reservation and payment, one must directly query the Provider and Payment services, or listen to a large number of events, including compensations events if a failure occurred.

### Winner for In-Context Communication?

**Orchestration!**

*   The business logic is very clear and in one place; the Reservation service orchestrates it.
*   Even though there is direct service-to-service communication, it does _not_ need to be synchronous. We can still use decoupled asynchronous communication practices.
*   Minimal coupling within a bounded context is okay, because business logic sometimes must flow across multiple services.
*   Events could _still_ be emitted by each service when something happens, in case external contexts need to know.

Choosing an Approach
--------------------

The entire business logic flow is modeled explicitly in a single place with orchestration, whereas it emerges from the interaction between components with orchestration.

**Rule of Thumb:** _Use orchestration within a single bounded context to model a single business flow; use choreography to communicate across bounded contexts._

If you encounter business flows that span across multiple bounded contexts, making it difficult to use choreography, it might be an indicator to reconsider your domain boundaries.

References
----------

Directly relevant:

*   [Choreography vs Orchestration in the land of serverless by Yan Cui](https://theburningmonk.com/2020/08/choreography-vs-orchestration-in-the-land-of-serverless)
*   [GOTO 2020 - Automating Processes in Modern Architectures by Bernd Ruecker](https://www.youtube.com/watch?v=IBfuKA9Nc3M)

Where to capture orchestration logic:

*   [Domain vs Application Logic by Ben Johns](https://blog.bennyjohns.com/2020/12/domain-vs-application-logic.html)
*   [Services in Domain-Driven Design (DDD) by Lev Gorodinski](http://gorodinski.com/blog/2012/04/14/services-in-domain-driven-design-ddd/)
*   [What is domain logic? by Vladimir Khorikov](https://enterprisecraftsmanship.com/posts/what-is-domain-logic/)
