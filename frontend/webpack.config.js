const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    stats: "normal",
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
        // new MonacoWebpackPlugin({
        //     "languages": ['st', 'javascript', 'python'],
        //     "features": [
        //         '!accessibilityHelp', '!anchorSelect', '!bracketMatching', '!caretOperations', '!clipboard',
        //         '!codeAction', '!codelens', '!colorPicker', '!comment', '!contextmenu', '!coreCommands',
        //         '!cursorUndo', '!dnd', '!documentSymbols', '!find', '!folding', '!fontZoom', '!format',
        //         '!gotoError', '!gotoLine', '!gotoSymbol', '!hover', '!iPadShowKeyboard', '!inPlaceReplace',
        //         '!indentation', '!inlayHints', '!inlineCompletions', '!inspectTokens', '!lineSelection',
        //         '!linesOperations', '!linkedEditing', '!links', '!multicursor', '!parameterHints', '!quickCommand',
        //         '!quickHelp', '!quickOutline', '!referenceSearch', '!rename', '!smartSelect', '!snippets', '!suggest',
        //         '!toggleHighContrast', '!toggleTabFocusMode', '!transpose', '!unicodeHighlighter',
        //         '!unusualLineTerminators', '!viewportSemanticTokens', '!wordHighlighter', '!wordOperations',
        //         '!wordPartOperations',
        //     ],
        //     "publicPath": '/static/frontend/',
        // }),
    ],
};