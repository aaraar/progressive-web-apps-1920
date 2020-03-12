require ( 'dotenv' ).config ();
const path = require ( 'path' );
const request = require ( 'request' );
const fs = require ( 'fs' );
const pump = require ( 'pump' );
const { getJson } = require ( "./generateData" );
const stationsPath = path.join ( __dirname, '..', 'public/data/stations.json' );

getJson ( stationsPath )
    .catch ( err => {
        console.error ( err )
    } )
    .then ( stations => {
        console.log ( stations.length );
        stations.forEach ( station => {
            getImage ( station.lng, station.lat, station.code ).catch ( err => console.error ( err ) )
        } )
    } );


async function getImage( lng, lat, code ) {
    console.log ( `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${ lng },${ lat },5,20/600x600?access_token=${ process.env.MAPBOX_TOKEN }` );
    await pump ( request ( `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${ lng },${ lat },15,0,60/600x600?access_token=${ process.env.MAPBOX_TOKEN }` ),
        fs.createWriteStream ( path.join ( __dirname, '..', `public/stations/${ code.toUpperCase () }/map.png` ),
            { encoding: 'base64' } ) );
}