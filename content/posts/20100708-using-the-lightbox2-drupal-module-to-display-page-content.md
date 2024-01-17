---
title: 'Using the Lightbox2 Drupal Module to Display Page Content'
date: 2010-07-08T02:15:00.000-07:00
summary: While building a Drupal site for one of my clients, I was having a heck of a time integrating...
categories:
  - Blog
  - Drupal
draft: false
---

While building a Drupal site for one of my clients, I was having a heck of a time integrating the [Lightbox2 module](http://drupal.org/project/lightbox2) for use with iframe content. For example, I wanted a login page (with [Janrain Engage](http://drupal.org/project/rpx)) and a couple other forms displayed in a lightbox. I wanted these pages to alternately be viewed as regular old nodes if the user didn't have JavaScript enabled, if they linked to the page externally, or if they right-clicked to open in a new tab, etc. The [Lightbox2 documentation](http://drupal.org/node/252260) provides a few different ways of doing this, but—here's the tricky part—none of the techniques address all of these scenarios:  

*   Only the node content should be visible in a lightbox (no sidebars!)
*   The user clicks a link in a lightbox that should target the top window
*   The user clicks a lightbox link that should stay in the lightbox iframe
*   The user clicks a lightbox link that calls a third-party service that redirects the user back to the site via a url token

Basically, I wanted to be able to happily add lightbox links anywhere in the site without worrying about whether the user could possibly come across a page that was formatted to be inside an iframe, or a lightbox that contained all my site's headers and sidebars. Talk about visual clutter!  
  
My solution was simple. For every page, check if it is in an iframe. If so, use CSS to hide the unnecessary page blocks. That way, no matter how you get to the page, it will always be formatted correctly. I'll admit that this does leave something to be desired in that we don't necessarily want to load the _entire_ page if all we want is the content, but short of writing a custom lightbox module, or modifying Lightbox2, it was the best solution I could find.

Step 1
------

Add a wrapper div directly below your body tag with an id of 'no-iframe'. This is our (semantically incorrect, sorry!) 'global variable' that we'll use to hold whether the page is in an iframe or not.  

Step 2
------

Add this script to your theme's page.tpl.php file right before the closing body tag:  

<Code language="javascript">
{
`if (top !== self) {  
  document.getElementById('no-iframe').id = 'in-iframe';  
}
`}
</Code>

This changes our wrapper div's id from 'no-iframe' to 'in-iframe' if, well, it's in an iframe. Ideally, you want to add the rest of your scripts after this snippet in order to apply the CSS rules to it as soon as possible. This cuts down on the time the hidden content is visible to the user.  
  
For example, if your theme is based off the [Zen theme](http://drupal.org/project/zen), the tail end of your page.tpl.php might look like this:  

<Code language="html">
{
`  <!-- Page content --!>  
  <script type="text/javascript">  
    if (top !== self) {  
      document.getElementById('no-iframe').id = 'in-iframe';  
    }  
  </script>  
<?php print $scripts; ?>  
<?php print $closure; ?>  
</div> <-- this is our closing tag for our no-iframe div -->  
</body>  
</html>
`}
</Code>
  
So, now for every page, if our elements are inside #no-iframe, then we display all headers, sidebars like normal. If our elements are inside #in-iframe, then we use CSS to hide our unwanted blocks.  

Step 3
------

Here's an example of my iframe-layout.css:  

<Code language="css">
{
`  /* Layout for pages within an iframe */  
  /* hide unwanted blocks */
  #in-iframe #header,  
  #in-iframe #navbar,  
  #in-iframe #footer,  
  #in-iframe #sidebar-right  
  {  
    display: none;  
  }  
  /* center my main content */  
  #in-iframe #main-inner  
  {  
    width: 660px;  
    margin: 0 auto;  
  }  
  /* fix my content margins to display without the sidebar */  
  #in-iframe #content  
  {  
    width: 660px;  
    margin-left: 0;  
    margin-right: 0;  
  }
`}
</Code>

Obviously, your CSS will differ from mine, depending on your theme and layout, but the key ingredient is the display: none to hide the unwanted blocks.  
  
Now, whenever you open a lightbox, the page that's loaded will automatically know that it's in an iframe, and display only the content you want. And if you link to the node normally, it will show your entire template! We still need one more tweak, though.  

Step 4
------

Create a new JavaScript file for your theme and add some simple jQuery:  

<Code language="javascript">
{
`$('a', '#in-iframe').each(function() {  
  var $this = $(this);  
  if ($this.attr('rel') == 'lightframe') {  
    $this.unbind('click').removeAttr('rel');  
  } else {  
    $this.attr('target', '\_top');  
  }  
});
`}
</Code>

This will find every instance of a link within the lightbox iframe and make sure it targets the parent window, or—for links that should open in a lightbox—will remove the click function that opens a _new_ one, allowing it to open in the current lightbox iframe.  
  
Now, all of our original scenarios are addressed and we've kept it all in the theme layer! Didn't even have to touch template.php :-)
