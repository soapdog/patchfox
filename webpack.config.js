const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const merge = require('webpack-merge');
const webpack = require('webpack')

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const commonConfig = {
    target: 'web',
    bail: true,
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        chunkFilename: '[name].[id].js'
    },
    // plugins: [new BundleAnalyzerPlugin()]
    plugins: [
        new SimpleProgressWebpackPlugin({
            format: process.env.CI ? 'expanded' : 'minimal'
        }),
        new webpack.DefinePlugin({
            global: 'window', // https://github.com/webpack/webpack/issues/5627#issuecomment-394309966
            'process.env': {
                NODE_ENV: '"production"',
            }
        })
    ],
    watchOptions: {
        ignored: ['dist/**/*', 'node_modules']
    },
    performance: {
        maxEntrypointSize: Infinity,
        maxAssetSize: 4194304 // https://github.com/mozilla/addons-linter/pull/892
    },
}

const bgConfig = merge(commonConfig, {
    target: "web",
    name: "background",
    entry: {
        background: ["./src/background/background.js"]
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader'
            }
        }]
    }
});

const uiConfig = merge(commonConfig, {
    target: 'web',
    name: "ui",
    node: {
        global: false, // https://github.com/webpack/webpack/issues/5627#issuecomment-394309966
        Buffer: true,
        fs: 'empty',
        tls: 'empty',
        cluster: 'empty' // expected by js-ipfs dependency: node_modules/prom-client/lib/cluster.js
    },
    entry: {
        ui: ['./src/ui/main.js'],
    },
    resolve: {
        alias: {
            svelte: path.resolve('node_modules', 'svelte'),
        },
        extensions: ['.mjs', '.js', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main']
    },

    module: {
        rules: [
            {
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        emitCss: true,
                        hotReload: false,
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
                    prod ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    mode,
    plugins: [
        new CopyPlugin([
            { from: "manifest.json" },
            { from: "docs", to: "docs" },
            { from: "static" }
        ]),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ],
    devtool: prod ? false : 'source-map'
});


module.exports = [
    uiConfig,
    bgConfig
]