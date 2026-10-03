#!/usr/bin/env bash
set -euo pipefail
set -m

SCRIPTS="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$SCRIPTS/../../../.." && pwd)"
RUN_DIR="$REPO/.verify/run"
APP_PORT="${VERIFY_APP_PORT:-4310}"
FAKES_PORT="${VERIFY_FAKES_PORT:-4311}"
CDP_PORT="${VERIFY_CDP_PORT:-4312}"
RUN_ID="$(date +%Y%m%d-%H%M%S)"
EVIDENCE_DIR="$REPO/.verify/evidence/$RUN_ID"
BASE_URL="http://localhost:$APP_PORT"

if [[ -f "$RUN_DIR/state.json" ]]; then
  echo "A verify run is already up ($RUN_DIR/state.json). Run doctor.sh, or down.sh first." >&2
  exit 1
fi

for port in "$APP_PORT" "$FAKES_PORT" "$CDP_PORT"; do
  if lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Port $port is already in use by a process this run did not start:" >&2
    lsof -nP -iTCP:"$port" -sTCP:LISTEN >&2
    exit 1
  fi
done

if pgrep -f "$REPO/node_modules/.bin/next dev|$REPO/node_modules/next/dist/bin/next dev" >/dev/null; then
  echo "A 'next dev' server for this repo is already running. Next allows one dev server per project; stop it or verify against it manually." >&2
  pgrep -fl "next dev" >&2
  exit 1
fi

mkdir -p "$RUN_DIR" "$EVIDENCE_DIR"
cd "$REPO"
git diff --quiet -- AGENTS.md && touch "$RUN_DIR/agents-md-was-clean"

VERIFY_FAKES_PORT="$FAKES_PORT" VERIFY_EVIDENCE_DIR="$EVIDENCE_DIR" \
  nohup node "$SCRIPTS/fakes.mjs" >"$RUN_DIR/fakes.log" 2>&1 &
echo $! >"$RUN_DIR/fakes.pid"

env \
  NEXT_TELEMETRY_DISABLED=1 \
  NODE_OPTIONS="--import $SCRIPTS/graph-redirect.mjs" \
  VERIFY_GRAPH_URL="http://127.0.0.1:$FAKES_PORT/graph" \
  VERIFY_RUN_DIR="$RUN_DIR" \
  OPENAI_BASE_URL="http://127.0.0.1:$FAKES_PORT/openai/v1" \
  OPENAI_API_KEY="verify-fake-openai-key" \
  WHATSAPP_ACCESS_TOKEN="verify-fake-whatsapp-token" \
  WHATSAPP_PHONE_NUMBER_ID="verify-phone-number-id" \
  WHATSAPP_ORDER_TEMPLATE_NAME="pedido_imagen" \
  WHATSAPP_CATALOGO_TEMPLATE_NAME="pedido_catalogo" \
  WHATSAPP_WEBHOOK_VERIFY_TOKEN="verify-webhook-token" \
  WHATSAPP_GRAPH_API_VERSION="v25.0" \
  WHATSAPP_TEMPLATE_LANGUAGE="es_AR" \
  nohup "$REPO/node_modules/.bin/next" dev -p "$APP_PORT" >"$RUN_DIR/app.log" 2>&1 &
echo $! >"$RUN_DIR/app.pid"

VERIFY_CDP_PORT="$CDP_PORT" VERIFY_PROFILE_DIR="$RUN_DIR/profile" \
  VERIFY_EVIDENCE_DIR="$EVIDENCE_DIR" VERIFY_BASE_URL="$BASE_URL" \
  nohup node "$SCRIPTS/browser-daemon.mjs" >"$RUN_DIR/browser.log" 2>&1 &
echo $! >"$RUN_DIR/browser.pid"

cat >"$RUN_DIR/state.json" <<EOF
{
  "runId": "$RUN_ID",
  "baseUrl": "$BASE_URL",
  "appPort": $APP_PORT,
  "fakesPort": $FAKES_PORT,
  "cdpPort": $CDP_PORT,
  "evidenceDir": "$EVIDENCE_DIR",
  "gitHead": "$(git -C "$REPO" rev-parse --short HEAD)"
}
EOF

wait_for() {
  local label="$1" url="$2" log="$3"
  for _ in $(seq 1 120); do
    if curl -fsS -o /dev/null "$url" 2>/dev/null; then return 0; fi
    sleep 1
  done
  echo "$label did not become ready at $url. Last log lines:" >&2
  tail -20 "$log" >&2
  return 1
}

wait_for "fakes" "http://127.0.0.1:$FAKES_PORT/health" "$RUN_DIR/fakes.log"
wait_for "browser" "http://127.0.0.1:$CDP_PORT/json/version" "$RUN_DIR/browser.log"
lsof -nP -t -iTCP:"$CDP_PORT" -sTCP:LISTEN | head -1 >"$RUN_DIR/chrome.pid"
wait_for "app" "$BASE_URL/" "$RUN_DIR/app.log"

echo "verify run $RUN_ID is up"
echo "  app:      $BASE_URL"
echo "  evidence: $EVIDENCE_DIR"
