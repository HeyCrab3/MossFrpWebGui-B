import { createRouter } from "vue-router";
import { createWebHashHistory } from "vue-router";
import loginView from '../user/login.vue';
import indexView from '../index.vue';
import nodeView from '../frp/node.vue'
import storeView from '../frp/store.vue'
import listView from '../frp/list.vue'
import codeNewView from '../frp/new.vue'
import settingsView from '../user/settings.vue'
import donateView from '../afdian.vue'
const routes = [
    {
        path: '/login',
        name: 'Login',
        component: loginView
    },
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
        path: '/code/add',
        name: 'NewCode',
        component: codeNewView
    },
    {
        path: '/settings',
        name: 'Settings',
        component: settingsView
    },
    {
        path: '/afdian',
        name: 'Donate',
        component: donateView
    }
];
const router = createRouter({history: createWebHashHistory(),routes: routes});
export default router;