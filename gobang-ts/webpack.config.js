const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/index.js',
    module: {
        rules: [
            {
            test: /\.tsx?$/,
            // ts-loader是官方提供的处理tsx的文件
            use: 'ts-loader',
            exclude: /node_modules/
            },
            {
                test: /\.css$/,   // 正则表达式，表示.css后缀的文件
                use: [MiniCssExtractPlugin.loader, 'css-loader']   // 针对css文件使用的loader，注意有先后顺序，数组项越靠后越先执行
            }
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        stats: 'errors-only',
        publicPath: '',
        host: '0.0.0.0',
        compress: false,
        port: 9000
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatters: ['./dist']
        }),
        new HtmlWebpackPlugin({
            title: '五子棋',
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        new MiniCssExtractPlugin({
        　　filename: "./css/[name].css"  // 提取出来的css文件路径以及命名
        })
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    }
}