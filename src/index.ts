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
import { Cfg, api } from './api'

const set_cfg = (options: { uuid?: string, host?: string, token?: string }) => {
  if (options.uuid) {
    Cfg.uuid.value = options.uuid
  }
  if (options.host) {
    if (options.host.endsWith('/')) {
      options.host = options.host.slice(0, options.host.length - 1)
    }
    Cfg.host.value = options.host
  }
  if (options.token) {
    Cfg.token.value = options.token
    if (Cfg.uuid.value === Cfg.self) {
      Cfg.oa_token.value = options.token
    } else {
      api.refresh_token()
    }
  }
}

export { OAer, set_cfg, api }
export default { OAer, set_cfg, api }
