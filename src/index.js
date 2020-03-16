import './scss/main.scss';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

function get(endpoint, code ) {
    return new Promise ( ( resolve, reject ) => {
        fetch ( `/api/${endpoint}?station=${code}`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            }
        } ).then ( ( res ) => {
            if ( res.ok ) return res.json ();
            else reject ( res );
        } )
            .then ( json => {
                resolve ( json.payload );
            } )
    } );
}

// get('arrivals', 'STP').then(res => {
//     console.log ( res );
// });
// get('departures', 'STP').then(res => {
//     console.log ( res );
// });


