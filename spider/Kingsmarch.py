import json
from pathlib import Path
import requests
from pyquery import PyQuery as pq
import concurrent.futures
import re
from utils.utils import crawl_url, saveFile, transform2ts, outputRoot

# 获取当前脚本文件的目录
base_dir = Path(__file__).parent.absolute()

# 编年史
base_url = 'https://poedb.tw'

# 索引列表
urls = 'https://poedb.tw/cn/Kingsmarch#Disenchant'

# 结果
result = []


def fetchItems():
    try:
        text = crawl_url(urls)
        if text == False:
            print("请求索引列表失败")
            return False
        list = []
        doc = pq(text)
        lines = doc('#Disenchant').find('table tbody tr')
        for line in lines:
            obj = {
                'name': doc(line).find('td').eq(0).text(), 
                'val': doc(line).find('td').eq(3).text()
            }
            list.append(obj)
        return list

    except Exception as e:
        print(f"解析异常：{e}")
        return False

def init():
    items_list = fetchItems()
    if items_list == False:
        return
    # outputRoot = '../src/'
    saveFile(base_dir / outputRoot / 'database/disenchant.data.ts', transform2ts('DISENCHANT', items_list))

init()