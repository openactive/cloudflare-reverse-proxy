/**
 * This Cloudflare reverse proxy serves JSON-LD for resources on the openactive.io
 * domain when the 'Accept' header of a request contains 'application/ld+json'.
 * This is required to ensure compliance with JSON-LD.
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const jsonLdUrlMap = {
  '/': '/ns/oa.jsonld',
  '/activity-list': '/activity-list/activity-list.jsonld',
  '/accessibility-support': '/accessibility-support/accessibility-support.jsonld',
  '/ns-beta': '/ns-beta/beta.jsonld',
  '/test-interface': '/test-interface/test-interface.jsonld',
  '/ns-extension': '/ns-extension/extension.jsonld',
  '/facility-types': '/facility-types/facility-types.jsonld'
}

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  // Make the headers mutable by re-constructing the Request.
  let url = new URL(request.url)
  let hasJsonLdAcceptHeader = /(ld\+)?json/.test(request.headers.get('Accept'))
  // If JSON-LD has been required
  if (hasJsonLdAcceptHeader && jsonLdUrlMap[url.pathname]) {
    // Construct JSON-LD URL for the path specified
    const targetUrl = 'https://openactive.io' + jsonLdUrlMap[url.pathname];
    // Fetch JSON-LD
    let response = await fetch(targetUrl, request)
    // Recreate the response so we can modify the headers
    response = new Response(response.body, response)
    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
  // If JSON-LD has not been requested, override the 301 redirect
  // of GitHub pages with a 302 to ensure browsers don't incorrectly
  // cache the redirect without respecting the varying Accept header
  } else if (!/\/$/.test(url.pathname)) {
    url.pathname = url.pathname + '/'
    return Response.redirect(url, 302)
  } else if (url.pathname === '/') {
    return Response.redirect('https://www.openactive.io/', 302)
  }
  return fetch(request)
}
