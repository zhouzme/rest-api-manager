// 当执行每个接口请求成功后的回调操作
window.onRequestSuccess = function(vue, params, response) {
    if (vue.apiName.toLowerCase() === 'api/command' && vue.method.toLowerCase() === 'put'
        && params && typeof params.cmd !== "undefined" && params.cmd === "rebuild-list") {
        vue.$emit('reload-apis'); // 触发父组件重载API数据的事件
    }
};
