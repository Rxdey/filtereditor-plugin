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
      item.limit = item.limit.replace(/「/g, '[').replace(/」/g, '] ').trim().replace('限定掉落', '<span style="color: #f00">限定掉落</span>')
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
.unique-item {
  background-color: rgb(72, 72, 78);
  padding: 0 8px;
  color: rgba(255, 255, 255, 0.82);
  max-height: 400px;
  overflow-y: auto;
  box-shadow: 0 0 16px rgba(0, 0, 0, .5);
}

.unique-cell {
  display: flex;
  flex-flow: row nowrap;
  font-size: 14px;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(88, 88, 94, 1);

  &:last-child {
    border: none;
  }

  &__icon {
    width: 32px;
    height: 32px;
  }

  &__body {
    flex: 1;
    padding: 0 16px;

    .name {
      // color: var(--color-uniqueitem);
    }

    .limit {
      white-space: pre-wrap;
      color: var(--color-default);
      font-size: 12px;
      line-height: 1.2;
    }
  }

  &__price {
    text-align: right;
    color: var(--color-currencyitem);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
