import './scss/main.scss'
import {Page} from './Page'
import {Home} from './pages/Home'
import {Stations} from './Stations'
import {Router} from './Router'
import {Trips} from './pages/Trips'
import {Trip} from './pages/Trip'

class App {
    stations: Stations
    home: Home
    router: Router

    constructor() {
        this.stations = new Stations()
        this.home = new Home(this.stations)
    }

    init() {
        this.router = new Router(
            {
                path: '/stations/:code/',
                callback: async (code) => {
                    const station: any = await this.stations.reduce(code)
                    station.init().then(station.renderDetails())
                }
            },
            {
                path: '/trips/from/:from/to/:to/',
                callback: async (from, to) => {
                    const fromStation = await this.stations.reduce(from)
                    const toStation = await this.stations.reduce(to)
                    const trips = new Trips(fromStation, toStation)
                    trips.init().then(trips.renderList)
                }
            },
            {
                path: '/trip/:ctxRecon',
                callback: async (ctxRecon) => {
                    const trip = new Trip(decodeURIComponent(ctxRecon))
                    trip.init().then(trip.renderDetails)
                }
            },
            {
                path: '/',
                callback: async () => {
                    this.home.init()
                    this.home.renderStations()
                }
            },
            {
                path: '', callback: () => {
                    new Page('<h2>404 Page not found</h2>').render()
                }
            })
    }
    // fixLinks() {
    //     document.querySelectorAll('a').forEach( link => {
    //         link.addEventListener('click')
    //     })
    // }
}

const app = new App
app.init()




