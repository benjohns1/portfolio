---
title: 'Go Middleware - Part 4'
date: 2019-02-24T20:03:00.000-08:00
image_sm: /images/posts/customize-all-the-things.jpg
image_size: 95%
image_bg_color: "#fff"
summary: In this fourth part of the Go middleware tutorial series, we'll discuss passing custom state along the request chain.
categories:
  - Blog
  - Go
draft: true
---

In this fourth part of the Go middleware tutorial series, we'll discuss passing custom state along the request chain. This provides the flexibility to pass data from one middleware handler to another one somewhere else in the chain.  

Part 4 - Custom State Middleware Example
----------------------------------------

We want to be able to pass custom data from one middleware function to another, but without breaking encapsulation or modularity. We also want to be very explicit and type-safe about the data that is being passed so it is easy to maintain.  
  
The code for this tutorial can be found here: [https://github.com/benjohns1/go-middleware-example/blob/master/customstate/main.go](https://github.com/benjohns1/go-middleware-example/blob/master/customstate/main.go)

### Step 1 - Simple Server

We'll create a simple server that uses the recursive middleware approach from [part 2](/posts/20190209-go-middleware-part-2) with a few modifications:  

main.go:
<Gist src="https://gist.github.com/benjohns1/ec5f243af7c72c6be9e3d9dbc1d5ced1.js"/>

This code should be familiar but for a couple slight differences:  

1.  In main() we're passing in a function literal (i.e. anonymous or lambda function) to the businessLogic function that randomly returns true or false. This is just for brevity and is not all that relevant.
2.  In businessLogic() we're explicitly setting a success or failure HTTP status code, depending on whether the decider function returns true or false.

Wouldn't it be nice to be able to log that status code in our logger middleware? But take a look at the http.ResponseWriter interface; there's no way to retrieve its value after its been set!  

### Step 2 - Implement http.ResponseWriter

Here's an example of where Go's interfaces really shine. We can define a new struct type to contain the data that we need to keep track of, and as long as we implement the http.ResponseWriter interface, our struct can be passed through _any_ middleware handler without issue (even through handlers that don't know or care about our custom data):  

main.go (partial):
<Gist src="https://gist.github.com/benjohns1/67878e5bdf2aed233ee8cf78dea205d3.js"/>


The logResponseWriter type stores the original http.ResponseWriter sent to the logger function and passes through all of the required interface function calls. It extends the standard functionality by storing the status code in an easily-accessible parameter when the WriteHeader interface method is called.  
  
The logger function creates our custom struct and passes it into the next middleware handler in the chain (which is fine because the struct implements the http.ResponseWriter interface). It then accesses the status parameter for logging after the subsequent handlers have run. Notice that we didn't touch a single line of our business logic to implement this, because we leveraged the http.ResponseWriter interface's existing WriteHeader function.  

### Step 3 - Custom Data

You might notice that this only works well for the status code in particular (or for any data that is passed to an existing http.ResponseWriter interface method). So how do we pass additional custom data?  

[![](/images/posts/customize-all-the-things.jpg)](/images/posts/customize-all-the-things.jpg)

In order to do this, both middleware handlers need to be aware of some sort of interface for getting/setting the data. In this example we'll modify our business logic so that it is aware of the logResponseWriter struct, but you can imagine decoupling this further using additional interfaces.  

main.go (partial):
<Gist src="https://gist.github.com/benjohns1/f4cab6ed6428f14feaeb311062ffec01.js"/>

We've added a new field "extra" to store our custom string data. The logger function logs this string after the request is complete.  
  
The businessLogic function does a bit of work to check if the custom interface is implemented. It uses a type assertion to check whether a logResponseWriter was passed in as the http.ResponseWriter, and if so it has type-safe access to the "extra" field.  
  
You can extend this approach to pass any type of custom data up and down the middleware chain. This has a lot of benefit over using, say, a [context](https://golang.org/pkg/context/) to store values on the response writer object, because it clearly defines type-safe fields in an explicit struct, making the code much more readable and less error-prone. However, keep in mind that this approach is still more complicated than simply passing parameters into functions, so only use it when needed.  
  
In the final [part 5](/posts/20190317-go-middleware-part-5) of this series, we'll look at a slightly more realistic and structured example of a JSON API that uses the middleware approaches we've discussed.  

### Final Server Code

main.go:
<Gist src="https://gist.github.com/benjohns1/f329429b730f2abd7f72067036e08353.js"/>

[Go Middleware - Part 3](/posts/20190215-go-middleware-part-3)

[Go Middleware - Part 5](/posts/20190317-go-middleware-part-5)
