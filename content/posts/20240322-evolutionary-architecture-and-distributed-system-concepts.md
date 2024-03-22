---
title: 'Evolutionary Architecture and Distributed System Concepts'
date: 2024-03-22T16:16:00.000-06:00
image_sm: /images/posts/evolutionary-architecture-distributed-system.png
image_size: 95%
image_bg_color: "#EA686B"
summary: The essential design concepts I use when developing an evolvable, distributed system.
categories:
  - Blog
  - Software-Architecture
  - Continuous-Delivery
draft: false
---

In recent years, I've developed distributed systems using domain-driven design, event storming, continuous delivery, and test-first development practices. In my experience, systems designed using these techniques are more likely to provide real value to customers, are easier to maintain, and are more fun to work on! There's no panacea against accidental complexity, though, and it takes experience, skill, and a solid team to create a successful system. In this post, I articulate some of the lessons I've learned and the design concepts I've found to be essential when building evolvable, distributed systems. Upcoming posts in this series will dig deeper into tactical patterns and specific component architecture concepts.

## Don't Build a Distributed System
First-and-foremost, do not distribute across a network if you do not need to! This advice is repeated over-and-over by those that went through failed microservice transformations or startups that attempted to begin with a microservice architecture. As software engineers, one of our primary goals is to reduce unnecessary complexity. Distributing pieces of your system across a network increase complexity, so don't do it without a good reason. One such good reason is: a *tangible* need to scale because specific bottlenecks are or will be preventing the system from providing real value. An example of a bad reason is: we're going to capture so much market share after launch that we need to be able to scale everything right off-the-bat!

Hint: You can still design a well-architected modular system without incurring the costs of distributed messaging up-front.

### MVPs
If you're building an MVP and have yet to prove product-market fit, don't build a distributed platform. Build the MVP well enough to onboard a small batch of initial customers and focus on delighting them. Once you've proven the product is valuable, then evolve your architecture towards the scalability and growth requirements. That said, there may be very good reasons to distribute some parts of your MVP if it is necessary to prove market fit (e.g. scalability, reliability, compliance, geography, isolating 3rd party integrations, etc.), but the goal should be to keep it as simple as possible while still viable. I think of an MVP as an experiment to prove the product solution against the current market forces, and you need to uncover the results as soon as possible to avoid waste. There are a couple approaches to building an MVP that I've seen work well.

One approach is to build the MVP as quickly and cheaply as possible while ignoring architectural quality. This really only works if the app you are building is simple enough because, as we all know, development will inevitably slow down over time with poor architecture. But this can work well if you expect to prove market fit quickly. I've seen this frequently when an entrepreneur wants to try out an idea and outsources development to a contracting firm to build the MVP. The key with this approach is that after you've proven the product's viability, you'll likely need to invest in a major architectural overhaul with an in-house development team that designs it with quality in mind at an appropriate level of scalability. This transition can be extremely difficult because just as the product is gaining traction, you are spending resources on rebuilding instead of providing additional user value.

Another approach is to build the MVP quickly, but with architectural quality in mind from the start using an in-house development team. This may require more initial investment, but provides a more stable product, smoother delivery cadence, and a healthier team in the long run. An experienced product and engineering team will help reduce risk as long as they are laser-focused on early engagement and rapid feedback with initial customers throughout MVP development. The system design concepts I describe here can be applied to an MVP built in this way and will help pave the way for a maintainable, scalable, and evolvable architecture.

## Modularize First, Then Distribute
Whether you're building an MVP or redesigning components of an existing system, if you create modular components with single responsibilities in your system, you do not need to separate those components across the network initially. Each component should have high cohesion within itself and low coupling to other modules with a clean interface boundary. It is cheaper and easier to modify the boundaries between components that are not distributed. Over time these boundaries should stabilize; then, when the need arises an individual component can be extracted into its own service. If designed well, the business logic should not need to change at all and the application logic should only need minor changes. The infrastructure should be the only aspect that needs significant rework. This ensures we're only adding complexity when it is needed.

Identifying the most useful component boundaries is hard and depends on many factors. Expect those boundaries to change over time as the team gains experience through experimentation.
## Design Concepts
Below are some of the most important design concepts I use when creating a modular system. Open and consistent communication with stakeholders is necessary to build a clear understanding of the business domain, which is essential. Markets change over time, so the problems the system addresses should be refined over time. And the solution will change over time as everyone involved learns new things. So we must embrace these changes and expect the system boundaries and models to evolve. Continually practicing techniques like event storming or event modeling throughout a product's lifecycle can help normalize and capture these changes.
### Clean Architecture
Robert Martin (Uncle Bob) coined clean architecture from aspects of hexagonal and onion architecture. It is the idea that our code should be organized in layers with the dependencies pointing in one direction: towards the business logic in the center. This approach builds on the SOLID design principles. If you're unfamiliar, see [Clean Architecture and SOLID Cheat Sheets](https://www.bennyjohns.com/posts/20201101-clean-architecture-and-solid-cheat-sheets)  for a quick overview and visualization.

Our core business logic (i.e. domain logic) at the center describes the valuable purpose of the component, boiled down into clear and concise language with minimal dependencies. The application logic is the next layer out from the center that wires the entire application together and should only directly depend on the core business logic. The outer infrastructure layer includes all additional concerns around state management, persistence, communication, and presentation. This outer layer tends to be where most engineering time is spent, even though the real business value is encoded in the business logic. I use this style of architecture within individual services to clearly separate the business logic from all the necessary complexity to make it run.

### Ubiquitous Language
Ubiquitous language is a fancy domain-driven design (DDD) term that simply means everyone should agree on the language used to describe the business logic, and that language should be used everywhere, including in code. As software engineers, we should name our variables, classes, functions, services, database tables, etc. using the same language that our product team members, customers, and business leaders use. We should also strive to design our data models to reflect the real-world concepts. This significantly reduces misunderstandings, helps avoid over-abstraction, speeds up new team member onboarding, and increases code maintainability. This means we need to communicate with others and decide on the proper terminology and definitions, which is part of our job as software engineers!

### Bounded Contexts
A bounded context is another DDD term that describes where the boundary is drawn around a domain concept. Within a single bounded context, the same ubiquitous language and the same domain models should be used. Separate bounded contexts may (and likely should) use a different ubiquitous language and domain model. Bounded contexts define important boundaries in a system. They provide clarity of the solution and allow separate teams to work in parallel with others with minimal dependencies. For example, you might have separate Storefront, Payment, and Shipping bounded contexts for an online store.

### Aggregates
Another important DDD concept is the aggregate, which is fundamentally a collection of entities that represent part of the domain model. An aggregate can be stored, modified, and passed around according to the business rules. What's most important about an aggregate, however, is the concept that it defines a transactional boundary. Each change to an aggregate should be an atomic transaction. This also means that any business rule that requires consistency must only operate on a single aggregate. This may initially sound trivial, but it is the grounding concept that allows a distributed system to manage state reliably and consistently.

If a new business rule requires data from multiple aggregates to make a decision, there are a few options to discuss with the stakeholders:
1. If the rule is simply nice-to-have, you can make best efforts to follow it, but allow it to be violated occasionally. For example, I've taken this approach when asserting a unique name across a user's list of items. If uniqueness is only a convenience to avoid confusing one item with another and the user can simply rename an item later if there's a collision, you can simply make a best effort to enforce uniqueness when the name is applied. It's okay if a duplicate name sneaks in due to two items being created at the same time, for instance, as long as the UX tradeoff is acceptable.
2. If the rule is an invariant (i.e. requires strict consistency), you can rework your domain model to increase the size of the aggregate to include everything the rule needs. An invariant rule is one that the system must enforce at all times; violations would result in the system being inconsistent.
3. If the rule can be eventually consistent, you can define a compensating process to fix a violation. An eventually consistent rule may be violated temporarily, but will eventually be fixed.

The first "nice-to-have" option is the simplest, but comes with a UX tradeoff. If that's not possible, strive for the second "invariant" option, as long as the new model doesn't make the aggregate too large and the rework effort is not prohibitive. The third "compensating process" option can add significant complexity so should be minimized, but is usually unavoidable in complex domains. If you need to use the third option, these approaches are listed in order of increasing complexity:
1. Define a manual process to compensate for the inconsistency. This requires some sensing mechanism to determine when the rule has been violated and a documented process for fixing it. This can work if the violation only occurs occasionally and may be a good place to start, but adds busy work so should be automated when possible.
2. Write automated compensation logic. Automate the manual process in the previous approach. This works if the compensating logic is fairly simple and can be run on a schedule.
3. Implement the saga pattern in a process manager. This works well if the business rule describes a long-running process with multiple steps involved. This requires each step in the process to have a compensating action that reverses the step, to allow rolling back if any subsequent step fails. If compensating actions continue to fail, there also should be a manual escalation process.

### Commands, Queries, and Events
All messages between modules should be explicitly categorized as a command, query, or an event. This simplifies reasoning about distributed communication patterns, allows for a much clearer understanding of how messages are processed, and enables some basic guarantees around idempotency and state changes.

A command is a message that requests a component to change the state of an aggregate in some way. A query is a message that requests data from a component without changing its state. An event is an asynchronous message to subscribers indicating something happened in the system (e.g. an aggregate's state changed or a failure condition was triggered). Events are powerful tools in evolutionary architectures but there's a lot of nuance around their usage that I will discuss in upcoming posts.

Commands and queries may be synchronous or asynchronous. Events are, by definition, asynchronous. For high throughput and scalability, asynchronous messaging is desirable, but there's additional complexity involved in handling concurrent processing and failures. This complexity can be mitigated with robust messaging libraries and knowledge sharing. Synchronous messaging with request/response style communication is simple and can be a great choice for many situations, but it will eventually result in idle resources and unnecessary bottlenecks so should be avoided if high throughput is necessary.

### Team-First Architecture
If you're building a large system, use the Inverse Conway Maneuver to first organize your teams along the desired architectural boundaries. Team Topologies by Matthew Skelton and Manuel Pais describes how to structure your organization with four team types and their interactions. Most of your cross-functional teams should be focused on delivering user value directly by becoming experts in one or more domains, solving problems within their bounded contexts, and reacting to user feedback. These teams are **stream-aligned**. Three additional team types help stream-aligned teams by: providing a stable **platform** for the other teams to leverage, **enabling** other teams through knowledge transfer, and offloading cognitive load by owning a specific **complicated subsystem** leveraged by other teams.

### Think Experimentally
Over time, I've learned to see the software delivery process as a series of experiments. Every change to a production system can be thought of as a small experiment using the scientific method, for example:
1. **Observe** the current system and market landscape to identify an opportunity.
2. **Hypothesize** that a particular feature will leverage the opportunity.
3. **Predict** that customers will use the new feature.
4. **Experiment** by implementing and releasing it to your users.
5. Capture user feedback and metric **results** as input for further experimentation.

This leans in to modern continuous delivery practices and requires working iteratively (running one small experiment at a time), incrementally (by creating small, cohesive components that can be worked on in isolation from the entire system), and relentlessly seeking feedback (through metrics and user collaboration). Dave Farley's book Modern Software Engineering covers this approach along with other excellent software engineering concepts.

## Reading and Next Steps
The following books were formative to my approach designing systems:
- [Team Topologies](https://teamtopologies.com/)
- [Building Evolutionary Architectures | Thoughtworks](https://www.thoughtworks.com/insights/books/building-evolutionary-architectures)
- [Modern Software Engineering: Doing What Works to Build Better Software Faster: Farley, David](https://www.amazon.co.uk/gp/product/0137314914)
- [Implementing Domain-Driven Design 1, Vaughn, Vernon](https://www.amazon.com/Implementing-Domain-Driven-Design-Vaughn-Vernon-ebook-dp-B00BCLEBN8/dp/B00BCLEBN8)
- [Domain-Driven Design: Tackling Complexity in the Heart of Software: Eric, Evans](https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software-ebook/dp/B00794TAUG)
- [Clean Architecture: A Craftsman's Guide to Software Structure and Design: Martin, Robert](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)

Stay tuned for upcoming posts in this series where I describe essential tactical patterns and component architecture concepts for building evolvable, distributed systems.
