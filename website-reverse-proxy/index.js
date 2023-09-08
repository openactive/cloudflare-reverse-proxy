/**
 * This Cloudflare reverse proxy serves content at the subdomain https://www.openactive.io/ that is
 * now hosted at https://openactive.io/, where a 301 redirect would break existing implementations.
 * This is required for backwards compatibility, for example with Gladstone's OWS.
 *
 * Changes to this script must be made via https://github.com/openactive/cloudflare-reverse-proxy/
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  // Reverse proxy to support Gladstone OWS use of www
  // OWS needs to be upgraded to remove the www
  if (request.url === 'https://www.openactive.io/activity-list/activity-list.jsonld' 
  || request.url === 'https://www.openactive.io/accessibility-support/accessibility-support.jsonld'
  || request.url === 'https://www.openactive.io/facility-types/facility-types.jsonld'
  || request.url === 'https://www.openactive.io/assets/openactive-logo-small.png'
  ) {
    request = new Request(request)
    let url = new URL(request.url)
    const targetUrl = request.url.replace('/assets/', '/brand-assets/').replace(url.hostname, 'openactive.io')
    let response = await fetch(targetUrl, request)
    return response
  }
}
