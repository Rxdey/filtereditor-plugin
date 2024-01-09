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

    /** 添加dom */
    const addCustomDom = (el: HTMLDivElement, node: HTMLDivElement) => {
        const activeTag: HTMLDivElement | null = node.querySelector(EDIT_TYPE_SELECTOR);
        if (!activeTag) return;
        const type = activeTag.innerText;

        const parent: HTMLDivElement | null = el.querySelector('.n-tag__content');
        if (!parent) return;
        let content: HTMLSpanElement | null = parent.querySelector('.flex-y-center') || parent;
        // if (!content) return;
        const name = content.innerText;
        const hoverName = 'hover-span inline-flex i-solar:hamburger-menu-bold ml-2 text-14 wh-14';
        // 如果已存在图标(国际服暗金),跳过处理
        if (content.querySelector('.inline-flex')) {
            content.querySelector('.inline-flex')?.classList.add('original')
            return;
        };
        const span = document.createElement('span');
        span.className = hoverName;
        span.dataset.name = name;
        span.dataset.type = type;
        content.appendChild(span);
        // 每个单独监听事件性能开销大，放到父级
    }

    /** 监听列表节点是否挂载(切换类型和重新渲染都会触发) */
    const observerChildren = (node: HTMLDivElement, mutationsList: MutationRecord[], obs: MutationObserver, callBack = (e: HTMLDivElement) => { }) => {
        // 触发切换
        const target = mutationsList[0].target as HTMLDivElement;
        const itemList: NodeListOf<HTMLDivElement> = target.querySelectorAll(TAG_SELECTOR);

        // 物价榜监听input内容并解析
        // const inputList: NodeListOf<HTMLInputElement> = node.querySelectorAll('input');
        // inputList.forEach(input => {
        //     if (!/粘贴国服物价榜/.test(input.getAttribute('placeholder') || '')) return;
        //     if (!input.value) return;
        //     const data = decode(input.value);
        //     // console.log(input.value)
        // });

        callBack(node)
        // // console.log('正在浏览: ', type, itemList);
        // 列表已加载 遍历已存在的卡片并添加dom
        itemList.forEach(e => {
            addCustomDom(e as HTMLDivElement, node);
        });
        // 监听动态添加的卡片添加dom
        const childrenList: NodeListOf<HTMLDivElement> = target.querySelectorAll(CARD_CONTENT_SELECTOR);
        childrenList.forEach(child => {
            observerFnc(child, (mutationsList, obs) => {
                mutationsList.forEach(item => {
                    (item.addedNodes as NodeListOf<HTMLDivElement>).forEach(el => {
                        if (!/n-tag/.test(el.className)) return;
                        if (el.querySelector('.hover-span')) return;
                        addCustomDom(el, node);
                    })
                });
            })
        });
    }
    /** 监听高级编辑弹窗 */
    const initObserver = ({
        over = (e: MouseEvent) => { },
        change = (e: HTMLDivElement) => { },
    }) => {
        const body = document.querySelector("body");
        if (!body) return;
        observerFnc(body, (mutationsList, obs) => {
            mutationsList.some(item => {
                return Array.from(item.addedNodes as NodeListOf<HTMLDivElement>).some((node) => {
                    if (/^高级编辑/.test((node as HTMLDivElement).innerText) && node.classList.contains(MODAL_SELECTOR)) {
                        const container: HTMLDivElement | null = document.querySelector(MODAL_CONTENT_SELECTOR);
                        if (!container) return false;
                        container.onmouseover = over;
                        observerFnc(container, (list, fnc) => { observerChildren(node, list, fnc, change) })
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