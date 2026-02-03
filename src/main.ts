import { createApp, type Component } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { AllEnterpriseModule, ModuleRegistry } from 'ag-grid-enterprise';
ModuleRegistry.registerModules([AllEnterpriseModule]);

const app = createApp(App);

app.use(createPinia());

app.mount('#app');
