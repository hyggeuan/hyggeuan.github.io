+++
title = '淘宝用户页面行为分析'
categories = ["项目"]
tags = ["mysql", "powerbi", "userbehaviour"]
+++

## 前言
利用阿里云公开数据集，通过MySQL和PowerBI，完成从数据清洗、特征提取、模型构建到可视化分析的完整流程。

## 一、数据准备
### 1. 原始数据
#### 1.1 来源
[淘宝用户购物行为数据集](https://tianchi.aliyun.com/dataset/649)

#### 1.2 结构
static/favicon.png
![alt text](image-1.png)

### 2. 导入数据库
原有数据集规模为亿级，MySQL运行过载，所以截取前1千万条记录做处理和分析

### 3. 预处理
#### 3.1 修改字段名和数据类型
- 将 `ALTER TABLE` 操作分成多个步骤，每次只修改一列，并显式指定 `ALGORITHM=COPY`。这样可以减少每次操作所需的锁数量，并且降低对生产环境的影响。

- 当使用 `ALGORITHM=COPY` 时，MySQL 会创建一个新表，并将原表的数据逐行复制到新表中。在复制完成后，MySQL 会用新表替换旧表。

```SQL
# 修改字段名，增加自增id
-- 修改 f1 列
ALTER TABLE userbehaviour
CHANGE f1 user_id INT,
ALGORITHM=COPY;

-- 修改 f2 列
ALTER TABLE userbehaviour
CHANGE f2 goods_id BIGINT,
ALGORITHM=COPY;

-- 修改 f3 列
ALTER TABLE userbehaviour
CHANGE f3 category_id BIGINT,
ALGORITHM=COPY;

-- 修改 f4 列
ALTER TABLE userbehaviour
CHANGE f4 behavior VARCHAR(5),
ALGORITHM=COPY;

-- 修改 f5 列
ALTER TABLE userbehaviour
CHANGE f5 action_time INT,
ALGORITHM=COPY;

-- 添加新列 time_stamp
ALTER TABLE userbehaviour
ADD COLUMN time_stamp TIMESTAMP;

-- 添加自增的 id 列
ALTER TABLE userbehaviour
ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY;
```
>数据量级较大，对代码性能优化要求较高，建议分批更新或优化代码
```SQL
# 将时间戳（日期时间）列转换为新列按日期显示
UPDATE userbehaviour
SET time_stamp = FROM_UNIXTIME(action_time)
WHERE time_stamp IS NULL
LIMIT 10000;
```

#### 3.2 去除不在时间范围内的记录
本次只保留2017-11-25至2017-12-02之间的记录
```SQL
DELETE FROM userbehaviour
WHERE time_stamp < '2017-11-25' OR time_stamp > '2017-12-02';
```

#### 3.3 去除缺失值
删除不完整的记录
```SQL
DELETE FROM userbehaviour
WHERE user_id IS NULL 
        OR goods_id IS NULL
        OR category_id IS NULL
        OR behavior IS NULL
        OR time_stamp IS NULL;
```

#### 3.4 去除重复
创建一个临时表来存储需要删除的记录 ID，根据主键ID，从主表中删除这些记录。这种方法可以更好地控制临时数据的存储，并且可以在删除过程中进行监控和调试。
```SQL
-- 创建临时表来存储需要删除的记录 ID
CREATE TEMPORARY TABLE temp_to_delete AS
SELECT id
FROM (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY user_id, goods_id, category_id, behavior, action_time
           ORDER BY id
         ) AS rn
  FROM userbehaviour
) AS derived_table
WHERE rn > 1;
> Query Time: 45.888s

-- 删除重复记录
DELETE FROM userbehaviour
WHERE id IN (SELECT id FROM temp_to_delete);
> Query Time: 125.307s

-- 删除临时表
DROP TEMPORARY TABLE temp_to_delete;
```

#### 3.5 结果预览
一千万条数据经过去重、去除缺失、去除不在目标日期内的记录后剩余有效数据8,498,679条
![alt text](image-2.png)

## 二、可视化分析
![alt text](<whiteboard_exported_image (1).png>)

### 1. 用户流量
#### 1.1 日活跃用户 (DAU) 和三日活跃用户 (3-DAU)
| ![DAU](image-4.png) | ![3-DAU](image-3.png) |
|---------------------|-----------------------|

每日活跃用户数据较为稳定，三日活用户数据波动较大，呈现增长趋势；两组数据在12月2日都出现峰值，推测12月2日平台可能有促销活动或新功能发布，吸引了用户集中访问。

这一现象在逐日留存趋势中也有呈现：用户留存率走势基本平稳，但都在最后一天大幅上升，大量用户再次活跃。
>留存率 = t+n日再次访问用户数/t日新增用户数

![alt text](image-5.png)

#### 1.2 页面浏览
![alt text](image-6.png)
平均访问深度的变化反映了用户在网站或应用中的活跃度。较高的平均访问深度表明用户在网站上停留的时间较长，访问了更多的页面。对商品品类进行筛选后会发现不同品类之间的访问深度差距较大，可以结合品类特性进行细化分析。

#### 1.3 用户行为
##### 1.3.1 总漏斗
>此处忽略行为先后顺序，仅考虑行为本身

![alt text](image-7.png)

浏览 - 加购 - 收藏 - 购买路径漏斗整体转化率为2%，浏览到加购转化率为6%。

需要注意的是，加购和收藏并不是转化的必要路径，用户可以选择页面直接购买，或者加购购买。对收藏较多的用户或商品进行优化，是实际业务中提升加购或直购的转化率的途径之一。可以考虑优化收藏功能、根据收藏记录提供个性化推荐、推出限时促销活动等方法优化购物体验。

##### 1.3.2 每小时用户行为
![alt text](image-9.png)

用户访问峰值在晚间21点，说明晚间20-21点用户最为活跃。因此可以考虑将大型活动设置在这一时间段（实际生活中已有运用，例如购物节付定金或尾款的时间点通常设置为晚上8点）。

同时，可以选取流量相对较少的时间段进行新版本发布等活动，减少对用户体验的影响，同时减轻服务器压力。


### 2. Lite RFM模型
>Lite版是因为数据源中没有消费金额这一指标，此处只选取R和F做分析

- **R值**：计算用户最新消费日期与业务最新日期（或当前日期）之间的天数差值；使用二分法，消费天数差**小于**所有用户平均天数差的，该用户价值相对较高，赋值1，否则赋值0；

- **F值**：计算用户累计消费频次；用户累计消费频次**大于**所有用户平均累计消费频次的，价值较高，赋值1，否则赋值0；

- **M值（如有）**：计算用户累计消费金额；累计金额**大于**所有用户平均累计消费金额的，价值较高，赋值1，否则赋值0；

此处将用户分为四个类别：

- 间隔短，频次高：（11）重要价值用户；
- 间隔短，频次低：（10）重要发展用户；
- 间隔久，频次高：（01）重要保持客户；
- 间隔久，频次低：（00）低价值用户；

| ![alt text](image-10.png) | ![alt text](image-13.png) |
|---------------------------|---------------------------|

计算各分类的用户数量，以及不同分类的购买次数展示：购买主力来源于重要价值客户，发展用户的数量比价值用户数量多，但购买次数仅占价值用户购买次数的三分之一不到，应对该类用户制定适当的营销策略促活。

此处的分类依据全平台消费记录，实际业务中应当根据不同店铺/品牌/品类进行细化拆解。



### 3. 商品端

#### 3.1 帕累托

![alt text](image-8.png)

根据购买次数计算品类的帕累托，并高亮累计占比前20%的品类；如有详细品类数据，可以拓展分析不同客单价区间/不同领域商品的购买行为；

#### 3.2 浏览次数和购买次数散点图
![alt text](image-14.png)

**用户行为**:

- 大部分商品在PV较低时，购买次数也较低，这表明用户对这些商品的兴趣不高。
- 少数商品在PV较高时，Buy也较高，这表明这些商品更受欢迎，转化率较高。
- 同时应当考虑，营销动作、页面素材等对PV的影响，客单价和品类与购买频次的关系；

**营销策略**:
- 对于PV较高但购买次数较低的商品，可能需要进一步分析原因，例如价格、描述、评价等。
- 对于PV和购买次数都较高的商品，可以考虑进一步推广，以维持其高转化率。

**异常值**：
- 散点图中的异常值可能的原因：商品本身的营销营销活动，原始数据截取不完整等。

## 三、总结
>基于当前数据

**用户端**：
- 12月2日用户活跃和留存都达到峰值，推断平台营销活动的影响，提升了这一阶段的用户活跃度；
- 新用户从第二日起留存率就大幅下降，可以从产品功能、用户属性、拉新活动等维度细化分析原因，制定针对性的促活方案；
- 根据浏览-加购-购买，浏览-收藏-加购-购买，浏览-购买三种行为路径的数据，识别用户流失较大的环节，针对性调整；
- 在用户集中活跃的时间段推新品、营销活动的收益会更高；在用户流量较低的时间段，进行功能上新、版本上线等活动，对用户影响较小；
- 聚焦到不同品类下的用户分群，对不同客户群体采取针对性的策略；

**商品端**：
- 应当结合商品客单价、营销活动等，综合分析商品曝光和转化，同时可通过设置A/B实验，选取适当的策略进行推广；
- 除营销活动外，优化商品页面素材，也是提升曝光度的途径之一；