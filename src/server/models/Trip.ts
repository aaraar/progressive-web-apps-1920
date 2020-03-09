import { Page } from '../controllers/Page';

type Stop = {
    origin: { any }
    destination: { any }
    actualArrivalDateTime: string;
    plannedArrivalDateTime: string;
    name: string;
}

export class Trip extends Page {
    readonly ctxRecon: string;
    private legs: {
        destination: any
        origin: any
        stops: Stop[]
    }[];

    constructor ( ctxRecon ) {
        super ( '' );
        this.ctxRecon = ctxRecon;
    }

    async init () {
        // @ts-ignore
        const trip: Trip = await this.getTrip ( this.ctxRecon );
        this.legs = trip.legs;
    }

    parseMarkup () {
        const legs = this.legs.map ( leg => {
            const originDateTime = leg.origin.actualDateTime
                ? new Date ( leg.origin.actualDateTime ).toLocaleTimeString ().slice ( 0, 5 )
                : new Date ( leg.origin.plannedDateTime ).toLocaleTimeString ().slice ( 0, 5 );
            const destinationArrival = leg.destination.actualDateTime
                ? new Date ( leg.destination.actualDateTime ).toLocaleTimeString ().slice ( 0, 5 )
                : new Date ( leg.destination.plannedDateTime ).toLocaleTimeString ().slice ( 0, 5 );
            const stops: Stop[] = leg.stops.slice ( 1, leg.stops.length );
            const stopMarkup = stops.filter ( stop => stop.plannedArrivalDateTime || stop.actualArrivalDateTime )
                .map ( ( stop ) => {
                    const arrivalDateTime = stop.actualArrivalDateTime
                        ? new Date ( stop.actualArrivalDateTime ).toLocaleTimeString ().slice ( 0, 5 )
                        : new Date ( stop.plannedArrivalDateTime ).toLocaleTimeString ().slice ( 0, 5 );
                    return `<p>${ stop.name } - ${ arrivalDateTime }</p>`;
                } );
            return `<div class="trip--leg">
                <h3>${ leg.origin.name } - Departure ${ originDateTime }</h3>
               ${ stopMarkup.join ( '' ) }
                <h3>${ leg.destination.name } - Arrival: ${ destinationArrival }</h3>
            </div>`;
        } );
        this.markup =
            `
            <h2>Trip from ${ this.legs[ 0 ].origin.name } to ${ this.legs[ this.legs.length - 1 ].destination.name }</h2> 
            ${ legs.join ( '<p class="transfer">Transfer</p>' ) }
            `;
    }

    renderDetails = async () => {
        this.render ( 'loading' );
        this.parseMarkup ();
        this.render ();
    };
}