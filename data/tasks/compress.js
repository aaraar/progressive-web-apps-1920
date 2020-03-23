const fs = require('fs-extra');
const zlib = require('zlib');
const brotli = require('brotli');

const brotliSettings = {
    extension: 'br',
    skipLarger: true,
    mode: 1, // 0 = generic, 1 = text, 2 = font (WOFF2)
    quality: 10, // 0 - 11,
    lgwin: 12 // default
};

var dirs = ['public', 'public/stations/*'];

getJson(stationsPath)

dirs.forEach(dir => {
    fs.readdirSync(dir).forEach(file => {
        file.endsWith('.js') || file.endsWith('.css') ||       file.endsWith('.html')
    })
});