export type HoverComType = 'card' | 'unique' | 'scarab' | 'allflame';

/** 命运卡模组 */
export type ExplicitMod = {
    type: string;
    value: string;
};
/** 命运卡 */
export type CardData = {
    id?: string;
    name: string;
    stack: number;
    type: string;
    flavourText: string;
    url?: string;
    href?: string;
    icon: string;
    explicitMod: string;
    num?: number;
    Tags?: string;
};
/** 传奇 */
export type Unique = {
    name: string;
    href: string;
    icon: string;
    baseType: string;
    limit?: string;
    calculated?: number;
    searchCode?: string;
};

/** 物价榜 */
export type PriceData = {
    baseType: string;
    name: string;
    calculated: number;
    frameType: number;
    searchCode: string;
};


/** 其他 */
export type OtherItem = {
    name: string;
    explicitMod: string;
};