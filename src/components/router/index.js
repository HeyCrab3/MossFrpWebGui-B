import { createRouter } from "vue-router";
import { createWebHashHistory } from "vue-router";
import loginView from '../user/login.vue';
import regView from '../user/register.vue';
import indexView from '../index.vue';
import nodeView from '../frp/node.vue'
import storeView from '../frp/store.vue'
import listView from '../frp/list.vue'
import settingsView from '../user/settings.vue'
import tunnelView from '../frp/tunnel.vue'
const routes = [
    {
        path: '/login',
        name: 'Login',
        component: loginView
    },
    {
        path: '/register',
        name: 'Register',
        component: regView
    },
    //Crab：您写了您妈呢
    {
        path: '/',
        name: 'Index',
        component: indexView
    },
    {
        path: '/status',
        name: 'Node',
        component: nodeView
    },
    {
        path: '/store',
        name: 'Store',
        component: storeView
    },
    {
        path: '/code',
        name: 'Code',
        component: listView
    },
    {
        path: '/settings',
        name: 'Settings',
        component: settingsView
    },
    {
        path: '/tunnel',
        name: 'Tunnel',
        component: tunnelView
    },
];
const router = createRouter({history: createWebHashHistory(),routes: routes});
export default router;