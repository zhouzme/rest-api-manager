# rest-api-manager
### 配合自己框架自动生成接口数据的测试工具

&nbsp;


![rest-api-manager](https://ghproxy.com/https://raw.githubusercontent.com/zhouzme/rest-api-manager/master/public/demo/api.png)

增加个示例，不然自己都忘了是怎么用的了。。。

### setting 设置

```text
API list URL:
https://xxx.com/video-api/v1/apis

API request URL:
https://xxx.com/video-api/v1
```

### 接口返回数据结构格式
```json
{
    "status": 200,
    "state": 1,
    "code": 0,
    "message": "ok",
    "description": null,
    "occurred": null,
    "data": {}
}
```

### 接口列表的数据结构
> 地址：https://xxx.com/video-api/v1/apis
  参考：`public/demo/apis.json`

```json
{
    "data": {
        // API 的 URI 列表
        "apiPathList": {
            "Api": [
                "Api\/Index"
            ],
            "Cartoon": [
                "Cartoon\/Index",
                "Cartoon\/Mapping",
                "Cartoon\/Period",
                "Cartoon\/Source",
                "Cartoon\/Torrent"
            ],
            // ...
        },
        // 每个 API 的 REST 具体配置
        "apiInfoList": {
            "Api\/Index": {
                "sort": 1,
                "name": "Api\/Index",
                "brief": null,
                "description": "\u63a5\u53e3\u4fe1\u606f\u7ba1\u7406",
                "methods": {
                    "GET": {
                        "Default": {
                            "routeMapIgnore": false,
                            "uriParams": null,
                            "bodyParams": null,
                            "pattern": "",
                            "uri": "\/apis",
                            "routeMatch": null,
                            "routeMatchParamsIndex": null,
                            "routeNativeParams": null,
                            "description": null
                        }
                    },
                    "PUT": {
                        "Caches": {
                            "routeMapIgnore": false,
                            "uriParams": null,
                            "bodyParams": null,
                            "pattern": "\/caches",
                            "uri": "\/apis\/caches",
                            "routeMatch": null,
                            "routeMatchParamsIndex": null,
                            "routeNativeParams": "['_do'=>'Caches']",
                            "description": null
                        },
                        "Maps": {
                            "routeMapIgnore": false,
                            "uriParams": null,
                            "bodyParams": null,
                            "pattern": "\/maps",
                            "uri": "\/apis\/maps",
                            "routeMatch": null,
                            "routeMatchParamsIndex": null,
                            "routeNativeParams": "['_do'=>'Maps']",
                            "description": null
                        }
                    }
                },
                "uriPrefix": "\/apis",
                "routeMapIgnoreAll": true
            },
            // ...
        }
    }
}
```

## Project setup
```shell
npm install
```

### Compiles and hot-reloads for development
```shell
npm run serve
```

### Compiles and minifies for production
```shell
# 复制 vue.config-example.js 并命名为 vue.config.js
# 然后修改文件中的路径和测试的IP和端口等相关配置为本地环境的配置
mv vue.config-example.js vue.config.js
npm run build
# 打包生成生产环境并输出到指定目录后，
# 复制 callbacks.example.js 更改名称为 callbacks.example.js
# 该文件中可以配置自定义的接口发送请求和响应回调的处理方法
# cd <打包输出的目录>
cd E:/Website/www/localhost/rest-api-manager
mv public/js/callback.example.js public/js/callback.js
```

### Run your tests
```shell
npm run test
```

### Lints and fixes files
```shell
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
