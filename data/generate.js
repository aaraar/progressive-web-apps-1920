const fs = require ( 'fs-extra' );
const path = require ( 'path' );
const { generateJson, getStations, getJson } = require ( './generateData' );
const { generateHtml } = require ( './generateHtml' );
const stationsPath = path.join ( __dirname, '..', 'public/data/stations.json' );
require ( 'dotenv' ).config ();

console.log('🧨 Destroying old tracks');
fs.remove ( path.join ( __dirname, '..', 'public' ), err => {
    if ( err ) console.error ( err );
    generateJson ( stationsPath, getStations ).then ( () => {
        getJson ( stationsPath ).then ( stations => {
            console.log('🚧 Constructing index station');
    
            generateHtml ( path.join ( __dirname, '..', 'public/index.html' ),
                path.join ( __dirname, 'Pages/home.pug' ),
                {
                    title: "NS INFO",
                    pageTitle: "NS",
                    stations: stations
                } );
    
            console.log('🚧 Constructing stations, this may take a while');
            process.stdout.write('🚂');
            generateStations(stations);
            process.stdout.write('\n');
        } )
    } );
} );

function generateStations(stations) {
        stations.forEach ( station => {
            process.stdout.write('🚃');
            generateHtml ( path.join ( __dirname, '..', `public/stations/${station.code}.html` ),
                path.join ( __dirname, 'Pages/stations.pug' ),
                {
                    title: "NS INFO",
                    pageTitle: "NS",
                    station: station
                } );
        } );
}


`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${station.lng},${station.lat},15,0/600x600?access_token=${process.env.MAPBOX_TOKEN}
`