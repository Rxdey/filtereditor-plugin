<template>
    <div id="d-radio">
        <div class="text-sm">类型高亮:</div>
        <div class="radio">
            <div class="radio-item" :class="{ active: active === tag.value }" v-for="tag in TAGES" :key="tag.key" @click="onChange(tag)">{{ tag.key }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { TAGES } from "@/database/tags";
import { ref, onMounted, computed, watch } from 'vue';

const active = ref<string>('');

const onChange = (tag: typeof TAGES[number]) => {
    const { key, value } = tag;
    active.value = value === active.value ? '' : value
}

</script>

<style scoped>
.radio {
    display: flex;
    flex-flow: row wrap;
    gap: 4px;
}

.radio-item {
    min-width: 64px;
    padding: 8px 12px;
    font-size: 12px;
    line-height: 1;
    cursor: pointer;
    background-color: #3f4448;
    border-radius: 100px;
    color: #dcddde;
    text-align: center;
    border: 1px solid #3f4448;

    &.active {
        background-color: rgba(232, 128, 128, .2);
        color: rgb(232, 128, 128);
        border-color: rgb(232, 128, 128);
    }
}
</style>
