const path = require('path');
const {stationsPath, placesPath} = require("./generateData");
const {getJson} = require('./generateData');
const {generateHtml} = require('./generateHtml');
require('dotenv').config();

generateCommon();

function generateCommon() {
    getJson(stationsPath)
        .catch(err => {
            console.error(err)
        })
        .then(stations => {
            getJson(placesPath)
                .catch(err => {
                    console.error(err)
                })
                .then(places => {
                    generate404();
                    console.log('🚧 Constructing index station');
                    generateIndex(stations);
                    console.log('🚧 Constructing stations, this may take a while');
                    process.stdout.write('🚂');
                    generateStations(stations, places);
                    process.stdout.write('\n');
                })
        })
}

function generateStations(stations, places) {
    stations.forEach(station => {
        const filteredPlaces = places.filter(place => place.locations.some(location => location.stationCode === station.code));
        const mappedPlaces = filteredPlaces.map(place => {
            return {
                type: place.type,
                locations: place.locations.filter(location => location.stationCode === station.code)
            }
        });
        let placesData = {};
        //     stationFacility: [],
        //     stationRetail: [],
        //     qPark: [],
        //     greenwheels: [],
        //     stationTaxi: [],
        //
        // },
        mappedPlaces.forEach(place => {
            if (placesData[place.type] && place.type !== 'stationV2') placesData[place.type].push(place.locations);
            else if (place.type !== 'stationV2') placesData[place.type] = [place.locations];
        });
        process.stdout.write('🚃');
        generateHtml(path.join(__dirname, '..', `public/stations/${station.code}/index.html`),
            path.join(__dirname, 'Pages/stations.pug'),
            {
                title: "NS INFO",
                pageTitle: "NS",
                station: station,
                places: placesData
            });
    });
}

function generateIndex(stations) {
    generateHtml(path.join(__dirname, '..', 'public/index.html'),
        path.join(__dirname, 'Pages/home.pug'),
        {
            title: "NS INFO",
            pageTitle: "NS",
            stations: stations
        });
}

function generate404() {
    generateHtml(path.join(__dirname, '..', 'public/404/index.html'),
        path.join(__dirname, 'Pages/404.pug'),
        {
            title: "NS INFO",
            pageTitle: "404",
        });
}