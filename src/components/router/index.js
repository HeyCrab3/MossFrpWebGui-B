import { createRouter } from "vue-router";
import { createWebHashHistory } from "vue-router";
import loginView from '../user/login.vue';
import indexView from '../index.vue';
import nodeView from '../frp/node.vue'
import storeView from '../frp/store.vue'
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
    }
];
const router = createRouter({history: createWebHashHistory(),routes: routes});
export default router;