import axios from "axios";
import qs from "qs";

const METHODS = {
    HEAD: 'HEAD',
    GET: 'GET',
    POST: 'POST',
    OPTIONS: 'OPTIONS',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
};

const getRequestConfig = function (apiName, method, url, uriParams, bodyParams = null, config = {}) {
    if (!config) config = {};
    if (typeof config.headers === "undefined") config.headers = {};
    if (method === METHODS.POST) {
        if (!config.headers.hasOwnProperty('Content-Type')) {
            let ct = 'application/x-www-form-urlencoded';
            if (bodyParams instanceof FormData) {
                ct = 'multipart/form-data';
            }
            config.headers['Content-Type'] = ct;
        }
    } else if (method === METHODS.PUT || method === METHODS.PATCH) {
        config.headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
    }
    let headers = JSON.parse(JSON.stringify(config.headers));
    // 自定义 header 处理
    [headers, url, bodyParams] = window.onRequestBefore(apiName, method, headers, url, uriParams, bodyParams);
    config.headers = headers;
    console.log('headers after', config.headers, url, bodyParams);
    return [url, bodyParams];
};

export default {
    METHODS,
    getRequestConfig,
    request(method, url, uriParams, bodyParams, config) {
        switch (method) {
            case METHODS.HEAD:
                return this.head(url, bodyParams, config);
            case METHODS.GET:
                return this.get(url, bodyParams, config);
            case METHODS.POST:
                if (bodyParams) {
                    const formData = new FormData();
                    for (let i in bodyParams) {
                        if (!bodyParams.hasOwnProperty(i)) continue;
                        formData.append(i, bodyParams[i]);
                    }
                    bodyParams = formData;
                }
                return this.post(url, bodyParams, config);
            case METHODS.PUT:
                return this.put(url, bodyParams, config);
            case METHODS.PATCH:
                return this.patch(url, bodyParams, config);
            case METHODS.DELETE:
                return this.delete(url, bodyParams, config);
            default:
                console.log('not supported request rest method ', method)
        }
        return null;
    },
    get(url, params = null, config = {}) {
        return new Promise((resolve, reject) => {
            config.params = params;
            axios.get(url, config)
                .then(response => {
                    resolve(response);
                })
                .catch(error => reject(error));
        });
    },
    post(url, params, config = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, params, config)
                .then(response => {
                    response.axiosConfig = config;
                    resolve(response);
                })
                .catch(error => reject(error))
        });
    },
    head(url, params, config = {}) {
        return new Promise((resolve, reject) => {
            config.params = qs.stringify(params);
            axios.head(url, config)
                .then(response => {
                    response.axiosConfig = config;
                    resolve(response);
                })
                .catch(error => reject(error))
        });
    },
    patch(url, params, config = {}) {
        return new Promise((resolve, reject) => {
            params = qs.stringify(params);
            axios.patch(url, params, config)
                .then(response => {
                    response.axiosConfig = config;
                    resolve(response);
                })
                .catch(error => reject(error))
        });
    },
    put(url, params, config = {}) {
        return new Promise((resolve, reject) => {
            params = qs.stringify(params);
            axios.put(url, params, config)
                .then(response => {
                    response.axiosConfig = config;
                    resolve(response);
                })
                .catch(error => reject(error))
        });
    },
    delete(url, params, config = {}) {
        return new Promise((resolve, reject) => {
            config.params = qs.stringify(params);
            axios.delete(url, config)
                .then(response => {
                    response.axiosConfig = config;
                    resolve(response);
                })
                .catch(error => reject(error))
        });
    },
}
