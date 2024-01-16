---
title: 'Go Middleware - Part 5'
date: 2019-03-17T07:56:00.002-07:00
summary: In this fifth and final part of the Go middleware tutorial series, we'll use what we've learned to create a more structured API example...
categories:
  - Blog
  - Go
draft: true
---

In this fifth and final part of the Go middleware tutorial series, we'll use what we've learned to create a more structured API example that includes basic request logging, authorization, and response formatting.  
  
Middleware will help simplify our API code and promote the [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle).

Part 5 - API Middleware Example
-------------------------------

The code for this tutorial can be found here: [https://github.com/benjohns1/go-middleware-example/tree/master/apiexample](https://github.com/benjohns1/go-middleware-example/tree/master/apiexample)  

### API Example Code

Rather than building up the code from scratch as in previous tutorials, we're going to start with the completed code and discuss each component. The project is structured as follows:

*   [businessdomain/](https://github.com/benjohns1/go-middleware-example/tree/master/apiexample/businessdomain) - contains all business logic, separately from infrastructure
    *   [businesslogic.go](https://github.com/benjohns1/go-middleware-example/blob/master/apiexample/businessdomain/businesslogic.go) - example logic
*   [middleware/](https://github.com/benjohns1/go-middleware-example/tree/master/apiexample/middleware) - contains all API middleware infrastructure
    *   [auth.go](https://github.com/benjohns1/go-middleware-example/blob/master/apiexample/middleware/auth.go) - middleware to handle authentication
    *   [chain.go](https://github.com/benjohns1/go-middleware-example/blob/master/apiexample/middleware/chain.go) - middleware chain helpers
    *   [logger.go](https://github.com/benjohns1/go-middleware-example/blob/master/apiexample/middleware/logger.go) - middleware to handle API logging
*   [main.go](https://github.com/benjohns1/go-middleware-example/blob/master/apiexample/main.go) - entry point

### Business Logic

This is where the meat and potatoes of the application reside. All the logical rules that the business, client, or user expects from the system should be driven from here without depending on implementation details such as HTTP, DB technology, etc. It's a great idea to write your business logic as decoupled as possible from infrastructure concerns, as has been recommended time and time again with architectural patterns like [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html), Hexagonal Architecture, and Onion Architecture.

businessdomain/businesslogic.go:
<Gist src="https://gist.github.com/benjohns1/71e377bada15692099442b12b661a1a9.js"/>

In this example, we're not actually _doing_ anything except returning a static struct, but notice that this package does not depend on anything related to the API delivery mechanism or database; it could easily be reused for a terminal or GUI application, for example.

### Middleware Chain

Now for the API infrastructure: this is where the recursive chain style of middleware is implemented as described in [Part 2](/posts/20190209-go-middleware-part-2) of this series. This could be replaced by any of the variants we've discussed or by one of the many router/mux packages available.

middleware/chain.go:
<Gist src="https://gist.github.com/benjohns1/a7072db1ee68d2ad064db408eb062e40.js"/>

The Factory type defines a valid function that can be chained as middleware.

### Logging Middleware

Similar to what we've shown in previous examples, this file contains HTTP request logging middleware.

middleware/logger.go:
<Gist src="https://gist.github.com/benjohns1/16f2518c45c4e01cea780e8458b03fb9.js"/>

The Logger function is of type Factory so it can be used directly as a middleware function. We're also implementing a custom WriteHeader function to capture the status code as described in [Part 4](/posts/20190224-go-middleware-part-4).

### Authorization Middleware

This middleware provides two strategies for authorization:

1.  Random Auth - randomly reject or accept a request (example purposes only!)
2.  Public Auth - always authorized

middleware/auth.go:
<Gist src="https://gist.github.com/benjohns1/be823fcd5737890cd8e29a45c87136e6.js"/>

The Auth function accepts an auth strategy function as a parameter to determine whether the user is authorized, and returns a Factory function that can be chained as middleware.

### Putting It All Together

Each of the previous files contain a specific and unique responsibility, and our business logic has no dependency on the API delivery mechanism or infrastructure. Let's put it all together into one informative (but... probably useless) API!

main.go:
<Gist src="https://gist.github.com/benjohns1/035fa81fd9768c05e5ec925f837ee5ed.js"/>

Our main function creates two routes, each using a different auth strategy:

1.  [localhost:8080/api/v1/random/](localhost:8080/api/v1/random/)
2.  [localhost:8080/api/v1/public/](localhost:8080/api/v1/public/)

The requestHandler function calls the business logic and transforms the return value into an appropriate HTTP response. Notice again that the business logic knows nothing about the transport mechanism; the final data format and transport type is handled here. This could be extended to allow additional data formats and more complex transformation steps using the middleware techniques we've just learned.  
  
This concludes the Go Middleware series. Now go forth a conqueror and win great API victories!  
  

[Go Middleware - Part 4](/posts/20190224-go-middleware-part-4)
