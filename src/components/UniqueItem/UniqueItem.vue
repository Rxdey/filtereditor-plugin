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
      <div class="unique-cell__price"></div>
    </div>
    <div class="empty" v-if="!current || !current.length">暂无数据</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { UNIQUE_POOL } from '@/database/unique.data';

const props = defineProps<{
  name: string
}>();

const current = computed(() => UNIQUE_POOL.filter(e => e.baseType === props.name).map(item => ({
  ...item,
  // 原来的符号换行对不齐
  limit: item.limit ? item.limit.replace(/「/g, '[').replace(/」/g, '] ').trim() : ''
})));

</script>

<style lang="less" scoped>
.unique-item {
  background-color: rgb(72, 72, 78);
  padding: 0 8px;
  color: rgba(255, 255, 255, 0.82);
  max-height: 400px;
  overflow-y: auto;
  box-shadow: 0 0 16px rgba(0,0,0,.5);
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
    padding: 0 8px;

    .name {
      // color: var(--color-uniqueitem);
    }

    .limit {
      white-space: pre-wrap;
      color: var(--color-currencyitem);
      font-size: 12px;
      line-height: 1.2;
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
