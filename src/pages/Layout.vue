<template>
    <div id="layout-main">
        <div id="layout-head">
            <ul class="navs">
                <li class="item left-space">
                </li><li class="item" :class="{curr: $route.name === 'Setting'}">
                    <router-link :to="{name: 'Setting'}">Setting</router-link>
                </li><li class="item" :class="{curr: $route.name === 'Api'}">
                    <router-link :to="{name: 'Api'}">Api</router-link>
                </li>
            </ul>
        </div>
        <div id="layout-body">
            <div id="layout-left" class="scrollbar" ref="layoutLeft">
                <slot name="left"></slot>
            </div>
            <div id="layout-right" ref="layoutRight">
                <slot name="right"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Layout"
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
        height: 50px;
        max-height: 50px;
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
        min-width: 250px;
        max-width: 400px;
    }
    #layout-head .navs .item a {
        display: block;
        font-size: 18px;
        padding: 0 25px;
        min-width: 125px;
        line-height: 50px;
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
