const path = require ( "path" );
const CopyWebpackPlugin = require ( "copy-webpack-plugin" );
const { CleanWebpackPlugin } = require ( 'clean-webpack-plugin' );

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve ( __dirname, "../dist/scripts" ),
    },
    resolve: {
        extensions: [ '.js' ],
    },
    module: {
        rules: [
            {
                test: [ /.js$/ ],
                exclude: /(node_modules)(data)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [ "@babel/preset-env" ]
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: "postcss-loader"
                    },
                    'sass-loader',
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "static/assets/images"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin ( [
            {
                from: "./src/assets/images",
                to: "assets/images"
            }
        ], )
    ]
};