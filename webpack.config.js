const path = require('path');

module.exports = {
    entry: './assets/js/scripts.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    }
}
