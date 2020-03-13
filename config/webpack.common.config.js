const path = require ( 'path' );
const CopyWebpackPlugin = require ( 'copy-webpack-plugin' );
const MiniCssExtractPlugin = require ( 'mini-css-extract-plugin' );

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve ( __dirname, '..', 'public' ),
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
                    loader: 'babel-loader',
                    options: {
                        presets: [ '@babel/preset-env' ]
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'static/assets/images'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin ( {
            to: 'styles',
            filename: 'styles.css'
        } ),
        new CopyWebpackPlugin ( [
            {
                from: path.join ( __dirname, '..', 'src/assets/images' ),
                to: path.join ( __dirname, '..', 'public/assets/images' )
            },
            {
                from: path.join ( __dirname, '..', 'src/api' ),
                to: path.join ( __dirname, '..', 'api' )
            }
        ], )
    ]
};