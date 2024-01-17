---
title: 'How to Set Up a Simple BIND Nameserver on CentOS - Comments'
date: 2010-04-24T11:11:00.000-07:00
categories:
  - Blog
  - Linux
draft: true
---

#### Thanks, this really helped getting me started. Th...
[Unknown](https://www.blogger.com/profile/05967544927360086131 "noreply@blogger.com") - <time datetime="2010-12-15T17:48:52.283-08:00">Dec 3, 2010</time>

Thanks, this really helped getting me started. There's not a lot of simple guides on how to set up a nameserver.  
  
One thing I found though is this setup allow recursive querying which would essentially leave you open to DDoS attacks or someone using your nameserver as their own. You should include this in your post:  
  
in named.conf:  
  
options {  
listen-on port 53 { any; };  
allow-recursion { "recursive\_subnets"; };  
};  
acl "recursive\_subnets" {  
localhost;  
};
<hr />
#### Very useful. Had the same situation for a Wordpres...
[Jesús](https://www.blogger.com/profile/02085221647978477026 "noreply@blogger.com") - <time datetime="2012-01-07T13:51:44.074-08:00">Jan 6, 2012</time>

Very useful. Had the same situation for a Wordpress site.
<hr />
#### tanks info
[Unknown](https://www.blogger.com/profile/03154700101439852227 "noreply@blogger.com") - <time datetime="2013-05-09T07:07:50.858-07:00">May 4, 2013</time>

tanks info
<hr />
#### Hello, I'm pretty new to CentOS and Linux in g...
[Unknown](https://www.blogger.com/profile/11881368243833518185 "noreply@blogger.com") - <time datetime="2014-03-23T13:01:11.016-07:00">Mar 0, 2014</time>

Hello,  
I'm pretty new to CentOS and Linux in general and I seek help. I've bought a VPS from ChicagoVPS and a domain name (vwh-rp.com) from HostingDude. I have created 2 host names in the domain name control panel (HostingDude), ns1.vwh-rp.com and ns2.vwh-rp.com and pointed them both to the public IP of my VPS. Then I have set the nameservers (On the HostingDude domain control panel) to ns1.vwh-rp.com and ns2.vwh-rp.com. As for this tutorial I've followed it strictly replacing example.com with vwh-rp.com (My registered domain name), 111.222.333.444 with 1.1.1.1 and 111.222.333.445 with 2.2.2.2. What am I doing wrong? Please help.
<hr />
