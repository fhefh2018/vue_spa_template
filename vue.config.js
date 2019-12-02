const path = require('path');
function resolve(dir) {
    return path.join(__dirname, dir)
}

//压缩代码并去掉console
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
//判断生产环境
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const isProduction = process.env.NODE_ENV === 'production';
//判断是否分析
const isAnalyze = process.env.NODE_ENV === 'analyze';
//使用cdn的js和css
const cdn = {
    js: [
        'https://cdn.staticfile.org/vue/2.6.10/vue.min.js',
        'https://cdn.staticfile.org/vue/2.6.10/vue.runtime.min.js',
        'https://cdn.staticfile.org/vuex/3.1.1/vuex.min.js',
        'https://cdn.staticfile.org/vue-router/3.1.3/vue-router.min.js',
        'https://cdn.staticfile.org/axios/0.19.0/axios.min.js',
    ]
};
// 不打包的一些插件 可以引线上cdn
let externals = {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
    'axios': 'axios'
};

module.exports = {
    publicPath: process.env.VUE_APP_REALEASE === "production" ? "/dist" : "/",
    productionSourceMap: false,
    configureWebpack: config => {
        if (isProduction) {
            //js使用cdn
            config.externals = externals;

            //去除console.log
            config.optimization = {
                minimizer: [
                    new UglifyJsPlugin({
                        uglifyOptions: {
                            compress: {
                                drop_console: true, //console
                                drop_debugger: false // pure_funcs: ['console.log']移除
                            }
                        }
                    })
                ]
            }
            //去除console.log
            // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        }
    },
    chainWebpack: config => {
        // 别名
        config.resolve.alias
            .set('@', resolve('src'))
            .set('@assets', resolve('src/assets'))
            .set('@images', resolve('src/assets/image'))

        //图片规则
        config.module
            .rule('images')
            .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
            .use('url-loader')
            .loader('url-loader')
            .options({
                limit: 10000,
                fallback: {
                    loader: 'file-loader',
                    options: {
                        name: 'images/[name].[hash:8].[ext]',
                    }
                }
            }).end();

        if (isProduction) {
            config.plugin('html')
                .tap(args => {
                    args[0].cdn = cdn;
                    args[0].minify = {
                        minifyCSS: true,
                        minifyJS: true,
                        removeComments: true,
                        collapseWhitespace: true
                    };
                    return args;
                });
        }

        if (isAnalyze) {
            config.plugin('webpack-bundle-analyzer')
                .use(require('webpack-bundle-analyzer')
                    .BundleAnalyzerPlugin)
        }

    },
    // devServer: {
    //     // overlay: { // 让浏览器 overlay 同时显示警告和错误
    //     //   warnings: true,
    //     //   errors: true
    //     // },
    //     // open: false, // 是否打开浏览器
    //     // host: "localhost",
    //     // port: "8080", // 代理断就
    //     // https: false,
    //     // hotOnly: false, // 热更新
    //     proxy: {
    //         "/api": {
    //             target:
    //                 "https://www.easy-mock.com/mock/5bc75b55dc36971c160cad1b/sheets", // 目标代理接口地址
    //             secure: false,
    //             changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
    //             // ws: true, // 是否启用websockets
    //             pathRewrite: {
    //                 "^/api": "/"
    //             }
    //         }
    //     }
    // }
};