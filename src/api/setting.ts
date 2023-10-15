/*
* @name: setting
* @author: veypi <i@veypi.com>
* @date: 2021-11-17 15:45
* @description：setting
* @update: 2021-11-17 15:45
*/

import { ref } from 'vue'

export let Cfg = {
  self: 'FR9P5t8debxc11aFF',
  uuid: ref(''),
  token: ref(''),
  oa_token: ref(''),
  host: ref(''),
  prefix: '/api',
  BaseUrl() {
    return this.host.value + this.prefix
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
