#!/usr/bin/env bash

# Restart Next.js dev server by killing any existing listeners on common dev ports,
# clearing the Turbopack lock, and starting a fresh dev server.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "Killing existing dev servers on ports 3000-3002 (if any)..."
powershell -NoProfile -Command "
  \$ports = 3000,3001,3002;
  \$pids = Get-NetTCPConnection -LocalPort \$ports -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess |
    Sort-Object -Unique;
  if (\$pids) {
    Get-Process -Id \$pids -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
  } else {
    Write-Output 'No existing dev servers found on ports 3000-3002.'
  }
"

LOCK_FILE=\"$ROOT_DIR/.next/dev/lock\"
if [ -f \"$LOCK_FILE\" ]; then
  echo \"Removing stale lock file: $LOCK_FILE\"
  rm -f \"$LOCK_FILE\"
fi

echo \"Starting Next.js dev server...\"
yarn run dev


