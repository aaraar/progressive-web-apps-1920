const path = require ( 'path' );
const express = require ( 'express' );
const { Api } = require ( './controllers/api' );
const { Station } = require ( './models/Station' );
const { Home } = require ( './controllers/Home' );
const fetch = require ( 'node-fetch' );
require ( 'dotenv' ).config ();

const home = new Home ();
const station = new Station();
const port = process.env.PORT;

const app = express ();
app.set ( 'view engine', 'pug' );
app.set ( 'views', path.join ( __dirname + '/views' ) );
app.use ( express.static ( path.join ( __dirname + ( '/static' ) ) ) );

app.get ( '/', home.route );
app.get ( '/stations/:code', station.route);

app.listen ( port, function () {
    console.log ( `Application started on port: ${ port }` );
} );