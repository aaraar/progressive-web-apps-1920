const pug = require ( 'pug' );
const {writeToFile, checkFile} = require('./generateData');

function generateHtml(writePath, templatePath, options) {
    return new Promise((resolve, reject) => {
        writeToFile (writePath , pug.renderFile ( templatePath, options), (err) => {
            if ( err ) return console.error ( err );
            checkFile(writePath, 'html').then(() => resolve()).catch(err => reject(err))
        });
    })
}

module.exports = {
    generateHtml: generateHtml
};
