import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Mount only after the first route resolves, so App.vue knows on setup which page the
// visitor landed on (the splash screen and the route palette depend on it).
router.isReady().then(() => app.mount('#app'))
