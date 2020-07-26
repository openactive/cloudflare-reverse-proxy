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
  // Reverse proxy for old status page (can be removed when status page updated)
  || request.url === 'https://www.openactive.io/datasets/directory.json'
  // Reverse proxy for validator example links that have been emailed (can be removed after time has passed)
  || request.url.indexOf('https://www.openactive.io/data-models/versions') != -1
  ) {
    request = new Request(request)
    let url = new URL(request.url)
    const targetUrl = request.url.replace(url.hostname, 'openactive.io')
    // URL is set up to respond with dummy HTML, remove to send requests to your own origin
    let response = await fetch(targetUrl, request)
    // Make the headers mutable by re-constructing the Response.
    response = new Response(response.body, response)
    return response

  // Serve new site (can be removed when old site fully decommissioned)
  } else if (request.headers.get('X-WP') == 'true') {
    return fetch(request)
  
  // Serve old site (can be removed when old site fully decommissioned)
  } else {
    request = new Request(request)
    let url = new URL(request.url)
    const targetUrl = request.url.replace(url.hostname, TARGET_HOST)
    // URL is set up to respond with dummy HTML, remove to send requests to your own origin
    let response = await fetch(targetUrl, request)
    // Make the headers mutable by re-constructing the Response.
    response = new Response(response.body, response)
    return response
  }
}
