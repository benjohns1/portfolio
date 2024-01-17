---
title: 'Drupal 6 Theme Info Error'
date: 2011-09-14T16:46:00.000-07:00
summary: Recently one of my client sites had an issue where the custom theme info was corrupted...
categories:
  - Blog
  - Drupal
draft: false
---

Recently one of my client sites had an issue where the custom theme info was corrupted. The following warnings were being thrown, and the theme wasn't loading:

PHP Error Reporting

```
Warning: Invalid argument supplied for foreach() in /drupal/path/includes/theme.inc on line 497

Warning: Invalid argument supplied for foreach() in /drupal/path/includes/theme.inc on line 502

Warning: Invalid argument supplied for foreach() in /drupal/path/includes/theme.inc on line 497

Warning: Invalid argument supplied for foreach() in /drupal/path/includes/theme.inc on line 502
```

Somehow the theme info database record (which holds a PHP serialized object) was corrupted.

The quick fix for this was to switch to a different theme, and switch back (rebuild the theme info). As this was hard to do without navigation, here are the URLs to hit:

baseurl.com/user
- Login as administrator

baseurl.com/admin/build/themes/select
- Select another theme, and switch back to your original one
