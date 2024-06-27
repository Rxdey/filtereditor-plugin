<template>
    <div class="hover-wrap" v-show="modelValue" :style="currentStyle">
        <component :is="currentCom" :name="name" :showPrice="showPrice" v-if="type !== 'card' || name" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DivinationCard from '@/components/DivinationCard/DivinationCard.vue';
import UniqueItem from '@/components/UniqueItem/UniqueItem.vue';

type Props = {
    modelValue: boolean;
    position: { x: number, y: number };
    type: 'card' | 'unique';
    name: string,
    showPrice: boolean,
};
const coms: Record<Props['type'], any> = {
    card: DivinationCard,
    unique: UniqueItem
};

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    position: () => ({ x: 0, y: 0 }),
    type: 'card',
    name: ''
})
const emit = defineEmits(['update:modelValue']);

const currentStyle = computed(() => ({
    left: `${props.position.x}px`,
    top: `${props.position.y}px`,
}));
const currentCom = computed(() => coms[props.type] || null);

</script>

<style lang="less" scoped>
.hover-wrap {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
}
</style>
