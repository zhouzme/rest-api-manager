import axios from "axios";
import lodash from "lodash";
import qs from "qs";

const commonHeaders = function(method = null){
    const obj = {};
    if (method) obj['X-HTTP-METHOD-OVERRIDE'] = method.toUpperCase();
    // obj['X-ACCESS-CONTROL-ALLOW-ORIGIN'] = '123';
    return obj;
};

const mergeCommonHeaders = function(config) {
    const headers = commonHeaders();
    config.headers = lodash.mergeWith(config.headers, headers);
};

export default {
    get(url, params = null, config = {}) {
        return new Promise((resolve, reject) => {
            config.params = params;
            mergeCommonHeaders(config);
            axios.get(url, config)
                .then(response => {
                    resolve(response, config);
                })
                .catch(error => reject(error));
        });
    },
    post(url, params, config = {}) {
        return new Promise((resolve, reject) => {
            if (!config.headers) config.headers = {};
            // 'Content-Type': 'application/x-www-form-urlencoded',
            if (!config.headers.hasOwnProperty('Content-Type')) {
                let ct = 'application/x-www-form-urlencoded';
                if (params instanceof FormData) {
                    ct = 'multipart/form-data';
                }/*
                for (let i in params) {
                    if (!params.hasOwnProperty(i)) continue;
                    console.log(params[i], typeof params[i]);
                    if (typeof params[i] === "object") {
                        ct = 'multipart/form-data';
                        break;
                    }
                }*/
                config.headers['Content-Type'] = ct;
                console.log('ct', ct)
            }
            mergeCommonHeaders(config);
            axios.post(url, params, config)
                .then(response => {
                    resolve(response, config);
                })
                .catch(error => reject(error))
        });
    },
    head(url, params, config = {}) {
        return new Promise((resolve, reject) => {
            params = qs.stringify(params);
            config.params = params;
            mergeCommonHeaders(config);
            axios.head(url, config)
                .then(response => {
                    resolve(response, config);
                })
                .catch(error => reject(error))
        });
    },
    patch(url, params, config = {}) {
        return new Promise((resolve, reject) => {
            if (!config.headers) {
                config.headers = {
                    'Content-Type': 'application/x-www-form-urlencoded'
                };
            }
            params = qs.stringify(params);
            mergeCommonHeaders(config);
            axios.patch(url, params, config)
                .then(response => {
                    resolve(response, config);
                })
                .catch(error => reject(error))
        });
    },
    put(url, params, config = {}) {
        return new Promise((resolve, reject) => {
            if (!config.headers) config.headers = {};
            // 'Content-Type': 'application/x-www-form-urlencoded',
            if (!config.headers.hasOwnProperty('Content-Type')) config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            params = qs.stringify(params);
            mergeCommonHeaders(config);
            axios.put(url, params, config)
                .then(response => {
                    resolve(response, config);
                })
                .catch(error => reject(error))
        });
    },
    delete(url, params, config = {}) {
        return new Promise((resolve, reject) => {
            config.params = qs.stringify(params);
            mergeCommonHeaders(config);
            axios.delete(url, config)
                .then(response => {
                    resolve(response, config);
                })
                .catch(error => reject(error))
        });
    },
}
