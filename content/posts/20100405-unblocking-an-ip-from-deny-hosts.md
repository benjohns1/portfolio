---
title: 'Unblocking an IP from Deny Hosts'
date: 2010-04-05T13:00:00.000-07:00
categories:
  - Blog
  - Linux
draft: false
---

As I was setting up my home testing server (Ubuntu Server 9.04), I kept running into issues with Deny Hosts while testing my server's authentication methods. It was a real pain to find out how to remove an IP that has been blocked.  
  
First of all, references to WORK\_DIR point to /var/lib/denyhosts/ or something similar on your system.  
The default location for the hosts.deny file is /etc/hosts.deny.  
  
Here's the method I used to unblock an IP:  

1.  Stop DenyHosts
2.  Remove the IP address from hosts.deny
3.  Remove all lines containing the IP address from the following files:  
    *   WORK\_DIR/hosts
    *   WORK\_DIR/hosts-restricted
    *   WORK\_DIR/hosts-root
    *   WORK\_DIR/hosts-valid
    *   WORK\_DIR/users-hosts
4.  Consider adding the IP address to WORK\_DIR/allowed-hosts
5.  Start DenyHosts
