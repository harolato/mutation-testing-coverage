const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

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
            },
            // --- Loaders for monaco ---
            // {
            //     test: /\.ts?$/,
            //     include: path.join(__dirname, "node_modules", "monaco-editor"),
            //     use: ["awesome-typescript-loader"],
            // },
            // {
            //     test: /\.css$/,
            //     include: path.join(__dirname, "node_modules", "monaco-editor"),
            //     use: ["style-loader", "css-loader"],
            // },
            // {
            //     test: /\.ttf$/,
            //     include: path.join(__dirname, "node_modules", "monaco-editor"),
            //     use: ["file-loader"],
            // },
            // ---
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, 'static/frontend'),
        publicPath: '/static/frontend/',
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        // splitChunks: {
        //     cacheGroups: {
        //         monaco: {
        //             test: /[\\/]node_modules[\\/]monaco-editor/,
        //             name: "mc-monaco",
        //             chunks: "all",
        //             priority: 1,
        //         },
        //         vendor: {
        //             test: /[\\/]node_modules[\\/]/,
        //             name: "mc-vendor",
        //             chunks: "all",
        //         },
        //     },
        // },
    },
    plugins: [
        new WebpackBuildNotifierPlugin({
            title: "Mut test cov",
            showDuration: true,
            suppressSuccess: false, // don't spam success notifications
        }),
        new MonacoWebpackPlugin({
            "languages": ['st'],
            filename: "[name].bundle.js",
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
    ],
};