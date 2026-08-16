# 作品简介（中文）

**名称：** CanSell（能卖哪）全球商品准入 Agent  
**赛道：** 无界应用 Boundless Agents · AI+工业制造  
**一句话：** 上传商品目录，AI 告诉你每个 SKU 能卖到哪里、为什么、缺什么，以及法规变化后哪些商品必须立刻行动。

中国出口企业并不缺法规新闻，缺的是把法规打到**自己的 SKU** 上。CanSell 不做法规搜索网站，而做 Product × Country × Platform × Regulation 的市场准入状态机：PASS / WARNING / BLOCKED / UNCERTAIN / EXPERT_REVIEW_REQUIRED，每条结论绑定官方来源 URL、条款、检索日期和哈希。LLM 不能单独作为证据。

MVP 只覆盖可验证子集：消费电子（蓝牙音箱、LED 灯）+ 对比用化妆品，市场 EU / US / 印度尼西亚，平台 Alibaba.com / Amazon。演示法规变更时，系统不会说“出了一部新法”，而会说“3 个 SKU 里哪 1 个被打中”。

本项目不是法律意见，不能替代公告机构或检测实验室。开源协议 MIT。仓库提供可运行 API、矩阵 UI、pytest 与参赛文档。
