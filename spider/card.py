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
# 卡片索引列表
card_index_url = 'https://poedb.tw/cn/Divination_Cards'
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
        doc = pq(text)
        lines = doc('#命运卡物品 ').find('.row .col')
        for line in lines:
            obj = {
                'name': doc(line).find('.flex-grow-1 a').text(), 
                'href': base_url + doc(line).find('.flex-grow-1 a').attr('href'),
                'type': doc(line).find('.flex-grow-1 a').attr('href').replace('/cn/', '').replace('_', ' '),
                # 更新(直接获取全部html文本)
                'explicitMod': doc(line).find('.explicitMod').html()
            }
            list.append(obj)
        return list
    except Exception as e:
        print(f"解析异常：{e}")
        return False

# 使用正则表达式提取 background-image 的 URL
def getImageUrl(str):
    match = re.search(r"url\('([^']+)'\)", str)
    if match:
        return match.group(1)
    else:
        return False

# 请求卡片详情
def fetchCardDetail(data):
    text = crawl_url(url=data["href"])
    if text == False:
        print(f'请求卡片:{data["name"]} 详情失败')
        return
    doc = pq(text)
    # 提取flavourText信息
    title = doc('.FlavourText').text()
    data['flavourText'] = title
    data['stack'] = int(doc('.stackSize').text())
    # 提取图片地址
    icon_div = doc('.icon')
    style_attribute = icon_div.attr('style')
    imgUrl = getImageUrl(style_attribute)
    data['icon'] = imgUrl
    
    tableLines = doc('table tbody tr')
    for line in tableLines:
        if doc(line).find('td').eq(0).text() == 'Tags':
            data['Tags'] = doc(line).find('td').eq(1).text()
            break
    result.append(data)
    return


def init():
    card_index = parseList(card_index_url)
    if card_index == False:
        print('解析索引列表失败')
        return
    with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
        futures = [executor.submit(fetchCardDetail, item) for item in card_index]
        # 初始化已完成和未完成任务计数器
        completed_count = 0
        total_count = len(futures)
        # 实时打印进度
        for future in concurrent.futures.as_completed(futures):
            completed_count += 1
            print(f"已完成 {completed_count}/{total_count} 任务")
            time.sleep(0.2)
    saveFile(base_dir / outputRoot / 'database/card.data.ts', transform2ts('CARD_POOL', result))

init()