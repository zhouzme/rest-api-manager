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
        color: #333;
        background-color: #FFF;
    }
    #app {
        display: flex;
        flex-direction: column;
        font-size: .6rem;
        height: 100%;

        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    #app, .form-li.textarea .input {
        font-family: "Consolas", "Microsoft YaHei UI", "Courier New";
    }
    .form-ul {
        width: 61.8%;
        padding: 3rem 2.5rem;
    }
    .form-li {
        box-sizing: border-box;
        position: relative;
        display: block;
        padding: .5rem;
        width: 100%;
        border: solid 1px #EEE;
        margin-bottom: 2.5rem;
    }
    .form-li:not(.button-ct)::before {
        content: attr(data-name);
        position: absolute;
        font-size: .7rem;
        white-space: nowrap;
        left: 0;
        top: -1.1rem;
        color: #999;
    }
    .form-li.button {
        border: none;
        padding: 0;
    }
    .form-li .input {
        box-sizing: border-box;
        width: 100%;
        border: none;
        background-color: transparent;
    }
    .form-li.text {

    }
    .form-li.color {
        max-width: 200px;
    }
    .form-li.textarea .input {
        display: block;
        min-height: 3rem;
        resize: vertical;
    }
    .form-li.button .input {
        width: auto;
        min-width: 4rem;
        height: 2rem;
        padding: 0 1rem;
        border: none;
        background-color: #3285ff;
        color: #FFF;
        cursor: pointer;
        font-weight: bolder;
    }
</style>
