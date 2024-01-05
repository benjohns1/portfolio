---
title: 'Domain vs Application Logic'
date: 2020-12-06T12:05:00.000-08:00
summary: When defining a business problem and planning its solution, keep the two conversations separate...
categories:
  - Blog
  - Software-Architecture
draft: true
---

Domain vs Application Logic in Domain-Driven Design
===================================================

Problem vs Solution Space
-------------------------

When defining a business problem and planning its solution, keep the two conversations separate so that the problem is understood in as much detail as possible first. Business logic is part of the _Solution Space_ so should be discussed only after thoroughly understanding the problem.

*   The _Problem Space_ identifies the purpose, the "why".
*   The _Solution Space_ is the "how".

Common DDD terminology falls into each category:

#### Problem Space
- Domain
- Problem Domain
- Core Domain
- Subdomain

#### Solution Space
- Business Logic
- Business Rules
- Domain Logic
- Bounded Context


The terms Domain, Problem Domain, Core Domain are synonymous, as are Business Logic, Business Rules, and Domain Logic; these terms are used interchangeably.

After understanding the problem space, we can dig in to the rules that solve the business problem and encode this domain knowledge in explicit logic.

This _Business Logic_ solves the problem at hand but does _not_ address implementation details such as database technology, API definitions, web frameworks, etc. Our business logic should encode what rules are needed to solve the problem with language everyone can understand.

Keep Things Simple
------------------

### Business Logic

Business logic should be created in collaboration with business experts. Our _primary purpose_ as software engineers is to convert that logic into an implementation that can be executed.

So, let's **keep things simple** and separate our domain model from the application details. If we capture the business logic in an isolated area of our code, write the code using terms anyone can understand from the problem domain, and keep all application details out of this area, it is much easier to understand the purpose of the solution and update the business rules when needed.

How do we know what the domain logic is? Ask whether the code makes decisions that have business meaning. Any _business-critical_ decision should be done in the domain logic; everything else is wiring.

### Application Logic

This wiring code is the _Application Logic_. This layer sadly represents the bulk of complexity and effort in many systems, despite the fact that it is simply _necessary_ and has minimal impact on your business's competitive edge: a topic for another day.

The application logic orchestrates executing the business logic and all of the infrastructure details like persistence, UI, external system communication, etc. The application layer hosts an environment for executing domain logic; it collects and transforms external input into forms that the business logic uses to make decisions.

Usually the application layer communicates using primitive data types and converts them into domain-specific data types for clarity.

Application Architecture
------------------------

In order for the application layer to do its job of _orchestration_, it is helpful to further separate implementation details of specific technologies into adapters. Uncle Bob's Clean Architecture is a wonderful approach to this.

### Infrastructure

Infrastructure adapter implementations could include management of the following application concerns, for example:

*   Data persistence (e.g. in-memory, MySQL, file system, DynamoDB)
*   User notifications (e.g. email, SMS)
*   Web API (e.g. REST, GraphQL, web socket)
*   UI frameworks

### Dependency Inversion

Each infrastructure adapter can implement an interface that is defined in the application layer. During startup the implementation can be instantiated and dependency injected into the application layer. This isolates the application layer from infrastructure changes, which has the massive benefit of allowing an effort like swapping a database technology to not require a full application rewrite; only the infrastructure adapter needs to be re-implemented against the same interface.

This leads to a dependency flow where the detailed infrastructure implementations depend on the application layer, and the application layer depends on the domain logic. Our domain logic is kept pristine without any external dependencies.

*   Infrastructure Adapter (e.g. DB, REST API, external service communication) depends on ->
*   Application Logic (orchestrates the flow of requests and executes business logic) depends on ->
*   Business Logic (makes business-critical decisions) depends on nothing

References
----------

*   [Implementing Domain-Driven Design](https://www.amazon.com/Implementing-Domain-Driven-Design-Vaughn-Vernon-ebook-dp-B00BCLEBN8/dp/B00BCLEBN8) Vaughn Vernon
*   [Domain Driven Design Distilled](https://www.amazon.com/Domain-Driven-Design-Distilled-Vaughn-Vernon/dp/0134434420) by Vaughn Vernon
*   [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) by Robert C. Martin 2012-08-13
*   [What is domain logic?](https://enterprisecraftsmanship.com/posts/what-is-domain-logic/) by Vladimir Khorikov 2016-08-25
*   [Services in Domain-Driven Design](http://gorodinski.com/blog/2012/04/14/services-in-domain-driven-design-ddd/) by Lev Gorodinski 2012-04-14
*   [Application layer vs domain layer?](https://softwareengineering.stackexchange.com/questions/140999/application-layer-vs-domain-layer)
*   [What is the difference between business and application logic?](https://softwareengineering.stackexchange.com/questions/293885/what-is-the-difference-between-business-and-application-logic)
