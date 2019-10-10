// https://cli.vuejs.org/zh/config/
// https://cli.vuejs.org/zh/guide/webpack.html

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/rest-api-manager/' : '/',
    outputDir: 'dist',
    assetsDir: '',
    indexPath: 'index.html',
    filenameHashing: true,
    lintOnSave: true,
    // CSS 相关选项
    css: {
        // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
        // 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
        extract: true,

        // 是否开启 CSS source map？
        sourceMap: false,

        // 为预处理器的 loader 传递自定义选项。比如传递给
        // sass-loader 时，使用 `{ sass: { ... } }`。
        loaderOptions: {},

        // 为所有的 CSS 及其预处理文件开启 CSS Modules。
        // 这个选项不会影响 `*.vue` 文件。
        modules: false
    },
    parallel: require('os').cpus().length > 1,
    chainWebpack: config => {
        // 修复HMR
        config.resolve.symlinks(true);
        //修复 Lazy loading routes Error
        config.plugin('html').tap(args => {
            args[0].chunksSortMode = 'none';
            return args;
        });

        // 添加别名
        config.resolve.alias
            .set('@', resolve('src'))

        //压缩图片
        // config.module
        //     .rule("images")
        //     .use("image-webpack-loader")
        //     .loader("image-webpack-loader")
        //     .options({
        //         mozjpeg: {progressive: true, quality: 65},
        //         optipng: {enabled: false},
        //         pngquant: {quality: "65-90", speed: 4},
        //         gifsicle: {interlaced: false},
        //         webp: {quality: 75}
        //     });
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.mode = 'production';
        } else {
            config.mode = 'development';
        }

        config.externals = {
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'window.axios',
            'qs': 'window.Qs',
            'lodash': 'window._',
            // 'jquery': 'window.jQuery',
            // 'mavon-editor': 'window["mavon-editor"]',
        };

        if (IS_PROD) {
            const plugins = [];
            plugins.push(
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            warnings: true,
                            drop_console: true,
                            drop_debugger: true,
                            pure_funcs: ['console.log'] //移除console
                        },
                        mangle: false,
                        output: {
                            beautify: true,//压缩注释
                        }
                    },
                    sourceMap: false,
                    parallel: true,
                })
            );
            plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: productionGzipExtensions,
                    threshold: 10240,
                    minRatio: 0.8
                })
            );
            config.plugins = [...config.plugins, ...plugins];
        }

        // 打包分析
        if (process.env.IS_ANALYZ) {
            config.plugin('webpack-report')
                .use(BundleAnalyzerPlugin, [{
                    analyzerMode: 'static',
                }]);
        }
    },
    devServer: {
        overlay: {
          warnings: true,
          errors: true
        },
        open: false,
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
    }
};
