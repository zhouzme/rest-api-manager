<template>
    <component :is="summary?'details':'div'" class="block" v-if="apiList" open>
        <summary class="summary" v-if="summary">{{summary}}</summary>
        <ul class="list">
            <template v-for="(children, i) in apiList">
                <li :key="i" v-if="children && children !== true" :class="itemClass(children)">
                    <span class="name" v-if="isApiName(children)" :class="children===apiName?'curr':''" v-on:click="onSelected(children)">{{children}}</span>
                    <api-list v-else :api-list="children" :summary="i" :on-selected="onSelected" :api-name="apiName"></api-list>
                </li>
            </template>
        </ul>
    </component>
</template>

<script>
    import lodash from 'lodash';

    export default {
        name: "ApiList",
        data() {
            return {

            };
        },
        methods: {
            itemClass(data) {
                return this.isApiName(data) ? 'api' : 'path';
            },
            isApiName(data) {
                return !lodash.isObject(data);
            },
        },
        created() {
            this.$nextTick(function(){

            });
        },
        props: {
            apiList: {
                required: true,
            },
            summary: String,
            apiName: String,
            onSelected: Function,
        },
    }
</script>

<style scoped>
    .summary {
        font-size: 12px;
        line-height: 36px;
    }

    .path, .api {
        list-style: none;
    }

    .path {
        font-size: 12px;
        color: #999;
    }

    .api {
        font-size: 14px;
        /*font-weight: bolder;*/
        color: #999;
    }

    .api .name {
        display: block;
        line-height: 36px;
        background-color: transparent;
        cursor: pointer;
    }
    .list {
        padding-left: 20px;
    }
    .list .summary {
        padding-left: 0px;
    }
    .list .api .name {
        padding-left: 10px;
    }
    .api .name.curr,
    .api .name:hover {
        color: #000;
        background-color: #FFF;
    }
</style>
