---
title: 'System Design Principles'
date: 2019-03-31T10:25:00.001-07:00
image: /images/posts/johann-siemens-591-unsplash.jpg
summary: After years of consulting, I find myself continually coming back to three basic principles of system design...
categories:
  - Blog
  - Software-Architecture
draft: false
---

Title photo by [Johann Siemens](https://unsplash.com/photos/EPy0gBJzzZU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

After years of consulting, I find myself continually coming back to three basic principles of system design. I could happily throw away all my books on system architecture and design patterns to instead apply these fundamentals as first principles to software design; or put another way, I believe the entire body of modern software design knowledge stems from these fundamentals. The second and third principles derive directly from the preceding ones. So, when boiled down to its essence, the most fundamental goal of system design is Simplicity.  
  
With every new requirement, complexity inevitably encroaches on the most elegant of designs, but if we hold simplicity as the most important fundamental design goal, we can keep complexity at bay. This is one of the most important roles of a product owner or architect: to be a steward of simplicity. To help accomplish this we can apply the second principle: Loose Coupling between components of the system. This implies that we clearly define boundaries between system components and integrate them in such a way that modifying one component minimally affects other components. The second goal stems from the first, and the third goal stems from the first two. A simple, loosely coupled system promotes Maintainability. Software systems are living, mutable things that interact with living, mutable people and organizations. To be a viable solution, they must be maintainable.  
  
The three fundamental system design principles:  

1.  Simplicity
2.  Loose Coupling
3.  Maintainability

Simplicity
----------

Simple systems promote clarity and rapid iteration. While designing for any requirement, the most important question is, "what is the simplest solution?" Every proposed solution's value should be weighed against its added complexity to the system. Put Occam's razor and the KISS principle into practice. Sometimes this requires us to think about the requirement in a different way or even push back against the requirement itself. This is a hard lesson that I'm still learning: sometimes it is necessary to say "no". However, this should be followed up with a proposed rephrasing of the requirement or alternate approach to accomplishing its business intent, such as moving the requirement elsewhere outside of the system.

  

Scope creep is one of the most insidious enemies of large projects, and it can come from anyone with stake in the project. A couple of innocent, "oh, it would be great if it could also do this" from the client and a few well meaning, "we can do this and it wouldn't be that much more work!" from an enthusiastic developer can turn a simple component into spaghetti. Keep the responsibility of the system and its components as focused and small as possible to accomplish the business need.

  

Simplicity also requires knowing when to use design patterns appropriately to avoid antipatterns. As a young developer whenever I learned a new technique or pattern, I would try to apply it anywhere it would fit, which got me into trouble on numerous occasions and frequently left me with an unmaintainable mess of a solution that was difficult to understand. Design patterns are incredible tools that allow us to stand on the shoulders of giants of our industry, but they should only be used if they reduce the complexity of the system. Abstractions are not innately good and they should be used only if they provide clarity.


A tree is an incredibly complex organism, but abstractions of leaf, branch, trunk, and root clarify and simplify its structure into understandable components.  
  
Software systems must be understood by human beings, so keep them simple.  

Loose Coupling
--------------

Simple systems are loosely coupled systems. Each component should strive for simplicity on its own and the system should strive for simplicity with the interactions between components. Even if you're not using an object-oriented language, you can still use the good old SOLID principles to guide your architecture—just replace the "object" concept with "component":

1.  [Single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)
2.  [Open-closed principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)
3.  [Liskov substitution principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle)
4.  [Interface segregation principle](https://en.wikipedia.org/wiki/Interface_segregation_principle)
5.  [Dependency inversion principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)

Each of these promote loose coupling between components.

  

Loose coupling allows components to be changed or completely replaced without rewriting other components. By minimizing dependencies between them, we also minimize unwanted side effects when the system changes. And as modern solutions increasingly use cloud services like AWS, Azure, and GCP, loose coupling can mitigate the risk of vendor lock by allowing individual components to be migrated separately.

  

These benefits should be discussed with the business owners early on to help explain why these system design goals are important, and will help provide context when you may need to push back on a requirement or spend some extra time to simplify an approach.

  

Techniques like Domain Driven Design coupled with Event Storming help to collaborate early and clearly define component boundaries that structurally align with the business domain.

Maintainability
---------------

A simple and loosely coupled system lends itself to being maintainable. It should be easy to update, fix, and enhance the business logic, supporting infrastructure, system rules, and code configuration at any point in the system's life cycle. I find it helpful to ask myself, "will a junior developer or business analyst be able to change this, once I am no longer available?" If the answer is "no," then I need to rewrite or redesign the component so its intent is crystal clear.

  

Embrace minimalism in your code and "do more with less". I usually don't consider a task code-complete until I've been able to refactor away any superfluous complexity. I'm not talking about trying to pack as much logic into the smallest amount of code as possible ([code golf](https://en.wikipedia.org/wiki/Code_golf)!), quite the opposite; try to be as verbose as needed to make your logic clear and concise.

  

Unit tests and Test Driven Development techniques help ensure that as a system is updated, previous functionality is not broken. Tests are much more easily written against systems that have small, simple and loosely coupled components with minimal dependencies because there's much less of a need for complicated mocks and stubs.

  

[![](/images/posts/nasa-45075-unsplash.jpg)](/images/posts/nasa-45075-unsplash.jpg)

An astronaut repairing a satellite. Photo by [NASA](https://unsplash.com/photos/5JuLcub3dYg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Even the most well designed systems require maintenance and future iteration. Plan for it. Usually this means taking extra time once the system is functional to refactor it towards a simpler implementation.

Make It Actionable
------------------

Regardless of methodology, technique, or management approach, the fundamental principles of simplicity, loose coupling, and maintainability guide good system design. Here's how I concretely address these principles in a typical project:

1.  Discuss the benefits of these goals with the business owner or client up front. Set the expectation that time will be needed at the end of the project to optimize for simplicity.
2.  When solutioning for requirements, strive to find the absolute simplest solution, and beware of scope creep.
3.  Take the time to clearly define the boundaries of the system; DDD is an excellent tool for this.
4.  During design and implementation, keep maintainability in mind (i.e. write clear and concise code with unit tests).
5.  After implementation is complete, take extra time to reevaluate solutions and optimize them for simplicity and maintainability.
