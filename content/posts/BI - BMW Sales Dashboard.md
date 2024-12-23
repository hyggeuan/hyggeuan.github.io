+++
title = 'BI - BMW Sales Dashboard'
categories = ["可视化"]
tags = ["powerbi", "powerquery"]
+++


# 在线报表
<iframe title="BMW Sales Dashboard" width="600" height="373.5" src="https://app.powerbi.com/view?r=eyJrIjoiNDg4YmEyMGEtNjU3Yi00OThmLTk4ZTAtOWI3Yzk0ZTJmNWIwIiwidCI6ImFiZDJiNzlkLWZjZDctNDdhOC1hMWVlLTU0MDdkODM5N2Y1MSJ9" frameborder="0" allowFullScreen="true"></iframe>


# 前言
- 数据来源👉kaggle [Sales Data ( BMW )](https://www.kaggle.com/datasets/sherifsamyabdelkarem/sales-data-bmw)
- 这个网站里面只有一张原始销售数据表，因为想要制作带国家旗帜和汽车图片的看板，需要另外收集国家旗帜的URL链接表和宝马汽车图片的URL链接，这里有一位youtube@Abdel Raouf Yessoufou博主整理过国家旗帜和汽车图片的URL数据集；
- 数据集中有些URL链接失效，需要补全，但部分车型已不在BMW官网展示，所以没有收集到透明底图片，我从网络上找到了这些车型的白底图片作为替代。

# 一、数据介绍
## 1. 数据结构

基础数据一共有三张表：
- FactSales：统计汽车销售信息，包含日期、车型、车系、销售额、销售台数、所属大洲、国家和销售渠道；
- Countries with Flags URL：国家旗帜URL链接表；
- Car Images：车型图片URL链接表；

<div class="zoomable">
    <img src="https://i.postimg.cc/5286hVXQ/image.png" alt="放大图片">
</div>

## 2. 数据预处理

### 2.1 清洗

检查/修正字段类型、去除重复值、补全缺失的URL链接等

### 2.2 建立维度表

原始表中包含的信息较多，此处将其维度拆分成不同的表格，通过外键id连接，需要增加四张维度表：
- 日期维度表；
- DimCountry - 地理维度表：包含大洲、国家，并将原始数据中的国家旗帜列并入此表中；
- DimCar - 车型维度表：车型去重，包含车型、车系，并将原始数据中的车型URL列并入此表；
- DimChannel - 销售渠道维度表：包含销售渠道

维度表构建完成后，将表格的主键id合并到事实表中，并将事实表中的城市、车型、渠道的明细信息字段去除，优化事实表的结构。

### 2.3 关系模型
此处应用星型模型，事实表+维度表。

<div class="zoomable">
    <img src="https://i.postimg.cc/TYDV3Byf/image.png" alt="放大图片">
</div>


# 二、看板结构

看板总共由四个界面构成：三个主界面分别从地理、车型、车系三个大维度制作视觉对象，一个明细界面用于自定义明细数据结构。原始数据中只有销售额和销量两种业务指标，所以此处都是围绕这两个指标进行不同维度的计算展示。

## 1. Region
### 1.1 销售额地理分布

- 涉及大洲和城市的数量；
- 各大洲的销售额分布；
- 各国家的销售额排布；

<div class="zoomable">
    <img src="https://i.postimg.cc/hPXBz1gS/image.png" alt="放大图片">
</div>

### 1.2 销售额时间分布

- 当前年份与去年销售额对比，并标注差异线；
- 按年、季度、月份销售额波动展示；
- 总销售额和总销量的年份环比；

<div class="zoomable">
    <img src="https://i.postimg.cc/DwQY8SWv/image.png" alt="放大图片">
</div>

### 1.3 页面交互示例

<div class="zoomable">
    <img src="https://i.postimg.cc/MHxYkDD1/image.png" alt="放大图片">
</div>

## 2. Car
### 2.1 车型筛选
整个板块主要展示当前筛选的车型图片及该款车型销售额的大洲占比，这个板块比我预先设想的效果要差一点，此处就是尝试一下这种样式，实际内部业务使用的话还是以输出内容为主，用下方的小图就足够了。

<div class="zoomable">
    <img src="https://i.postimg.cc/XNfbwYBP/image.png" alt="放大图片">
</div>

### 2.2 具体指标
这个板块展示：
- 当前车型的销售额、销量及与往期的环比对比；
- 各国家的销售额帕累托图；
- 按年和按月统计的销售额；

<div class="zoomable">
    <img src="https://i.postimg.cc/y8ZCnmf7/image.png" alt="放大图片">
</div>

## 3. Series
这个界面是车型维度的上一级，对各大车系进行分析展示，同时可以横向对比各车型之间的数据。

### 3.1 分解树
将销售额拆分到各大车系 - 车型 - 国家，展示各种类别的销售额贡献占比。具体展示的内容可自行在页面调整。

<div class="zoomable">
    <img src="https://i.postimg.cc/zXHQ1JTj/image.png" alt="放大图片">
</div>

### 3.2 波士顿矩阵
此处根据车型的市场占有率和增长率将车型划分为四个类别：
- 明星：高增长高占有；
- 现金牛：低增长高占有；
- 问题：高增长低占有；
- 瘦狗：低增长低占有；

需要注意的是在计算市场占有的时候往往选择的是相对市场占有份额，因为手中没有相同时间维度的总汽车市场销售数据，所以此处市场占有率的计算是车型在自己的品牌中的占有率。

<div class="zoomable">
    <img src="https://i.postimg.cc/05V8n6Kr/image.png" alt="放大图片">
</div>

### 3.3 各车系销售额的时间维度波动

此处根据展示所有年份及其月份的销售额波动折线图，并对各年份销售额最高月份和最低月份进行标注。

<div class="zoomable">
    <img src="https://i.postimg.cc/VvZBSbMh/image.png" alt="放大图片">
</div>

### 3.4 各车系销量占比及销售额地理分布

<div class="zoomable">
    <img src="https://i.postimg.cc/L6732LmY/image.png" alt="放大图片">
</div>

## 4. Detail
这个界面主要用来提供字段和度量值，供自定义构建明细数据展示表格，同时上方配置了筛选信息，可以根据实际需要对字段进行筛选。

<div class="zoomable">
    <img src="https://i.postimg.cc/g0by6pXG/image.png" alt="放大图片">
</div>

## 5. 界面导航栏
界面导航栏主要包含两个部分，左侧是界面切换按钮，右侧三个按钮的功能分别是重置筛选、页面筛选器、Detail界面跳转。

<div class="zoomable">
    <img src="https://i.postimg.cc/WbJJmKPz/image.png" alt="放大图片">
</div>

- 筛选器：
<div class="zoomable">
    <img src="https://i.postimg.cc/SKZW1M1x/image.png" alt="放大图片">
</div>

- 当页面出现筛选时，筛选器按钮会出现"❗"提示，表明当前页面所展示的是部分数据；此时可以通过旁边的重置按钮清楚所有筛选。
<div class="zoomable">
    <img src="https://i.postimg.cc/sDF5Lym7/image.png" alt="放大图片">
</div>