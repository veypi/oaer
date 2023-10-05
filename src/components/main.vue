<template>
    <BaseFrame :class="[isDark ? 'oa_light' : 'oa_dark']" v-model="shown" :is-dark="isDark">
        <template #title>
            {{ self.name }}
        </template>
        <div class="flex justify-center items-center">
            <Avatar :src="usr.icon" />
        </div>
        <template #main>
            <div style="height: 100%">
                <div style="height: calc(100% - 50px)">
                    <div class="w-full px-3">
                        <div class="h-16 flex justify-between items-center">
                            <span style="">我的账户</span>
                            <span @click="shown = false" class="cursor-pointer" style="color:#f36828">账户中心</span>
                        </div>
                        <div class="grid grid-cols-4 gap-4 h-20">
                            <div class="flex items-center justify-center">
                                <Avatar :src="usr.icon" />
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
                    <File :usr="usr"></File>
                    <Apps :apps="ofApps"></Apps>
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
import { decode } from 'js-base64'
import { api, Cfg } from '../api'
import { AUStatus, modelsApp, modelsUser } from '../models'
import Avatar from './avatar.vue'

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
onMounted(() => {
    fetchUserData()
})

let usr = ref<modelsUser>({} as modelsUser)
let ofApps = ref<modelsApp[]>([])
let self = ref<modelsApp>({} as modelsApp)

let token = computed(() => Cfg.token.value)
watch(token, () => {
    fetchUserData()
})

function fetchUserData() {
    let token = Cfg.token.value?.split('.')
    if (!token || token.length !== 3) {
        return false
    }
    let data = JSON.parse(decode(token[1]))
    if (data.id) {
        api.user.get(data.id).then(e => {
            usr.value = e
            ofApps.value = []
            api.app.user('-').list(e.id).then((apps: modelsApp[]) => {
                for (let v of apps) {
                    if (v.status === AUStatus.OK) {
                        ofApps.value.push(v)
                    }
                    if (v.id === Cfg.uuid.value) {
                        self.value = v
                    }
                }
            })
            emits('load', e)
        }).catch(e => {
            console.log(e)
            logout()
        })
    } else {
        logout()
    }
}

const logout = () => {
    shown.value = false
    emits('logout')
}


</script>

<style>
.oa_light {
    color: #eee;
}

.oa_dark {
    color: #333;

}
</style>
