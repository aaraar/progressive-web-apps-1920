import { CountryCode } from '../models/Station';
import { Trip } from '../models/Trip';

type Response = {
    payload?: {
        code: string,
        namen: {
            lang: string
        },
        land: CountryCode
    }[]
}

export type DeparturesResponse = {
    payload?: {
        departures: {
            direction: string,
            routeStations: [
                { mediumName: string }
            ]
        }[]
    }
}

export type ArrivalsResponse = {
    payload?: {
        arrivals: {
            origin: string
        }[]
    }
}

interface RequestObject {
    method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'UPDATE'
    mode?: 'cors' | 'no-cors' | 'same-origin'
    cache?: 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached'
    credentials?: 'same-origin' | 'include' | 'omit'
    headers?
    body?
}

export class Api {
    private rawStations: { code: string; namen: { lang: string }; land: CountryCode }[];

    async fetch (
        baseUrl: string,
        endpoint: string,
        requestObject: RequestObject,
        queries: string[][] = [ [ '' ] ] ): Promise<object> {
        const queryArray: string[] = queries.map ( query => query.join ( '=' ) );
        const query: string = queryArray.join ( '&' );
        return new Promise ( ( resolve, reject ) => {
            fetch ( `https://cors-anywhere.herokuapp.com/${ baseUrl }${ endpoint }?${ query }`, requestObject )
                .then ( res => {
                    if ( res.ok ) resolve ( res.json () );
                    else reject ( res );
                } )
                .catch ( err => console.error ( err ) );
        } );
    }

    getStations () {
        this.fetch (
            'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/',
            'stations',
            {
                method: 'GET',
                headers: {
                    'Ocp-Apim-Subscription-Key': 'process.env.API_KEY_STATIONS'
                }
            } )
            .then ( ( res: Response ) => {
                this.rawStations = res.payload;
                return res.payload;
            } );
    }

    getArrivals ( code ) {
        return new Promise ( ( resolve, reject ) => {
            this.fetch (
                'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/',
                'arrivals', {
                    method: 'GET',
                    headers: {
                        'Ocp-Apim-Subscription-Key': 'process.env.API_KEY_STATIONS'
                    }
                }, [ [ 'station', code ] ] )
                .then ( ( res: ArrivalsResponse ) => {
                    resolve ( res );
                } );
        } );
    }

    getDepartures ( code ) {
        return new Promise ( ( resolve, reject ) => {
            this.fetch (
                'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/',
                'departures', {
                    method: 'GET',
                    headers: {
                        'Ocp-Apim-Subscription-Key': 'process.env.API_KEY_STATIONS'
                    }
                }, [ [ 'station', code ] ] )
                .then ( ( res: DeparturesResponse ) => {
                    resolve ( res );
                } );
        } );
    }

    getTrips ( from, to ) {
        return new Promise ( ( resolve, reject ) => {
            this.fetch (
                'https://gateway.apiportal.ns.nl/public-reisinformatie/api/v3/',
                'trips', {
                    method: 'GET',
                    headers: {
                        'Ocp-Apim-Subscription-Key': 'process.env.API_KEY_TRIPS'
                    }
                }, [ [ 'fromStation', from.toLowerCase () ], [ 'toStation', to.toLowerCase () ] ] )
                .then ( ( res: { trips: Trip[] } ) => {
                    res.trips.forEach ( trip => {
                        if ( !localStorage.getItem ( trip.ctxRecon ) ) localStorage.setItem ( trip.ctxRecon, JSON.stringify ( trip ) );
                    } );
                    resolve ( res );
                } );
        } );
    }

    getTrip ( ctxRecon ) {
        return new Promise ( ( resolve, reject ) => {
            if ( localStorage.getItem ( ctxRecon ) ) resolve ( JSON.parse ( localStorage.getItem ( ctxRecon ) ) );
            else {
                this.fetch (
                    'https://gateway.apiportal.ns.nl/public-reisinformatie/api/v3/',
                    'trips/trip', {
                        method: 'GET',
                        headers: {
                            'Ocp-Apim-Subscription-Key': 'process.env.API_KEY_TRIPS'
                        }
                    }, [ [ 'ctxRecon', encodeURIComponent ( ctxRecon ) ], [ 'lang', 'en' ], [ 'travelClass', '2' ] ] )
                    .then ( ( res: Trip ) => {
                        resolve ( res );
                    } );
            }
        } );
    }
}