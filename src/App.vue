<template>
  <div>
    <Hover v-model="visible" :position="position" :type="type" :name="name" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { getModalPosition, decode } from '@/utils';
// import { proxy } from "ajax-hook";
import Hover from '@/container/Hover.vue';
import useObsrver from '@/hooks/useObsrver';

type ItemType = 'card' | 'unique';
const initObserver = useObsrver();

const visible = ref(false);
const name = ref('');
const type = ref<ItemType>('card');

const position = ref({
  x: 0,
  y: 0
});

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

const parseData = (e: MouseEvent) => {
  console.log(e)
  let btn = e.target as HTMLButtonElement;
  if (btn.nodeName !== 'BUTTON') btn = btn.parentNode as HTMLButtonElement;
  const prve = btn.previousElementSibling;
  if (!prve) return;
  const input = prve.querySelector('input');
  if (!input) return;
  const data = decode(input.value);
  console.log(data);
}
onMounted(() => {
  initObserver({
    over: handleShowDivCard,
    change: (node) => {
      // 复制的数据没有带价格，所以不做了(笑)
      console.log('change')
      const btnList: NodeListOf<HTMLButtonElement> = node.querySelectorAll('.n-button');
      btnList.forEach(btn => {
        if (btn.innerText !== '解析数据') return;
        btn.removeEventListener('click', parseData);
        btn.addEventListener('click', parseData);
      });
    }
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
