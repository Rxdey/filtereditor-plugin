// import CryptoJS from 'crypto-js';

/** 动态获取渲染位置 */
export const getModalPosition = (el: Element, ract: string) => {
    const card = document.querySelector(ract)?.getBoundingClientRect();
    if (!card) return { x: 0, y: 0 };
    // 注意卡片固定宽高
    const { top, left, width, height } = el.getBoundingClientRect();
    const positionAction: Record<string, { x: number, y: number }> = {
        bottom: { x: left - (card.width / 2) + (width / 2), y: top + height },
        top: { x: left - (card.width / 2) + (width / 2), y: top - card.height },
    };
    if (top + height < card.height) return positionAction.bottom;
    return positionAction.top;
};

/** 解密 */
// export const decode = (e: string) => {
//     const a = CryptoJS.AES.decrypt(e, 'asdfg!@#$%12345', {
//         mode: CryptoJS.mode.ECB,
//         padding: CryptoJS.pad.Pkcs7
//     });
//     return CryptoJS.enc.Utf8.stringify(a).toString()
// }