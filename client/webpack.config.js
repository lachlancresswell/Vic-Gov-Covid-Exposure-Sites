const path = require('path');

module.exports = {
    entry: './src/app.ts',
    watch: true,
    mode: 'development',
    watchOptions: {
        ignored: ['**/node_modules'],
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};