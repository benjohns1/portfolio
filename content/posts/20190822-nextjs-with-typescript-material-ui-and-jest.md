---
title: 'Next.js with TypeScript, Material UI, and Jest'
date: 2019-08-22T10:35:00.001-07:00
image_sm: /images/posts/template-screenshot.png
image_size: "100%"
image_bg_color: "#fff"
summary: I was looking for a quick and easy way to put together a personal static site and...
categories:
  - Blog
  - Front-end
draft: false
---

I was looking for a quick and easy way to put together a personal static site and _almost_ went with Svelte Sapper because I've been enjoying it so much using it for another side project. But in the end I decided to use Next.js instead because it has been around for a while (Sapper is modeled after it), it is so incredibly easy to deploy using Zeit's Now for free, and I wanted to use TypeScript without the hassle of trying to get it to work with Svelte (which apparently _is_ possible). I also wanted to brush up on React since it had been a while.  
  
Here's my target front-end stack:  

*   [Next.js](https://github.com/zeit/next.js)  
    
*   [TypeScript](https://www.typescriptlang.org/)  
    
*   [Material UI](https://material-ui.com/)  
    
*   [Jest](https://jestjs.io/) with [Enzyme](https://airbnb.io/enzyme/)  
    

After working with the Next.js and Material UI examples to get a good starting template, here's the final result, which I plan on starting with for static sites moving forward:

[github.com/benjohns1/next-ts-mui-jest-template](https://github.com/benjohns1/next-ts-mui-jest-template) [![](/images/posts/template-screenshot.png)](https://github.com/benjohns1/next-ts-mui-jest-template)  
  
Grab it and try it out yourself!  
```
npx degit https://github.com/benjohns1/next-ts-mui-jest-template my-project
cd my-project
npm i
npm run dev

```
