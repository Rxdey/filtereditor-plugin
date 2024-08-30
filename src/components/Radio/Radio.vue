<template>
    <div id="d-radio">
        <div style="margin-right: 4px">{{ title }}</div>
        <div class="radio">
            <div
                class="radio-item"
                :class="{ active: active === tag.value }"
                v-for="tag in options"
                :key="tag.key"
                @click="onClick(tag)"
            >
                {{ tag.key }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';

type Tags = {
    key: string;
    value: string;
};
const emit = defineEmits(['onChange']);

const props = withDefaults(
    defineProps<{
        options: Tags[];
        title: string;
    }>(),
    {
        options: () => [],
    }
);
const visible = ref(true);
// const active = ref<string>('');
const active = defineModel({ type: String, default: '' });

const onClick = (tag: Tags) => {
    const { key, value } = tag;
    active.value = value === active.value ? '' : value;
    emit('onChange', value === active.value ? '' : value);
};

const show = () => {
    visible.value = true;
};
const hide = () => {
    visible.value = false;
};
defineExpose({
    show,
    hide,
});
</script>

<style scoped>
/* 页面的布局有点问题，弹窗插入的内容高度会把下面的按钮撑没，所以用这个 */
#d-radio {
    position: absolute;
    bottom: -20px;
    left: 0;
    display: flex;
    flex-flow: row;
    font-size: 11px;
    align-items: center;
}

.radio {
    display: flex;
    flex-flow: row wrap;
    gap: 4px;
}

.radio-item {
    min-width: 48px;
    padding: 4px 8px;
    font-size: 12px;
    line-height: 1;
    cursor: pointer;
    background-color: #3f4448;
    border-radius: 100px;
    color: #dcddde;
    text-align: center;
    border: 1px solid #3f4448;

    &.active {
        background-color: rgba(232, 128, 128, 0.2);
        color: rgb(232, 128, 128);
        border-color: rgb(232, 128, 128);
    }
}
</style>
