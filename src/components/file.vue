<template>
  <div class="w-full px-3">
    <div class="h-16 flex justify-between items-center">
      <span style="">
        我的云盘
      </span>
      <span @click="cfg.goto('/fs')" class="cursor-pointer" style="color:#f36828">文件中心</span>
    </div>
    <div class="">
      {{ usr.used }} KB / {{ usr.space }} GB
      <!-- <n-progress type="line" color="#0f0" rail-color="#fff" :percentage="1" indicator-text-color="#f00" /> -->
    </div>
    <div>
      <FsTree :root="rootDir" :client="client"></FsTree>
    </div>
    <div class="flex justify-center">
      <div @click="showModal = true" type="primary">获取挂载链接</div>
    </div>
    <!-- <div class="fixed w-full h-full" v-if="showModal" @click.self="showModal = false"> -->
    <!-- </div> -->
    <!-- <n-modal v-model:show="showModal"> -->
    <!--   <n-card style="width: 600px;" title="云盘挂载地址" :bordered="false" size="huge"> -->
    <!--     <template #header-extra>复制</template> -->
    <!--     {{ cfg.userFileUrl() }} -->
    <!--     <template #footer> 挂载说明</template> -->
    <!--   </n-card> -->
    <!-- </n-modal> -->
    <hr class="mt-10" style="border:none;border-top:1px solid #777;">
  </div>
</template>
<script lang="ts" setup>
import { createClient } from 'webdav'
import { fileProps, modelsUser } from '../models'
import { onMounted, ref } from 'vue'
import cfg from '../cfg'
import FsTree from './FsTree.vue'

let showModal = ref(false)
withDefaults(defineProps<{
  usr: modelsUser
}>(), {})
let rootDir = ref({} as fileProps)

const client = createClient(cfg.userFileUrl(),
  { headers: { auth_token: cfg.oa_token.value as string } })

onMounted(() => {
  client.stat('/').then((e: any) => {
    rootDir.value = e
  }).catch((e: any) => {
    console.log(e)
  })
})
</script>
<style scoped></style>
