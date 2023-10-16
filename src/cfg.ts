/*
* @name: setting
* @author: veypi <i@veypi.com>
* @date: 2021-11-17 15:45
* @description：setting
* @update: 2021-11-17 15:45
*/

import { ref } from 'vue'
import { modelsApp, modelsUser } from './models'

let cfg = {
  self: 'FR9P5t8debxc11aFF',

  uuid: ref(''),
  app_data: ref<modelsApp>({} as modelsApp),

  token: ref(''),
  oa_token: ref(''),
  local_user: ref<modelsUser>({} as modelsUser),

  host: ref('127.0.0.1:4001'),
  _host_nats: '127.0.0.1:4221',
  nats_pub_key: 'UCXFAAVMCPTATZUZX6H24YF6FI3NKPQBPLM6BNN2EDFPNSUUEZPNFKEL',
  prefix: '/api',
  BaseUrl() {
    return this.host.value + this.prefix
  },
  NatsHost() {
    if (this._host_nats.startsWith('ws:')) {
      return this._host_nats
    }
    return 'ws://' + this._host_nats
  },
  media(u: string) {
    return this.host.value + u
  },
  goto(url: string) {
    if (url.startsWith('http')) {
      window.location.href = url
      return
    }
    if (!url.startsWith('/')) {
      url = '/' + url
    }
    window.location.href = this.host.value + url
  },
  userFileUrl() {
    return (this.host.value || window.location.host) + '/file/'
  },
}


export default cfg
