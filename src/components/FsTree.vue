 <!--
 * FsTree.vue
 * Copyright (C) 2023 veypi <i@veypi.com>
 * 2023-10-06 15:35
 * Distributed under terms of the MIT license.
 -->
<template>
  <div>
    <div @mouseup="draging = false" class="cursor-pointer select-none flex hover:bg-gray-50
       rounded py-2 my-1" @click="toggle" @dblclick="change_root">
      <OneIcon @mousedown.self="start_drag" class="transition-all mx-2
         cursor-grab" :class="[expand ? 'rotate-90' :
           '']" style="font-size: 24px;color: #5981DD"> {{ root.type ===
    'directory' ? 'caret-right' : 'file' }}</OneIcon>
      <div>
        {{ root.basename || '/' }}
      </div>
      <div class="grow"></div>
      <!-- <div>{{ new Date(root.lastmod).toLocaleString() }}</div> -->
    </div>
    <div class="pl-6" v-if="expand">
      <template v-for="s of subs">
        <FsTree :root="s" :client="client" :sync_root="sync_root"></FsTree>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import FsTree from './FsTree.vue'
import { OneIcon } from '@veypi/one-icon';
import { onMounted, ref, watch, computed, inject } from 'vue';
import { fileProps } from '../models';
import { WebDAVClient } from 'webdav';


let subs = ref([] as fileProps[])
const toggle_main = inject('toggle') as any

let props = withDefaults(defineProps<{
  root: fileProps,
  client: WebDAVClient,
  sync_root: (p: string) => void,
}>(),
  {
  }
)

let expand = ref(false)
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
const change_root = () => {
  if (props.root.type === 'file') {
    return
  }
  props.sync_root(props.root.filename)
}
watch(computed(() => props.root.filename), (e) => {
  if (expand.value) {
    props.client
      .getDirectoryContents(e).then(
        (e: any) => {
          subs.value = e
        })
  }
})

const draging = ref(false)
const start_drag = (e: MouseEvent) => {
  draging.value = true
  setTimeout(() => {
    if (!draging.value) {
      return
    }
    let cloneEl = document.createElement('div')
    cloneEl.id = "v_dragging"
    cloneEl.innerHTML = `
  <svg aria-hidden="true" style="width: 1em;height:1em;fill: #5981DD;font-size:
    40px;">
    <use xlink:href="#icon-file"></use>
  </svg>
`
    cloneEl.style.top = e.clientY - 20 + 'px'
    cloneEl.style.left = e.clientX - 20 + 'px'
    cloneEl.classList.add('oa_dragging', 'oa_top') // 使其浮动
    document.body.appendChild(cloneEl) // 加入到列表中
    document.body.classList.add('cursor-grabbing')
    let name = '/fs/u' + props.root.filename
    if (props.root.type === 'directory') {
      name = name + '/'
    }
    cloneEl.setAttribute('vsrc', name)
    toggle_main()
    let cb = (e: MouseEvent) => {
      cloneEl.style.top = e.clientY - 20 + 'px'
      cloneEl.style.left = e.clientX - 20 + 'px'
      if (!draging.value) {
        setTimeout(() => {
          document.body.removeChild(cloneEl)
        }, 2000)
        cloneEl.style.opacity = '0'
        document.body.classList.remove('cursor-grabbing')
        window.removeEventListener("mousemove", cb)
      }
    }
    window.addEventListener("mousemove", cb)
    let cancel = () => {
      draging.value = false
      window.removeEventListener("mouseup", cancel)
    }
    window.addEventListener("mouseup", cancel)
  }, 200)
}
onMounted(() => {
})
</script>

<style>
.oa_top {
  position: absolute;
  z-index: 9999;
  pointer-events: none;
}

.oa_dragging {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>

