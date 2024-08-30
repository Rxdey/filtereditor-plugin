<template>
    <Hover
        v-model="visible"
        :position="position"
        :type="type"
        :name="name"
        :showPrice="showPrice"
    />
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, provide, computed, createApp } from 'vue';
import { getModalPosition } from '@/utils';
import Hover from '@/container/Hover.vue';
import useObsrver, { EDIT_TYPE_SELECTOR } from '@/hooks/useObsrver';
import { HoverComType, PriceData } from '@/types';
import { GM_getValue, GM_deleteValue } from '$';
import { PRICE_MESSAGE, PRICE_TIME_STAMP, PriceDataKey, ActionType } from '@/const';
import { UNIQUE_POOL } from '@/database/unique.data';
import ActionBar from '@/container/ActionBar.vue';

let actionBar: any = null;
// 直接传吧
const priceData = ref<PriceData[] | null>(null);
const visible = ref(false);
const showPrice = ref(false);
const name = ref('');
const initRadio = ref(false);
// 展示组件类型(忘了是干嘛的了😀)
const type = ref<HoverComType>('card');
const position = ref({
    x: 0,
    y: 0,
});
provide(PriceDataKey, priceData);

const setting: Record<string, { type: HoverComType; target: string }> = {
    命运卡: {
        type: 'card',
        target: '#divination-wrap',
    },
    暗金装备: {
        type: 'unique',
        target: '.unique-item',
    },
    圣甲虫: {
        type: 'scarab',
        target: '.scarab-item',
    },
    不灭余烬: {
        type: 'allflame',
        target: '.allflame-item',
    },
};
const isPrice = computed(() => window.location.host === 'price.filtereditor.cn');

const { initObserver, actionType } = useObsrver(isPrice.value);
/**
 * 新增向国际服增加限制描述
 */
const addLimitToTarget = (target: HTMLDivElement) => {
    if (!target) return;
    const listItem: NodeListOf<HTMLLIElement> = target.querySelectorAll('.n-list-item');
    if (!listItem.length) return;
    listItem.forEach(el => {
        const nameWrap: HTMLDivElement | null = el.querySelector('.flex-y-center');
        if (!nameWrap) return;
        const name = nameWrap.innerText;
        const limit = (UNIQUE_POOL.find(item => item.name === name)?.limit || '')
            .replace(/「/g, '[')
            .replace(/」/g, '] ')
            .trim()
            .replace(/(限定掉落|升级)/g, '<span style="color: #98f1d4">$1</span>');
        if (!limit) return;
        nameWrap.style.flex = '1';
        (nameWrap.querySelector('div') as HTMLDivElement).innerHTML = `
      <p>${name}</p>
      <p style="color: var(--color-default);font-size: 12px;line-height: 1.2;white-space: pre-wrap;">${limit}</p>
      `;
        const list: HTMLDivElement | null = target.querySelector('.n-list');
        if (!list) return;
        list.style.maxHeight = '400px';
        list.style.overflowY = 'auto';
    });
};

const changePriceDisplay = (target: HTMLDivElement) => {
    // const text: string = GM_getValue(PRICE_MESSAGE);
    // console.log(target, text)
};

/**
 * 鼠标经过新增的dom事件
 * 通过获取附加在target元素上的data-name和data-type来指定Hover组件展示的浮窗内容
 * @param event
 */
const handleShowDivCard = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('original')) {
        // 有个大概300毫秒的动画需要延时查询
        setTimeout(() => {
            // 查找显示的popover
            const activeList: NodeListOf<HTMLDivElement> = document.querySelectorAll(
                '.n-popover:not([style*="display: none"])'
            );
            if (!isPrice.value) {
                addLimitToTarget(activeList[0]);
            } else {
                changePriceDisplay(activeList[0]);
            }
        }, 301);
        return;
    }
    if (!target.classList.contains('hover-span')) {
        visible.value = false;
        return;
    }
    // console.log(target);
    const { name: dataName, type: dataType, server } = target.dataset;
    if (!dataName || !dataType || !setting[dataType as keyof typeof setting]) {
        visible.value = false;
        return;
    }
    // 兼容物价榜
    showPrice.value = !server || server === '国服';
    name.value = dataName;
    visible.value = true;
    type.value = setting[dataType as keyof typeof setting]?.type;
    // dom隐藏时获取不到宽高，等显示再获取
    nextTick(() => {
        position.value = getModalPosition(target, setting[dataType as keyof typeof setting].target);
    });
};

/** 获取物价榜页面推送的数据(如果有) */
const getGMStorageData = () => {
    const text: string = GM_getValue(PRICE_MESSAGE);
    if (!text) return;
    const result: {
        PRICE_TIME_STAMP: number;
        list: PriceData[];
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
const highlightDivCard = (content: HTMLDivElement) => {
    if (!initRadio.value) {
        const div = document.createElement('div');
        content.style.position = 'relative';
        content.appendChild(div);
        actionBar = createApp(ActionBar).mount(div);
        actionBar.setActionType(actionType.value);
        initRadio.value = true;
    } else {
        actionBar.setActionType(actionType.value);
        console.log('已加载 Action');
    }
};

onMounted(() => {
    // 获取跨页面数据 (GM_addValueChangeListener监听不到)
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState !== 'visible') return;
        getGMStorageData();
    });
    getGMStorageData();
    initObserver({
        over: handleShowDivCard,
        // 奖励类型高亮，随便写写用着
        change: node => {
            if (isPrice.value) return;
            const activeTag: HTMLDivElement | null = node.querySelector(EDIT_TYPE_SELECTOR);
            if (!activeTag) return;
            actionType.value = activeTag.innerText;
            const content: HTMLDivElement | null = node.querySelector('.n-card-header__main');
            if (!content) return;
            highlightDivCard(content);
        },
    });
    document.body.addEventListener('click', () => {
        visible.value = false;
    });
});
</script>

<style scoped>
.hover-span {
    cursor: pointer;
}
</style>
