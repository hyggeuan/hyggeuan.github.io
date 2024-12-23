+++
title = 'BI - Ali User Behaviour'
categories = ["可视化"]
tags = ["powerbi"]
+++


# 在线报表
<iframe title="User Behaviour" width="600" height="373.5" src="https://app.powerbi.com/view?r=eyJrIjoiOWE2MDczOTktMWI5Yy00MTZlLTkxOGYtOTQzMzdlNDA2MDliIiwidCI6ImFiZDJiNzlkLWZjZDctNDdhOC1hMWVlLTU0MDdkODM5N2Y1MSJ9" frameborder="0" allowFullScreen="true"></iframe>


# 前言
- 数据来源：[淘宝用户购物行为数据集](https://tianchi.aliyun.com/dataset/649)；
- 这份可视化的梳理可以参考我的另一篇文章[用户行为分析](https://hyggeuan.github.io/posts/my-first-post/)，原始数据的清洗是在MySQL完成的。因为报表界面和分析已在另一篇文章中详细介绍，所以此处简单介绍一下界面的基本信息。

# 界面一、Users & Goods
这个界面主要分成三个板块：
- 用户活跃度：日活、三日活；用户逐日留存率；
- 页面行为：pv、uv及平均访问深度；页面总漏斗；转化率按日波动折线图；
- 商品维度：按购买次数（原始数据没有消费金额信息）累计的品类帕累托；按pv和购买次数展示商品分布；

<div class="zoomable">
    <img src="https://i.postimg.cc/Kv6kz5wT/image.png" alt="放大图片">
</div>

# 界面二、Lite RFM

>原始数据中没有消费金额"M"字段，所以此处简化了模型，只计算R和F指标

界面分为两个板块：
- RFM模型：各分类用户的数量；用户页面行为按小时的分布；
- 客户明细：各类别用户的购买次数分布；各分类用户的明细信息；

<div class="zoomable">
    <img src="https://i.postimg.cc/0yGY13jj/image.png" alt="放大图片">
</div>

# 导航栏
导航栏提供了界面切换和筛选框