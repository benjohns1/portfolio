---
title: 'Using the Lightbox2 Drupal Module to Display Page Content - Comments'
date: 2010-07-08T02:15:00.000-07:00
categories:
  - Blog
  - Drupal
draft: true
---

#### Thanks for the script, it seems very useful! Howev...
[sergio](https://www.blogger.com/profile/16379759584015958571 "noreply@blogger.com") - <time datetime="2010-08-11T04:01:48.103-07:00">Aug 3, 2010</time>

Thanks for the script, it seems very useful!  
However, there is no need to create a #in-iframe id using javascript, as you can use a different page.tpl.php (page-node-lightbox2.tpl.php) for the lightbox pages. (and you should do that, as its very useful for getting rid of sidebars, etc.). So, in that tpl you can add a in-iframe class to the body or whatever you need to do the proper css selection.
<hr />
#### Thank you sergio, you're right. The problem I ...
[Ben Johns](https://www.blogger.com/profile/04262780281430927669 "noreply@blogger.com") - <time datetime="2010-08-11T08:13:44.055-07:00">Aug 3, 2010</time>

Thank you sergio, you're right. The problem I ran into when using page-node-lightbox2.tpl.php was the fact that each lightbox link must be of the form /node/xxx/lightbox2. Another solution would be to use the [alternative solution using a get parameter](http://drupal.org/node/252260), and modify the javascript that adds and removes the lightbox links to append or remove the url parameter as well. When I get a free moment I'll post an example of this.
<hr />
#### Thanks for this guide. I was having trouble with ...
[Unknown](https://www.blogger.com/profile/16754786147432953275 "noreply@blogger.com") - <time datetime="2010-10-18T20:19:00.250-07:00">Oct 1, 2010</time>

Thanks for this guide. I was having trouble with hiding the page elements in the iframes. I am using the lightbox to present a form driven by nodereference\_url that references back to the page they were came from. I used a custom tpl.php for the node add form, but after it was saved I was getting redirected to the new page but with the full layout. I didn't want to change the template globally as later people would be viewing with the normal layout. Turns out that lightbox2 adds a class of .lightbox-processed to the body of nodes it renders in iframes, so I keyed my iframe css off this class. I think this will suffice for my current needs, but I bookmarked your page in case I have a more robust application in the future.
<hr />
#### oops. I was a little quick on that one. lightbox2...
[Unknown](https://www.blogger.com/profile/16754786147432953275 "noreply@blogger.com") - <time datetime="2010-10-18T20:46:48.612-07:00">Oct 1, 2010</time>

oops. I was a little quick on that one. lightbox2 adds lightbox-processed to every page. Maybe I'll try your idea in the morning.
<hr />
