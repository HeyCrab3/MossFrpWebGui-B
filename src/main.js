import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import router from './components/router/index.js';
import 'vant/lib/index.css';

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.mount('#app');

