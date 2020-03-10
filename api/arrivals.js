const fetch = require ( 'node-fetch' );
module.exports = ( req, res ) => {
    const { station = 'AMS' } = req.query;
    fetch (
        `https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/arrivals?station=${ station.toUpperCase () }`,
        {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Ocp-Apim-Subscription-Key': process.env.API_KEY_STATIONS
            }
        } )
        .then ( ( response ) => {
            if ( response.ok ) return response.json ();
            else reject ( response );
        } )
        .then ( data => {
            res.json ( data );
        } )
};