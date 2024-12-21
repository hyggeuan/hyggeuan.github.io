+++
title = 'BI - Patients Emergency Room Visit Report'
categories = ["可视化"]
tags = ["powerbi", "powerquery"]
+++

# 前言
- 这份可视化看板是跟练版，教学视频👉youtube@Data with Decision（数据集也来源于这位博主）；在跟练的同时，我结合实际使用对部分板块的代码进行了修改，使其计算逻辑更切合业务场景。
- 这份数据围绕医疗领域的患者就诊路径满意度追踪，分析影响满意度的几大指标。
- 本地.csv数据上传，进行可视化处理。

# 一、数据预处理

## 1. 数据结构
### 1.1 表格预览
| date               | patient_id       | patient_gender | patient_age | patient_sat_score | patient_first_initial | patient_last_name  | patient_race                           | patient_admin_flag | patient_waittime | department |
|--------------------|------------------|----------------|-------------|-------------------|-----------------------|--------------------|----------------------------------------|--------------------|------------------|------------|
| 2020/3/20 8:47     | 145-39-5406      | M              | 69          | 10                | H                     | Glasspool          | White                                  | FALSE              | 39               | None       |
| 2020/6/15 11:29    | 316-34-3057      | M              | 4           |                   | X                     | Methuen            | Native American/Alaska Native          | TRUE               | 27               | None       |

### 1.2 字段解释
- date: 记录患者就诊或数据记录的日期和时间。
- patient_id: 患者的唯一标识符，用于在医疗系统中唯一识别患者。
- patient_gender: 患者的性别，通常为男性（M）或女性（F）。
- patient_age: 患者的年龄，以岁为单位。
- patient_sat_score: 患者满意度评分，通常是一个数值，表示患者对医疗服务的满意度。
- patient_first_initial: 患者名字的首字母。
- patient_last_name: 患者的姓氏。
- patient_race: 患者的种族，如白人、非裔美国人、亚洲人等。
- patient_admin_flag: 一个布尔值，表示患者是否进行了行政登记。TRUE 表示已登记，FALSE 表示未登记。
- patient_waittime: 患者等待的时间，通常以分钟为单位。
- department: 患者就诊的部门，如普通科、骨科、胃肠科等。

## 2. 数据清洗
>数据本身已经很干净了，需要处理的内容不太多，一些小处理此处就省略了，主要描述对字段结构做的处理
### 2.1 增加"AM"和"PM"字段
通过修改`date`列的时区，
<div class="zoomable">
    <img src="https://i.postimg.cc/xjz81f0J/image.png" alt="放大图片">
</div>
