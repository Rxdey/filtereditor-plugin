<template>
  <div class="scarab-item simpleitem-wrap" @click.stop v-if="current">
    <div class="normal">
      {{ current.name }}
    </div>
    <div class="magicitem" v-html="current.explicitMod"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { SCARAB_POOL } from '@/database/scarab.data';
import { PriceDataKey, TRADE_URL } from '@/const';

const priceData = inject(PriceDataKey);

const props = defineProps<{
  name: string,
  showPrice: boolean
}>();

const current = computed(() => {
  return SCARAB_POOL.find(e => e.name === props.name)
})

</script>

<style scoped>

</style>
