---
title: 'Go Middleware - Part 1'
date: 2019-02-06T15:06:00.002-08:00
image_sm: /images/posts/mike-alonzo-3347-unsplash.jpg
summary: This is the first in a series of simple tutorials explaining the usage of HTTP middleware in Go.
categories:
  - Blog
  - Go
draft: false
---

This is the first in a series of simple tutorials explaining the usage of HTTP middleware in Go.  
  
Middleware is useful for injecting logic before and after a request handler, without needing to modify the business logic of the handler itself. For instance, you can use the middleware pattern to log some basic information about every request sent to the server, then apply some standard authentication for those requests that need it, and finally apply the appropriate handler to run the actual business logic.  
  
In this context middleware is a specific case of the [decorator pattern](https://en.wikipedia.org/wiki/Decorator_pattern); it is typically used to cleanly add logic to a web request handled by a server. Middleware can be chained to wrap multiple pieces of functionality around a single request (e.g. logging, authentication, authorization, request/response encoding, error handling). Historically, the term "[middleware](https://en.wikipedia.org/wiki/Middleware)" has been used in SOA and enterprise architectures to cover any type of software that facilitates communication between two other systems (e.g. Service Bus), but is being used more frequently to refer to a logical layer _within_ a single service.  
  
This pattern helps encapsulate logic to adhere to the [Single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle) for [SOLID](https://en.wikipedia.org/wiki/SOLID) design and [Clean Architecture](http://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).

Part 1 - Loop Chain Middleware Example
--------------------------------------

[![](/images/posts/mike-alonzo-3347-unsplash.jpg)](/images/posts/mike-alonzo-3347-unsplash.jpg)

Photo by [Mike Alonzo](https://unsplash.com/@mikezo?utm_medium=referral&utm_campaign=photographer-credit&utm_content=creditBadge)

  
The code for this tutorial can be found here:  
[https://github.com/benjohns1/go-middleware-example/blob/master/loopchain/main.go](https://github.com/benjohns1/go-middleware-example/blob/master/loopchain/main.go)  
  
This simple approach uses a range loop to apply each middleware function in order. Technically, this isn't really the "middleware" pattern, but it serves the same purpose and provides a great introduction. We will build upon this simple approach with a more useful implementation in Part 2.  

### Step 1 - A Simple HTTP Server

First let's create a main func to start a simple server:  

main.go:
<Gist src="https://gist.github.com/benjohns1/f1bd0325e47a8879d54b5cb11967f29f.js"/>

We're using the standard http library to handle the "/api/v1" route with our aptly-named businessLogic function. You can run the server with:
```
go run main.go
```
and go to [localhost:8080/api/v1](http://localhost:8080/api/v1) in your browser to see this in action.  
  
One thing to note is that we're wrapping the function that handles the actual http request in a closure (the businessLogic function) so that we can inject some setup values into the handler when the server starts. The first injected value is just a static string, but the second value is a func that is run whenever a request is invoked. Try hitting the endpoint multiple times to see the pseudo-random numbers from runTimeFunc. This isn't important for this particular example, but is being shown now because closures are key to more advanced middleware implementations.  

### Step 2 - Adding Middleware

Now let's create a logging function that will log some generic information about a request:

main.go (partial):
<Gist src="https://gist.github.com/benjohns1/b6aff6e71adefbe127452ea2143d5ef0.js"/>

How do we add this to our route handler in a way that can be reused? This is where the usefulness of middleware comes in! We can write a new function that will chain these handlers together and return a final handler that wraps all of this nicely and neatly for the route:  

main.go (partial):
<Gist src="https://gist.github.com/benjohns1/d9b238f9da534ae24a4c0d94d6c146e1.js"/>

The chain function takes any number of http.HandlerFunc functions and returns a new http.Handler that runs all of them in order. We can create and add as many middleware function handlers as we want to this chain:  
```
http.Handle("/api/v1", chain(logger, moreMiddleware, evenMoreMiddleware, businessLogic("99999", runTimeFunc)))
```
  
These handlers are completely decoupled from each other and can easily be applied to multiple routes in various configurations.  
  
[Part 2](/posts/20190209-go-middleware-part-2) will cover a slightly more advanced implementation approach using recursive functions that allow applying logic before _and_ after the subsequent handler as well as short-circuiting the request chain.  

### Final Server Code

main.go:
<Gist src="https://gist.github.com/benjohns1/9e423f4c5462cb1742af050574632e6f.js"/>

[Go Middleware - Part 2](/posts/20190209-go-middleware-part-2)
