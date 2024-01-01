
/*
 * main.ts
 * Copyright (C) 2023 veypi <i@veypi.com>
 * 2023-10-05 19:20
 * Distributed under terms of the MIT license.
 */


import { createApp } from 'vue'
import App from './App.vue'
import oaer from './index.ts'

oaer.set({
  host: 'http://127.0.0.1:4001/',
  uuid: 'FR9P5t8debxc11aFF',
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJvYSIsImF1ZCI6IiIsImV4cCI6MTcwMzkyMjg3NCwiaWF0IjoxNzAzNTc3Mjc0LCJpZCI6ImVhM2U5YjQ3NTFiMjQwMWU4MGQ0MzY5Nzc4Yjk3YzE4Iiwibmlja25hbWUiOiJUZWFkaW4iLCJpY29uIjoiL21lZGlhL3VzZXJfaWNvbi9lYTNlOWI0NzUxYjI0MDFlODBkNDM2OTc3OGI5N2MxOC4xNjk3MTIzMTA4MzgxTURFeE9TNXFjR2M9LmpwZyIsImFpZCI6IkZSOVA1dDhkZWJ4YzExYUZGIiwiYWNjZXNzIjpbeyJuYW1lIjoiYXBwIiwicmlkIjpudWxsLCJsZXZlbCI6NX0seyJuYW1lIjoidXNlciIsInJpZCI6bnVsbCwibGV2ZWwiOjV9XX0.JIMX76XYK617r1A7hWOAXUxZyJci4gV7u8l59zAfqso'
})

createApp(App).mount('#app')
