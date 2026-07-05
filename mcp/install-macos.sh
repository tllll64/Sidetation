#!/usr/bin/env bash
# Install (or remove) the Sidetation receiver as a macOS LaunchAgent so it
# starts at login and restarts if it crashes.
#
#   ./install-macos.sh            # install + start
#   ./install-macos.sh uninstall  # stop + remove
#
# Run this from your real checkout — the plist points at wherever THIS script
# lives, so don't run it from a temporary git worktree.

set -euo pipefail

LABEL="com.sidetation.receiver"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RECEIVER="$DIR/receiver.mjs"
LOG="$HOME/Library/Logs/sidetation-receiver.log"

uninstall() {
  if [ -f "$PLIST" ]; then
    launchctl unload -w "$PLIST" 2>/dev/null || true
    rm -f "$PLIST"
    echo "已卸载并删除 $PLIST"
  else
    echo "没有找到已安装的 LaunchAgent，无需卸载。"
  fi
}

if [ "${1:-}" = "uninstall" ]; then
  uninstall
  exit 0
fi

NODE="$(command -v node || true)"
if [ -z "$NODE" ]; then
  echo "找不到 node，请先安装 Node.js（或确保它在 PATH 中）。" >&2
  exit 1
fi
if [ ! -f "$RECEIVER" ]; then
  echo "找不到 $RECEIVER" >&2
  exit 1
fi

mkdir -p "$HOME/Library/LaunchAgents" "$(dirname "$LOG")"

cat > "$PLIST" <<PLIST_EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>$NODE</string>
    <string>$RECEIVER</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>$(dirname "$NODE"):/usr/bin:/bin:/usr/sbin:/sbin</string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>$LOG</string>
  <key>StandardErrorPath</key>
  <string>$LOG</string>
</dict>
</plist>
PLIST_EOF

# validate before loading
plutil -lint "$PLIST" >/dev/null

launchctl unload -w "$PLIST" 2>/dev/null || true
launchctl load -w "$PLIST"

echo "已安装并启动 Sidetation receiver："
echo "  node:     $NODE"
echo "  receiver: $RECEIVER"
echo "  plist:    $PLIST"
echo "  日志:     $LOG"
echo
echo "验证：curl -s http://127.0.0.1:\${SIDETATION_PORT:-8787}/health"
echo "卸载：$0 uninstall"
