/*
 * index.ts
 * Copyright (C) 2023 veypi <i@veypi.com>
 * 2023-10-16 21:19
 * Distributed under terms of the MIT license.
 */


import axios from 'axios'
import * as nats from '../libs/nats.ws'
import cfg from '../cfg';
import bus from '../bus';
import { api } from '..';
import { ref } from 'vue';



let data = {
  _connect: {} as nats.NatsConnection,
  ready: ref(false),
  name: '',
}



export const sync = () => {
  console.debug('sync oa nats')
  api.app.get(cfg.uuid.value).then(e => {
    cfg.app_data.value = e
    init()
  })
}


const sc = nats.StringCodec()
const init = async function() {
  let name = (cfg.local_user.value.username || cfg.local_user.value.id) + '@' + cfg.app_data.value.name
  data.name = name
  console.debug('connect ' + name)
  data.ready.value = false
  let tmp = await nats.connect({
    servers: cfg.NatsHost(),
    name: name,
    authenticator: (nonce?: string) => {
      return {
        nkey: async function name(nonce) {
          let response = await axios.post(cfg.BaseUrl() + '/app/nats/token/', { token: cfg.oa_token.value, nonce: nonce });
          let data = response.data.split('@')
          let res = {
            nkey: data[1],
            sig: data[0]
          };
          return res
        }(nonce)
      }
    },
  } as any)
  if (data._connect.isClosed && !data._connect.isClosed()) {
    data._connect.close()
    console.debug('close last connection')
  }
  data._connect = tmp
  subscribe(`logout.${name}`, () => {
    data.ready.value = false
    bus.emit('logout', 'from remote call')
    client().close()
  })
  data.ready.value = true
}

const client = () => {
  return data._connect
}

const subscribe = (topic: string, cb: (msg: string, idx: number, topic: string) => void) => {
  console.debug('subscribe ' + topic)
  let sub = client().subscribe(topic);
  (async function() {
    for await (const m of sub) {
      cb(m.string(), sub.getProcessed(), m.subject)
    }
  })();
  return sub
}
const publish = (topic: string, msg?: string) => {
  if (msg) {
    client().publish(topic, sc.encode(msg))
    return
  }
  return (msg: string) => {
    client().publish(topic, sc.encode(msg))
  }
}

const serve = (topic: string, cb: (msg: string) => string) => {
  let sub = client().subscribe(topic);
  (async function() {
    for await (const m of sub) {
      let res = cb(m.string())
      m.respond(sc.encode(res))
    }
  })();
  return sub
}
const request = (topic: string, payload?: string) => {
  return new Promise<string>((resolve, reject) => {
    client().request(topic, payload || nats.Empty, { timeout: 1000 }).then((m: any) => {
      resolve(m.string())
    }).catch((e: any) => {
      reject(e)
    })
  })
}



export default {
  nats,
  client,
  subscribe,
  publish,
  serve,
  request,
  ready: data.ready,
}
