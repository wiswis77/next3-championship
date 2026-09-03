#!/usr/bin/env bash
# Next3 공개 데모용: Ollama 확인 → Next → Cloudflare tunnel
set -euo pipefail
cd "$(dirname "$0")/.."

if ! curl -sf http://127.0.0.1:11434/api/tags >/dev/null; then
  echo "Starting ollama..."
  brew services start ollama || true
  sleep 2
fi

if ! curl -sf http://127.0.0.1:3000/ >/dev/null; then
  echo "Starting next dev..."
  npm run dev -- --port 3000 >/tmp/next3-dev.log 2>&1 &
  for i in $(seq 1 30); do
    curl -sf http://127.0.0.1:3000/ >/dev/null && break
    sleep 1
  done
fi

echo "Starting cloudflared tunnel..."
exec cloudflared tunnel --url http://127.0.0.1:3000
