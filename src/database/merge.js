// import UNIQUE_POOL from './unique.data.ts';
// import DISENCHANT from './disenchant.data.ts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/** 合并下粉尘数据 */
const __filename = fileURLToPath(import.meta.url);

// 获取当前文件所在目录的路径
const __dirname = dirname(__filename);

const t1 = fs.readFileSync(path.resolve(__dirname, './unique.data.ts'), 'utf-8');
const t2 = fs.readFileSync(path.resolve(__dirname, './disenchant.data.ts'), 'utf-8');

const func1 = new Function(`${t1.replace('export', '')}; return UNIQUE_POOL;`);
const UNIQUE_POOL = func1();

const func2 = new Function(`${t2.replace('export', '')}; return DISENCHANT;`);
const DISENCHANT = func2();

function mergeData() {
    return UNIQUE_POOL.map(e => {
        const disenchant = DISENCHANT.find(d => e.name.startsWith(d.name));
        if (!disenchant) return e;
        return {
            ...e,
            value: disenchant.val,
        };
    });
}
const res = mergeData();

fs.writeFileSync(path.resolve(__dirname, './merged.data.ts'), `export const UNIQUE_POOL = ${JSON.stringify(res, null, 2)};`, 'utf-8');
