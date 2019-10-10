<template>
    <Layout>
        <template slot="right">
        <ul class="form-ul">
            <li class="form-li" data-name="API List URL"><input class="input text" type="text" v-model="apiListUrl" placeholder="API List URL" title=""></li>
            <li class="form-li" data-name="API Request URL"><input class="input text" type="text" v-model="apiRequestUrl" placeholder="API Request URL" title=""></li>
            <li class="form-li button-ct"><input class="input button submit" type="button" v-on:click="save" value="Save"></li>
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
                apiListUrl: '',
                apiRequestUrl: '',
            };
        },
        created() {
            this.apiListUrl = Configs.ApiListUrl();
            this.apiRequestUrl = Configs.ApiRequestUrl();
        },
        methods: {
            save() {
                Configs.setApiListUrl(this.apiListUrl);
                Configs.setApiRequestUrl(this.apiRequestUrl);
                alert('保存成功')
            }
        }
    }
</script>

<style scoped>
    #layout-right-top, #layout-right-bottom { display: none; }

</style>
