
/*
 * main.ts
 * Copyright (C) 2023 veypi <i@veypi.com>
 * 2023-10-05 19:20
 * Distributed under terms of the MIT license.
 */


import { createApp } from 'vue'
import App from './App.vue'
import { Cfg } from './index.ts'
Cfg.host.value = 'http://127.0.0.1:8082'
Cfg.token.value = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJvbmVkdCIsImF1ZCI6IiIsImV4cCI6MTY5NjgzNzU3NSwiaWF0IjoxNjk2NDkxOTc1LCJpZCI6Ijc5NDAyZDBlY2RiYTQ1ZWFiNTQwNTk0YzZlYjJlM2VjIiwibmlja25hbWUiOiJhZG1pbiIsImljbyI6Ii9tZWRpYS9pY29uL3Vzci8wMDU1LmpwZyIsImFjY2VzcyI6W3sibmFtZSI6ImFwcCIsInJpZCI6bnVsbCwibGV2ZWwiOjV9LHsibmFtZSI6InVzZXIiLCJyaWQiOm51bGwsImxldmVsIjo1fV19.vS7XfCKDT75xOZ1b_UZ7fR24JkZj7dLKL69Kx0Ud2OY'
Cfg.uuid.value = 'FR9P5t8debxc11aFF'

createApp(App).mount('#app')
