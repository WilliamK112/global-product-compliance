# 技术架构

栈：Python 3.11、FastAPI、Pydantic、JSON 种子（SQLite 可替换）、Next.js 可选。一条命令即可演示：

```bash
.venv/bin/uvicorn apps.api.main:app --port 8000
```

打开 http://127.0.0.1:8000

## 计算

`Product × Country × Platform × Regulation → Market Access State`

Intake Agent 读 CSV 生成 Product Digital Twin。Regulatory Research 只编码官方 URL。Matching 是确定性谓词。Verification 金字塔禁止 LLM 单独主张。空规则集返回 UNCERTAIN，永不沉默 PASS。Action 生成整改清单；`POST /recheck` 在补证后重算。Change engine 做版本 diff，输出受影响 SKU。

详见 `docs/AGENT_ARCHITECTURE.md`。
