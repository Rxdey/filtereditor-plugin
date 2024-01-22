<template>
  <div id="divination-wrap">
    <div class="divination-card" @click.stop>
      <div class="divination-card--background" v-if="!props.disabled">
        <img v-if="!!current" :src="current.icon" :key="current.icon" />
      </div>
      <div class="divination-card__exmod" :class="{ disabled }" v-if="!!current">
        <!-- 名字 -->
        <div class="divination-card--name">{{ current.name }}</div>
        <template v-if="!props.disabled">
          <!-- 堆叠 -->
          <div class="divination-card--stack" :class="{ single: quantity >= current.stack }">
            <span v-if="current.stack === 1 && quantity === 1">{{ quantity }}</span>
            <span v-else>{{ quantity }}/{{ current.stack }}</span>
          </div>
          <div class="divination-card--wrap">
            <!-- 奖励 -->
            <div class="divination-card--reward">
              <div>
                <template v-for="(item, index) in current.explicitMod">
                  <span class="explicit-mod" :style="{ '--mod-color': `var(--color-${item.type})` }">{{ item.value }}</span>
                  <br v-if="item.type != 'default'" />
                </template>
              </div>
            </div>
            <div class="divination-card--line"></div>
            <!-- 描述 -->
            <div class="divination-card--flavour">
              {{ current.flavourText }}
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="price" v-if="price && showPrice">
      <span>{{ price }}</span>
      <span> × </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { CARD_POOL } from '@/database/card.data';
import { CardData } from '@/types';
import { PriceDataKey } from '@/const';


const priceData = inject(PriceDataKey);

type Props = {
  /** 类型匹配 */
  type?: string;
  /** 名字匹配 */
  name?: string;
  quantity?: number;
  disabled?: boolean;
  showPrice: boolean;
};
const props = withDefaults(defineProps<Props>(), {
  type: '',
  name: '',
  quantity: 1,
  disabled: false,
  showPrice: false
})
// const playerStore = usePlayerStore();
const current = computed<CardData | null>(() => {
  if (props.type) return CARD_POOL.find((item: CardData) => item.type === props.type) || null;
  if (!props.type && props.name) return CARD_POOL.find((item: CardData) => item.name === props.name) || null;
  return null;
});

const price = computed(() => {
  if (!priceData || !priceData.value) return 0;
  return Math.floor(priceData.value.find(e => e.frameType === 6 && e.name === props.name)?.calculated || 0)
})

</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
