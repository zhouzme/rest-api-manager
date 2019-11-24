// 当执行每个接口请求成功后的回调操作
window.onRequestSuccess = function(vue, response) {
    if (vue.apiName.toLowerCase() === 'api/command' && vue.method.toLowerCase() === 'put'
        && vue.params && typeof vue.params.cmd !== "undefined" && vue.params.cmd === "rebuild-list"
        && response.data.success) {
        vue.$emit('reload-apis'); // 触发父组件重载API数据的事件
    }
};
