#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STAGING=/tmp/CanSell_GOAI_Prelim
rm -rf "$STAGING"
mkdir -p "$STAGING"/{docs,research,submission,code,cn,en}
cp "$ROOT/README.md" "$ROOT/LICENSE" "$ROOT/GOAI_STARTUP_STATUS.md" "$STAGING/"
cp "$ROOT/submission/00_表单怎么填.txt" "$STAGING/"
cp "$ROOT/submission/01_作品名称.txt" "$STAGING/"
cp "$ROOT/submission/02_作品简介_中文.txt" "$STAGING/cn/description_zh.txt"
cp "$ROOT/submission/03_作品简介_英文.txt" "$STAGING/en/description_en.txt"
cp "$ROOT/submission/"*.md "$ROOT/submission/"*.html "$STAGING/submission/"
cp "$ROOT/docs/"*.md "$STAGING/docs/"
cp "$ROOT/research/"*.md "$STAGING/research/"
rsync -a --exclude '.venv' --exclude '.git' --exclude '__pycache__' --exclude '.pytest_cache' \
  --exclude 'apps/web/node_modules' --exclude 'apps/web/.next' --exclude 'apps/web/.vercel' \
  "$ROOT/agents" "$ROOT/apps" "$ROOT/data" "$ROOT/product_graph" "$ROOT/regulation_graph" \
  "$ROOT/market_graph" "$ROOT/platform_graph" "$ROOT/verification" "$ROOT/monitoring" \
  "$ROOT/evidence" "$ROOT/storage" "$ROOT/skills" "$ROOT/tools" "$ROOT/tests" "$ROOT/benchmarks" \
  "$ROOT/pyproject.toml" "$ROOT/docker-compose.yml" "$ROOT/Dockerfile" "$ROOT/.env.example" \
  "$STAGING/code/"
OUT="$HOME/Downloads/GOAI-CanSell"
mkdir -p "$OUT"
rm -f "$OUT/CanSell_GOAI_Prelim.zip"
(cd /tmp && zip -r "$OUT/CanSell_GOAI_Prelim.zip" CanSell_GOAI_Prelim -x "*.DS_Store" >/dev/null)
ls -lh "$OUT/CanSell_GOAI_Prelim.zip"
