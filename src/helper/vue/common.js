import Vue from 'vue';
import Toast from '@/components/Toast';

// 绑定全局 Toast 组件
const ToastConstructor = Vue.extend(Toast);
Vue.prototype.toast = function (props = {}) {
    const t = new ToastConstructor({
        el: document.createElement('div'),
        propsData: props,
    });
    document.body.appendChild(t.$el);
    return t;
};
