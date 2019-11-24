// 在请求 API 接口前可自定义处理 headers、url、params
window.onRequestBefore = function (apiName, method, headers, url, params) {
    // headers['X-HTTP-METHOD-OVERRIDE'] = method.toUpperCase();
    headers['X-REQUESTED-WITH'] = 'XMLHttpRequest';
    return [headers, url, params];
};
// 当执行每个接口请求成功后的回调操作
window.onRequestSuccess = function (vue, response) {
    if (vue.apiName.toLowerCase() === 'api/command' && vue.method.toLowerCase() === 'put'
        && vue.params && typeof vue.params.cmd !== "undefined" && vue.params.cmd === "rebuild-list"
        && response.data.success) {
        vue.$emit('reload-apis'); // 触发父组件重载API数据的事件
    }
};
