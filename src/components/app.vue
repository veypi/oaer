<template>
  <div class="w-full px-3">
    <div class="h-16 flex justify-between items-center">
      <span style="">我的应用</span>
      <span @click="cfg.goto('/')" class="cursor-pointer" style="color:#f36828">应用中心</span>
    </div>
    <div class="flex flex-col bg-gray-200 rounded-xl">
      <template v-for="(ap ) of apps">
        <div class="pl-8 cursor-pointer flex py-2 gap-8  items-center
          hover:bg-gray-50" @click="cfg.goto(ap.host || '/')" v-if="ap.id !== cfg.uuid.value">
          <tooltip :text="ap.name">
            <Avatar :src="cfg.media(ap.icon)" />
          </tooltip>
          <div>{{ ap.name }}</div>
        </div>
      </template>
    </div>
    <hr class="mt-10" style="border:none;border-top:1px solid #777;">
  </div>
</template>
<script lang="ts" setup>
import { modelsApp } from '../models'
import cfg from '../cfg'
import Avatar from './avatar.vue'
import tooltip from './tooltip.vue'

withDefaults(defineProps<{
  apps: modelsApp[]
}>(), {})
</script>
<style scoped></style>
