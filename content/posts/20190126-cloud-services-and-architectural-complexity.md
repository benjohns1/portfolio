---
title: 'Cloud Services and Architectural Complexity'
date: 2019-01-26T16:12:00.002-08:00
image_sm: /images/posts/2014-08-17_deception_pass_forest.jpg
summary: How do we manage the architectural complexity that inevitably arises from using cloud services?
categories:
  - Blog
  - Software-Architecture
draft: false
---

How do we manage the architectural complexity that inevitably arises from using cloud services?  
  
Using Functions as a Service (FaaS) and Backends as a Service (BaaS) (i.e. Serverless) can cause pieces of business logic to be strewn about in many places:  

*   Visual orchestration tools (e.g. Azure's Logic Apps)
*   FaaS logic (e.g. AWS Lambda, Azure Functions, Google Cloud Functions)
*   BaaS setups (e.g. Google Firebase)
*   Cloud configurations

Combined with modern single-page applications that maintain complex logic on the client side and microservices that split an organization's concerns across small modules, it's very easy for business logic to become fragmented and intertwined with infrastructure concerns. Is it possible to build organized and maintainable systems using Domain Driven Design (DDD) techniques and clean architecture patterns?

Forest for the Trees
--------------------

![](/images/posts/2014-08-17_deception_pass_forest.jpg)

Although originally introduced by [Eric Evans](http://domainlanguage.com/about/) in his [seminal book](https://www.amazon.com/dp/0321125215) in 2004, DDD is very well-suited for reigning in the modern chaos. The guiding principle of this technique is that one must strive to understand the business domain and its interactions, first and foremost, and articulate it in a way that is clear to everyone involved, including the business, developers, managers, etc.—everyone. Clear understanding and communication of the business domain is a firm prerequisite.

<div className="bg-white rounded-lg px-8 py-4">![](/images/posts/2019-02-20_bounded_context_example.png "DDD event diagram")</div>

A lower-level DDD event diagram showing specific business logic

  
The result of a DDD approach should be a clear understanding of the business logic (i.e. domain logic) and how that logic is grouped (into domains, subdomains, bounded contexts, and aggregates). Only when the implementation-agnostic groupings (i.e. the domain model) are defined in this way should the discussion turn towards choosing particular technologies. These choices may lead to refining the lower-level specifics of the model (such as reorganizing or splitting an aggregate), but should not modify the higher-level domain architecture. The domain architecture reflects the driving purpose of the business itself and should not be defined by implementation details.  

Into the Weeds
--------------

DDD provides an excellent organizational approach to the system as a whole, but how do we keep the domain logic separate from the implementation details? Within an individual component of the design (e.g. a hosted application, FaaS, external service, SPA), separating the business logic from the infrastructure can be accomplished using various patterns. I prefer [Clean Architecture](http://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html), coined by "Uncle Bob", but the idea has been around for a long time as iterations of layered, hexagonal, and onion architectures. The key concept behind all these patterns is that the business logic should not depend on anything but itself. It does not make direct API calls; it does not query a database; it does not read a configuration file; it does not concern itself with anything infrastructure related at all—all of these things support and depend on the business logic, not the other way around. Anything that the business logic needs is passed into it, and anything it needs to communicate is sent out via an interface or abstraction it defines.  
  

![Clean Architecture: Domain, Application, Presentation, Infrastructure, and Persistence Layers](/images/posts/2019-01-26%20Clean%20Architecture%20Diagram.png)

Clean architecture aligns well with code-based components like applications, microservices, and cloud functions, but how do we apply the same principle to visual or configuration-based components like Azure Logic Apps? There's no easy answer to this because it heavily depends on the particular component; the important thing is that the business logic is separated as much as possible from any external concerns so it can be maintained separately. For instance, a Logic App may retrieve data from an external API in order for the business logic to decide to take an action. The business decision process should be configured in a separate Logic App or Function, rather than embedded within the parent Logic App, and it should be made clear which is which.  

Is Smaller Better?
------------------

Cloud services provide many benefits, but care must be taken to ensure that the domain logic doesn't become entangled with infrastructure concerns. The smaller pieces of business logic that are spread across various services, the more difficult this becomes. Smaller services should only be used if there is a clear benefit. This concept is a balancing factor to the current trend of implementing smaller and smaller microservices and the adoption of FaaS. A clean domain promotes simplicity, maintainability, and flexibility at the highest level.  

People at the Core
------------------

Human discipline is required to maintain organization and cleanliness throughout the life of the domain. Because modern architectures are dependent on myriad implementations, there is no guarantee that each technology will have a technological or automated solution to enforce these practices. This brings us back full circle to the importance of _everyone_ understanding the business domain as articulated by DDD. Policies and practices should encourage people to maintain an organized domain, rather than to take short cuts; they should guide people to "fall into the pit of success" as they say, and this starts with clear communication.
