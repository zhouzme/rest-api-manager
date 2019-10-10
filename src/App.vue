<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'app',
    }
</script>

<style>
    @import './assets/css/reset.css';
    html,body {
        height: 100%;
        padding: 0;
        margin: 0;
        font-size: 12px;
        color: #333;
        background-color: #FFF;
    }
    #app {
        display: flex;
        flex-direction: column;
        height: 100%;
        font-family: "Consolas", "Microsoft YaHei UI", "Courier New";
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .form-ul {
        width: 50%;
        padding: 60px 50px;
    }
    .form-li {
        box-sizing: border-box;
        position: relative;
        display: block;
        padding: 10px;
        width: 100%;
        border: solid 1px #EEE;
        margin-bottom: 50px;
    }
    .form-li:not(.button-ct)::before {
        content: attr(data-name);
        position: absolute;
        font-size: 14px;
        left: 0;
        top: -22px;
        color: #999;
    }
    .form-li.button-ct {
        border: none;
        padding: 0;
    }
    .input {
        box-sizing: border-box;
        width: 100%;
        border: none;
    }
    .input.button {
        width: auto;
        min-width: 80px;
        height: 40px;
        padding: 0 20px;
        border: none;
        background-color: #3285ff;
        color: #FFF;
        cursor: pointer;
    }
</style>
