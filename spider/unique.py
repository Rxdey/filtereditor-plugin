import json
from pathlib import Path
import time
import requests
from pyquery import PyQuery as pq
import concurrent.futures
import re
from utils.utils import crawl_url, saveFile, transform2ts, outputRoot

# 获取当前脚本文件的目录
base_dir = Path(__file__).parent.absolute()
# 编年史
base_url = 'https://poedb.tw'
# 全部在同一页
unique_url = 'https://poedb.tw/cn/Unique_item'
# 结果
result = []

# 解析索引列表
def parseList(url):
    try:
        text = crawl_url(url)
        if text == False:
            print("请求索引列表失败")
            return
        list = []
        ids = ['#Weapon传奇', '#Armour传奇', '#Other传奇']
        doc = pq(text)
        for id in ids:
            lines = doc(id).find('.row .col')
            for line in lines:
                obj = {
                    'name': doc(line).find('.flex-grow-1 a').text(), 
                    'href': base_url + doc(line).find('.flex-grow-1 a').attr('href'),
                    'icon': doc(line).find('.flex-shrink-0 img').attr('src'),
                    'baseType': ''
                }
                list.append(obj)
        return list
    except Exception as e:
        print(f"解析异常：{e}")
        return False

def fetchDetail(data):
    text = crawl_url(url=data["href"])
    if text == False:
        print(f'请求物品:{data["name"]} 详情失败')
        return
    doc = pq(text)
    tds = doc('table').eq(0).find('tbody tr td:first-child')
    for td in tds:
        if doc(td).text() == 'Limit':
            data['limit'] = doc(td).next().text()
        if doc(td).text() == 'BaseType':
            data['baseType'] = doc(td).next().text()
    result.append(data)


def init():
    unique_index = parseList(unique_url)
    if unique_index == False:
        print('解析unique_index列表失败')
        return
    print(len(unique_index))

    with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
        futures = [executor.submit(fetchDetail, item) for item in unique_index]
        # 初始化已完成和未完成任务计数器
        completed_count = 0
        total_count = len(futures)
        # 实时打印进度
        for future in concurrent.futures.as_completed(futures):
            completed_count += 1
            print(f"已完成 {completed_count}/{total_count} 任务")
            time.sleep(0.3)
    saveFile(base_dir / outputRoot / 'database/unique.data.ts', transform2ts('UNIQUE_POOL', result))
    return

init()