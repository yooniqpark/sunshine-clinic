#!/bin/bash
# 글쓰기 듀오 - 맥 실행 (더블클릭으로 실행)
cd "$(dirname "$0")"
PY=/usr/local/bin/python3
[ -x "$PY" ] || { echo "파이썬이 없습니다. 먼저 '설치하기.command' 를 실행해 주세요."; read -r -p "엔터를 누르면 닫힙니다"; exit 1; }

echo ""
echo "briefs 폴더에 있는 의뢰서 목록:"
ls briefs
echo ""
read -r -p "사용할 의뢰서 파일 이름을 입력하세요 (그냥 엔터 = 키 없이 연습 모드): " BRIEF
if [ -z "$BRIEF" ]; then
  "$PY" duo.py briefs/youtube_example.txt --demo
else
  "$PY" duo.py "briefs/$BRIEF"
fi
[ -d output ] && open output
read -r -p "엔터를 누르면 닫힙니다"
