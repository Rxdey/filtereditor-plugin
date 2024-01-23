import { GM_setValue, GM_getValue } from "$";
import fetchIntercept from 'fetch-intercept';
import { PRICE_MESSAGE } from './const';
/**
 * 数据操作
 */
export default function priceInit() {
    // 页面请求执行太靠前，脚本劫持不到 - -
    // window.fetch = new Proxy(window.fetch, {
    //     apply: async (target, thisArg, argArray) => {
    //         // output pathname (maybe)
    //         console.log(argArray);
    //         let originProxy = await target.apply(thisArg, argArray);
    //         return originProxy;
    //     }
    // });
    window.JSON.parse = new Proxy(window.JSON.parse, {
        apply: (target, thisArg, argArray) => {
            // // 添加一个参数跳过处理
            // if (argArray.length <= 2) {
            //     const str = argArray[0];

            // }
            if (/混沌石/.test(argArray[0])) {
                setParseJson(Reflect.apply(target, thisArg, argArray));
            }
            const result = Reflect.apply(target, thisArg, argArray);
            return result;
        }
    });

    const setParseJson = (data: any[]) => {
        const result = data.filter(e => e.frameType === 3 || e.frameType === 6).map(item => ({
            baseType: item.baseType,
            name: item.name,
            calculated: item.calculated,
            frameType: item.frameType,
            searchCode: item.searchCode,
        }));
        if (!result.length) return;
        GM_setValue(PRICE_MESSAGE, JSON.stringify({
            PRICE_TIME_STAMP: Date.now(),
            list: result
        }));
        console.log('%c 数据成功推送', 'color:#4ade80');
    }
}