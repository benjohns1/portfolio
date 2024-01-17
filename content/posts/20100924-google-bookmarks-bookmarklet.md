---
title: 'Google Bookmarks Bookmarklet'
date: 2010-09-24T13:34:00.000-07:00
summary: Here's a slight modification to the handy Google Bookmarks Bookmarklet...
categories:
  - Blog
draft: false
---

Here's a slight modification to the handy Google Bookmarks Bookmarklet: 
```
javascript:(function(){var a=window,b=document,c=encodeURIComponent,d=a.open("http://www.google.com/bookmarks/mark?op=edit&bkmk="+c(b.location)+"&title="+c(b.title),"bkmk_popup","left="+((a.screenX||a.screenLeft)-20)+",top="+((a.screenY||a.screenTop)+20)+",height=600px,width=800px,resizable=1,alwaysRaised=1,scrollbars=1,menubar=1,toolbar=1");a.setTimeout(function(){d.focus()},300)})();
```  
A window (or tab depending on your browser settings) pops up with the current page's URL and title loaded into a Google Bookmark for you to add. It allows you to easily browse your existing bookmarks or add a new one, and it increases the window size from the default bookmarklet available on the Google page.
