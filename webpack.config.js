module.exports = {
    entry : './src/main.js',
    output: {
        path: './public/js',
        filename: 'bundle.js',
        library: 'AudioSpectrum'
    },

    resolve: {
        extensions: [
            "",
            ".js"
        ]
    },

    module: {
        loaders: [
            {
                test : /\.js?/,
                exclude: /node_modules/,
                loader : 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};