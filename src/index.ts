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
import { ref, watch, computed } from 'vue'

const set = (options: { uuid?: string, host?: string, token?: string }) => {
  if (options.uuid) {
    cfg.uuid.value = options.uuid
  }
  if (options.host) {
    if (options.host.endsWith('/')) {
      options.host = options.host.slice(0, options.host.length - 1)
    }
    cfg.host.value = options.host
    api.info().then(e => {
      cfg._host_nats = e.ws_url
    })
  }
  if (options.token) {
    cfg.token.value = options.token
    if (cfg.uuid.value === cfg.self) {
      bus.emit('sync', options.token)
    } else {
      api.refresh_token()
    }
  }
}

bus.on('sync', (t: any) => {
  let token = t.split('.')
  if (!token || token.length !== 3) {
    return false
  }
  let data = JSON.parse(decode(token[1]))
  if (data.id) {
    console.debug('sync oa')
    cfg.oa_token.value = t
    cfg.local_user.value = data
    api.user.get(data.id).then(e => {
      cfg.ready.value = true
      cfg.oa_token.value = t
      cfg.local_user.value = e
      nats_sync()
      oafs_sync()
    }).catch(e => {
      cfg.oa_token.value = ''
      console.warn(e)
      bus.emit('logout', 'fetch user data failed ' + e)
    })
  } else {
    console.warn('invalid token')
    bus.emit('logout', 'fetch user data failed.')
  }
})

let ready = ref(false)
watch(computed(() => cfg.ready.value && nats.ready.value), (e) => {
  console.log('oa ready.')
  ready.value = e
})

const drop_fs = () => {
  return new Promise((resolve, reject) => {
    let dom = document.getElementById('v_dragging')
    if (dom === null) {
      return
    }
    let u = dom.getAttribute('vsrc')
    if (u) {
      oafs.get(u).then(e => {
        resolve(e)
      }).catch(e => {
        reject(e)
      })
    } else {
      reject('e')
    }
  })
}
export { OAer, api, oafs, nats, drop_fs }
export default { OAer, set, api, nats, ready: ready }
