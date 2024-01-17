---
title: 'How to Set Up a Simple BIND Nameserver on CentOS'
date: 2010-04-24T11:11:00.000-07:00
categories:
  - Blog
  - Linux
draft: false
---

I decided to try out HostGator's VPS Hosting for a new Drupal project I'm working on. This is the first post in a series that will touch on various aspects of VPS management, Drupal, and video distribution.  
  
I wanted to set up a custom nameserver partially for the learning experience and partially to gain total control over load balancing, if necessary in the future. First of all, I signed up for the Level 1 VPS at HostGator. The low cost and scalability of their plans attracted me, though I've never used them before. After doing some research, I decided to setup a simple nameserver hosted on the VPS that points to my domains on the server. Keep in mind that this is a very simple setup that is not necessarily secure. Check out the resources at the end of this post if you want to dig deeper.  
  
The three files we will need to create or edit are:  

*   /etc/resolv.conf
*   /etc/named.conf
*   /var/named/chroot/var/named/example.com.db

This assumes that you're running BIND in a chroot jail (which is the default setup for HostGator's VPS at the moment).

Step 1
------

Create or edit resolv.conf so that it looks like this:  

File: /etc/resolv.conf
```
nameserver 127.0.0.1
```

You should comment out any other lines if they exist. This tells the host to look at its own nameserver for domain name lookups.  

Step 2
------

Next, create or edit named.conf so that it contains:  

File: /etc/named.conf
```
options {  
  listen-on port 53 { any; };  
};  
zone "example.com" {  
 type master;  
  notify no;  
  allow-query { any; };  
  file "/var/named/chroot/var/named/example.com.db";  
};
```

This tells BIND to listen on port 53 (the default DNS port number) from any IP. The _zone_ section should be repeated for every domain you're serving. The _file_ part should point to each zone file.  
  

Step 3
------

Now we need to create a zone file for the domain:  

File: /var/named/chroot/var/named/example.com.db
```
$TTL 14400  
@ 86400 IN SOA ns1.example.com. admin@example.com. (  
    2008021501 ; serial, todays date+todays  
    86400 ; refresh, seconds  
    7200 ; retry, seconds  
    3600000 ; expire, seconds  
    86400 ) ; minimum, seconds  
example.com. 86400 IN NS ns1.example.com.  
example.com. 86400 IN NS ns2.example.com.  
ns1 IN A 111.222.333.444  
ns2 IN A 111.222.333.445  
example.com. IN A 111.222.333.444  
localhost.example.com. IN A 127.0.0.1  
example.com. IN MX 0 example.com.  
mail IN CNAME example.com.  
www IN CNAME example.com.  
ftp IN A 111.222.333.444
```

Basically, this file sets up each nameserver as ns1.example.com (111.222.333.444) and ns2.example.com (111.222.333.445). This matches the nameservers to each IP.  

Step 4
------

Then, restart BIND:  
```
service named restart
```

Step 5
------

Finally, you need to contact your registrar and register your new nameservers ns1.example.com and ns2.example.com. [Here are some step-by-step instructions](http://www.whsupport.net/register_nameservers.php) for the most common registrars.  
  
And that should do it! Please check out the following resources, as this short example just barely scratches the surface of DNS configuration:  

*   [Quick HOWTO : Ch18 : Configuring DNS](http://www.linuxhomenetworking.com/wiki/index.php/Quick_HOWTO_:_Ch18_:_Configuring_DNS#BIND)
*   [DNS/BIND: Create a basic zone file](http://www.tech-recipes.com/rx/305/dnsbind-create-a-basic-zone-file/)
*   [Chroot-BIND HOWTO](http://www.faqs.org/docs/Linux-HOWTO/Chroot-BIND-HOWTO.html)
*   [Bind: Quick install guide to install and setup Bind (DNS server) in secure (chroot) environment in Linux (CentOS, Redhat Enterprise (RHEL), Fedora).](http://crazytoon.com/2007/06/21/bind-quick-install-guide-to-install-and-setup-bind-dns-server-in-secure-chroot-environment-in-linux-centos-redhat-enterprise-rhel-fedora/)
