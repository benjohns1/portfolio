---
title: 'Handy Linux Commands'
date: 2010-04-01T16:00:00.000-07:00
categories:
  - Blog
  - Linux
draft: false
---

Since installing Ubuntu on my home machine about a year ago, I've compiled a list of simple commands that I frequently need, but always have to look them up in the man pages:  

  

scp /path/to/local/file username@host:/path/to/remote/location
- copies a local file to a server via ssh

find . -name filename | xargs -I % rm -rf %
- finds all instances of filename and remove them (CAREFUL!)

ln -s /target/path/to/file /path/to/link
- creates a symbolic link

ls -d \*/
- lists all directories in cwd

du -hs /path/to/directory
- prints the size of directory

du -h --max-depth=1 /path/to/directory
- prints the size of each folder and file in directory
