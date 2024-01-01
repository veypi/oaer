<template>
  <div @click="click">
    <input enctype="multipart/form-data" ref="file" name="files" :multiple="multiple" type="file" hidden @change="upload">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { oafs } from '../../index.ts'

let file = ref<HTMLInputElement>()
let emits = defineEmits<{
  (e: 'success', v: string): void
  (e: 'failed'): void
}>()
let props = withDefaults(defineProps<{
  multiple?: boolean,
  renames?: string,
  dir?: string,
}>(), {
  dir: '/',
  multiple: false,
  renames: ''
})

function click() {
  file.value?.dispatchEvent(new MouseEvent('click'))
}

const upload = (evt: Event) => {
  evt.preventDefault()
  let f = (evt.target as HTMLInputElement).files as FileList
  let dir = props.dir
  if (!dir.endsWith('/')) {
    dir = dir + '/'
  }
  for (let item of f) {
    item.arrayBuffer().then(e => {
      oafs.dav().client.putFileContents(dir + item.name,
        e).then((e: any) => {
          console.log(e)
          emits('success', item.name)
        })
    })
  }
}

</script>

<style scoped></style>
