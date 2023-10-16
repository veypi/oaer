/*
 * index.ts
 * Copyright (C) 2023 veypi <i@veypi.com>
 * 2023-10-05 18:13
 * Distributed under terms of the MIT license.
 */

import './index.css'
import 'animate.css'
import '@veypi/msg/index.css'
import './assets/icon.js'
import OAer from './components/main.vue'
import { api } from './api'
import oafs from './libs/oafs'
import cfg from './cfg'
import bus from './bus'
import nats from './nats'
export type { fileProps } from './libs/oafs'

const set = (options: { uuid?: string, host?: string, token?: string }) => {
  if (options.uuid) {
    cfg.uuid.value = options.uuid
  }
  if (options.host) {
    if (options.host.endsWith('/')) {
      options.host = options.host.slice(0, options.host.length - 1)
    }
    cfg.host.value = options.host
  }
  if (options.token) {
    cfg.token.value = options.token
    if (cfg.uuid.value === cfg.self) {
      cfg.oa_token.value = options.token
      bus.emit('sync')
    } else {
      api.refresh_token()
    }
  }
}

export { OAer, api, oafs, nats }
export default { OAer, set, api, nats }
