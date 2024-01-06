---
title: 'Clean Architecture and SOLID Cheat Sheets'
date: 2020-11-01T09:39:00.004-08:00
summary: Printable cheat sheets to help remember some of Uncle Bob's valuable contributions to the industry
categories:
  - Blog
  - Software-Architecture
draft: true
---

> Good architectures allow major architectural decisions to be deferred. The job of an architect is not to make decisions, the job of an architect is to defer decisions as long as possible to allow the program to be built in the absence of decisions, so that decisions can be made later with the most possible information.

_— Robert C Martin, [The Principles of Clean Architecture, Norwich UK, 2015](https://www.youtube.com/watch?v=o_TH-Y78tt4)_

Sources from Uncle Bob
----------------------

*   Book: [Clean Architecture: A Craftsman's Guide to Software Structure and Design](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
*   Blog: [The Clean Architecture, 13 August 2012](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
*   Talk: [The Principles of Clean Architecture by Uncle Bob Martin, Norwich UK, 2015](https://www.youtube.com/watch?v=o_TH-Y78tt4)

SOLID Design Principles
-----------------------

#### SRP: Single Responsibility Principle

Does _not_ necessarily mean that a module should do just one thing, but that a module should have only one reason to change.

#### OCP: Open-Closed Principle

A module's behavior can be modified without modifying the core code; class inheritance and composition. For example: to swap out a DB implementation, the business logic should not need to be modified.

#### LSP: Liskov Substitution Principle

Concrete implementations must adhere to the expected interface contracts.

#### ISP: Interface Segregation Principle

Keep interfaces small!

#### DIP: Dependency Inversion Principle

*   Interface abstractions are more stable (change less frequently) than concrete implementations
*   Use the factory pattern to keep concrete implementations out of business logic
*   Use a small number of concrete "main" components, where all DIP violations are gathered

Architecture
------------

> The goal of software architecture is to minimize the human resources required to build and maintain the required system.

_— Robert C Martin, [Clean Architecture: A Craftsman's Guide to Software Structure and Design](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)_

Two words "soft" and "ware" mean an easily changeable product.

The "policy" (i.e. business logic) is essential; the "details" (e.g. I/O, frameworks, protocols, etc) are irrelevant to it.

Defer architectural decisions as long as you can, so you have the most information possible. For example, wait to choose a DB technology and web framework until the core business app is built.

> A good architecture maximizes the number of decisions _not_ made. And you achieve that by using a plugin model.

_— Robert C Martin, [The Principles of Clean Architecture, Norwich UK, 2015](https://www.youtube.com/watch?v=o_TH-Y78tt4)_

### Dependency Inversion

*   UI, frameworks, persistence/database, etc _depend_ on the business logic (not the other way around).
*   Only inject some strategies and factories, keep it limited.
*   Do _not_ inject your business logic directly into the app. Instead, inject into a plugin abstraction, then the plugin distributes objects. This is so business logic and its tests do not need to know about injection framework.
*   Do _not_ couple your app to the framework, keep it at arms length.

![](/images/posts/2019-01-26%20Clean%20Architecture%20Diagram.png)

### Business Logic at a Glance: Source Code Structure

Someone new looking at the code should primarily see the _business logic_; the technical implementation details should be hidden away.

*   Primary focus of structure should be to describe the business domain
*   Implementation details should be low-level and should take a back-seat to domain logic in source code

Printable Cheat Sheets
----------------------

### SOLID Design Principles

<div className="max-w-80">[![](/images/posts/2020-11-01%20SOLID%20Design%20Principles%20Cheat%20Sheet.png)](/images/posts/2020-11-01%20SOLID%20Design%20Principles%20Cheat%20Sheet.png)</div>

### Clean Architecture Black & White

<div className="max-w-80">[![](/images/posts/2019-01-26%20Clean%20Architecture%20Cheatsheet%20B%20and%20W.png)](/images/posts/2019-01-26%20Clean%20Architecture%20Cheatsheet%20B%20and%20W.png)</div>

### Clean Architecture Diagram

<div className="max-w-80 bg-white rounded-lg">[![](/images/posts/2019-01-26%20Clean%20Architecture%20Diagram.png)](/images/posts/2019-01-26%20Clean%20Architecture%20Diagram.png)</div>

### Clean Architecture Diagram with Text

<div className="max-w-96 bg-white rounded-lg">[![](/images/posts/2019-01-26%20Clean%20Architecture%20Diagram%20with%20Text.png)](/images/posts/2019-01-26%20Clean%20Architecture%20Diagram%20with%20Text.png)</div>
