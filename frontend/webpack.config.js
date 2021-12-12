const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin')
const zlib = require('zlib')

module.exports = {
    stats: "detailed",
    entry: "./src/index.tsx",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'static/frontend'),
        publicPath: '/static/frontend/',
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        splitChunks: {
            cacheGroups: {
                monacoCommon: {
                    test: /[\\/]node_modules[\\/]monaco-editor/,
                    name: 'monaco-editor-common',
                    chunks: 'async'
                }
            }
        }
    },
    plugins: [
        new MonacoWebpackPlugin({
            "languages": ['st', 'javascript', 'python'],
            "features": [
                '!accessibilityHelp', '!anchorSelect', '!bracketMatching', '!caretOperations', '!clipboard',
                '!codeAction', '!codelens', '!colorPicker', '!comment', '!contextmenu', '!coreCommands',
                '!cursorUndo', '!dnd', '!documentSymbols', '!find', '!folding', '!fontZoom', '!format',
                '!gotoError', '!gotoLine', '!gotoSymbol', '!hover', '!iPadShowKeyboard', '!inPlaceReplace',
                '!indentation', '!inlayHints', '!inlineCompletions', '!inspectTokens', '!lineSelection',
                '!linesOperations', '!linkedEditing', '!links', '!multicursor', '!parameterHints', '!quickCommand',
                '!quickHelp', '!quickOutline', '!referenceSearch', '!rename', '!smartSelect', '!snippets', '!suggest',
                '!toggleHighContrast', '!toggleTabFocusMode', '!transpose', '!unicodeHighlighter',
                '!unusualLineTerminators', '!viewportSemanticTokens', '!wordHighlighter', '!wordOperations',
                '!wordPartOperations',
            ],
            "publicPath": '/static/frontend/',
        }),
        // new WebpackBundleAnalyzer.BundleAnalyzerPlugin(),
        new webpack.DefinePlugin({
            // "process.env": {
            //     // This has effect on the react lib size
            //     NODE_ENV: JSON.stringify("production"),
            // },
        }),
        new CompressionPlugin({
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8,
            compressionOptions: {
                level: 9,
            },
        }),
        new CompressionPlugin({
            filename: '[path][base].br',
            algorithm: 'brotliCompress',
            test: /\.(js|css|html|svg)$/,
            compressionOptions: {
                params: {
                    [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                },
                level: 11,
            },
            threshold: 10240,
            minRatio: 0.8,
        }),
    ],
};