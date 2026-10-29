#!/usr/bin/env bash
set -u
usage() { printf '%s\n' 'Usage: bash start-server.sh --session-dir <directory> [--foreground]' >&2; exit 2; }
[ "$#" -ge 2 ] && [ "$1" = '--session-dir' ] && [ -n "$2" ] || usage
session=$2
shift 2
foreground=
if [ "$#" -gt 0 ]; then
  [ "$#" -eq 1 ] && [ "$1" = '--foreground' ] || usage
  foreground=--foreground
fi
command -v node >/dev/null 2>&1 || { printf '%s\n' 'Node.js 22 or newer is required.' >&2; exit 1; }
node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 22 ? 0 : 1)' || { printf '%s\n' 'Node.js 22 or newer is required.' >&2; exit 1; }
script_dir=$(cd "$(dirname "$0")" && pwd -P)
exec node "$script_dir/server.cjs" start "$session" $foreground
