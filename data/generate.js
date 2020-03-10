const fs = require ( 'fs-extra' );
const path = require ( 'path' );
const { generateStations, getStations } = require ( './generateData' );
const { generateHtml } = require ( './generateHtml' );
require ( 'dotenv' ).config ();

fs.remove ( path.join ( __dirname, '..', 'dist' ), err => {
    if ( err ) console.error ( err );
    generateStations ( path.join ( __dirname, '..', 'dist/data/stations.json' ) ).then ( () => {
        getStations ().then ( data => {
            const stations = mapStations(data.payload);
            generateHtml ( path.join ( __dirname, '..', 'dist/index.html' ),
                path.join ( __dirname, 'Pages/home.pug' ),
                {
                    title: "NS INFO",
                    pageTitle: "NS",
                    stations: mapStations ( stations)
                } );
        } )
    } );
} );


function mapStations( stations ) {
    return stations.map ( station => {
        station.name = station.namen.lang;
        station.countryCode = station.land;
        switch ( station.land ) {
            case 'ERROR':
                station.country = 'Try redefining your search';
                break;
            case 'NL':
                station.country = 'The Netherlands';
                break;
            case 'D':
                station.country = 'Germany';
                break;
            case 'B':
                station.country = 'Belgium';
                break;
            case 'F':
                station.country = 'France';
                break;
            case 'GB':
                station.country = 'Great-Britain';
                break;
            case 'A':
                station.country = 'Austria';
                break;
            case 'CH':
                station.country = 'Switzerland';
                break;
        }
        return station;
    } );
}