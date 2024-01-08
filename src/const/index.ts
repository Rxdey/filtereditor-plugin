import { InjectionKey, Ref } from 'vue';
import { type PriceData } from '@/types';

/** 物价key */
export const PRICE_MESSAGE = 'PRICE_MESSAGE';
/** 时间戳 */
export const PRICE_TIME_STAMP = 'PRICE_TIME_STAMP';

/** 注入物价 */
export const PriceDataKey: InjectionKey<Ref<PriceData[] | null>> = Symbol()