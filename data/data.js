const fs  = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const mkdirp = require('mkdirp');
require('dotenv').config();
console.log ( process.env.API_KEY_STATIONS );

fetch (
    'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations',
    {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Ocp-Apim-Subscription-Key': process.env.API_KEY_STATIONS
        }
    } )
    .then ( ( response ) => {
        return response.json ();
    } )
    .then ( ( json  ) => {
        const writePath = path.join(__dirname, '../', 'dist/data/stations.json');
        mkdirp.sync(path.dirname(writePath));
        fs.writeFile(writePath, JSON.stringify(json), { flag: 'w' }, function(err) {
            if (err)
                return console.error(err);
            fs.readFile(writePath, 'utf-8', function (err, data) {
                if (err)
                    return console.error(err);
                console.log(`Data is written, check ${writePath} for results or turn on verbose`);
            });
        });
    } );

