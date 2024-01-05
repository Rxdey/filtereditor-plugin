import { ref, onMounted, computed, watch } from 'vue';

/** 弹窗节点 */
const MODAL_SELECTOR = 'n-modal-container';
/** 动态卡片/物品的固定父节点 */
const MODAL_CONTENT_SELECTOR = '.h-full.flex-1>.n-scrollbar .n-scrollbar-content';

/** 卡片父节点，归属上面的固定父节点(会被移除) */
const CARD_CONTENT_SELECTOR = '.wh-full';

/** 激活标签类型 */
const EDIT_TYPE_SELECTOR = '.n-menu-item-content--selected';
/** 卡片/物品节点 */
const TAG_SELECTOR = '.n-tag';

export default function () {
    const observerFnc = (node: Element, callBack: MutationCallback) => {
        if (!node) return;
        const observer = new MutationObserver(callBack);
        observer.observe(node, {
            childList: true,
        });
        return observer;
    }
    /** hover */
    // const onSpanOver = (event: MouseEvent, callBack = (e: MouseEvent) => { }) => {
    //     const t = event.target as HTMLElement;
    //     if (!/hover-span/g.test(t.className)) return;
    //     // console.log(t.dataset.name);
    //     callBack(event);
    // };

    /** 添加dom */
    const addCustomDom = (el: HTMLDivElement, type: string) => {
        const parent: HTMLDivElement | null = el.querySelector('.n-tag__content');
        if (!parent) return;
        let content: HTMLSpanElement | null = parent.querySelector('.flex-y-center') || parent;
        // if (!content) return;
        const name = content.innerText;
        const hoverName = 'hover-span inline-flex i-solar:hamburger-menu-bold ml-2 text-14 wh-14';
        if (content.querySelector('.inline-flex')) return;
        const span = document.createElement('span');
        span.className = hoverName;
        span.dataset.name = name;
        span.dataset.type = type;
        content.appendChild(span);
        // 每个单独监听事件性能开销大，放到父级
    }

    /** 监听列表节点是否挂载 */
    const observerChildren = (node: HTMLDivElement, mutationsList: MutationRecord[], obs: MutationObserver) => {
        // 触发切换
        const target = mutationsList[0].target as HTMLDivElement;
        const activeTag: HTMLDivElement | null = node.querySelector(EDIT_TYPE_SELECTOR);
        if (!activeTag) return;
        const type = activeTag.innerText;
        const itemList: NodeListOf<HTMLDivElement> = target.querySelectorAll(TAG_SELECTOR);
        // console.log('正在浏览: ', type, itemList);
        // 列表已加载 遍历已存在的卡片添加dom
        itemList.forEach(e => {
            addCustomDom(e as HTMLDivElement, type);
        });
        const childrenList: NodeListOf<HTMLDivElement> = target.querySelectorAll(CARD_CONTENT_SELECTOR);
        childrenList.forEach(child => {
            observerFnc(child, (mutationsList, obs) => {
                mutationsList.forEach(item => {
                    (item.addedNodes as NodeListOf<HTMLDivElement>).forEach(el => {
                        if (!/n-tag/.test(el.className)) return;
                        if (el.querySelector('.hover-span')) return;
                        addCustomDom(el, type);
                    })
                });
            })
        });
    }
    /** 监听高级编辑弹窗 */
    const initObserver = ({
        over = (e: MouseEvent) => { },
        leave = (e: MouseEvent) => { },
    }) => {
        const body = document.querySelector("body");
        if (!body) return;
        observerFnc(body, (mutationsList, obs) => {
            mutationsList.some(item => {
                return Array.from(item.addedNodes as NodeListOf<HTMLDivElement>).some((node) => {
                    if (/^高级编辑/.test((node as HTMLDivElement).innerText) && (node).className === MODAL_SELECTOR) {
                        const container: HTMLDivElement | null = document.querySelector(MODAL_CONTENT_SELECTOR);
                        if (!container) return false;
                        container.onmouseover = over;
                        observerFnc(container, (list, fnc) => { observerChildren((node), list, fnc) })
                        obs.disconnect();
                        return true;
                    }
                    return false;
                })
            })
        });
    };
    return initObserver
}