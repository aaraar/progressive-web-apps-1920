export class Stations {
    private all: any;
    private mapped: any;
    constructor ( stations: any[] ) {
        this.all = stations;
        // @ts-ignore
        this.mapped = this.map ( stations );
    }

    map ( stations: any[] ) {
        return stations.map ( station => {
            station.name = station.namen.lang;
            station.countryCode = station.land;
            switch ( station.land ) {
                case 'ERROR':
                    station.country = 'Try redefining your search';
                    break;
                case 'NL':
                    station.country = 'The Netherlands';
                    break;
                case 'D':
                    station.country = 'Germany';
                    break;
                case 'B':
                    station.country = 'Belgium';
                    break;
                case 'F':
                    station.country = 'France';
                    break;
                case 'GB':
                    station.country = 'Great-Britain';
                    break;
                case 'A':
                    station.country = 'Austria';
                    break;
                case 'CH':
                    station.country = 'Switzerland';
                    break;
            }
            return station;
        } );
    }
}
