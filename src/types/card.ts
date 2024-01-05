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
    explicitMod: ExplicitMod[];
    num?: number;
};
/** 传奇 */
export type Unique = {
    name: string;
    href: string;
    icon: string;
    baseType: string;
    limit?: string;
};
