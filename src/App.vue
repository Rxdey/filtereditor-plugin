<template>
  <div>
    <Hover v-model="visible" :position="position" :type="type" :name="name" :priceData="priceData" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, provide } from 'vue';
import { getModalPosition } from '@/utils';
import Hover from '@/container/Hover.vue';
import useObsrver from '@/hooks/useObsrver';
import { PriceData } from '@/types';
import { GM_getValue, GM_deleteValue } from "$";
import { PRICE_MESSAGE, PRICE_TIME_STAMP, PriceDataKey } from '@/const';

type ItemType = 'card' | 'unique';
const initObserver = useObsrver();

// 直接传吧
const priceData = ref<PriceData[] | null>(null);
const visible = ref(false);
const name = ref('');
const type = ref<ItemType>('card');
const position = ref({
  x: 0,
  y: 0
});

provide(PriceDataKey, priceData)

const setting: Record<string, { type: ItemType, target: string }> = {
  命运卡: {
    type: 'card',
    target: '.divination-card'
  },
  暗金装备: {
    type: 'unique',
    target: '.unique-item'
  }
};
/** 鼠标经过新增的dom */
const handleShowDivCard = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!/hover-span/g.test(target.className)) {
    visible.value = false;
    return;
  }
  const { name: dataName, type: dataType } = target.dataset;
  if (!dataName || !type) {
    visible.value = false;
    return;
  }
  name.value = dataName;
  visible.value = true;
  type.value = setting[dataType as keyof typeof setting].type;
  // dom隐藏时获取不到宽高，等显示再获取
  nextTick(() => {
    position.value = getModalPosition(target, setting[dataType as keyof typeof setting].target);
  })
}

/** 获取物价榜页面推送的数据(如果有) */
const getGMStorageData = () => {
  const text: string = GM_getValue(PRICE_MESSAGE);
  if (!text) return;
  const result: {
    PRICE_TIME_STAMP: number,
    list: PriceData[]
  } = JSON.parse(text);
  // 超过一天清除存储
  if ((Date.now() - result.PRICE_TIME_STAMP) / 1000 / 60 / 60 / 24 >= 1) {
    GM_deleteValue(PRICE_TIME_STAMP);
    return;
  }
  priceData.value = result.list;
  const timeStamp = window.localStorage.getItem(PRICE_TIME_STAMP) || '';
  if (result.PRICE_TIME_STAMP === Number(timeStamp)) return;
  window.localStorage.setItem(PRICE_TIME_STAMP, `${result.PRICE_TIME_STAMP}`);

};

onMounted(() => {
  // 获取跨页面数据 (GM_addValueChangeListener监听不到
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState !== "visible") return;
    getGMStorageData();
  });
  getGMStorageData();
  initObserver({
    over: handleShowDivCard
  });
  document.body.addEventListener('click', () => {
    visible.value = false;
  });
})
</script>

<style scoped>
.hover-span {
  cursor: pointer;
}
</style>
