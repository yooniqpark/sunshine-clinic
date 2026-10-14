@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 글쓰기 듀오

set "PY="
py --version >nul 2>nul && set "PY=py"
if not defined PY python --version >nul 2>nul && set "PY=python"
if not defined PY (
  echo 파이썬이 없습니다. 먼저 "설치하기.bat" 을 더블클릭해 주세요.
  pause
  exit /b
)

rem 새로 필요한 부품이 생겼을 수 있어 매번 조용히 확인합니다
%PY% -m pip install --disable-pip-version-check -q -r requirements.txt
%PY% app.py
pause
