import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);

// 获取当前文件所在目录的路径
const __dirname = dirname(__filename);

/** 压缩下数据大小 */

const t1 = fs.readFileSync(path.resolve(__dirname, './unique.data.ts'), 'utf-8');

const func1 = new Function(`${t1.replace('export', '')}; return UNIQUE_POOL;`);
const UNIQUE_POOL = func1();

const res = UNIQUE_POOL.map(e => {
    const { href, ...reset } = e;
    return reset;
});


fs.writeFileSync(path.resolve(__dirname, './mini.data.ts'), `export const UNIQUE_POOL = ${JSON.stringify(res, null, 2)};`, 'utf-8');