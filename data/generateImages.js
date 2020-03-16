require ( 'dotenv' ).config ();
const path = require ( 'path' );
const request = require ( 'request' );
const fs = require ( 'fs-extra' );
const pump = require ( 'pump' );
const { getJson } = require ( "./generateData" );
const stationsPath = path.join ( __dirname, '..', 'public/data/stations.json' );


getJson ( stationsPath )
    .catch ( err => {
        console.error ( err )
    } )
    .then ( stations => {
        // if ( process.env.NODE_ENV === 'production' ) {
        console.log ( '🗺 Generating maps of the stations' );
        fs.mkdirp(path.join ( __dirname, '..', `src/assets/images/maps` ));
        stations.forEach ( async (station) => {
            await getImages ( station.lng, station.lat, station.code ).catch ( err => console.error ( err ) ).catch(err => {console.error(err)})
        } )
    });

/**
 *
 * @param lng
 * @param lat
 * @param code
 * @returns {Promise<void>}
 */
async function getImages( lng, lat, code ) {
    console.log ( path.join ( __dirname, '..', `src/assets/images/${ code.toUpperCase () }.png` ) );
    await pump ( request ( `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${ lng },${ lat },15,0,60/600x600?access_token=${ process.env.MAPBOX_TOKEN }` ),
        fs.createWriteStream ( path.join ( __dirname, '..', `src/assets/images/maps/${ code.toUpperCase () }.png` ),
            { encoding: 'base64' } ) );
}

exports.getImages = getImages;