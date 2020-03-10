const fetch = require ( 'node-fetch' );
const path = require ( 'path' );
const fs = require('fs-extra');
require ( 'dotenv' ).config ();


function writeToFile( writePath, data, cb ) {
    fs.mkdirp ( path.dirname ( writePath ), err => {
        if (err) console.error(err);
        fs.writeFile ( writePath, data, { flag: 'w' }, cb)
    } );
}

function checkFile(writePath, mode = 'json') {
    return new Promise((resolve, reject) => {
        fs.readFile ( writePath, 'utf-8', ( err, data ) => {
            if ( err ) reject( err );
            if (mode === 'json') console.log ( `🛤 Laying data tracks at ${ writePath }` );
            else if (mode === 'html') console.log ( `🚂 Driving markup train over ${ writePath }` );
            else console.log ( `👮 Are you spraying graffiti at ${ writePath } ?` );
            resolve ( data );
        } );
    })
}

function generateStations(writePath) {
    return new Promise((resolve, reject) => {
        getStations().then ( ( json ) => {
            writeToFile (writePath , JSON.stringify ( json ), (err) => {
                if ( err ) return console.error ( err );
                checkFile(writePath).then(() => resolve()).catch(err => reject(err))
            });
        } );
    })
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
                if (res.ok) resolve(res.json());
                else reject ( res );
            } )
    })
}


function getStationsFromJson() {
    return new Promise ( ( resolve, reject ) => {
        fs.readFile ( path.join ( __dirname, '..', 'dist/data/stations.json' ), 'utf8', ( err, data ) => {
            if ( err ) reject ( err );
            resolve ( JSON.parse ( data ) );
        } )
    } )
}

module.exports = {
    generateStations: generateStations,
    getStations: getStationsFromJson,
    writeToFile: writeToFile,
    checkFile: checkFile
};