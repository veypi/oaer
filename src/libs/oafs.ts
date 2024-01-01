/*
 * fs.ts
 * Copyright (C) 2023 veypi <i@veypi.com>
 * 2023-10-08 01:55
 * Distributed under terms of the MIT license.
 */


import axios from "axios";
import { Base64 } from 'js-base64'
import { createClient, WebDAVClient } from 'webdav'
import { ref } from 'vue'
import cfg from "../cfg";

export interface fileProps {
  filename: string,
  basename: string,
  lastmod: string,
  size: number,
  type: "directory" | "file",
  etag: string
}

let client = {
  dav: {} as WebDAVClient,
  ready: ref(false),
  app_dav: {} as WebDAVClient,
}


export const sync = () => {
  console.debug('sync oafs: ' + cfg.userFileUrl())
  client.app_dav = createClient(cfg.appFileUrl(),
    { headers: { authorization: "bearer " + cfg.oa_token.value } })
  client.dav = createClient(cfg.userFileUrl(),
    { headers: { authorization: "bearer " + cfg.oa_token.value } })
  client.ready.value = true
}

const rename = (o: string, n?: string) => {
  let ext = '.' + o.split('.').pop()?.toLowerCase()
  if (n) {
    return n + ext
  }
  let d = new Date().getTime()
  return d + Base64.encode(o) + ext
}


const get = (url: string): Promise<string> => {
  return fetch(cfg.Host() + url, { headers: { authorization: "bearer " + cfg.oa_token.value } }).then((response) => response.text())
}

// rename 可以保持url不变
const upload = (f: FileList | File[], dir?: string, renames?: string[]) => {
  return new Promise<string[]>((resolve, reject) => {
    var data = new FormData();
    for (let i = 0; i < f.length; i++) {
      let nf = new File([f[i]], rename(f[i].name, renames && renames[i] ? renames[i] : undefined), { type: f[i].type })
      data.append('files', nf, nf.name)
    }
    axios.post("/api/upload/" + (dir || ''), data, {
      headers: {
        "Content-Type": 'multipart/form-data',
        'auth_token': cfg.oa_token.value,
      }
    }).then(e => {
      resolve(e.data)
    }).catch(reject)
  })
}

const get_dav = (client: WebDAVClient, base_url: string) => {
  return {
    client: client,
    stat: client.stat,
    dir: client.getDirectoryContents,
    uploadstr: (dir: string, name: string, data: string) => {
      if (dir.startsWith('/')) {
        dir = dir.slice(1)
      }
      return new Promise((resolve, reject) => {
        let temp = () => {
          let reader = new FileReader()
          reader.onload = function(event) {
            var res = event.target?.result
            // let data = new Blob([res])
            client.putFileContents(dir + name, res).then(e => {
              if (e) {
                resolve(base_url + dir + name)
              }
            }).catch(reject)
          }
          reader.readAsArrayBuffer(new Blob([data], { type: 'plain/text' }))
        }
        client.stat(dir).then(() => {
          temp()
        }).catch((_) => {
          client.createDirectory(dir, { recursive: true }).then(() => {
            temp()
          }).catch(e => {
            console.warn(e)
          })
        })
      });
    }
  }
}


const dav = () => {
  return get_dav(client.dav, cfg.userFileUrl())
}
const appdav = () => {
  return get_dav(client.app_dav, cfg.appFileUrl())
}


export default {
  ready: client.ready,
  get,
  upload,
  dav,
  appdav,
  rename,
}
