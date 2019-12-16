<template>
    <Layout>
        <template slot="left">
            <div class="left-ct scrollbar">
                <api-list v-if="apiPathList" :api-name="apiName" :api-path-list="apiPathList" :api-info-list="apiInfoList"  :on-selected="onSelected"></api-list>
            </div>
        </template>
        <template slot="right">
            <api-info v-if="apiName" v-bind:name.sync="apiName" :api-name="apiName" :api-info-list="apiInfoList" @reload-apis="loadApiList"></api-info>
        </template>
    </Layout>
</template>

<script>
    import Layout from "@/pages/Layout";
    import ApiList from "@/components/ApiList";
    import ApiInfo from "@/components/ApiInfo";
    import Configs from "@/config";
    import Http from "@/utils/http";
    export default {
        name: "Api",
        components: {Layout, ApiList, ApiInfo},
        data() {
            return {
                apiName: "",
                apiPathList: null,
                apiInfoList: null,
                onSelected:  (name) => {
                    this.apiName = name;
                }
            };
        },
        methods: {
            setDefaultApiName() {
                if (this.apiName) return;
                for (let apiName in this.apiInfoList) {
                    if (!this.apiInfoList.hasOwnProperty(apiName)) continue;
                    this.apiName = apiName;
                    break;
                }
            },
            loadApiList() {
                const apiListUrl = Configs.ApiListUrl();
                Http.get(apiListUrl).then(response => {
                    if (!response.data.state) {
                        alert(response.data.message);
                    } else {
                        this.apiPathList = response.data.data.apiPathList;
                        this.apiInfoList = response.data.data.apiInfoList;
                        this.setDefaultApiName();
                    }
                });
            },
        },
        created() {
            this.loadApiList();
        },
    }
</script>

<style>
    #layout-left > .block { padding: .5rem 0; }
</style>

<style scoped>
    .left-ct {
        box-sizing: border-box;
        height: calc(100% - 1rem);
        margin: .5rem 0;
        overflow: hidden;
    }
    .left-ct:hover {
        overflow: auto;
    }
    .scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(153,153,153,0);
    }
    .scrollbar:hover::-webkit-scrollbar-thumb {
        background-color: rgba(153,153,153,1);
    }
</style>
