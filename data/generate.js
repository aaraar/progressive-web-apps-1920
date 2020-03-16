const fs = require ( 'fs-extra' );
const path = require ( 'path' );
const { generateJson, getStations, getJson } = require ( './generateData' );
const { generateHtml } = require ( './generateHtml' );
const stationsPath = path.join ( __dirname, '..', 'public/data/stations.json' );
require ( 'dotenv' ).config ();
console.log ( process.env.NODE_ENV );

if ( process.env.NODE_ENV === 'production' ) {
    console.log ( '🧨 Destroying old tracks' );
    fs.remove ( path.join ( __dirname, '..', 'public' ), err => {
        if ( err ) console.error ( err );
        generateCommon ();
    } );
} else {
    generateCommon ()
}

function generateCommon() {
    generateJson ( stationsPath, getStations )
        .catch ( err => {
            console.error ( err )
        } )
        .then ( () => {
            getJson ( stationsPath )
                .catch ( err => {
                    console.error ( err )
                } )
                .then ( stations => {
                    generate404();
                    console.log ( '🚧 Constructing index station' );
                    generateIndex ( stations );
                    console.log ( '🚧 Constructing stations, this may take a while' );
                    process.stdout.write ( '🚂' );
                    generateStations ( stations );
                    process.stdout.write ( '\n' );
                } )
        } );
}

function generateStations( stations ) {
    stations.forEach ( station => {
        process.stdout.write ( '🚃' );
        generateHtml ( path.join ( __dirname, '..', `public/stations/${ station.code }/index.html` ),
            path.join ( __dirname, 'Pages/stations.pug' ),
            {
                title: "NS INFO",
                pageTitle: "NS",
                station: station
            } );
    } );
}

function generateIndex( stations ) {
    generateHtml ( path.join ( __dirname, '..', 'public/index.html' ),
        path.join ( __dirname, 'Pages/home.pug' ),
        {
            title: "NS INFO",
            pageTitle: "NS",
            stations: stations
        } );
}
function generate404( ) {
    generateHtml ( path.join ( __dirname, '..', 'public/404/index.html' ),
        path.join ( __dirname, 'Pages/404.pug' ),
        {
            title: "NS INFO",
            pageTitle: "404",
        } );
}