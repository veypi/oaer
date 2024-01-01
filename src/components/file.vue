<template>
  <div class="w-full px-3">
    <div class="h-16 flex justify-between items-center">
      <span style="">
        我的云盘
      </span>
      <span @click="cfg.goto('/fs')" class="cursor-pointer" style="color:#f36828">文件中心</span>
    </div>
    <div class="">
      <!-- {{ usr.used }} KB / {{ usr.space }} GB -->
      <!-- <n-progress type="line" color="#0f0" rail-color="#fff" :percentage="1" indicator-text-color="#f00" /> -->
    </div>
    <div class="bg-gray-200 rounded-xl select-none cursor-pointer">
      <div class="w-full h-10 text-white rounded-t-xl flex
        bg-gray-600 items-center">
        <OneIcon v-if="history.length" @click="sync_root(history.pop(), true)" style="font-size: 24px;color: #5981DD">
          left
        </OneIcon>
        <span class="ml-4">
          {{ rootDir.filename || '/' }}
        </span>
      </div>
      <div class="" style="min-height: 10rem;">
        <template v-for="s of subs">
          <FsTree :root="s" :client="client.client" :sync_root="sync_root"></FsTree>
        </template>
      </div>
      <div class="flex justify-center w-full items-center h-10
        rounded-b-xl my-8 hover:opacity-90" style="background:#4963E3;">
        <uploader multiple :dir="rootDir.filename" @success="sync_root(rootDir.filename)">
          <div>上传文件</div>
        </uploader>
      </div>
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
import { OneIcon } from '@veypi/one-icon';
import { fileProps, modelsUser } from '../models'
import { onMounted, ref } from 'vue'
import cfg from '../cfg'
import FsTree from './FsTree.vue'
import uploader from '../components/uploader'
import { oafs } from '..'

let subs = ref([] as fileProps[])
withDefaults(defineProps<{
  usr: modelsUser
}>(), {})
let rootDir = ref({} as fileProps)

const client = oafs.dav()

let history = ref<string[]>([])
const sync_root = (P?: string, norecord?: boolean) => {
  if (P && !norecord) {
    history.value.push(rootDir.value.filename)
  }
  client.stat(P || '/').then((e: any) => {
    rootDir.value = e
    if (rootDir.value.type !== 'file') {
      client.client
        .getDirectoryContents(rootDir.value.filename).then(
          (e: any) => {
            subs.value = e
          })

    }
  }).catch((e: any) => {
    console.log(e)
  })
}
onMounted(() => {
  sync_root()
})
</script>
<style scoped></style>
