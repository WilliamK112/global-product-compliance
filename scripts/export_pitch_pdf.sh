#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/submission/CanSell_GOAI_Pitch.pdf"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
URL="${1:-https://cansell-kappa.vercel.app/pitch.html}"
if [[ ! -x "$CHROME" ]]; then
  echo "Chrome not found; open $URL and Print to PDF as CanSell_GOAI_Pitch.pdf"
  exit 0
fi
"$CHROME" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="$OUT" "$URL"
ls -lh "$OUT"
