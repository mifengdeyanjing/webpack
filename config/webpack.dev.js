const path = require('path')//核心模块，专门用来处理路径问题
const HtmlWebpackPlugin = require('html-webpack-plugin');//生成html模版
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//提取css
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");//优化和压缩 CSS

//获取处理样式的loader
function getStyleLoader(pre){
  return [
    MiniCssExtractPlugin.loader,
    "css-loader",//将css资源编译成commonjs的模块到js中
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            ['postcss-preset-env'],//解决兼容问题
          ],
        },
      },
    },
    pre,
  ].filter(Boolean)
}
module.exports = {
  entry:'./src/index.js',
  output:{
    //开发环境没有输出
    path:undefined,
    filename:'bundle.js'
  },
  module:{
    rules:[
      {
        oneOf:[//只使用第一个匹配规则
          {
            test: /\.(csv|tsv)$/,
            use: ['csv-loader']
          }, {
            test: /\.xml$/,
            use: ['xml-loader']
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,//排除node_modules中的js文件
            use: {
              loader: 'babel-loader',
              options: {
                cacheDirectory:true,//开启babel缓存
                cacheCompression:false,//关闭缓存文件压缩
                plugins: ['@babel/plugin-transform-runtime']
              }
            }
          },
          {
            test: /\.css$/i,//只检测.css文件
            use:  getStyleLoader(),
          },
          {
            test: /\.less$/i,
            use: getStyleLoader('less-loader'),//将less编译成css文件
          },
          {
            test: /\.s[ac]ss$/i,
            use:  getStyleLoader('sass-loader'),//将sass编译成css文件
          },
          {
            test: /\.(png|jpe?g|gif|webp|svg)$/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024 // 10kb
              }
            }
          }
        ]
      }
    ]
  },
  plugins:[
    //生成一个 HTML5 文件
    new HtmlWebpackPlugin({
      //模版：以public/index.html文件创建一个新的模版
      template:path.join(__dirname,'../public/index.html'),
      filename:'index.html'
    }),
  ],
  optimization:{
    //压缩操作
    minimizer:[
      new CssMinimizerPlugin(),
    ]
  },
  devServer:{
    host:'localhost',
    port:3000,
    open:true,//自动打开
    hot:true,//热更新（）
  },
  mode:'development',//模式
  devtool:'cheap-module-source-map',//更加精准的找到错误代码-提示行
}
