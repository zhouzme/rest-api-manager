<template>
    <div class="api-info-ct">
        <div class="request-ct">
            <div class="title">
                <ul class="tabs methods" title="Methods:">
                    <li v-for="(vars, i) in getApiInfo" :key="i" v-on:click="onTabMethod(i)" class="tab method"
                        :class="i === method?'curr':''">{{i}}
                    </li>
                </ul>
            </div>
            <div class="tab-content-ct scrollbar">
                <ul class="tab-content form-ul" v-for="(data, i) in getApiInfo" :class="i === method?'curr':''" :key="apiName +`-`+ i">
                    <li v-for="(param,j) in data.args" :key="apiName +`-`+ i +`-`+ j" class="form-li" :class="inputType(param.type) +' '+ (isRequired(param.type)? 'required' : '')" :title="param.comment" :data-name="param.name">
                        <textarea v-if="param && param.type && (param.type.indexOf('textarea') !== -1)"
                                  class="input textarea" v-model="args[param.name]" :required="isRequired(param.type)"
                                  :placeholder="param.name +`:`+ param.comment"></textarea>
                        <input v-else-if="param && inputType(param.type) === 'file'" v-on:change="e=>args[param.name]=e.target.files[0]" :required="isRequired(param.type)"
                               class="input file" type="file" :placeholder="param.comment">
                        <input v-else-if="param" v-model="args[param.name]" :required="isRequired(param.type)"
                               class="input" :class="inputType(param.type)" :type="inputType(param.type)"
                               :placeholder="param.comment">
                        <span class="btn-remove" v-on:click="onRemove(param.name)">╳</span>
                    </li>
                    <li class="button-ct"><input type="button" class="input button submit" v-on:click="onSubmit()" value="Send"></li>
                </ul>
            </div>
        </div>
        <div class="response-ct">
            <div class="title">
                <ul class="tabs" title="Results:">
                    <li v-for="(type, i) in ['request', 'response']" class="tab request" v-on:click="onTabResponse(type)" :class="{type, curr: responseTab === type}" :key="i">{{type}}</li>
                </ul>
            </div>
            <div class="tab-content-ct scrollbar">
                <div class="tab-content" :class="{curr: responseTab === 'request'}">
                    <fieldset>
                        <legend>URL</legend>
                        <p>{{request.url}}</p>
                    </fieldset>
                    <fieldset>
                        <legend>Params</legend>
                        <p>{{request.params}}</p>
                    </fieldset>
                    <fieldset>
                        <legend>Config</legend>
                        <p>{{request.config}}</p>
                    </fieldset>
                    <fieldset>
                        <legend>Header</legend>
                        <p>{{request.header}}</p>
                    </fieldset>
                </div>
                <div class="tab-content" :class="{curr: responseTab === 'response'}">
                    <fieldset>
                        <legend>Status</legend>
                        <p>{{response.status}} : {{response.statusText}}</p>
                    </fieldset>
                    <fieldset v-if="response.error">
                        <legend>Error</legend>
                        <p>{{response.error}}</p>
                    </fieldset>
                    <fieldset>
                        <legend>Header</legend>
                        <p>{{response.header}}</p>
                    </fieldset>
                    <fieldset>
                        <legend>Data</legend>
                        <p>{{response.data}}</p>
                    </fieldset>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import lodash from 'lodash';
    import Http from '@/utils/http';
    import Configs from '@/config';
    export default {
        name: "ApiInfo",
        data() {
            return {
                method: '',
                args: null,
                allMethodArgs: {},
                responseTab: '',
                request: {header:{}, config:null, url:{}, params: {}},
                response: {status:0, statusText: '', header:{}, data: {}, error: ''},
            };
        },
        computed: {
            getApiInfo() {
                return lodash.has(this.apiInfoList, this.apiName) ? this.apiInfoList[this.apiName] : [];
            }
        },
        methods: {
            onTabMethod(method) {
                this.method = method;
                this.setDefaultArgs();
            },
            onTabResponse(type) {
                this.responseTab = type;
            },
            onRemove(paramName) {
                // console.log(this.args, this.allMethodArgs)
                // this.$set(this.args, paramName, '');
                this.$delete(this.args, paramName);
                // console.log(this.args, this.allMethodArgs)
            },
            onSubmit() {
                let params = lodash.clone(this.args);
                const method = this.method.toLowerCase();
                const url = Configs.ApiRequestUrl() + this.apiName + '/';

                this.responseTab = 'response';

                // 清除上一次的结果
                this.request.header = {};
                this.request.config = null;
                this.response.header = '';
                this.response.data = '';
                this.response.status = 0;
                this.response.statusText = '';
                this.response.error = '';

                this.request.url = url;
                this.request.params = params;
                console.log('params', params);
                if (method === "post") {
                    const formData = new FormData();
                    for (let i in params) {
                        if (!params.hasOwnProperty(i)) continue;
                        console.log('post set', i, params[i]);
                        formData.append(i, params[i]);
                    }
                    params = formData;
                    console.log('post', params);
                }

                try {
                    Http[method](url, params).then((response, config) => {
                        console.log(response);
                        console.log(response.request);
                        this.request.config = config;
                        this.request.header = response.request.headers;
                        this.response.status = response.status;
                        this.response.statusText = response.statusText;
                        this.response.header = response.header;
                        this.response.data = response.data;
                    }).catch(error => {
                        if (error.request) {
                            console.log(error.request);
                            this.request.header = error.request.headers;
                        }
                        if (error.response) {
                            this.response.status = error.response.status;
                            this.response.statusText = error.response.statusText;
                            this.response.header = error.response.header;
                            this.response.data = error.response.data;
                        } else {
                            this.response.error = error.message;
                        }
                    });
                } catch (e) {
                    this.response.header = e;
                }
            },
            isRequired(type) {
                // 若是类型中存在 null 则表示非必要参数
                return type && type.indexOf('null') === -1;
            },
            inputType(type) {
                if (!type) return 'text';
                type = type.replace('null', '').replace('|', '');
                // 除了下方类指定转换类型，其他的都使用 input 控件的原生类型
                switch (type) {
                    case 'int':
                    case 'bool':
                        return 'number';
                    case 'float':
                    case 'string':
                    case 'mixed':
                        return 'text';
                    default:
                        return type;
                }
            },
            setDefaultMethod() {
                if (this.method) return;
                for (let apiName in this.apiInfoList) {
                    if (!this.apiInfoList.hasOwnProperty(apiName)) continue;
                    if (apiName !== this.apiName) continue;
                    let methods = this.apiInfoList[apiName];
                    for (let method in methods) {
                        if (!methods.hasOwnProperty(method)) continue;
                        // 设置初始默认显示的请求方式
                        this.method = method;
                        return;
                    }
                }
            },
            setDefaultArgs() {
                // 初始化输入值对象
                if (typeof this.allMethodArgs[this.apiName] === "undefined") {
                    this.allMethodArgs[this.apiName] = {};
                }
                if (typeof this.allMethodArgs[this.apiName][this.method] === "undefined") {
                    this.allMethodArgs[this.apiName][this.method] = {};
                }
                this.args = this.allMethodArgs[this.apiName][this.method];
            }
        },
        created() {
            // 优先设置默认请求方式
            this.setDefaultMethod();
            this.setDefaultArgs();
        },
        props: {
            apiName: String,
            apiInfoList: {
                required: true,
            }
        },
        watch: {
            apiName(n) {
                console.log('apiName', n);
                this.method = '';
                this.setDefaultMethod();
                this.setDefaultArgs();
            }
        }
    }
</script>

<style scoped>
    .api-info-ct {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        height: 100%;
    }

    .title {
        margin: 0 20px;
        padding: 20px 10px 0 10px;
        /*background-color: #F5F5F5;*/
        border-bottom: solid 1px #E5E5E5;
    }
    .tabs {
        display: inline-block;
        white-space: nowrap;
    }
    .tabs:before,
    .tabs .tab {
        display: inline-block;
        min-width: 60px;
        padding: 0 15px;
        line-height: 40px;
        font-size: 12px;
        /*border-right: solid 1px #DDD;*/
        text-align: center;
        color: #999;
    }

    .tabs:before {
        content: attr(title);
        color: #333;
        /*background-color: #999;*/
    }

    .tabs .tab {
        cursor: pointer;
    }

    .tabs .tab:last-child {
        border-right: none;
    }

    .tabs .tab:not(.curr):hover {
        color: #333;
        background-color: #F5F5F5;
    }
    .tabs .tab.curr {
        /*position: relative;*/
        color: #333;
        border: solid 1px #E5E5E5;
        border-bottom: none;
    }
    .tabs .tab.curr:after {
        /*position: absolute;*/
        /*bottom: -1px;*/
        /*left: 0;*/
        /*right: 0;*/
        display: block;
        content: '';
        height: 0;
        margin: 0 -15px -1px -15px;
        border-bottom: solid 1px #FFF;
    }
    .tab-content-ct {
        flex: 1;
        height: 100%;
        margin: 10px 0;
        overflow-y: auto;
    }
    .tab-content {
        display: none;
        word-break: break-all;
        word-wrap: break-word;
    }
    .tab-content.curr {
        display: block;
    }

    .form-li {
        position: relative;
    }
    .form-li.required {
        border: solid 2px #3285ff;
    }
    .form-li .btn-remove {
        display: none;
        position: absolute;
        right:-36px;
        top: 0;
        bottom: 0;
        width: 35px;
        line-height: 35px;
        font-size: 12px;
        text-align: center;
        font-family: cursive;
        color: #CCC;
        cursor: pointer;
    }
    .form-li.file .btn-remove {
        line-height: 45px;
    }
    .form-li .btn-remove:hover {
        color: #333;
    }
    .form-li:hover .btn-remove {
        display: block;
    }
    .scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(153,153,153,0);
    }
    .scrollbar:hover::-webkit-scrollbar-thumb {
        background-color: rgba(153,153,153,1);
    }

    .request-ct,
    .response-ct {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }
    .request-ct {
        /*flex: 1;*/
        width: 50%;
        /*min-width: 10%;*/
        max-width: 80%;
        height: 100%;
        overflow-x: auto;
        resize: horizontal;
    }
    .response-ct {
        /*flex: 1;*/
        width: 50%;
        /*min-width: 10%;*/
        /*max-width: 50%;*/
        height: 100%;
        border-left: solid 1px #F5F5F5;
    }
    .response-ct .tab-content {
        padding: 30px 50px;
    }
    .response-ct .tab-content fieldset {
        margin-bottom: 30px;
        border-top: solid 1px #F0F0F0;
    }
    .response-ct .tab-content legend {
        padding: 20px 50px 20px 0;
        font-size: 14px;
        font-weight: bolder;
        color: #BBB;
    }
    .response-ct .tab-content p {
        font-size: 14px;
        line-height: 1.7em;
        color: #333;
        word-wrap: break-word;
        word-break: break-all;
        font-family: Consolas !important;
    }
</style>
<style>

</style>
