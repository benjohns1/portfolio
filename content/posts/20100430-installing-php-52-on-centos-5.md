---
title: 'Installing PHP 5.2 on CentOS 5'
date: 2010-04-30T15:48:00.000-07:00
categories:
  - Blog
  - PHP
  - Linux
draft: false
---

One quirky thing about RedHat is that they are _very_ conservative as to the packages they include in their repositories. In this case, PHP 5.1.6 was the latest version and I needed at least 5.2 for a Drupal 6 installation.

Step 1
------

[atomicorp.com](http://atomicorp.com/) hosts a repository which we'll add:  

wget -q -O - http://www.atomicorp.com/installers/atomic.sh | sh

Step 2
------

Then we'll install the latest version of PHP using yum:  

```
yum install php
```

Or if an older version of php is already installed:  

```
yum update php
```

Step 3
------

Restart the webserver:  

```
/etc/init.d/httpd restart
```
  
And that's it! Now you should have PHP 5.2 installed.  
  
Resources:  

*   [http://bluhaloit.wordpress.com/2008/03/13/installing-php-52x-on-redhat-es5-centos-5-etc/](http://bluhaloit.wordpress.com/2008/03/13/installing-php-52x-on-redhat-es5-centos-5-etc/)
*   [http://mayurchaudhari.wordpress.com/2009/02/23/upgrade-php-to-5-2-x-using-yum/](http://mayurchaudhari.wordpress.com/2009/02/23/upgrade-php-to-5-2-x-using-yum/)
*   [http://iptrees.wordpress.com/2009/10/11/how-to-upgrade-to-php-5-2-x-on-centosrhelfedoraedora/](http://iptrees.wordpress.com/2009/10/11/how-to-upgrade-to-php-5-2-x-on-centosrhelfedoraedora/)
*   [http://netfirms.com/community/threads/35-Upgrade-to-PHP-5-2-x-on-CentOS-5-Plesk](http://netfirms.com/community/threads/35-Upgrade-to-PHP-5-2-x-on-CentOS-5-Plesk)
