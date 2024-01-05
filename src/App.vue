<template>
  <div class="hover-wrap" :style="position" v-show="cardVisible">
    <DivinationCard :name="activeName" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { getModalPosition } from '@/utils';
// import { proxy } from "ajax-hook";
import DivinationCard from '@/components/DivinationCard/DivinationCard.vue';
import useObsrver from '@/hooks/useObsrver';

const initObserver = useObsrver();
const cardVisible = ref(false);
const activeName = ref('');
const position = ref({
  left: '0px',
  top: '0px'
});

/** 鼠标经过新增的dom */
const handleShowDivCard = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!/hover-span/g.test(target.className)) {
    cardVisible.value = false;
    return;
  }
  const { name, type } = target.dataset;
  if (!name || !type) {
    if (cardVisible.value) cardVisible.value = false;
    return;
  };
  if (type === '命运卡') {
    activeName.value = name;
    if (!cardVisible.value) cardVisible.value = true;
    const { x, y } = getModalPosition(target);
    // console.log(x, y)
    position.value = {
      left: x + 'px',
      top: y + 'px'
    };
  }
}

onMounted(() => {
  initObserver({
    over: handleShowDivCard
  });
  document.body.addEventListener('click', () => {
    cardVisible.value = false;
  })
})
</script>

<style scoped>
.hover-span {
  cursor: pointer;
}

.hover-wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
}
</style>
