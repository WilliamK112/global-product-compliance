#!/usr/bin/env bash
set -euo pipefail
# Silent storyboard movie of the live product for GOAI if ffmpeg exists.
# Spoken 90–120s take still follows submission/DEMO_RECORDING.md.
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$HOME/Downloads/GOAI-CanSell"
FRAMES="$OUT_DIR/demo_frames"
mkdir -p "$FRAMES"
URL="${1:-https://cansell-kappa.vercel.app}"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [[ -x "$CHROME" ]]; then
  "$CHROME" --headless --disable-gpu --window-size=1440,900 --screenshot="$FRAMES/01_ledger.png" "$URL"
  "$CHROME" --headless --disable-gpu --window-size=1440,900 --screenshot="$FRAMES/02_pitch.png" "$URL/pitch.html"
fi
if command -v ffmpeg >/dev/null 2>&1 && ls "$FRAMES"/*.png >/dev/null 2>&1; then
  ffmpeg -y -loop 1 -t 8 -i "$FRAMES/01_ledger.png" -loop 1 -t 8 -i "$FRAMES/02_pitch.png" \
    -filter_complex "[0][1]concat=n=2:v=1:a=0,format=yuv420p" \
    "$OUT_DIR/CanSell_demo_silent.mp4"
  ls -lh "$OUT_DIR/CanSell_demo_silent.mp4"
else
  echo "Install ffmpeg to assemble $OUT_DIR/CanSell_demo_silent.mp4"
  echo "Record the spoken take with submission/DEMO_RECORDING.md"
fi
