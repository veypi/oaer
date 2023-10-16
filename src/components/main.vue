<template>
  <BaseFrame :class="[isDark ? 'oa_light' : 'oa_dark']" v-model="shown" :is-dark="isDark">
    <template #title>
      {{ self.name }}
    </template>
    <div class="flex justify-center items-center">
      <Avatar :src="cfg.media(usr.icon)" />
    </div>
    <template #main>
      <div style="height: 100%">
        <div style="height: calc(100% - 50px)">
          <div class="w-full px-3">
            <div class="h-16 flex justify-between items-center">
              <span style="">我的账户</span>
              <span @click="cfg.goto('/user')" class="cursor-pointer" style="color:#f36828">账户中心</span>
            </div>
            <div class="grid grid-cols-4 gap-4 h-20">
              <div class="flex items-center justify-center">
                <Avatar :src="cfg.media(usr.icon)" />
              </div>
              <div class="col-span-2 text-xs grid grid-cols-1 items-center text-left" style="">
                <span>昵称: &ensp;&ensp; {{ usr.nickname }}</span>
                <span>账户: &ensp;&ensp; {{ usr.username }}</span>
                <span>邮箱: &ensp;&ensp; {{ usr.email }}</span>
              </div>
              <div class="">123</div>
            </div>
            <hr class="mt-10" style="border:none;border-top:1px solid #777;">
          </div>
          <Apps :apps="ofApps"></Apps>
          <File :usr="usr"></File>
        </div>
        <hr style="border:none;border-top:2px solid #777;">
        <div style="height: 48px">
          <div @click="logout"
            class="w-full h-full flex justify-center items-center cursor-pointer transition duration-500 ease-in-out transform hover:scale-125">
            <OneIcon class="inline-block" style="font-size: 24px;">
              logout
            </OneIcon>
            <div>
              退出登录
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseFrame>
</template>
<script lang="ts" setup>
import BaseFrame from './frame.vue'
import Apps from './app.vue'
import File from './file.vue'
import { OneIcon } from '@veypi/one-icon'
import { computed, onMounted, ref, watch } from 'vue'
import { api } from '../api'
import cfg from '../cfg'
import { AUStatus, modelsApp, modelsAppUser, modelsUser } from '../models'
import Avatar from './avatar.vue'
import bus from '../bus'
import { nats } from '..'
import msg from '@veypi/msg'


let shown = ref(false)
let emits = defineEmits<{
  (e: 'logout'): void
  (e: 'load', u: modelsUser): void
}>()
withDefaults(defineProps<{
  isDark?: boolean
}>(), {
  isDark: false,
})

watch(computed(() => nats.ready.value), (t) => {
  if (t) {
    nats.subscribe('usr.info.*', (e) => {
      msg.Info(e)
    })
  }
}, { immediate: true })
onMounted(() => {
  console.debug('mount oaer')
})

let usr = ref<modelsUser>({} as modelsUser)
let ofApps = ref<modelsApp[]>([])
let self = ref<modelsApp>({} as modelsApp)

let uid = computed(() => cfg.local_user.value.id)
watch(uid, (id) => {
  console.debug('oaer user change to :' + id)
  if (id) {
    usr.value = cfg.local_user.value
    ofApps.value = []
    api.app.user('-').list(id, { app: true }).then((apps: modelsAppUser[]) => {
      for (let v of apps) {
        if (v.status === AUStatus.OK && v.app) {
          ofApps.value.push(v.app)
          if (v.app_id === cfg.uuid.value) {
            self.value = v.app
          }
        }
      }
    })
    emits('load', usr.value)
  } else {
    logout()
  }
}, { immediate: true })


const logout = () => {
  shown.value = false
  cfg.oa_token.value = ''
  cfg.token.value = ''
  emits('logout')
}
bus.on('logout', logout)



</script>

<style>
.oa_light {
  color: #eee;
}

.oa_dark {
  color: #333;

}
</style>
