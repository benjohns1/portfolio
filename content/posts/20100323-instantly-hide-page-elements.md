---
title: 'Instantly Hide Page Elements'
date: 2010-03-23T15:00:00.000-07:00
categories:
  - Blog
  - Linux
draft: false
---

To hide page elements without IE showing them for a split second when the page loads, add an id to your body tag as soon as the DOM loads. You'll want to do this even before you load any JavaScript libraries like jQuery or Prototype.  
  
This is what your page layout should look like:  

<Code language="html">
{`<!DOCTYPE HTML>  
<html>  
<head>  
  <!-- Header content -->  
</head>  
<body>  
  <!-- Page content -->  
  <script type="text/javascript">  
document.getElementsByTagName('body')\[0\].id = 'js';  
  </script>  
  <!-- Load your JS libraries and scripts here -->  
</body>  
</html>
`}
</Code>
  
This will add the 'js' id to your body tag only if the user has Javascript enabled. Adding the script right away makes sure that the elements are hidden as soon as possible, rather than having to wait for jQuery/Prototype to load, etc...  
  
Then, in your CSS file create a selector for your element like so:  

<Code language="css">
{`#element {  
  /\* css for all users \*/  
}  
body#js #element {  
  /\* css for javascript enabled browsers \*/  
  display: none;  
}
`}
</Code>
  
This will hide the element so you can display it later with your JavaScript code, but show it for non-JavaScript users. Ahhh, beautiful degradation.
