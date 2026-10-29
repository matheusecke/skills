#!/usr/bin/env bash
set -u
[ "$#" -eq 1 ] && [ -n "$1" ] || { printf '%s\n' 'Usage: bash stop-server.sh <session-directory>' >&2; exit 2; }
command -v node >/dev/null 2>&1 || { printf '%s\n' 'Node.js 22 or newer is required.' >&2; exit 1; }
node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 22 ? 0 : 1)' || { printf '%s\n' 'Node.js 22 or newer is required.' >&2; exit 1; }
script_dir=$(cd "$(dirname "$0")" && pwd -P)
exec node "$script_dir/server.cjs" stop "$1"
