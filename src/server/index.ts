const path = require ( 'path' );
const express = require ( 'express' );
const { Api } = require ( './controllers/api' );
const fetch = require ( 'node-fetch' );
require ( 'dotenv' ).config ();

const api = new Api ();
const port = process.env.PORT;

const app = express ();
app.set ( 'view engine', 'pug' );
app.set ( 'views', path.join ( __dirname + '/views' ) );
app.use ( express.static ( path.join ( __dirname + ( '/static' ) ) ) );

app.get ( '/', ( req: any, res: { render: ( arg0: string, arg1: { title: string; pageTitle: string; stations: any; } ) => void; } ) => {
    fetch (
        'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations',
        {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Ocp-Apim-Subscription-Key': 'process.env.API_KEY_STATIONS'
            }
        } )
        .then ( ( response: Response ) => {
            return response.json ();
        } )
        .then ( stations => {
            res.render ( 'home', { title: 'NS info', pageTitle: 'NS', stations: stations.payload } );
        } );
} );

app.get ( '/stations/:code', ( req, res ) => {
    fetch (
        `https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/arrivals?station=${ req.params.code.toUpperCase () }`,
        {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Ocp-Apim-Subscription-Key': 'process.env.API_KEY_STATIONS'
            }
        } )
        .then ( ( response: Response ) => {
            return response.json ();
        } )
        .then ( arrivals => {
            res.render ( 'station', { title: 'NS info', pageTitle: 'NS', arrivals: arrivals.payload.arrivals } );
        } );
} );

app.listen ( port, function () {
    console.log ( `Application started on port: ${ port }` );
} );