
<template>
  <div @mouseup="end" class="flex justify-end h-full">
    <div>
      ->
    </div>
    <OAer>
    </OAer>
  </div>
</template>
<script setup lang="ts">
import { OAer } from './index.ts';
const end = () => {
  let dom = document.getElementById('v_dragging')
  if (dom === null) {
    return
  }
  console.log(dom.getAttribute('vsrc'))
}
</script>

<style>
body,
#app {
  width: 100vw;
  height: 100vh;
}
</style>
