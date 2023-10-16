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
import oafs, { sync as oafs_sync } from './libs/oafs'
import cfg from './cfg'
import bus from './bus'
import nats, { sync as nats_sync } from './nats'
import { decode } from 'js-base64'
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

bus.on('sync', () => {
  let token = cfg.oa_token.value?.split('.')
  if (!token || token.length !== 3) {
    return false
  }
  let data = JSON.parse(decode(token[1]))
  if (data.id) {
    cfg.local_user.value = data
    api.user.get(data.id).then(e => {
      cfg.local_user.value = e
      nats_sync()
      oafs_sync()
    }).catch(e => {
      console.warn(e)
      bus.emit('logout', 'fetch user data failed ' + e)
    })
  } else {
    console.warn('invalid token')
    bus.emit('logout', 'fetch user data failed.')
  }
})

export { OAer, api, oafs, nats }
export default { OAer, set, api, nats }
