# 数据爬虫

从编年史爬取物品信息
(ps：编年史结构经常变啊)

## 执行
```bash
python ./spider/指定文件.py
```
爬取完后存放在`./src/database/`下，覆盖历史内容

## 命运卡数据 `card.py`

编年史部分卡片的物品描述 dom 结构不准确，所以可能需要手动改一下
比如`套娃`这张卡

```diff
-{ "type": "size-25", "value": "物品等级： 85\\n品质： +20%\\n受影响物品\\n4圣油\\n魔符孕育物品\\n腐化" },
+{ "type": "rareitem", "value": "{黑耀护身符}" },
```

页面结构按照其它卡片的规则应该是:  
`<span class="rareitem">{黑耀护身符}<span>`  
  
但是不知道为啥渲染成了:   
`<rareitem>{黑曜护身符}</rareitem>`  
  
> 网页市集上奖励`黑曜护身符`这一句直接没有，应该是原始数据有问题

基本上`type`是`size-`开头的，都是数据有问题。
不会很多，就十多个。大部分是描述获取重复了，需要删掉`size-`开头的重复行
```diff
-{ "type": "size-29", "value": "6 级强化辅助宝石" },
{ "type": "gemitem", "value": "6 级强化辅助宝石" },
{ "type": "default", "value": "品质：" },
{ "type": "augmented", "value": "+23%" },
{ "type": "corrupted", "value": "已腐化" }
```
还有一些是`type`错乱，需要手动改下。
```diff
-{ "type": "size-27><uniqueitem", "value": "永恒幽影" },
+{ "type": "uniqueitem", "value": "永恒幽影" },
```

## 传奇数据 `unique.py`

没啥好说的，就挺多的。
只获取了 限定描述  

## 其他数据(圣甲虫和不灭余烬) `otherItem.py`
