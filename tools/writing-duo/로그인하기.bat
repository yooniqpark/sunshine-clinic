@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 글쓰기 듀오 - 구독 계정 로그인
echo.
echo ==============================================
echo   ① Claude 로그인
echo   브라우저가 열리면 Claude Pro/Max 를 구독 중인 계정으로 로그인하고
echo   "승인"을 눌러 주세요. 끝나면 이 창으로 돌아옵니다.
echo ==============================================
call claude auth login --claudeai
echo.
echo ==============================================
echo   ② ChatGPT 로그인
echo   브라우저가 열리면 ChatGPT Plus/Pro 를 구독 중인 계정으로
echo   "Sign in with ChatGPT" 를 눌러 로그인해 주세요.
echo ==============================================
call codex login
echo.
echo ==============================================
echo   로그인 상태 확인
echo ==============================================
call claude auth status --text
call codex login status
echo.
echo 둘 다 로그인돼 있으면 "글쓰기.bat" 을 실행하세요.
echo 이미 글쓰기 화면을 열어 뒀다면 ⚙️ 설정 → "다시 확인"을 누르면 됩니다.
echo.
if /i not "%~1"=="nopause" pause
