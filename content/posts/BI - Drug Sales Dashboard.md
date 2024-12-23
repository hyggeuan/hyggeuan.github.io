+++
title = 'BI - Drug Sales Dashboard'
categories = ["可视化"]
tags = ["powerbi", "powerquery"]
+++


# 在线报表
<iframe title="DrugSales Dashboard" width="600" height="373.5" src="https://app.powerbi.com/view?r=eyJrIjoiODU0NmUzOTktOTE3Yy00YTBlLWExNzItOGRlZjhkM2M3YzQzIiwidCI6ImFiZDJiNzlkLWZjZDctNDdhOC1hMWVlLTU0MDdkODM5N2Y1MSJ9&pageName=d5ce4be5030c3e0d7b04" frameborder="0" allowFullScreen="true"></iframe>

# 前言
这份可视化为跟练版，教学视频来自👉youtube@Data with Decision，数据是药物销售数据，其中有部分内容我结合实际业务场景做了调整，会更加切合业务逻辑。

# 一、数据介绍
## 1. 数据结构

原始数据一共有三张表：
- FactTable：存储药品销售订单信息，以索引字段进行存储；包含多个外键id，销量，订单日期；
- CustomerTable：存储客户实际信息，包含id、姓名、性别、年龄、地理信息；
- DrugLookup：存储药品实际信息，包含药品id、名称、单价、成本；

<div class="zoomable">
    <img src="https://i.postimg.cc/zXLdSL4S/image.png" alt="放大图片">
</div>

## 2. 数据预处理

### 2.1 清洗
- 原始数据结构很完整，不需要过多的清洗。主要涉及，检查/修正字段类型、去除重复值、去除缺失值、修正部分字符的书写方法（将西文字符修正为英文字母等）。

### 2.2 日期表
创建符合数据结构的日期表，便于后续日期交互。

```DAX
DateTable = 
ADDCOLUMNS(
    CALENDARAUTO(),
    "Year", YEAR([Date]),
    "Month", FORMAT([Date],"mmm"),
    "MonthNum", MONTH([Date]),
    "WeekName", FORMAT([Date],"ddd"),
    "WeekNum", WEEKDAY([Date]),
    "Quarter", "Q"&QUARTER([Date])
)
```

<div class="zoomable">
    <img src="https://i.postimg.cc/C5YpWGD8/image.png" alt="放大图片">
</div>

### 2.3 关系模型
此处应用星型模型，以FactTable作为事实表，CustomerTable、DrugLookup、DateTable作为维度表。

<div class="zoomable">
    <img src="https://i.postimg.cc/9f7308YT/image.png" alt="放大图片">
</div>


# 二、看板结构

看板总共三个主界面和一个工具提示用来辅助页面悬停

## 1. Top/Bottom Analysis
本页面用于展示基础业务指标和业务排名前几后几的药品、客户信息。

### 1.1 基础业务指标

指标：销量Quantity、销售额Revenue、成本Cost、利润Profit、利润率Profit Margin

同时配合页面对于月份的筛选，在指标的标签中展示所筛选的月份信息，以及该月份的上个月的指标数值和环比波动。

<div class="zoomable">
    <img src="https://i.postimg.cc/zv9ts54c/image.png" alt="放大图片">
</div>

### 1.2 Top/Bottom N板块

这个板块用于跟随动态度量值筛选对应指标下Top N和Bottom N的药品信息和客户信息，并显示相应的文本信息。

构成内容：
- N值的滑块，设置从1-20的数值范围；
- 度量值切换，选取了销量、销售额、订单数、利润四个指标做切换展示；
- 药品信息和客户信息

<div class="zoomable">
    <img src="https://i.postimg.cc/tCjmNRts/image.png" alt="放大图片">
</div>

## 2. Customer Analysis

该页面用于展示客户信息，从客户的年龄、性别、地理维度拆解制作视觉对象。

### 2.1 基础指标

客户数量、平均销售额、总销售额

<div class="zoomable">
    <img src="https://i.postimg.cc/bJ01yPG5/image.png" alt="放大图片">
</div>

### 2.2 各性别的销售额占比

<div class="zoomable">
    <img src="https://i.postimg.cc/13g6gwnw/image.png" alt="放大图片">
</div>

### 2.3 地理维度的销售额

这里使用了两个视觉对象切换展示：城市销售额条形图和销售额地图

<div class="gallery" style="display: flex; justify-content: space-between;">
    <div class="zoomable" style="flex: 1 1 48%; margin: 10px;">
        <img src="https://i.postimg.cc/TwxWHskJ/image.png" alt="放大图片">
    </div>
    <div class="zoomable" style="flex: 1 1 48%; margin: 10px;">
        <img src="https://i.postimg.cc/wvksKkZ8/image.png" alt="放大图片">
    </div>
</div>

<div class="zoom-overlay"></div>

同时配置了工具提示，在鼠标悬停在视觉对象上时，显示该视觉对象维度的销售额前3的药品名称

<div class="zoomable">
    <img src="https://i.postimg.cc/BQRbVybP/image.png" alt="放大图片">
</div>

### 2.4 不同客户类型销售额

<div class="zoomable">
    <img src="https://i.postimg.cc/k4MgSP1z/image.png" alt="放大图片">
</div>

### 2.5 不同年龄区间的销售额

<div class="zoomable">
    <img src="https://i.postimg.cc/VNmfyc8v/image.png" alt="放大图片">
</div>

## 3. Revenue Trend

此页面用于呈现销售额波动趋势

### 3.1 基础指标及年、季度波动

交易量和总销售额；销售额按年份和季度的波动折线图

<div class="zoomable">
    <img src="https://i.postimg.cc/y6X25SNm/image.png" alt="放大图片">
</div>

### 3.2 销售额每月波动及月环比

这个板块呈现了月份维度的销售额波动折线图以及月环比柱状图

<div class="zoomable">
    <img src="https://i.postimg.cc/TwjNZZTd/image.png" alt="放大图片">
</div>

### 3.3 周内销售额

这个板块由周内每日销售额柱状图和周内每日Top5销售额药品的销售热力图构成

<div class="gallery" style="display: flex; justify-content: space-between;">
    <div class="zoomable" style="flex: 1 1 48%; margin: 10px;">
        <img src="https://i.postimg.cc/PxH2z2YB/image.png" alt="放大图片">
    </div>
    <div class="zoomable" style="flex: 1 1 48%; margin: 10px;">
        <img src="https://i.postimg.cc/VL29WKcD/image.png" alt="放大图片">
    </div>
</div>

<div class="zoom-overlay"></div>