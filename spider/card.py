import json
import urllib.parse
import requests
from pyquery import PyQuery as pq
import threading
import concurrent.futures
import re
import os

# 编年史
base_url = 'https://poedb.tw'
# 卡片索引列表
card_index_url = 'https://poedb.tw/cn/Divination_Cards'
# 结果
result = []
# 保存文件
def saveFile(fileName, text):
    with open(fileName, 'w', encoding='utf-8') as json_file:
        json.dump(text, json_file, ensure_ascii=False, indent=4)
        print(f"操作完成，结果已保存到 {fileName} 文件中。")

# 发送请求
def crawl_url(url):
    try:
        response = requests.get(url=url, timeout=(30, 50))
        if response.status_code == 200:
           return response.text
        else:
            print(f"请求失败")
        return False

    except requests.exceptions.RequestException as e:
        # print(f"请求异常")
        return False

# 解析索引列表
def parseList(url):
    try:
        text = crawl_url(url)
        if text == False:
            print("请求索引列表失败")
            return
        list = []
        doc = pq(text)
        lines = doc('table').eq(0).find('tbody tr')
        for line in lines:
            explicitMod = []
            if len(doc(line).find('.explicitMod span')) <= 0:
                explicitMod = [{
                    'type': 'magicitem', 'value': doc(line).find('.explicitMod').text()
                }]
            else:
                exList = doc(line).find('.explicitMod span')
                for ex in exList:
                    exObj = {
                        'type': doc(ex).attr('class'),
                        'value': doc(ex).text()
                    }
                    explicitMod.append(exObj)
            obj = {
                'name': doc(line).find('td').eq(1).find('a').text(), 
                'href': base_url + doc(line).find('td').eq(1).find('a').attr('href'),
                'type': doc(line).find('td').eq(1).find('a').attr('href').replace('/cn/', '').replace('_', ' '),
                'explicitMod': explicitMod
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
    title = doc('.FlavourText').text()
    data['flavourText'] = title
    data['stack'] = int(doc('.stackSize').text())
    # 提取图片地址
    icon_div = doc('.icon')
    style_attribute = icon_div.attr('style')
    imgUrl = getImageUrl(style_attribute)
    data['icon'] = imgUrl
    result.append(data)
    return


def init():
    card_index = parseList(card_index_url)
    if card_index == False:
        print('解析索引列表失败')
        return
    with concurrent.futures.ThreadPoolExecutor(max_workers=100) as executor:
        futures = [executor.submit(fetchCardDetail, item) for item in card_index]
        # 初始化已完成和未完成任务计数器
        completed_count = 0
        total_count = len(futures)
        # 实时打印进度
        for future in concurrent.futures.as_completed(futures):
            completed_count += 1
            print(f"已完成 {completed_count}/{total_count} 任务")
    saveFile('./spider/result/card_pool.json', result)

# init()