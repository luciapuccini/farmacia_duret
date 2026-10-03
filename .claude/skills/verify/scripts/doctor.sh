#!/usr/bin/env bash
set -uo pipefail

SCRIPTS="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$SCRIPTS/../../../.." && pwd)"
RUN_DIR="$REPO/.verify/run"
status=0

fail() { echo "FAIL $*"; status=1; }
pass() { echo "ok   $*"; }

if [[ ! -f "$RUN_DIR/state.json" ]]; then
  echo "FAIL no verify run is up (missing $RUN_DIR/state.json). Run up.sh."
  exit 1
fi

read_state() { node -e "console.log(require('$RUN_DIR/state.json')['$1'])"; }
BASE_URL="$(read_state baseUrl)"
APP_PORT="$(read_state appPort)"
FAKES_PORT="$(read_state fakesPort)"
CDP_PORT="$(read_state cdpPort)"
EVIDENCE_DIR="$(read_state evidenceDir)"
RUN_HEAD="$(read_state gitHead)"

for name in app fakes browser; do
  pid="$(cat "$RUN_DIR/$name.pid" 2>/dev/null)"
  if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then pass "$name process $pid is alive"
  else fail "$name process ${pid:-?} is not running (see $RUN_DIR/$name.log)"; fi
done

owns_port() {
  local port="$1" root_pid="$2"
  local listener
  listener="$(lsof -nP -t -iTCP:"$port" -sTCP:LISTEN 2>/dev/null | head -1)"
  [[ -z "$listener" ]] && return 1
  local pgid
  pgid="$(ps -o pgid= -p "$listener" | tr -d ' ')"
  [[ "$pgid" == "$root_pid" ]]
}

owns_port "$APP_PORT" "$(cat "$RUN_DIR/app.pid")" && pass "port $APP_PORT is owned by this run's app" || fail "port $APP_PORT is not owned by this run's app"
owns_port "$FAKES_PORT" "$(cat "$RUN_DIR/fakes.pid")" && pass "port $FAKES_PORT is owned by this run's fakes" || fail "port $FAKES_PORT is not owned by this run's fakes"
cdp_listener="$(lsof -nP -t -iTCP:"$CDP_PORT" -sTCP:LISTEN 2>/dev/null | head -1)"
if [[ -n "$cdp_listener" && "$cdp_listener" == "$(cat "$RUN_DIR/chrome.pid")" && "$(ps -o ppid= -p "$cdp_listener" | tr -d ' ')" == "$(cat "$RUN_DIR/browser.pid")" ]]; then
  pass "port $CDP_PORT is owned by this run's Chromium (pid $cdp_listener)"
else
  fail "port $CDP_PORT is not owned by this run's Chromium"
fi

code="$(curl -s -o /dev/null -w '%{http_code}' "$BASE_URL/")"
[[ "$code" == "200" ]] && pass "GET $BASE_URL/ -> 200" || fail "GET $BASE_URL/ -> $code"

challenge="$(curl -s "$BASE_URL/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=verify-webhook-token&hub.challenge=doctor-ok")"
[[ "$challenge" == "doctor-ok" ]] && pass "app runs with the verify env (webhook token answers)" || fail "app is not using the verify env: webhook answered '$challenge'"

counts="$(curl -s "http://127.0.0.1:$FAKES_PORT/health")"
[[ "$counts" == *'"ok":true'* ]] && pass "fakes healthy: $counts" || fail "fakes unhealthy: $counts"

app_listener="$(lsof -nP -t -iTCP:"$APP_PORT" -sTCP:LISTEN 2>/dev/null | head -1)"
if [[ -n "$app_listener" && -f "$RUN_DIR/redirected-pids/$app_listener" ]]; then
  pass "Graph redirect preload is active in the app server (pid $app_listener)"
else
  fail "Graph redirect preload is not active in the app server (pid ${app_listener:-?}); WhatsApp sends could reach Meta"
fi

head_now="$(git -C "$REPO" rev-parse --short HEAD)"
[[ "$head_now" == "$RUN_HEAD" ]] && pass "git HEAD $head_now matches the run" || echo "warn HEAD moved from $RUN_HEAD to $head_now since up.sh (dev server hot-reloads, but say so in the report)"

[[ -d "$EVIDENCE_DIR" ]] && pass "evidence dir $EVIDENCE_DIR" || fail "evidence dir $EVIDENCE_DIR is missing"

exit $status
