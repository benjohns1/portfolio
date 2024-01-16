---
title: 'Go Middleware - Part 2'
date: 2019-02-09T08:52:00.001-08:00
image_sm: /images/posts/szabo-viktor-1154603-unsplash.jpg
summary: In this second part of the Go middleware tutorial series, we'll cover a recursive approach that provides a couple benefits beyond the simple loop chain example from part 1.
categories:
  - Blog
  - Go
draft: false
---

In this second part of the Go middleware tutorial series, we'll cover a recursive approach that provides a couple benefits beyond the simple loop chain example from [part 1](/posts/20190206-go-middleware-part-1), including:  

1.  the ability to _wrap_ around the next handler in the chain (i.e. add logic before and after the subsequent handlers are applied)
2.  the ability to short-circuit the request chain in any middleware handler (e.g. if authentication fails)

Part 2 - Recursive Chain Middleware Example
-------------------------------------------

[![](/images/posts/szabo-viktor-1154603-unsplash.jpg)](/images/posts/szabo-viktor-1154603-unsplash.jpg)

Photo by [Szabo Viktor](https://unsplash.com/photos/XDNiTGp3bKM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

The code for this tutorial can be found here:  
[https://github.com/benjohns1/go-middleware-example/blob/master/recursivechain/main.go](https://github.com/benjohns1/go-middleware-example/blob/master/recursivechain/main.go)  

### Step 1 - Simple Server

Just as we did in part 1, let's start with a simple working HTTP server:  

main.go:
<Gist src="https://gist.github.com/benjohns1/deb30888549c60751eb73cb9b60d5544.js"/>

Run the server:
```
go run main.go
```

Test in a browser:
```
localhost:8080/api/v1
```  
Notice the businessLogic function returns a closure around the actual http handler, so we can pass in an all-important config value "12345" when the server is started.  

### Step 2 - Recursive Chain

Rather than use a simple loop that calls handlers one after another like we did in part 1, instead we're going to pass the second handler as a parameter to the first handler, pass the third handler as a parameter to the second handler, and so on:
```
firstHandler(secondHandler(thirdHandler(fourthHandler())))
```  
Each handler will then be responsible for calling (or not!) the next one in the chain. We can do better than a bunch of eye-bleeding nested functions and use recursion:  

main.go (partial):
<Gist src="https://gist.github.com/benjohns1/3d2473a03e122eabac17665f38341f4f.js"/>

The middlewareFunc type describes the new type of middleware function we need to pass into the chain function. It accepts the next handler in the chain and returns the current handler, which wraps the next handler (this should make more sense in a bit).  
The chain function just provides the nice variadic parameter syntax and converts the final handler function into the http.Handler interface that the http router accepts.  
The recurseChain function does the actual work of sending the next handler as a parameter to the current one recursively, up until there aren't any more handlers, and it finally returns an empty function to complete the chain.  
  
To use this chain function, modify the businessLogic to:  

1.  wrap the http handler in a new closure that passes-in the next handler
2.  and call the next handler where appropriate

main.go (partial):
<Gist src="https://gist.github.com/benjohns1/03bf8ef76a2a5acbfcde7c8a206a5076.js"/>

Now our businessLogic function accepts the same config parameter, but it returns the middlewareFunc type function that chain() accepts. This middlewareFunc accepts the next handler in the chain as a parameter and returns the actual handler function that processes the request. The actual handler function has access to the outer config and handler parameters via closures; it can call next(w, r) to continue to the next handler in the chain. In this case next(w, r) just calls the empty function returned from the last iteration of recurseChain.  

### Step 3 - Wrap and Short-Circuit

Okay, thanks a lot, now we've just made things more complicated! Wait, wait, we should [KISS](https://en.wikipedia.org/wiki/KISS_principle). We're adding complexity because it gives us the ability to actually wrap our nested handlers in functionality like this:  

main.go (partial):
<Gist src="https://gist.github.com/benjohns1/7b8ed952520dad541f1dfc52209fa50f.js"/>

and short-circuit the request chain like this:  

main.go (partial):
<Gist src="https://gist.github.com/benjohns1/7673cbf8750ea8d6d107f43f0c91132c.js"/>

The logger middleware prints an entry before _and_ after all subsequent handlers run. The shortCircuitLogic randomly decides not to call any of the subsequent handlers in the chain by returning without calling the next function.  
  
As you can see this provides a lot of flexibility with our middleware, while still keeping each function decoupled from the others.  
  
In Part 3 we'll look at a common variant of this approach that doesn't require the final handler function to call an empty handler.  

### Final Server Code

main.go:
<Gist src="https://gist.github.com/benjohns1/0f6430b1ca1bef824247fea04d00ee4d.js"/>

[Go Middleware - Part 1](/posts/20190206-go-middleware-part-1)

[Go Middleware - Part 3](/posts/20190215-go-middleware-part-3)
