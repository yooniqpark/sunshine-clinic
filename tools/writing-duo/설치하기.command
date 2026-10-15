#!/bin/bash
# 글쓰기 듀오 - 맥 설치 (더블클릭으로 실행)
cd "$(dirname "$0")"
echo ""
echo "=============================================="
echo "  글쓰기 듀오 설치를 시작합니다"
echo "=============================================="
echo ""

PKG_VER="3.12.10"
if ! /usr/local/bin/python3 --version >/dev/null 2>&1 && ! [ -x /Library/Frameworks/Python.framework/Versions/3.12/bin/python3 ]; then
  echo "[1/3] 파이썬이 없어서 설치합니다. 맥 로그인 비밀번호를 물어보면 입력해 주세요."
  echo "      (입력해도 화면에 글자가 안 보이는 게 정상입니다)"
  curl -fL -o /tmp/python-installer.pkg "https://www.python.org/ftp/python/${PKG_VER}/python-${PKG_VER}-macos11.pkg" || {
    echo "다운로드 실패. 인터넷 연결을 확인하고 다시 실행해 주세요."; read -r -p "엔터를 누르면 닫힙니다"; exit 1; }
  sudo installer -pkg /tmp/python-installer.pkg -target / || {
    echo "설치 실패. 위 메시지를 복사해서 Claude에게 보여주세요."; read -r -p "엔터를 누르면 닫힙니다"; exit 1; }
  rm -f /tmp/python-installer.pkg
fi
PY=/usr/local/bin/python3
echo "[1/3] 파이썬 확인 완료"

echo "[2/3] 필요한 부품을 설치합니다..."
"$PY" -m pip install --disable-pip-version-check -q -r requirements.txt || {
  echo "부품 설치 중 오류가 났습니다. 위 메시지를 복사해서 Claude에게 보여주세요."; read -r -p "엔터를 누르면 닫힙니다"; exit 1; }

echo "[3/3] API 키 설정 파일을 준비합니다..."
[ -f .env ] || cp .env.example .env
echo "      텍스트 편집기가 열리면 API 키 두 개를 붙여넣고 저장(⌘S)한 뒤 닫아 주세요."
open -e .env

echo ""
echo "설치 끝! 이제 '글쓰기.command' 를 더블클릭하면 웹페이지가 열립니다."
read -r -p "엔터를 누르면 닫힙니다"
