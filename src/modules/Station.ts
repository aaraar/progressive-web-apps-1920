import {Page} from '../Page'
import {ArrivalsResponse, DeparturesResponse} from '../Api'

export type CountryCode = 'ERROR' | 'NL' | 'D' | 'B' | 'F' | 'GB' | 'A' | 'CH'

export class Station extends Page {
    code: string
    readonly name: string
    countryCode: CountryCode
    private arrivals: Promise<ArrivalsResponse> | ArrivalsResponse
    private departures: Promise<DeparturesResponse>
    private readonly country: any

    constructor(station: { code: string, namen: { lang: string }, land: CountryCode }) {
        super('')
        this.code = station.code
        this.name = station.namen.lang
        this.countryCode = station.land
        switch (station.land) {
            case 'ERROR':
                this.country = 'Try redefining your search'
                break
            case 'NL':
                this.country = 'The Netherlands'
                break
            case 'D':
                this.country = 'Germany'
                break
            case 'B':
                this.country = 'Belgium'
                break
            case 'F':
                this.country = 'France'
                break
            case 'GB':
                this.country = 'Great-Britain'
                break
            case 'A':
                this.country = 'Austria'
                break
            case 'CH':
                this.country = 'Switzerland'
                break
        }
        const buttons = station.land !== 'ERROR'
            ? `<button id="${this.code}-from">From</button>
               <button id="${this.code}-to">To</button>`
            : ''
        this.markup =
            `<li class="stations--item">
                <a href="/web-app-from-scratch-1920/#stations/${this.code}">
                    <h3>${this.name}</h3>
                    <p>${this.country}</p>
                </a>
                <div>
                ${buttons}
                </div>
            </li>`
    }

    async init() {
        this.arrivals = this.getArrivals(this.code)
        this.departures = this.getDepartures(this.code)
    }

    async renderDetails() {
        this.render('loading')
        const arrivalsEl = document.createElement('ul')
        const departuresEl = document.createElement('ul')
        arrivalsEl.classList.add('station--list')
        departuresEl.classList.add('station--list')
        const arrivals = await this.arrivals
        const departures = await this.departures
        //@ts-ignore
        arrivals.payload.arrivals.forEach(arrival => {
            const item = document.createElement('li')
            item.innerText = arrival.origin
            item.classList.add('stations--item')
            arrivalsEl.appendChild(item)
        })
        departures.payload.departures.forEach(departure => {
            const item = document.createElement('li')
            const routeUl = document.createElement('ul')
            departure.routeStations.forEach(station => {
                const stop = document.createElement('li')
                stop.innerText = station.mediumName
                routeUl.appendChild(stop)
            })
            item.classList.add('stations--item')

            item.innerText = departure.direction
            item.appendChild(routeUl)
            departuresEl.appendChild(item)
        })
        this.markup =
            `
            <section class="station--wrapper">
                <h2>${this.name}</h2>
                <div class="station--arrivals">
                    <h3>Arrivals</h3>
                </div>
                <div class="station--departures">
                    <h3>Departures</h3>
                </div>
            </section>
           `
        this.render()
        document.querySelector('.station--arrivals').appendChild(arrivalsEl)
        document.querySelector('.station--departures').appendChild(departuresEl)
    }
}