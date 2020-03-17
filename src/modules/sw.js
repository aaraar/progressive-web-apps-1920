const CORE_ASSETS = [
    '/',
    '/404',
    'main.js',
    'styles.css'
];

self.addEventListener('install', (event) => {
    const preCache = async () => {
        caches.open('core')
            .then((cache) => {
                return cache.addAll(CORE_ASSETS);
            });
    };
    event.waitUntil(preCache().then(self.skipWaiting())
    );
});

self.addEventListener('fetch', (event) => {
    const hasQuery = event.request.url.indexOf('?') !== -1;
    if (isCoreGetRequest(event.request)) {
        event.respondWith(
        caches.open('core').then((cache) => {
                console.log('core');
                return cache.match(event.request)
            }).catch(() => {
            return new Response('CORE_ASSETS not found in cache');
        })
    )} else if (isHtmlGetRequest(event.request)) {
        event.respondWith(
            caches.match(event.request, {
                ignoreSearch: hasQuery
            }).then((resp) => {
                console.log('Page request');
                return resp || fetch(event.request, {redirect: 'follow'}).then((response) => {
                    let responseClone = response.clone();
                    caches.open('html').then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                });
            }).catch(() => {
                caches.open('core').then(cache => cache.match('/404'));
            })
        )}
});

/**
 *
 * @param request
 * @returns {boolean|boolean}
 */
function isHtmlGetRequest(request) {
    return request.method === 'GET' && (request.headers.get('accept') !== null && request.headers.get('accept').indexOf('text/html') > -1);
}

/**
 *
 * @param request
 * @returns {boolean|boolean}
 */
function isJsGetRequest(request) {
    return request.method === 'GET' && (request.headers.get('accept') !== null && request.headers.get('accept').indexOf('application/javascript') > -1);
}

/**
 *
 * @param request
 * @returns {boolean|boolean}
 */
function isCssGetRequest(request) {
    return request.method === 'GET' && (request.headers.get('accept') !== null && request.headers.get('accept').indexOf('text/css') > -1);
}

/**
 *
 * @param request
 * @returns {boolean|boolean}
 */
function isCoreGetRequest(request) {
    return request.method === 'GET' && (request.headers.get('accept') !== null && CORE_ASSETS.includes(getPathName(request.url)))
}

/**
 *
 * @param requestUrl
 * @returns {string}
 */
function getPathName(requestUrl) {
    const url = new URL(requestUrl);
    return url.pathname
}