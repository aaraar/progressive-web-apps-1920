import './scss/main.scss';

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

get('arrivals', 'STP').then(res => {
    console.log ( res );
});
get('departures', 'STP').then(res => {
    console.log ( res );
});
