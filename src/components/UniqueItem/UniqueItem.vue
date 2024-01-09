<template>
  <div class="unique-item" @click.stop>
    <div class="unique-cell" v-for="item in current" :key="item.name">
      <div class="unique-cell__icon">
        <img :src="item.icon">
      </div>
      <div class="unique-cell__body">
        <div class="name">{{ item.name }}</div>
        <div class="limit">
          <div v-html="item.limit"></div>
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
import { PriceDataKey } from '@/const';

const props = defineProps<{
  name: string
}>();

const priceData = inject(PriceDataKey);

const current = computed(() => {
  const currentList = UNIQUE_POOL.filter(e => e.baseType === props.name).map(item => {
    // 显示限定
    if (item.limit) {
      item.limit = item.limit.replace(/「/g, '[').replace(/」/g, '] ').trim().replace(/(限定掉落|升级)/g, '<span style="color: #98f1d4">$1</span>')
    }
    // 合并物价
    if (priceData?.value) {
      const data = priceData.value.find(d => `${d.name} ${d.baseType}` === item.name);
      if (data) {
        item.calculated = !isNaN(Math.floor(data.calculated)) ? Math.floor(data.calculated) : 0;
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
