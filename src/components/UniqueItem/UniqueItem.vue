<template>
  <div class="unique-item" @click.stop>
    <div class="unique-cell" v-for="item in current" :key="item.name">
      <div class="unique-cell__icon">
        <img :src="'https://web.poecdn.com' + item.icon">
      </div>
      <div class="unique-cell__body">
        <div class="name">
          <a :href="TRADE_URL + item.searchCode" v-if="item.searchCode" target="_blank" title="点击跳转市集搜索">{{ item.name }}</a>
          <span v-else>{{ item.name }}</span>
        </div>
        <div class="limit">
          <div v-html="item.limit"></div>
        </div>
        <div class="desc">
          <span>奇术之尘: </span>
          <span class="val">{{ item.value }}</span>
        </div>
      </div>
      <div class="unique-cell__price">
        <span v-show="item.calculated">{{ item.calculated }} C</span>
      </div>
    </div>
    <div class="empty" v-if="!current || !current.length">暂无数据</div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { UNIQUE_POOL } from '@/database/unique.data';
import { PriceDataKey, TRADE_URL } from '@/const';
import { Unique } from "@/types";

const props = defineProps<{
  name: string,
  showPrice: boolean
}>();

const priceData = inject(PriceDataKey);

const current = computed(() => {
  const currentList = (UNIQUE_POOL as Unique[]).filter(e => e.baseType === props.name).map(item => {
    // 显示限定
    if (item.limit) {
      item.limit = item.limit.replace(/「/g, '[').replace(/」/g, '] ').trim().replace(/(限定掉落|升级)/g, '<span style="color: #98f1d4">$1</span>')
    }
    // 合并物价
    if (priceData?.value) {
      const data = priceData.value.find(d => `${d.name} ${d.baseType}` === item.name);
      if (data) {
        item.calculated = !isNaN(Math.floor(data.calculated)) ? Math.floor(data.calculated) : 0;
        item.searchCode = data.searchCode;
      }
    }
    return item
  });
  return currentList.sort((a, b) => (b.calculated || 0) - (a.calculated || 0));
});

</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
