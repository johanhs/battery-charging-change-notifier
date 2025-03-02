import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import type { Configuration } from 'webpack';

const require = createRequire(import.meta.url);
const ExtReloader = require('webpack-ext-reloader');

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mode: 'development' | 'production';
let devtool: 'source-map' | false;
let outputDirectory: string;

if (process.env.NODE_ENV === 'development') {
    mode = 'development';
    devtool = 'source-map';
    outputDirectory = 'dev';
} else {
    mode = 'production';
    devtool = false;
    outputDirectory = 'dist';
}
let config: Configuration = {
    mode,
    target: 'web',
    devtool,
    entry: {
        serviceWorker: [path.resolve(__dirname, 'src/serviceWorker/index.ts')],
        offscreen: [path.resolve(__dirname, 'src/offscreen/index.ts')],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        alias: {
            serviceWorker: path.resolve(__dirname, './src/serviceWorker/'),
            offscreen: path.resolve(__dirname, './src/offscreen/'),
            assets: path.resolve(__dirname, './src/assets/'),
            utils: path.resolve(__dirname, './src/utils/'),
            types: path.resolve(__dirname, './src/types/'),
        },
        extensions: ['.ts'],
    },
    output: {
        filename: '[name]/[name].js',
        path: path.resolve(__dirname, outputDirectory),
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/assets'),
                    to: path.resolve(__dirname, `${outputDirectory}/assets`),
                },
                {
                    from: path.resolve(__dirname, 'src/manifest.json'),
                    to: path.resolve(__dirname, `${outputDirectory}/manifest.json`),
                },
            ],
        }),
        new HtmlWebpackPlugin({
            title: 'Offscreen',
            filename: path.resolve(__dirname, `${outputDirectory}/offscreen/index.html`),
            template: path.resolve(__dirname, 'src/offscreen/index.html'),
            chunks: ['offscreen'],
        }),
    ],
};

if (mode === 'development') {
    config = {
        ...config,
        watch: true,
        plugins: [
            ...(config.plugins || []),
            new ESLintPlugin({}),
            new ExtReloader({
                port: 9224,
                reloadPage: true,
                entries: {
                    background: 'serviceWorker',
                },
            }),
        ],
    };
}

export default config;
