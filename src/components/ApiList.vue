<template>
    <component :is="summary?'details':'div'" class="block" v-if="apiPathList" open>
        <summary class="summary" v-if="summary">{{summary}}</summary>
        <ul class="list">
            <template v-for="(children, i) in apiPathList">
                <li :key="i" v-if="children && children !== true" :class="itemClass(children)">
                    <span class="brief" v-if="isApiName(children)" :class="children===apiName?'curr':''"
                          @click="onSelected(children)">{{apiInfoList[children].brief ? apiInfoList[children].brief : children}}<span
                        class="name" v-if="apiInfoList[children].brief">{{children}}</span></span>
                    <api-list v-else :api-path-list="children" :api-info-list="apiInfoList" :summary="i" :on-selected="onSelected"
                              :api-name="apiName"></api-list>
                </li>
            </template>
        </ul>
    </component>
</template>

<script>
    export default {
        name: "ApiList",
        data() {
            return {};
        },
        methods: {
            itemClass(data) {
                return this.isApiName(data) ? 'api' : 'path';
            },
            isApiName(data) {
                return typeof data === "string";
            },
        },
        created() {
        },
        props: {
            apiPathList: {
                required: true,
            },
            apiInfoList: {
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
        font-size: .6rem;
        line-height: 1.8rem;
    }

    .path, .api {
        list-style: none;
    }

    .path {
        font-size: .6rem;
        color: #CCC;
    }

    .api {
        font-size: .6rem;
        /*font-weight: bolder;*/
        color: #AAA;
    }

    .api .brief {
        position: relative;
        display: block;
        line-height: 1.2rem;
        background-color: transparent;
        cursor: pointer;
    }

    .api .name {
        display: none;
        margin-top: -8px;
        padding-bottom: .5rem;
        font-size: .6rem;
        line-height: 1.2em;
        color: #DDD;
    }
    .summary,
    .api .brief,
    .api .name {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .list {
        padding-left: .5rem;
    }

    .list .summary {
        padding-left: 0;
        padding-bottom: 0;
    }

    .list .api .brief {
        padding-left: .5rem;
    }

    .api .brief.curr {
        line-height: 2rem;
        color: #333;
        background-color: #FFF;
    }
    .api .brief:not(.curr):hover {
        color: #DDDDDD;
    }
</style>
