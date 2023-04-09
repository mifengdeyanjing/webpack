const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');//生成html模版
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//提取css
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");//优化和压缩 CSS
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");//压缩图片

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
    path:path.join(__dirname,'../dist'),//所有文件的输出路径
    filename:'static/js/bundle.js',//入口文件打包输出文件名
    //filename:'[name].js',//webpack命名方式,[name]以文件名自己命名
    clean:true,//自动清空上次打包的内容
  },
  module:{
    rules:[
      //处理不同的数据格式
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
            plugins: ['@babel/plugin-transform-runtime']//避免重复引入Babel加入的辅助代码
          }
        }
        //use: {
        //  loader: 'babel-loader',
        //  options: {//可以在这里写，也可在外面写.babelrc
        //    presets: ['@babel/preset-env']
        //  }
        //}
      },
      {
        test: /\.css$/i,//只检测.css文件
        use: getStyleLoader(),
      },
      {
        test: /\.less$/i,
        use: getStyleLoader('less-loader'),//将less编译成css文件
      },
      {
        test: /\.s[ac]ss$/i,
        use: getStyleLoader('sass-loader'),//将sass编译成css文件
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        type: 'asset',//会转换base64
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 10kb
          }
        },
        generator: {
          //输出图片名称
          //[hash:10] hash值取前十位
          filename: 'static/images/[hash:10][ext][query]'
        }
      },
      {
        test: /\.(ttf|woff2?)$/,//字体图标
        type: 'asset/resource',
        generator: {
          //输出图片名称
          filename: 'static/media/[hash:10][ext][query]'
        }
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
    new MiniCssExtractPlugin({
      filename:'static/css/main.css',
    }),
    //new CssMinimizerPlugin(),
   
  ],
  optimization:{
    //代码分割配置
    splitChunks: {
      chunks: 'all',//所有模块都进行分割
    },
    //压缩操作
    minimizer:[
      new CssMinimizerPlugin(),
      //new ImageMinimizerPlugin({
      //  minimizer: {
      //    implementation: ImageMinimizerPlugin.imageminGenerate,
      //    options: {
      //      plugins: [
      //        ["gifsicle", { interlaced: true }],
      //        ["jpegtran", { progressive: true }],
      //        ["optipng", { optimizationLevel: 5 }],
      //        [
      //          "svgo",
      //          {
      //            plugins: [
      //              "preset-default",
      //              "prefixIds",
      //              {
      //                name: "sortAttrs",
      //                params: {
      //                  xmlnsOrder: "alphabetical",
      //                },
      //              },
      //            ],
      //          },
      //        ],
      //      ],
      //    },
      //  },
      //}),
    ]
  },
  mode:'production',//模式
  devtool:'source-map'//更加精准的找到错误代码-提示行和列
}
