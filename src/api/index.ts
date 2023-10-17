/*
 * Copyright (C) 2019 light <veypi@light-laptop>
 *
 * Distributed under terms of the MIT license.
 */

import user from './user'
import app from './app'
import cfg from '../cfg'
import ajax from './axios'
import bus from '../bus'


const api = {
  user: user,
  app: app,
  refresh_token: () => {
    ajax.post(cfg.BaseUrl() + '/app/' + cfg.self + '/token/', { app_id: cfg.uuid.value, token: cfg.token.value }).then(e => {
      bus.emit('sync', e)
    }).catch(e => {
      console.warn(e)
      bus.emit('logout', 'get token failed ' + e)
    })
  }
}

export { api }
export default api
