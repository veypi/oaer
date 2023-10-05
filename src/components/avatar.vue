 <!--
 * avatar.vue
 * Copyright (C) 2023 veypi <i@veypi.com>
 * 2023-10-05 20:22
 * Distributed under terms of the MIT license.
 -->

<template>
    <div>
        <img :style="{ 'width': size, 'height': size }" class="oa_avatar" :src="src" />
    </div>
</template>

<script lang="ts" setup>

withDefaults(defineProps<{
    src?: string
    size?: string
}>(),
    {
        src: '',
        size: '2.5rem'
    }
)
</script>

<style scoped>
.oa_avatar {
    vertical-align: middle;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
}
</style>

