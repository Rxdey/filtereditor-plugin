import { ref } from "vue";

/** 弹窗节点 */
const MODAL_SELECTOR = 'n-modal-container';
/** 动态卡片/物品的固定父节点 */
const MODAL_CONTENT_SELECTOR = '.h-full.flex-1>.n-scrollbar .n-scrollbar-content';

/** 卡片父节点，归属上面的固定父节点(会被移除) */
const CARD_CONTENT_SELECTOR = '.wh-full';

/** 激活标签类型 */
export const EDIT_TYPE_SELECTOR = '.n-menu-item-content--selected';
/** 卡片/物品节点 */
const TAG_SELECTOR = '.n-tag';
/**
 *
 * @param isPrice 是否物价页面
 * @returns
 */
export default function (isPrice: boolean) {
    const actionType = ref('');
    const observerFnc = (node: Element, subtree = false, callBack: MutationCallback) => {
        if (!node) return;
        const observer = new MutationObserver(callBack);
        observer.observe(node, {
            childList: true,
            subtree: subtree,
        });
        return observer;
    };

    /** 添加dom */
    const addCustomDom = (el: HTMLDivElement, node: HTMLDivElement) => {
        // const activeTag: HTMLDivElement | null = node.querySelector(EDIT_TYPE_SELECTOR);
        // if (!activeTag) return;
        // const type = activeTag.innerText;

        const parent: HTMLDivElement | null = el.querySelector('.n-tag__content');
        if (!parent) return;
        let content: HTMLSpanElement | null = parent.querySelector('.flex-y-center') || parent;
        // if (!content) return;
        const name = content.innerText;
        const hoverName = 'hover-span inline-flex i-solar:hamburger-menu-bold ml-2 text-14 wh-14';
        // 如果已存在图标(国际服暗金,物价榜),跳过处理
        const icon = content.querySelector('.i-solar\\:hamburger-menu-bold');
        if (icon) {
            // 物价榜移除原dom，改用插件显示
            if (isPrice) {
                content.removeChild(icon);
            } else {
                icon?.classList.add('original');
                return;
            }
        }
        const server: HTMLElement | null = document.querySelector('.n-radio-button--checked');
        const span = document.createElement('span');
        span.className = hoverName;
        span.dataset.name = name;
        span.dataset.type = actionType.value;
        span.dataset.server = server ? server.innerText : '';
        el.dataset.name = name;
        content.appendChild(span);
        // 每个单独监听事件性能开销大，放到父级
    };

    /** 监听列表节点是否挂载(切换类型和重新渲染都会触发) */
    const observerChildren = (
        node: HTMLDivElement,
        mutationsList: MutationRecord[],
        obs: MutationObserver,
        callBack = (e: HTMLDivElement) => {}
    ) => {
        // 触发切换
        const target = mutationsList[0].target as HTMLDivElement;
        const itemList: NodeListOf<HTMLDivElement> = target.querySelectorAll(TAG_SELECTOR);

        const activeTag: HTMLDivElement | null = node.querySelector(EDIT_TYPE_SELECTOR);
        if (!activeTag || actionType.value === activeTag.innerText)  {
            return;
        }
        actionType.value = activeTag.innerText;
        // console.log('触发切换');
        callBack(node);
        // console.log('正在浏览: ', type, itemList);
        // 列表已加载 遍历已存在的卡片并添加dom
        // if (!isPrice) {
        itemList.forEach(e => {
            addCustomDom(e as HTMLDivElement, node);
        });
        // 监听动态添加的卡片添加dom
        const childrenList: NodeListOf<HTMLDivElement> =
            target.querySelectorAll(CARD_CONTENT_SELECTOR);
        childrenList.forEach(child => {
            observerFnc(child, false, (mutationsList, obs) => {
                mutationsList.forEach(item => {
                    (item.addedNodes as NodeListOf<HTMLDivElement>).forEach(el => {
                        if (!/n-tag/.test(el.className)) return;
                        if (el.querySelector('.hover-span')) return;
                        addCustomDom(el, node);
                    });
                });
            });
        });
        // }
    };
    /**
     * 监听高级编辑弹窗
     * @param over 鼠标经过事件
     * @param change 变更挂载节点
     * @returns
     */
    const initObserver = ({ over = (e: MouseEvent) => {}, change = (e: HTMLDivElement) => {} }) => {
        const body = document.querySelector('body');
        if (!body) return;
        observerFnc(body, false, (mutationsList, obs) => {
            mutationsList.some(item => {
                // console.log(item)
                return Array.from(item.addedNodes as NodeListOf<HTMLDivElement>).some(node => {
                    const REG = isPrice ? /^价格排序/ : /^高级编辑/;
                    if (REG.test(node.innerText) && node.classList.contains(MODAL_SELECTOR)) {
                        const container: HTMLDivElement | null =
                            document.querySelector(MODAL_CONTENT_SELECTOR);
                        if (!container) return false;
                        container.onmouseover = over;
                        // 只监听内容的children有时候监听不到，故监整个树变化
                        observerFnc(container, true, (list, fnc) => {
                            observerChildren(node, list, fnc, change);
                        });
                        // 高级编辑弹窗关闭时没有销毁，故只需处理一次
                        obs.disconnect();
                        return true;
                    }
                    return false;
                });
            });
        });
    };
    return {
        initObserver,
        actionType
    };
}
