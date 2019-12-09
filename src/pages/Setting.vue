<template>
    <Layout ref="layout">
        <template slot="right">
        <ul class="form-ul">
            <li class="form-li text" data-name="API List URL"><input class="input" type="text" v-model="apiListUrl" placeholder="API List URL" title=""></li>
            <li class="form-li text" data-name="API Request URL"><input class="input" type="text" v-model="apiRequestUrl" placeholder="API Request URL" title=""></li>
            <li class="form-li color" data-name="Left Background Color"><input class="input" type="text" v-model="leftBackgroundColor" placeholder="Left Background Color" title=""><input class="input color-selector" type="color" v-model="leftBackgroundColor" placeholder="Left Background Color" title="select color"></li>
            <li class="form-li button"><input class="input submit" type="button" @click="(e)=>onSave(e)" value="Save"><span class="result">{{result}}</span></li>
        </ul>
        </template>
    </Layout>
</template>

<script>
    import Layout from './Layout'
    import Configs from '@/config'
    export default {
        name: "Setting",
        components: {Layout},
        data() {
            return {
                result: '',
                apiListUrl: '',
                apiRequestUrl: '',
                leftBackgroundColor: '',
            };
        },
        created() {
            this.apiListUrl = Configs.ApiListUrl();
            this.apiRequestUrl = Configs.ApiRequestUrl();
            this.leftBackgroundColor = Configs.LeftBackgroundColor();
        },
        methods: {
            onSave() {
                Configs.setApiListUrl(this.apiListUrl);
                Configs.setApiRequestUrl(this.apiRequestUrl);
                Configs.setLeftBackgroundColor(this.leftBackgroundColor);
                this.result = '保存成功';
            }
        },
        watch: {
            leftBackgroundColor(n) {
                this.$refs.layout.onLeftBgColorChange(n);
                console.log('color', n);
                this.$emit('left-bgcolor-change', n);
            },
        }
    }
</script>

<style scoped>
    #layout-right-top, #layout-right-bottom { display: none; }
    .result {
        color: lightseagreen;
        margin-left: 1rem;
    }
    .color-selector {
        position: absolute;
        top: .25rem;
        right: -2rem;
        width: 1.5rem;
        height: 1.5rem;
        cursor: pointer;
    }
</style>
