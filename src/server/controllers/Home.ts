// import { Page } from '../controllers/Page';
import { Stations } from '../models/Stations';
const fetch = require('node-fetch');

export class Home{
    route ( req: any, res: { render: ( arg0: string, arg1: { title: string; pageTitle: string; stations: any; } ) => void; } ) {
        fetch (
            'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations',
            {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Ocp-Apim-Subscription-Key': process.env.API_KEY_STATIONS
                }
            } )
            .then ( ( response: Response ) => {
                return response.json ();
            } )
            .then ( ( json: { payload: any[]; } ) => {
                const stations = new Stations ( json.payload );
                res.render ( 'home', { title: 'NS info', pageTitle: 'NS', stations: stations.mapped } );
            } );
    }
}