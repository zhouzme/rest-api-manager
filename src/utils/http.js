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

const getRequestConfig = function (apiName, method, url, params = null, config = {}) {
    if (!config) config = {};
    if (typeof config.headers === "undefined") config.headers = {};
    if (method === METHODS.POST) {
        if (!config.headers.hasOwnProperty('Content-Type')) {
            let ct = 'application/x-www-form-urlencoded';
            if (params instanceof FormData) {
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
    [headers, url, params] = window.onRequestBefore(apiName, method, headers, url, params);
    config.headers = headers;
    console.log('headers after', config.headers, url, params);
    return [url, params];
};

export default {
    METHODS,
    getRequestConfig,
    request(method, url, params, config) {
        switch (method) {
            case METHODS.HEAD:
                return this.head(url, params, config);
            case METHODS.GET:
                return this.get(url, params, config);
            case METHODS.POST:
                if (params) {
                    const formData = new FormData();
                    for (let i in params) {
                        if (!params.hasOwnProperty(i)) continue;
                        formData.append(i, params[i]);
                    }
                    params = formData;
                }
                return this.post(url, params, config);
            case METHODS.PUT:
                return this.put(url, params, config);
            case METHODS.PATCH:
                return this.patch(url, params, config);
            case METHODS.DELETE:
                return this.delete(url, params, config);
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
