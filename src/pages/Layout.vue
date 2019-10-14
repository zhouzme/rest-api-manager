<template>
    <div id="layout-main">
        <div id="layout-head">
            <ul class="navs">
                <li class="item left-space">
                </li><li class="item" :class="{curr: $route.name === 'Setting'}">
                    <router-link :to="{name: 'Setting'}">Setting</router-link>
                </li><li class="item" :class="{curr: $route.name === 'API'}">
                    <router-link :to="{name: 'API'}">API</router-link>
                </li>
            </ul>
        </div>
        <div id="layout-body">
            <div id="layout-left" class="scrollbar" ref="layoutLeft" :style="leftStyle">
                <slot name="left"></slot>
            </div>
            <div id="layout-right" ref="layoutRight">
                <slot name="right"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    import Configs from '@/config'
    export default {
        name: "Layout",
        data() {
            return {
                leftStyle: {
                    backgroundColor: '#F0F0F0',
                }
            };
        },
        methods: {
            onLeftBgColorChange(color) {
                console.log('onLeftBgColorChange',color)
                this.leftStyle.backgroundColor = color;
            }
        },
        created() {
            const leftBackgroundColor = Configs.LeftBackgroundColor();
            if (leftBackgroundColor) this.leftStyle.backgroundColor = leftBackgroundColor
        },
    }
</script>

<style scoped>
    #layout-main {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        height: 100%;
    }
    #layout-head {
        height: 2.5rem;
        max-height: 2.5rem;
        background-color: #555;
    }
    #layout-head .navs {

    }
    #layout-head .navs .item {
        display: inline-block;
    }
    #layout-head .navs .item.left-space,
    #layout-left {
        width: 10%;
        min-width: 10rem;
        max-width: 60%
    }
    #layout-head .navs .item a {
        display: block;
        font-size: .9rem;
        padding: 0 1.25rem;
        min-width: 6.25rem;
        line-height: 2.5rem;
        text-align: center;
        color: #FFF;
    }
    #layout-head .navs .item.curr {
        background-color: #FFF;
    }
    #layout-head .navs .item.curr a {
        /*font-size: 20px;*/
        /*font-weight: bolder;*/
        color: #333;
    }
    #layout-body {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        height: 100%;
    }
    #layout-left {
        height: 100%;
        background-color: #F8F8F8;
        overflow-x: auto;
        resize: horizontal;
    }
    #layout-left:hover {

    }
    #layout-right {
        flex: 1;
        height: 100%;
    }
</style>
