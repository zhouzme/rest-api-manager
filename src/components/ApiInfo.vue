<template>
    <div class="api-info-ct">
        <div class="request-ct">
            <details v-show="!!getApiInfo.description || !!getApiInfo.brief" class="api-description">
                <summary class="pointer"></summary>
                <p class="description"><span v-show="!!getApiInfo.brief" class="name">{{getApiInfo.name}}</span><span v-html="getApiInfo.description"></span></p>
            </details>
            <div class="title">
                <ul class="tabs methods" title="Methods:">
                    <li v-for="(vars, i) in getApiInfo.methods" :key="i" @click="onTabMethod(i)" class="tab method"
                        :class="i === method?'curr':''">{{i}}
                    </li>
                </ul>
            </div>
            <details class="method-info-details" open>
                <summary class="pointer"></summary>
                <div v-show="!!getMethodUri" class="uri">{{getMethodUri}}</div>
                <div v-show="!!getMethodDescription" class="description" v-html="getMethodDescription"></div>
            </details>
            <div class="tab-content-ct scrollbar">
                <ul class="tab-content form-ul" v-for="(data, i) in getApiInfo.methods" :class="i === method?'curr':''" :key="apiName +`-`+ i">
                    <li v-for="(loopParam,j) in data.params" :key="apiName +`-`+ i +`-`+ j" class="form-li" :class="inputType(loopParam.type) +' '+ (isRequired(loopParam.type)? 'required' : '')" :title="loopParam.comment" :data-name="loopParam.name">
                        <textarea v-if="loopParam && loopParam.type && (loopParam.type.indexOf('textarea') !== -1)"
                                  class="input" v-model="params[loopParam.name]" :required="isRequired(loopParam.type)"
                                  :placeholder="loopParam.comment"></textarea>
                        <input v-else-if="loopParam && inputType(loopParam.type) === 'file'" @change="e=>params[loopParam.name]=e.target.files[0]" :required="isRequired(loopParam.type)"
                               class="input" type="file" :placeholder="loopParam.comment">
                        <input v-else-if="loopParam" v-model="params[loopParam.name]" :required="isRequired(loopParam.type)"
                               class="input" :class="inputType(loopParam.type)" :type="inputType(loopParam.type)"
                               :placeholder="loopParam.comment">
                        <span class="btn-remove" @click="onRemove(loopParam.name)">╳</span>
                    </li>
                    <li v-show="!data.params" class="form-li no-params">No Params!</li>
                    <li class="form-li button"><input type="button" class="input button submit" @click="onSubmit()" value="SEND"></li>
                </ul>
            </div>
        </div>
        <div class="response-ct">
            <div class="title">
                <ul class="tabs" title="Results:">
                    <li v-for="(type, i) in ['request', 'response']" class="tab request" @click="onTabResponse(type)" :class="{type, curr: resultTab === type}" :key="i">{{type.toUpperCase()}}</li>
                </ul>
            </div>
            <div class="url" v-show="!!request.url" :data-method="request.method">{{request.url}}</div>
            <div class="tab-content-ct scrollbar">
                <div class="tab-content" :class="{curr: resultTab === 'request'}">
                    <details v-show="!!request.status.type" class="item" open>
                        <summary class="summary">Status</summary>
                        <pre class="text"><span class="icon" :class="request.status.type.toLowerCase()">{{request.status.type}}</span>{{request.status.message}}</pre>
                    </details>
                    <details class="item" open>
                        <summary class="summary">Config</summary>
                        <p class="text">{{request.config}}</p>
                    </details>
                    <details class="item" open>
                        <summary class="summary">Params</summary>
                        <pre class="text">{{request.params}}</pre>
                    </details>
                    <details class="item" v-show="!!request.header">
                        <summary class="summary">Header</summary>
                        <p class="text">{{request.header}}</p>
                    </details>
                </div>
                <div class="tab-content" :class="{curr: resultTab === 'response'}">
                    <details class="item">
                        <summary class="summary">Header</summary>
                        <p class="text">Status {{response.status}} : {{response.statusText}}</p>
                        <p class="text">{{response.header}}</p>
                    </details>
                    <details class="item error" open v-show="!!response.error">
                        <summary class="summary">Error</summary>
                        <p class="text">{{response.error}}</p>
                    </details>
                    <details class="item state" open>
                        <summary class="summary">State</summary>
                        <p class="text">
                            <span v-show="response.data.hasOwnProperty('isSuccess')" class="icon"
                                  :class="[response.data.isSuccess ? 'success':'failure', response.data.occurred ? 'occurred' : null]">
                                <template v-if="response.data.code !== 0"> - {{response.data.code}}</template>
                            </span><span v-html="response.data.message"></span>
                        </p>
                    </details>
                    <details v-show="response.data.occurred" class="item" open>
                        <summary class="summary">Occurred</summary>
                        <pre class="text pre-data">{{response.data.occurred}}</pre>
                    </details>
                    <details v-show="!!response.data.description" open class="item">
                        <summary class="summary">Description</summary>
                        <p class="text pre-data" v-html="response.data.description"></p>
                    </details>
                    <details class="item" open>
                        <summary class="summary">Data</summary>
                        <pre class="text pre-data">{{response.data.data}}</pre>
                    </details>
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
                params: null,
                allMethodParams: {},
                resultTab: '',
                request: {method: '', header: {}, config: {}, url: '', params: {}, status: {type:'', message:''}},
                response: {status: '', statusText: '', header: {}, data: {}, error: ''},
            };
        },
        computed: {
            getApiInfo() {
                return lodash.has(this.apiInfoList, this.apiName) ? this.apiInfoList[this.apiName] : [];
            },
            getMethods() {
                return this.getApiInfo.methods;
            },
            getMethodUri() {
                return this.getMethods[this.method].uri;
            },
            getMethodDescription() {
                return this.getMethods[this.method].description;
            }
        },
        methods: {
            onTabMethod(method) {
                this.method = method;
                this.setDefaultParams();
            },
            onTabResponse(type) {
                this.resultTab = type;
            },
            onRemove(paramName) {
                this.$delete(this.params, paramName);
            },
            getRequestUrl(params) {
                let uri = this.getApiInfo.methods[this.method].uri;
                if (params) {
                    for(let k in params) {
                        if (!params.hasOwnProperty(k)) continue;
                        let v = params[k];
                        if (uri.indexOf('{' + k + '}') > -1) delete params[k];
                        uri = uri.replace('{' + k + '}', encodeURIComponent(v));
                    }
                    uri = uri.replace(/\/+(\?|$)/, '/$1');
                }
                if (uri.indexOf('{') >= 0) {
                    this.resultTab = 'request';
                    this.request.status = {
                        type: 'Error',
                        message: '缺少 URI 参数',
                    };
                    return false;
                }
                return Configs.ApiRequestUrl() + uri;
            },
            setRequestStatus(type = '', message = '') {
                this.request.status.type = type;
                this.request.status.message = message;
            },
            onSubmit() {
                let params = JSON.parse(JSON.stringify(this.params));
                const method = this.method.toLowerCase();
                // 注意：params 对象中的部分字段可能会被删除
                const url = this.getRequestUrl(params);
                if (url === false) {
                    return false;
                }

                this.resultTab = 'request';

                // 清除上一次的结果
                this.request.method = this.method;
                this.request.header = {};
                this.request.config = {};
                this.setRequestStatus('Loading', 'please wait ...');
                this.response.header = {};
                this.response.data = {};
                this.response.status = '';
                this.response.statusText = '';
                this.response.error = '';

                this.request.url = url;
                this.request.params = params;

                if (method.toLowerCase() === 'post' && params) {
                    const formData = new FormData();
                    for (let i in params) {
                        if (!params.hasOwnProperty(i)) continue;
                        formData.append(i, params[i]);
                    }
                    params = formData;
                }

                try {
                    Http[method](url, params).then((response) => {
                        this.resultTab = 'response';
                        this.request.config = response.axiosConfig;
                        this.request.header = response.request.headers;
                        this.setRequestStatus();
                        this.response.status = response.status;
                        this.response.statusText = response.statusText;
                        this.response.header = response.header;
                        this.response.data = response.data;
                        console.log(params);
                        // 执行全局回调处理
                        if (lodash.isFunction(window.onRequestSuccess)) {
                            window.onRequestSuccess(this, response);
                        }
                    }).catch(error => {
                        this.resultTab = 'response';
                        if (error.request) {
                            this.request.header = error.request.headers;
                        }
                        this.setRequestStatus();
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
                const methods = this.apiInfoList[this.apiName].methods;
                for (let method in methods) {
                    if (!methods.hasOwnProperty(method)) continue;
                    // 设置初始默认显示的请求方式
                    this.method = method;
                    break;
                }
            },
            setDefaultParams() {
                // 初始化输入值对象
                if (typeof this.allMethodParams[this.apiName] === "undefined") {
                    this.allMethodParams[this.apiName] = {};
                }
                if (typeof this.allMethodParams[this.apiName][this.method] === "undefined") {
                    this.allMethodParams[this.apiName][this.method] = {};
                }
                this.params = this.allMethodParams[this.apiName][this.method];
            }
        },
        created() {
            // 优先设置默认请求方式
            this.setDefaultMethod();
            this.setDefaultParams();
        },
        props: {
            apiName: String,
            apiInfoList: {
                required: true,
            }
        },
        watch: {
            apiName() {
                this.method = '';
                this.setDefaultMethod();
                this.setDefaultParams();
            }
        }
    }
</script>

<style scoped>
    .tabs {
        display: inline-block;
        white-space: nowrap;
        line-height: 1.5rem;
        font-size: .6rem;
        text-align: center;
        color: #999;
    }
    .tabs:before,
    .tabs .tab {
        display: inline-block;
        padding: 0 .5rem;
    }
    .tabs .tab {
        padding: 0 1.25rem;
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
        margin: 0 -1.25rem -1px -1.25rem;
        border-bottom: solid 1px #FFF;
    }
    .tab-content-ct {
        flex: 1;
        height: 100%;
        margin: .5rem 0;
        overflow-y: scroll;
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
        border: solid 2px #AAA;
    }
    .form-li .btn-remove {
        display: none;
        position: absolute;
        right: -1.8rem;
        top: calc(50% - .6rem);
        bottom: 0;
        width: 1.75rem;
        font-size: .6rem;
        text-align: center;
        font-family: cursive;
        color: #CCC;
        cursor: pointer;
    }
    .form-li .btn-remove:hover {
        color: #333;
    }
    .form-li:hover .btn-remove {
        display: block;
    }
    .form-li.no-params {
        padding: 0;
        font-size: 2.5rem;
        line-height: 1em;
        color: #CCC;
        border: none;
    }
    .scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(153,153,153,0);
    }
    .scrollbar:hover::-webkit-scrollbar-thumb {
        background-color: rgba(153,153,153,1);
    }
    .api-info-ct {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        height: 100%;
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

    .api-info-ct .api-description {
        position: relative;
        margin: 0 1rem;
    }
    .api-info-ct .api-description .pointer {
        position: absolute;
        top: 50%;
        left: -.5rem;
        color: #EEE;
        cursor: pointer;
    }
    .api-info-ct .api-description .description {
        margin-top: 1rem;
        padding: .5rem;
        color: #999;
        border: solid 1px #F5F5F5;
    }
    .api-info-ct .api-description .description .name {
        margin-right: 1rem;
    }
    .api-info-ct .api-description .description .name::before {
        content: 'NAME';
    }
    .api-info-ct .title {
        padding-top: 1rem;
    }
    .api-info-ct .title,
    .request-ct .method-info {
        margin: 0 1rem;
        border-bottom: solid 1px #E5E5E5;
    }
    .request-ct .method-info-details {
        position: relative;
    }
    .request-ct .method-info-details .pointer {
        position: absolute;
        top: -1.3rem;
        left: .5rem;
        cursor: pointer;
        color: #CCC;
    }
    .response-ct .url,
    .request-ct .method-info-details .description,
    .request-ct .method-info-details .uri {
        margin: 0 1rem;
        padding: .5rem;
        line-height: 1.7em;
        border-bottom: solid 1px #F5F5F5;
    }

    .api-info-ct .api-description .description .name::before,
    .request-ct .method-info-details .uri::before,
    .response-ct .url::before {
        margin-right: .5rem;
        padding: .1rem .25rem;
        color: #FFF;
        background-color: #999;
    }

    .request-ct .method-info-details .uri::before {
        content: 'URI';
    }
    .request-ct .method-info-details .description {
        color: #999;
    }


    .response-ct .url::before {
        content: attr(data-method);
    }
    .response-ct .tab-content {
        padding: 1.5rem 2.5rem;
        overflow: auto;
    }
    .response-ct .tab-content .item {
        margin-bottom: 2rem;
        border-top: solid 1px #F5F5F5;
    }
    .response-ct .tab-content .summary {
        margin-top: -1.35rem;
        margin-left: -.75rem;
        padding: 1rem 1rem 1rem 0;
        width: 5rem;
        font-size: .7rem;
        font-weight: bolder;
        color: #BBB;
        background-color: #FFF;
    }
    .response-ct .tab-content .text {
        font-size: .6rem;
        line-height: 1.7em;
        color: #333;
        max-width: 100%;
        word-wrap: break-word;
        word-break: break-all;
        font-family: Consolas !important;
    }
    .response-ct .tab-content .pre-data {
        white-space: pre-wrap;
        overflow-x: auto;
    }
    .response-ct .tab-content .error .text {
        color: red;
    }
    .response-ct .tab-content .icon {
        display: inline-block;
        margin-right: .5rem;
        padding: .15rem .5rem;
        min-width: 2.5rem;
        text-align: center;
        color: #FFF;
        background-color: #3285ff;
    }
    .response-ct .tab-content .icon.loading {
        background-color: orange;
    }
    .response-ct .tab-content .icon.success {
        background-color: lightseagreen;
    }
    .response-ct .tab-content .icon.success::before {
        content: 'SUCCESS';
    }
    .response-ct .tab-content .icon.error,
    .response-ct .tab-content .icon.failure {
        background-color: red;
    }
    .response-ct .tab-content .icon.failure::before {
        content: 'FAILURE';
    }
    /* 执行过程中有其他一般性错误发生 */
    .response-ct .tab-content .icon.success.occurred {
        background-color: orange;
    }
</style>

