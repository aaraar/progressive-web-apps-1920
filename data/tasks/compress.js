const fs = require('fs-extra');
const zlib = require('zlib');
const brotli = require('brotli');
const { stationsPath } = require ( "../generateData" );
const { getJson } = require ( "../generateData" );

const brotliSettings = {
    extension: 'br',
    skipLarger: true,
    mode: 1, // 0 = generic, 1 = text, 2 = font (WOFF2)
    quality: 11, // 0 - 11,
    lgwin: 12 // default
};

let dirs = ['public', 'public/404'];

getJson(stationsPath).then(stations => {
    stations.forEach(station => {
       dirs.push(`public/stations/${station.code}`)
    });

    dirs.forEach(dir => {
        fs.readdirSync(dir).forEach(file => {
            if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.html')) {
                // brotli
                const result = brotli.compress(fs.readFileSync(dir + '/' + file), brotliSettings);
                fs.writeFileSync(dir + '/' + file + '.br', result);
                // gzip
                const fileContents = fs.createReadStream(dir + '/' + file);
                const writeStream = fs.createWriteStream(dir + '/' + file + '.gz');
                const zip = zlib.createGzip();
                fileContents
                    .pipe(zip)
                    .on('error', err => console.error(err))
                    .pipe(writeStream)
                    .on('error', err => console.error(err));
            }
        })
    });
});
