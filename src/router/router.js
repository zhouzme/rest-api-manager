import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const ApiList = ()=>import('@/pages/Api');
const Setting = ()=>import('@/pages/Setting');

const router = new Router({
    // mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Setting',
            component: Setting,
            meta: {
                noNeedRequiresAuth: true,
                title: 'Setting'
            }
        },
        {
            path: '/api',
            name: 'Api',
            component: ApiList,
            meta: {
                noNeedRequiresAuth: true,
                title: 'API'
            }
        },
    ],
});

router.beforeEach((to, from, next)=> {
    const pageTitle = to.meta.hasOwnProperty('title') ? to.meta.title + ' - ' : '';
    document.title = pageTitle + 'REST-API Manager';
    // let goto = null;
    // if (!from && !to) goto = {name:'Setting'};
    next();
});

export default router;
