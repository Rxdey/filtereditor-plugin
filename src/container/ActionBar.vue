<template>
    <div class="ActionBar">
        <Radio
            v-model="value"
            :options="TAGES"
            :title="title[actionType] || ''"
            @onChange="handleChange"
            v-show="actionType === '命运卡'"
        />
        <div
            class="slider"
            v-show="actionType === '暗金装备'"
        >
            <div class="slider-title">{{ title[actionType] }}</div>
            <div class="slider-select">
                <div
                    class="slider-btn"
                    v-for="item in selectList"
                    :key="item"
                    @click="onSelect(item)"
                >
                    ≥{{ item / 10000 }}W
                </div>
            </div>
            <div class="slider-inner">
                <Slider
                    v-model="sliderValue"
                    :height="12"
                    color="#FB278D"
                    track-color="#FEFEFE"
                    :max="2800000"
                    :min="0"
                    :step="1000"
                />
            </div>
            <div class="slider-value">{{ displayValue }}</div>
            <div
                class="slider-btn submit"
                @click="onFilter"
            >
                提交过滤
            </div>
            <div
                class="slider-btn"
                @click="onClear"
            >
                清除
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, inject } from 'vue';
import { TAGES } from '@/database/tags';
import Radio from '@/components/Radio/Radio.vue';
import { CARD_POOL } from '@/database/card.data';
import { UNIQUE_POOL } from '@/database/unique.data';
import Slider from 'vue3-slider';

const title: Record<string, string> = {
    命运卡: '命运卡奖励分类:',
    暗金装备: '含粉尘基底(lv84q0):',
};
const actionType = ref('');
const value = ref('');
const sliderValue = ref(0);

const selectList = [10000, 30000, 50000, 100000, 300000];

const displayValue = computed(() => `${(sliderValue.value / 10000).toFixed(2)}万`);

const setStyle = (list: string[], id = 'styleTag') => {
    const styles = list
        .map(
            item => `.n-tag[data-name="${item}"] {
                            background-color: #a745c0;
                            color: #fff;
                        }`
        )
        .join('\n');
    if (document.querySelector(`#${id}`)) {
        document.querySelector(`#${id}`)!.innerHTML = styles;
    } else {
        const styleTag = document.createElement('style');
        styleTag.id = id;
        styleTag.innerHTML = styles;
        document.head.appendChild(styleTag);
    }
};
const handleChange = (val: string) => {
    // console.log(val);
    if (!val) {
        if (document.querySelector('#styleTag')) {
            document.querySelector('#styleTag')!.innerHTML = '';
        }
        return;
    }
    const list = CARD_POOL.filter(card => card.Tags?.split(',').some(str => str.trim() === val));
    setStyle(
        list.map(e => e.name),
        'styleTag'
    );
};
const onSelect = (val: number) => {
    sliderValue.value = val;
    onFilter();
};
const onClear = () => {
    sliderValue.value = 0;
    onFilter();
};
const onFilter = () => {
    if (sliderValue.value <= 0) {
        if (document.querySelector('#uniqueTypes')) {
            document.querySelector('#uniqueTypes')!.innerHTML = '';
        }
        return;
    }
    const filterList = UNIQUE_POOL.filter(item => {
        return parseInt(item.value || '0') >= sliderValue.value;
    });
    const uniqueTypes = [...new Set(filterList.map(item => item.baseType))];
    setStyle(uniqueTypes, 'uniqueTypes');
};
onMounted(() => {});

defineExpose({
    setActionType: (type: string) => {
        actionType.value = type;
    },
});

// watch(
//     () => actionType.value,
//     val => {
//         console.log(val);
//         value.value = '';
//     }
// );
</script>

<style scoped lang="less">
.slider {
    position: absolute;
    bottom: -20px;
    left: 0;
    width: 70%;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    font-size: 11px;
    gap: 8px;
    .slider-title {
    }
    .slider-inner {
        flex: 1;
        min-width: 0;
    }
    .slider-value {
    }
    .slider-select {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        gap: 4px;
    }
    .slider-btn {
        border-radius: 100px;
        min-width: 42px;
        background-color: #3f4448;
        padding: 2px 6px;
        cursor: pointer;
        text-align: center;
        &.submit {
            background-color: #63e2b7;
            color: #333;
        }
    }
}
</style>
