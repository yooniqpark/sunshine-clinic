#!/bin/bash
# 글쓰기 듀오 - 맥 실행 (더블클릭으로 실행)
cd "$(dirname "$0")"
PY=/usr/local/bin/python3
[ -x "$PY" ] || { echo "파이썬이 없습니다. 먼저 '설치하기.command' 를 실행해 주세요."; read -r -p "엔터를 누르면 닫힙니다"; exit 1; }

# 새로 필요한 부품이 생겼을 수 있어 매번 조용히 확인합니다
"$PY" -m pip install --disable-pip-version-check -q -r requirements.txt
"$PY" app.py
