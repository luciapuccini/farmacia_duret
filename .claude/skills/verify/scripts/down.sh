#!/usr/bin/env bash
set -uo pipefail

SCRIPTS="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$SCRIPTS/../../../.." && pwd)"
RUN_DIR="$REPO/.verify/run"

if [[ ! -d "$RUN_DIR" ]]; then
  echo "No verify run to tear down."
  exit 0
fi

EVIDENCE_DIR="$(node -e "console.log(require('$RUN_DIR/state.json').evidenceDir)" 2>/dev/null)"

for name in browser chrome app fakes; do
  pid="$(cat "$RUN_DIR/$name.pid" 2>/dev/null)"
  [[ -z "$pid" ]] && continue
  kill -TERM -- "-$pid" 2>/dev/null
  for _ in $(seq 1 10); do kill -0 "$pid" 2>/dev/null || break; sleep 0.5; done
  kill -KILL -- "-$pid" 2>/dev/null
  echo "stopped $name (process group $pid)"
done

if [[ -n "$EVIDENCE_DIR" && -d "$EVIDENCE_DIR" ]]; then
  mkdir -p "$EVIDENCE_DIR/logs"
  cp "$RUN_DIR"/*.log "$EVIDENCE_DIR/logs/" 2>/dev/null
  echo "evidence kept at $EVIDENCE_DIR"
fi

if [[ -f "$RUN_DIR/agents-md-was-clean" ]] && ! git -C "$REPO" diff --quiet -- AGENTS.md; then
  git -C "$REPO" checkout -- AGENTS.md
  echo "restored AGENTS.md (next dev appends its agent-rules block)"
fi

rm -rf "$RUN_DIR"
