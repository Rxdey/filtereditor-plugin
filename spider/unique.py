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
# 全部在同一页
unique_url = 'https://poedb.tw/cn/Unique_item'
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
        ids = ['#Weapon传奇', '#Armour传奇', '#Other传奇']
        doc = pq(text)
        for id in ids:
            lines = doc(id).find('table tbody tr')
            for line in lines:
                obj = {
                    'name': doc(line).find('td').eq(1).find('a').eq(0).text(), 
                    'href': base_url + doc(line).find('td').eq(1).find('a').attr('href'),
                    'icon': doc(line).find('td').eq(0).find('img').attr('src'),
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

    with concurrent.futures.ThreadPoolExecutor(max_workers=200) as executor:
        futures = [executor.submit(fetchDetail, item) for item in unique_index]
        # 初始化已完成和未完成任务计数器
        completed_count = 0
        total_count = len(futures)
        # 实时打印进度
        for future in concurrent.futures.as_completed(futures):
            completed_count += 1
            print(f"已完成 {completed_count}/{total_count} 任务")
    saveFile('./spider/result/unique_pool.json', result)
    return

# init()