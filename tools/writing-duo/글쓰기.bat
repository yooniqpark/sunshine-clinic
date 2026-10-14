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

if "%~1"=="" goto :demo
%PY% duo.py "%~1"
goto :done

:demo
echo.
echo 의뢰서 파일^(.txt^)을 이 "글쓰기.bat" 아이콘 위로 끌어다 놓으면 실제로 글을 씁니다.
echo 지금은 그냥 더블클릭하셨으니, API 키 없이 연습 모드로 흐름을 보여드릴게요.
echo.
pause
%PY% duo.py briefs\youtube_example.txt --demo

:done
if exist output start "" output
pause
