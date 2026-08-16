# 数据与证据

每条关键判断绑定：

```json
{
  "claim": "This SKU requires RED conformity assessment",
  "status": "BLOCKED",
  "country": "EU",
  "evidence": [{
    "authority": "European Parliament and Council",
    "document": "Directive 2014/53/EU",
    "article": "Article 3; Article 10; Article 17",
    "source_url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32014L0053",
    "retrieved_at": "2026-08-16",
    "hash": "sha256..."
  }]
}
```

来源登记：`data/regulations/SOURCE_REGISTRY.md`。种子：`data/regulations/seed.json`、`data/platforms/seed.json`。哈希在加载时对证据 payload 计算。阿康医药库未导入，原因见 `research/AKANG_DATA_USE.md`。
