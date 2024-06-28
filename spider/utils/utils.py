# 保存文件
import json
import os
from pathlib import Path
import requests


def saveFile(fileName, text):
    # 如果目录不存在，则创建目录
    if not fileName.parent.exists():
        fileName.parent.mkdir(parents=True, exist_ok=True)
    # 创建文件（即使文件已经存在，'touch'方法不会覆盖文件内容）
    fileName.touch(exist_ok=True)
    with open(fileName, 'w', encoding='utf-8') as file:
        # json.dump(text, json_file, ensure_ascii=False, indent=4)
        file.write(text)
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


def create_file_if_not_exists(file_path: str) -> None:
    # 创建一个Path对象
    path = Path(file_path)
    # 如果目录不存在，则创建目录
    if not path.parent.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
    # 创建文件（即使文件已经存在，'touch'方法不会覆盖文件内容）
    path.touch(exist_ok=True)

def transform2ts(name, list):
    text = str(list)
    return 'export const ' + name  + ' = ' + text