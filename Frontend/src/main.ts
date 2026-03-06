import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import "@fortawesome/fontawesome-free/css/all.css";
import router from './router'
import VueApexCharts from "vue3-apexcharts";
import api from './services/axios';

const app = createApp(App);

// Rendre l'instance axios accessible globalement via this.$api
app.config.globalProperties.$api = api;

app.use(router).use(VueApexCharts).mount('#app');
