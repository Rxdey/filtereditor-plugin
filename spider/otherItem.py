import json
from pathlib import Path
import requests
from pyquery import PyQuery as pq
import concurrent.futures
import re
from utils.utils import crawl_url, saveFile, transform2ts, outputRoot

# 圣甲虫，不灭余烬等

# 获取当前脚本文件的目录
base_dir = Path(__file__).parent.absolute()

# 编年史
base_url = 'https://poedb.tw'

# 索引列表
card_index_urls = {
    'Scarab': 'https://poedb.tw/cn/Scarab',
    'Allflame': 'https://poedb.tw/cn/Embers_of_the_Allflame',
}

# 结果
result = []


def fetchScarab():
    try:
        text = crawl_url(card_index_urls['Scarab'])
        if text == False:
            print("请求Scarab索引列表失败")
            return False
        list = []
        doc = pq(text)
        lines = doc('#圣甲虫物品').find('.row .col')
        for line in lines:
            obj = {
                'name': doc(line).find('.flex-grow-1 a').text(), 
                'explicitMod': doc(line).find('.explicitMod').html()
            }
            list.append(obj)
        return list

    except Exception as e:
        print(f"解析异常：{e}")
        return False

def fetchAllflame():
        try:
            text = crawl_url(card_index_urls['Allflame'])
            if text == False:
                print("请求Allflame索引列表失败")
                return False
            list = []
            doc = pq(text)
            lines = doc('.card').eq(1).find('.row .col')
            for line in lines:
                obj = {
                    'name': doc(line).find('.flex-grow-1 a').text(), 
                    'explicitMod': doc(line).find('.implicitMod').html()
                }
                list.append(obj)
            return list    

        except Exception as e:
            print(f"解析异常：{e}")
            return False


def init():
    scarab_list = fetchScarab()
    if scarab_list == False:
        return
    # outputRoot = '../src/'
    saveFile(base_dir / outputRoot / 'database/scarab.data.ts', transform2ts('SCARAB_POOL', scarab_list))
    allflame_pool = fetchAllflame()
    if allflame_pool == False:
        return
    saveFile(base_dir / outputRoot / 'database/allflame.data.ts', transform2ts('ALLFLAME_POOL', allflame_pool))

init()