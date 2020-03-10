const fetch = require ( 'node-fetch' );
require('dotenv').config();

function getImage( lng, lat ) {
    return new Promise ( ( resolve, reject ) => {
        fetch ( `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${ lng },${ lat },15,0/600x600?access_token=${ process.env.MAPBOX_TOKEN }` )
            .then ( ( res ) => {
                if ( res.ok ) return res;
                else reject ( res );
            } )
            .then ( res => {
                resolve ( res );
            } )
    } )
}

getImage ( 51.531437, -0.126136, ).then ( res => {
    console.log ( res.body )
} ).catch ( err => {
    console.error ( err )
} );