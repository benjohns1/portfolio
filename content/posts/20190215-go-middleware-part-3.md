---
title: 'Go Middleware - Part 3'
date: 2019-02-15T14:40:00.000-08:00
image_sm: /images/posts/samuel-zeller-379406-unsplash.jpg
summary: In this third part of the Go middleware tutorial series, we'll quickly look at a common variant on the recursive middleware implementation from part 2.
categories:
  - Blog
  - Go
draft: false
---

In this third part of the Go middleware tutorial series, we'll quickly look at a common variant on the recursive middleware implementation from [part 2](/posts/20190209-go-middleware-part-2).  

Part 3 - Final Handler Middleware Example
-----------------------------------------

[![](/images/posts/samuel-zeller-379406-unsplash.jpg)](/images/posts/samuel-zeller-379406-unsplash.jpg)

Photo by [Samuel Zeller](https://unsplash.com/photos/oBb-Y26PJgg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

This variant separates the idea of middleware from the final handler that processes the request's business logic. This means that each middleware chain can have any number of middleware handler functions, but only a single final handler runs at the end of the chain. This allows the final handler to not need to accept a "next" handler, keeping our business logic a bit cleaner.  
  
The code for this tutorial can be found here:  
[https://github.com/benjohns1/go-middleware-example/blob/master/finalhandler/main.go](https://github.com/benjohns1/go-middleware-example/blob/master/finalhandler/main.go)  

### Step 1 - Modified Chain Functions

An additional parameter can simply be added to the chain functions:  

main.go (partial):
<Gist src="https://gist.github.com/benjohns1/0e74d47c067d9e8845745f1731abadd0.js"/>

We're passing in a new http.HandlerFunc as the first parameter and using it as the final function in the chain (instead of an empty function as we were previously).  

### Step 2 - Simplified Business Logic

Then we pass our handler in as the first parameter in the chain (rather than the last) and remove the extra closure from the businessLogic function so that it just supplies an http handlerFunc and doesn't need to call next():  

main.go (partial):
<Gist src="https://gist.github.com/benjohns1/66e7e099b9a93b887c03bcd9c36b0627.js"/>

This keeps our primary request business logic clean, and with the handler function as the first parameter it's easier to read in a long list of routes.  
  
In Part 4 we'll look at passing custom state up and down the request chain in a type-safe way.

### Final Server Code

main.go:
<Gist src="https://gist.github.com/benjohns1/afd9adbde74aca973fac732c7fd82180.js"/>

[Go Middleware - Part 2](/posts/20190209-go-middleware-part-2)

[Go Middleware - Part 4](/posts/20190224-go-middleware-part-4)
