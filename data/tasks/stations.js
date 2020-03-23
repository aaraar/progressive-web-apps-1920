const {getPlaces} = require("../generateData");
const {getStations} = require("../generateData");
const {generateJson} = require("../generateData");
const path = require('path');
const fs = require('fs-extra');
const {placesPath} = require("../generateData");
const {stationsPath} = require("../generateData");


// if (process.env.NODE_ENV === 'production') {
//     console.log('🧨 Destroying old tracks');
    // fs.remove(path.join(__dirname, '../..', 'public'), err => {
    //     if (err) console.error(err);
        generateAllJsons();
    // });
// } else {
//     console.log('👷Skipping JSON generation in dev-mode')
// }

function generateAllJsons() {
    generateJson(stationsPath, getStations)
        .catch(err => {
            console.error(err)
        });
    generateJson(placesPath, getPlaces)
        .catch(err => {
            console.error(err)
        });
}