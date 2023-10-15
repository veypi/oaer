/*
 * Copyright (C) 2019 light <veypi@light-laptop>
 *
 * Distributed under terms of the MIT license.
 */

import user from './user'
import app from './app'
import { Cfg } from './setting'
import ajax from './axios'
import bus from '../bus'


const api = {
  user: user,
  app: app,
  refresh_token: () => {
    Cfg.oa_token.value = ''
    ajax.get(Cfg.BaseUrl() + '/app/' + Cfg.self + '/token/', {}, { app_id: Cfg.uuid.value, auth_token: Cfg.token.value }).then(e => {
      Cfg.oa_token.value = e
    }).catch(e => {
      console.warn(e)
      bus.emit('logout')
    })
  }
}

export { api, Cfg }
export default api
