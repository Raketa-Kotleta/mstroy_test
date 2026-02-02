import { createApp, type Component } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { AgGridVue } from 'ag-grid-vue3';

const app = createApp(App);

app.use(createPinia());
app.component('VAgGrid', AgGridVue);

app.mount('#app');
