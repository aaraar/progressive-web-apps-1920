import {Station} from './pages/Station'
import {Api} from './Api'


export class Stations {
    private readonly stations: Station[]
    private api: Api

    constructor() {
        this.stations = []
        this.api = new Api()
    }

    async getAll() {
        let stations = await this.api.getStations()
        //@ts-ignore
        return stations.map(station => new Station(station))
    }

    render(listEl: HTMLElement, stations: Station[], country = 'NL') {
        // @ts-ignore
        if (!listEl instanceof Element || !listEl instanceof HTMLDocument) throw 'listEl is not an HTML element'// https://stackoverflow.com/a/36894871
        if (!stations[0]) {
            stations[0] = new Station({code: 'ERROR', namen: {lang: 'No stations found'}, land: 'ERROR'})
        }
        while (listEl.firstChild) listEl.removeChild(listEl.firstChild) // empties the ul
        stations.forEach(station => {
            station.render('markup', station.markup, listEl, 'beforeend', false)
            document.getElementById(`${station.code}-from`).addEventListener('click', (e) => {
                e.preventDefault()
                document.getElementById('from').value = station.code
                document.getElementById('fromLabel').innerText += ' ' + station.name
            })
            document.getElementById(`${station.code}-to`).addEventListener('click', (e) => {
                e.preventDefault()
                document.getElementById('to').value = station.code
                document.getElementById('toLabel').innerText += ' ' + station.name
            })
        })

    }

    filter(stations: Station[] = [], query: string = '', country: string = 'NL', limit: number = 20): Promise<Station[]> {
        return new Promise((resolve, reject) => {
            if (!stations[0]) {
                console.error('Empty station array in filter')
                this.getAll().then((res: Station[]) => {
                    filter(res)
                })
            } else filter(stations)

            function filter(stationArray) {
                resolve(stationArray.filter((station) =>
                    station.name.toLowerCase().includes(query.toLowerCase())
                    && (station.countryCode === country || country === 'ALL')).slice(0, limit))
            }
        })
    }

    reduce(code) {
        return new Promise((resolve, reject) => {
            this.getAll().then((stations: Station[]) => {
                resolve(stations.reduce((acc, curr) => acc = curr.code === code ? curr : acc))
            })
        })
    }
}