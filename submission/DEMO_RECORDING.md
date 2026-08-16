# Demo recording shot list (90–120s)

Speak first: **This is not legal advice.**

Record the live product: https://cansell-kappa.vercel.app

| t | Shot | Say |
|---|---|---|
| 0–8s | Header + matrix | 上传目录。每个 SKU × 国家 × 平台给出放行状态。 |
| 8–22s | Click SERUM-01 × ID BLOCKED | 精华液进印尼 BLOCKED。缺 BPOM Notifkos。这是官方门户，不是模型编的。 |
| 22–38s | Click BT-SPEAKER-01 × EU BLOCKED | 音箱有 CE-EMC 仍 BLOCKED。RED 2014/53/EU。EMC 不是 RED。 |
| 38–52s | Click LED-LAMP-01 × EU WARNING | LED 不是 Yes/No。LVD/EMC 有证据，仍缺 GPSR 欧盟责任人。 |
| 52–70s | 改首行 SKU 名再评估 | 改了名字，状态不变。按属性，不按 SKU 名。 |
| 70–95s | 恢复演示目录，模拟法规变更 | 不要说「出了一部新法」。4 个 SKU 里只有 LED 被打中。印尼 PASS → WARNING。 |
| 95–110s | 补证后再评估（可选） | 给音箱附上 CE-RED / EU-RP / FCC / DJID，状态重算。 |
| 110–120s | Pull back to matrix | 工厂要的是被打中的 SKU 和下一步，不是更多新闻。 |

If live site fails: `pytest -q` then `uvicorn apps.api.main:app --port 8000`.
