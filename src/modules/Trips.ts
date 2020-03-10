import {Page} from '../Page'
import {Station} from './Station'

export class Trips extends Page {
    private readonly from: Station
    private readonly to: Station
    private trips: Promise<unknown>

    constructor(from, to) {
        super(``)
        this.from = from
        this.to = to
    }

    async init() {
        await this.from
        await this.to
        this.trips = this.getTrips(this.from.code, this.to.code)
    }

    renderList = async () => {
        this.render('loading')
        const tripsEl = document.createElement('ul')
        tripsEl.classList.add('trips--list')
        const trips = await this.trips
        console.log(trips)
        // @ts-ignore
        trips.trips.forEach(trip => {
            const item = document.createElement('li')
            const link = document.createElement('a')
            link.href = `/web-app-from-scratch-1920/#trip/${encodeURIComponent(trip.ctxRecon)}`
            link.classList.add('trips--item')
            const title = document.createElement('h3')
            const time = document.createElement('p')
            const via = document.createElement('p')
            const stops = trip.legs.length > 1
                ? trip.legs.map(leg => leg.destination.name)
                : trip.legs[0].stops.filter(stop => stop.plannedArrivalDateTime || stop.actualArrivalDateTime)
                                    .map(stop => stop.name)
            stops.join(', ')
            via.innerText = `Via ${stops.slice(0, stops.length - 1).join(', ')} & ${stops.slice(stops.length - 1)}`
            title.innerText = trip.legs.length > 1 ? `${trip.legs.length} trains` : trip.legs[0].direction
            const departureTime = trip.legs[0].origin.actualDateTime
                ? new Date(trip.legs[0].origin.actualDateTime).toLocaleTimeString().slice(0, 5)
                : new Date(trip.legs[0].origin.plannedDateTime).toLocaleTimeString().slice(0, 5)
            const arrivalTime = trip.legs[trip.legs.length -1].destination.actualDateTime
                ? new Date(trip.legs[trip.legs.length -1].destination.actualDateTime).toLocaleTimeString().slice(0, 5)
                : new Date(trip.legs[trip.legs.length -1].destination.plannedDateTime).toLocaleTimeString().slice(0, 5)
            time.innerText = `${departureTime} - ${arrivalTime}`
            link.append(title, time, via)
            item.appendChild(link)
            tripsEl.appendChild(item)
        })
        this.markup =
            `
            <section class="trips--wrapper">
                <h2>Trips from ${this.from.name} to ${this.to.name}</h2>
                <div class="trips"></div>
            </section>
           `
        this.render()
        document.querySelector('.trips').appendChild(tripsEl)
    }
}