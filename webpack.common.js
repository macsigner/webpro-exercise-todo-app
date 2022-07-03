const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const pages = ['index', 'news', 'form'];

module.exports = {
    entry: Object.assign({
        app: './src/js/app.js',
    }, pages.reduce((config, page) => {
        config[page] = `./src/js/${page}.js`;

        return config;
    }, {})),
    module: {
        rules: [
            {
                test: /\.html$/i,
                use: [
                    'html-loader',
                ],
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                type: 'asset/resource',
            }
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {from: 'src/data', to: 'data'},
            ]
        }),
    ].concat(
        pages.map(
            (page) => {
                return new HtmlWebpackPlugin({
                    inject: true,
                    template: `./src/${page}.html`,
                    filename: `${page}.html`,
                    chunks: ['app', page],
                });
            }
        )
    ),
}
