# CanSell · 能卖哪

**Know where every product can sell — before regulations stop it.**

GOAI 2026：**无界应用 / Boundless Agents / 赛题五 AI+工业制造**

上传目录。每个 SKU × 国家 × 平台 得到 `PASS` / `WARNING` / `BLOCKED` / `UNCERTAIN` / `EXPERT_REVIEW_REQUIRED`，带官方证据、缺失项和整改清单。法规变化只报告 **哪些 SKU 被打中**。

不是法律意见，不是法规搜索器。

## Demo（一条命令）

```bash
python3.11 -m venv .venv
source .venv/bin/activate
pip install pytest pydantic fastapi python-multipart uvicorn
pytest -q
uvicorn apps.api.main:app --port 8000
```

打开 http://127.0.0.1:8000  
路演页：http://127.0.0.1:8000/pitch

点击矩阵看证据。点 **Simulate regulation change** 看 LED 印尼 PASS → WARNING。给 `BT-SPEAKER-01` 附加 `CE-RED,EU-RP,FCC,DJID` 再 **Re-check**。

## 可信子集

消费电子（蓝牙音箱、LED）+ 一条化妆品对照；EU / US / 印尼；Alibaba.com + Amazon。没有假的 200 国。

## 计算

`Product × Country × Platform × Regulation = Market Access State`

匹配按产品属性，不按 SKU 名字。未知品类不能 PASS。

仓库：https://github.com/WilliamK112/global-product-compliance

## 在线 Demo

https://cansell-kappa.vercel.app  
路演页：https://cansell-kappa.vercel.app/pitch.html

引擎在 Vercel 上以 Next.js API 运行（TypeScript 端口）。Python 引擎仍是 pytest 的源。

## License

MIT。法规摘录仅用于识别，全文以官方 URL 为准。
