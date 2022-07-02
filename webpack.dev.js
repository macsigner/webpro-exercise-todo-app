const path = require('path');

const {merge} = require('webpack-merge');
const common = require('./webpack.common')

module.exports = merge(common, {
        mode: 'development',
        output: {
            filename: 'main.js',
            path: path.resolve(__dirname, 'dist'),
            assetModuleFilename: 'assets/[name][ext]',
        },
        module: {
            rules: [
                {
                    test: /\.scss$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader',
                    ],
                },
            ]
        }
    }
)
