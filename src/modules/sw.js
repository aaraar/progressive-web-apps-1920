self.addEventListener('install', (event) => {
    const preCache = async () => {
        caches.open('html')
            .then((cache) => {
                return cache.addAll([
                    '/',
                    '/404'
                ]);
            });
        caches.open('js')
            .then((cache) => {
                return cache.addAll([
                    '/main.js'
                ]);
            });
        caches.open('css')
            .then((cache) => {
                return cache.addAll([
                    '/styles.css'
                ]);
            })
            .then(self.skipWaiting())
    };
    event.waitUntil(preCache().then(self.skipWaiting())
    );
});

self.addEventListener('fetch', (event) => {
    const hasQuery = event.request.url.indexOf('?') !== -1;
    if (isHtmlGetRequest(event.request)) {
        event.respondWith(
        caches.match(event.request, {
            ignoreSearch: hasQuery
        }).then((resp) => {
            return  resp || fetch(event.request).then((response) => {
                let responseClone = response.clone();
                caches.open('html').then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response
            });

        }).catch(() => {
            return caches.match('/404');
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