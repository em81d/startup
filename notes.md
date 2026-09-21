# CS 260 Notes

Here are my notes for the course!

- [My startup](https://startup.cs260.click)
- [My simon](https://simon.cs260.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

My server's ip is 3.88.3.121 and the elastic ip is 44.199.32.153 
mine is using t3 micro which should be plenty big for this project.

my account comes with the $100 of free credits, not the $200, so monitor and make sure the billing info works

exposes SSH, HTTP, and HTTPS so I can access the server with any of the three (tested SSH, that gives you the internal stuff, and tested HTTP, which gives you the page in your browser, but HTTPS has to wait until caddy is set up)

Notes from reading:
- most major companies have multiple ips associated  with  
a given domain for redundancy
- domain names listed in domain name registry
- possible list of top level domains controlled by 
one of the internet's governing boards
- subdomains resolve to different IPs
- use whois in the console to see who owns a domain
- including contact info!
- an A record maps domain to IP address
- a CNAME record maps a domain name to another domain
name (aliases, either can be used)
- when you enter a domain name in browser it checks if already cached,
if not it contacts a DNS server, if the DNS server
doesn't have it cached, it contacts an authoritative name server
- caching is clunky but more efficient in the long run
- you can set a max amount of time for it to be cached
- this helps if you need to update domain info
- buying a domain from a private party is way more expensive so think of a weird name
- you need a domain name (not just an IP) to use HTTPS
- do this through AWS Route 53, lasts a year

- ip address no longer works, just domain name
- used porkbun to buy domain and linked it to my route53 hosted zone

- completed all tasks - rented EC2 server, leased domain name, and made available online with HTTPS

## HTML

Interesting things I have learned about HTML

- use img, not image, although it seems <image> also works
- image tags should be self-closing
- <b> is to <div> what <span> is to <p>
- <th> or <td> elements are nested within <tr> elements, which are nested within the <table> element

- form element used to be very important for javascript as it was the only way to send user info back to server
- other input types include <select> for a selection dropdown, <option> for a selectable option, <meter> they choose from a range of values
- form needs attributes action (defines url to send to) and method (specifies http method to use)
- though JS can do most anything now, still use good practices with form for the sake of accessibility
- some elements like email have a pattern attribute that will check if an input fits a certain reg. expression in order to be valid

- use ./deployFiles.sh -k ~/prod.pem -h <domainname> -s <nameoftheservicedeployingto>

## React

Interesting things I have learned about React
