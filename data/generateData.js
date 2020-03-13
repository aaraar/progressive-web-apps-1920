const fetch = require ( 'node-fetch' );
const path = require ( 'path' );
const fs = require ( 'fs-extra' );
require ( 'dotenv' ).config ();


function writeToFile( writePath, data, cb ) {
    fs.mkdirp ( path.dirname ( writePath ), err => {
        if ( err ) console.error ( err );
        fs.writeFile ( writePath, data, { flag: 'w' }, cb )
    } );
}

function checkFile( writePath, mode = 'json' ) {
    return new Promise ( ( resolve, reject ) => {
        fs.readFile ( writePath, 'utf-8', ( err, data ) => {
            if ( err ) reject ( err );
            if ( mode === 'json' ) console.log ( `🛤 🔍 Data tracks constructed at ${ writePath }` );
            // else if ( mode === 'html' ) console.log ( `🛤 📄 Markup tracks constructed at  ${ writePath }` );
            // else console.log ( `👮 Are you spraying graffiti at ${ writePath } ?` );
            resolve ( data );
        } );
    } )
}

function generateJson( writePath, dataPromise ) {
    return new Promise ( ( resolve, reject ) => {
        dataPromise ().then ( ( json ) => {
            writeToFile ( writePath, JSON.stringify ( json ), ( err ) => {
                if ( err ) return console.error ( err );
                checkFile ( writePath ).then ( () => resolve () ).catch ( err => reject ( err ) )
            } );
        } );
    } )
}

function getStations() {
    return new Promise ( ( resolve, reject ) => {
        fetch (
            'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations',
            {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Ocp-Apim-Subscription-Key': process.env.API_KEY_STATIONS
                }
            } )
            .then ( ( res ) => {
                if ( res.ok ) return res.json ();
                else reject ( res );
            } )
            .then ( json => {
                resolve ( mapStations ( json.payload ) );
            } )
    } )
}

function getArrivals(code) {
    return new Promise ( ( resolve, reject ) => {
        fetch (
            `https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/arrivals?station=${code}`,
            {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Ocp-Apim-Subscription-Key': process.env.API_KEY_STATIONS
                }
            } )
            .then ( ( res ) => {
                if ( res.ok ) return res.json ();
                else reject ( res );
            } )
            .catch( err => { console.error( err ) } )
            .then ( json => {
                resolve (json.payload.arrivals );
            } )
    } )
}


function getJson(writePath) {
    return new Promise ( ( resolve, reject ) => {
        fs.readFile ( writePath, 'utf8', ( err, data ) => {
            if ( err ) reject ( err );
            resolve ( JSON.parse ( data ) );
        } )
    } )
}


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

module.exports = {
    generateJson: generateJson,
    getJson: getJson,
    getStations: getStations,
    writeToFile: writeToFile,
    checkFile: checkFile
};