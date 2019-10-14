<template>
    <div class="toast-ct">
        <div v-if="isShowCover" class="toast-cover" :class="coverClasses" :style="{ zIndex: zIndex }"></div>
        <div ref="toastItem" class="toast-item" @click="onClick" :class="classes" :style="styles">
            <span v-if="icon" class="toast-icon iconfont" :class="'icon-'+icon"></span>
            <span class="toast-message">{{ message }}</span>
        </div>
    </div>
</template>

<script>
    import lodash from 'lodash';

    // 全局保存具名的 toast 唯一对象
    const _namedToasts = {};

    export default {
        name: 'Toast',
        data() {
            return {
                classes: [],
                instanceName: '',
                styles: {},
                iconClasses: [],
                coverClasses: [],
                isShowCover: false,
                onClick: ()=>this.hide(),
            }
        },
        props: {
            icon: {
                type: String,
                default: null,
            },
            message: String,
            duration: {
                type: Number,
                default: 3000 // 持续显示的时长，单位 ms 为 0 则不自动消失需手动点击
            },
            position: {
                type: [Array, String],
                // 数组或字符串类型
                // 定位，数组格式支持自定义位置，左上比较常用所以顺序为[top, right, bottom, left],
                // 默认单位整型为:px, 若为小于0的浮点数时则表示占屏幕的百分比%
                // 如：[10, null, null, .1]，不需要设置的则为 null
                // 定位，预设 topLeft|topCenter|topRight|centerLeft|center|centerRight|bottomLeft|bottomCenter|bottomRight
                default: 'center',
            },
            zIndex: {
                type: Number,
                default: 100000
            },
            maxWidth: {
                type: String,
                default: '300px', // 最大宽度
            },
            offset: {
                type: Array,
                default() {
                    // 仅用于对预设定位点(如：topLeft|center...)坐标在 [X, Y] 轴的偏移量修正，单位 px
                    // 作用于 margin-top|margin-left, 可以为负数; > 0 则偏向右下角，< 0 则偏向左上角
                    return [0, 0]
                }
            }
        },
        computed: {
        },
        methods: {
            info(msg, duration = 3000) {
                this.message = msg;
                this.duration = duration;
                return this;
            },
            hide() {
                this.classes.push('fadeout'); // 淡出效果直接覆盖了 fadein 的 css 设置
                this.isShowCover && this.coverClasses.push('fadeout');
                if (this.instanceName && window.hasOwnProperty('_toasts')) {
                    window._toasts[this.instanceName] = null;
                    delete window._toasts[this.instanceName];
                }
                lodash.delay(() => this.$destroy(), 500); // 淡出动画结束后再销毁
            },
            loading(msg = 'loading...'){
                this.icon = 'loading';
                this.duration = 0;
                this.onClick = ()=>{};
                this.message = msg;
                return this;
            },
            failure(msg) {
                this.icon = 'failure';
                this.message = msg;
                this.duration = 15000;
                return this;
            },
            success(msg, duration = 3000) {
                this.icon = 'success';
                this.message = msg;
                this.duration = duration;
                return this;
            },
            z(z) {
                this.zIndex = z;
                return this;
            },
            cover() {
                this.isShowCover = true;
                return this;
            },
            // 将显示坐标定位在鼠标附近，动态计算鼠标的位置，x,y为偏移量，大于0的整数为px，小于零的浮点数为当前量的百分比
            setPositionByEvent(e, x = .2, y = -.2) {
                let left = e.clientX;
                left += Math.abs(x) < 1 ? x = Math.round(left * x) : x;
                if (left < x) left = x;
                let top = e.clientY + y;
                top += Math.abs(y) < 1 ? y = Math.round(top * y) : y;
                if (top < y) top = y;
                this.position = [top, null, null, left];
                return this;
            },
            show(){
                this.$set(this.styles, 'zIndex', this.zIndex);
                this.$set(this.styles, 'maxWidth', this.maxWidth);
                const isPrePos = lodash.isString(this.position); // 是字符串则认定为默认的预设定位点
                if (lodash.isArray(this.position)) {
                    const [top, right, bottom, left] = this.position;
                    const resolve = (s, n) => {
                        if (n !== undefined) this.$set(this.styles, s, (n > 0 && n < 1) ? (n*100) + '%' : n +'px');
                    };
                    null !== top && resolve('top', top);
                    null !== right && resolve('right', right);
                    null !== bottom && resolve('bottom', bottom);
                    null !== left && resolve('left', left);
                } else if (isPrePos) {
                    const pos = this.position.toString();
                    const isC1 = pos.indexOf('center') > -1;
                    const isC2 = pos.indexOf('Center') > -1;

                    // 设置预设定位点样式
                    this.classes.push(pos.replace(/([A-Z])/, (s) => '-' + s.toLowerCase()));
                    // 居中定位修正
                    if (isC1 || isC2) {
                        const ref = this.$refs.toastItem;
                        if (pos === 'center' || isC1) {
                            lodash.delay(()=>{
                                this.$set(this.styles, 'marginTop',
                                    ((isPrePos ? (ref.clientHeight * -1 / 2) : 0) + this.offset[1]) + 'px');
                            }, 10);
                        }
                        if (pos === 'center' || isC2) {
                            lodash.delay(()=>{
                                this.$set(this.styles, 'marginLeft',
                                    ((isPrePos ? (ref.clientWidth * -1 / 2) : 0) + this.offset[0]) + 'px');
                            }, 10);
                        }
                    }
                }
                // 添加淡入效果
                lodash.delay(()=>{
                    this.isShowCover && this.coverClasses.push('fadein');
                    this.classes.push('fadein');
                }, 10);
                this.duration > 0 && lodash.delay(() => {
                    this.hide();
                }, this.duration);
            },
            /**
             * 使用一个唯一的名称，同名称的实例只能存在一个，每次新生成组件实例是上一个会自动触发关闭
             * 避免屏幕上同时出现一大堆提示妨碍用户使用
             * @param {string} name 必须指定名称
             * @returns {default.methods}
             */
            name(name) {
                if (!name) return this;
                this.instanceName = name;
                if (_namedToasts[name]) _namedToasts[name].hide();
                _namedToasts[name] = this;
                return this;
            }
        },
        created() {
            this.$nextTick(function(){
                this.show();
            });
        },
        mounted() {
        },
        destroyed() {
            this.$el.parentNode.removeChild(this.$el)
        }
    }
</script>

<style scoped>
    .toast-item {
        position: fixed;
        z-index: 10000;
        padding: .8rem 1.2rem;
        font-size: .8rem;
        background-color: #4dceff;
        box-shadow: 0 0 5px rgba(0,0,0,.1);
        opacity: 0;
        word-break: break-all;
        word-wrap: break-word;
        /*border-radius: 1.5rem;*/
        color: #FFF;
    }
    .toast-item.top-left {
        top: 0;
        left: 0;
    }
    .toast-item.top-center {
        top: 0;
        left: 50%;
    }
    .toast-item.top-right {
        top: 0;
        right: 0;
    }
    .toast-item.center-left {
        top: 50%;
        left: 0;
    }
    .toast-item.center {
        top: 50%;
        left: 50%;
    }
    .toast-item.center-right {
        top: 50%;
        right: 0;
    }
    .toast-item.bottom-left {
        bottom: 0;
        left: 0;
    }
    .toast-item.bottom-center {
        bottom: 0;
        left: 50%;
    }
    .toast-item.bottom-right {
        bottom: 0;
        right: 0;
    }
    .toast-item.fadein {
        opacity: 1;
        transition: opacity ease-in .2s;
    }
    .toast-item.fadeout {
        opacity: 0;
        transform: scale(.5);
        transition: all ease-in-out .4s;
    }
    .toast-item .toast-icon {
        float: left;
        width: 1.1rem;
        height: .9rem;
        margin-top: .05rem;
        margin-right: .25rem;
        font-size: 1rem;
        text-align: center;
        vertical-align: middle;
        color: #FFF;
    }
    @keyframes loading {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .toast-item .toast-icon.icon-loading {
        width: 1.1rem;
        font-size: .95rem;
        animation: loading 1s linear both infinite;
    }
    .toast-cover {
        position: fixed;
        z-index: 9999;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(255,255,255,0);
        transition: background-color .4s ease-in-out;
    }
    .toast-cover.fadein {
        background-color: rgba(255,255,255,.35);

    }
    .toast-cover.fadeout {
        transition-delay: .2s;
        background-color: rgba(255,255,255,0);
    }
</style>
