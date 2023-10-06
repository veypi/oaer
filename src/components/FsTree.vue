 <!--
 * FsTree.vue
 * Copyright (C) 2023 veypi <i@veypi.com>
 * 2023-10-06 15:35
 * Distributed under terms of the MIT license.
 -->
<template>
  <div>
    <div class="cursor-pointer flex hover:bg-gray-500" @click="toggle">
      <OneIcon class="transition-all mx-2" :class="[expand ? 'rotate-90' :
        '']" style="font-size: 24px;"> {{ root.type ===
    'directory' ? 'caret-right' : 'file' }}</OneIcon>
      <div>
        {{ root.filename }}
      </div>
      <div class="grow"></div>
      <div>{{ new Date(root.lastmod).toLocaleString() }}</div>
    </div>
    <div class="pl-4" v-if="expand">
      <template v-for="s of subs">
        <FsTree :root="s" :client="client"></FsTree>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import FsTree from './FsTree.vue'
import { OneIcon } from '@veypi/one-icon';
import { ref } from 'vue';
import { fileProps } from '../models';
import { WebDAVClient } from 'webdav';


let expand = ref(false)
let subs = ref([] as fileProps[])

let props = withDefaults(defineProps<{
  root: fileProps,
  client: WebDAVClient,
}>(),
  {}
)

const toggle = () => {
  if (props.root.type === 'file') {
    return
  }
  if (!expand.value) {
    props.client
      .getDirectoryContents(props.root.filename).then(
        (e: any) => {
          subs.value = e
          expand.value = true
        })
    return
  }
  expand.value = !expand.value
}
</script>

<style scoped></style>

