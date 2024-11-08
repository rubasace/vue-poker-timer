import './assets/main.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'


import {createApp} from 'vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import {createPinia} from 'pinia'
import piniaPersistedState from 'pinia-plugin-persistedstate';
import App from './App.vue'


import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Checkbox from 'primevue/checkbox';
import Card from 'primevue/card';
import FileUpload from 'primevue/fileupload';
import Textarea from 'primevue/textarea';
import Dialog from 'primevue/dialog';

import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';



import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import {useCustomizationStore} from "@/stores/customizationStore.js";

const app = createApp(App)

app.component('Tabs', Tabs);
app.component('TabList', TabList);
app.component('Tab', Tab);
app.component('TabPanels', TabPanels);
app.component('Dialog', Dialog);
app.component('TabPanel', TabPanel);
app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('Select', Select);
app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Checkbox', Checkbox);
app.component('Card', Card);
app.component('FileUpload', FileUpload);
app.component('Textarea', Textarea);

app.component('ConfirmDialog', ConfirmDialog);
app.component('Toast', Toast);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'none',
        }
    }
});


app.use(ConfirmationService);
app.use(ToastService);
const pinia = createPinia()
pinia.use(piniaPersistedState);
app.use(pinia)

//Done like this so themes get loaded at startup
const customizationStore = useCustomizationStore()

// Register the v-visible directive globally
app.directive('visible', {
    mounted(el, binding) {
        el.style.visibility = binding.value ? 'visible' : 'hidden';
    },
    updated(el, binding) {
        el.style.visibility = binding.value ? 'visible' : 'hidden';
    }
});

app.mount('#app')
