# cloudflare-reverse-proxy [![Deploy to Cloudflare](https://github.com/openactive/cloudflare-reverse-proxy/workflows/Deploy%20to%20Cloudflare/badge.svg)](https://github.com/openactive/cloudflare-reverse-proxy/actions)
This repository contains Cloudflare reverse proxy scripts for OpenActive.io.

## Purpose

### [jsonld-reverse-proxy](jsonld-reverse-proxy/index.js)
This Cloudflare reverse proxy serves JSON-LD for resources on the openactive.io domain when the "`Accept`" header of a request contains "`application/ld+json`". This is required to ensure compliance with JSON-LD.

### [website-reverse-proxy](website-reverse-proxy/index.js)
This Cloudflare reverse proxy serves content at the subdomain https://www.openactive.io/ that is now hosted at https://openactive.io/, where a 301 redirect would break existing implementations. This is required for backwards compatibility, for example with Gladstone's OWS.

## Deployment 
This repository is configured to automatically deploy the `master` branch to the Cloudflare LIVE environment via Github Actions.

## Contribution
Commits to the master branch of this repository that affect the `*.js` files have the potential to bring down products that rely on these reverse proxies for backwards compatibility or JSON-LD compatibility, hence every change to the master branch MUST be submitted in a pull request and have at least one external review.
