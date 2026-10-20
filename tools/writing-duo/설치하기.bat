@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 글쓰기 듀오 - 설치
echo.
echo ==============================================
echo   글쓰기 듀오 설치를 시작합니다
echo   API 키 없이 Claude / ChatGPT 구독으로 동작합니다
echo ==============================================
echo.

where winget >nul 2>nul
if errorlevel 1 set "NOWINGET=1"
set "RESTART="

rem ── 1) 파이썬 ──
call :find_python
if defined PY goto :py_ok
if defined NOWINGET goto :manual_python
echo [1/5] 파이썬을 설치합니다. 몇 분 걸릴 수 있어요...
winget install -e --id Python.Python.3.12 --scope user --accept-source-agreements --accept-package-agreements
set "RESTART=1"
goto :node
:py_ok
echo [1/5] 파이썬 확인 완료

rem ── 2) Node.js : Claude Code 와 Codex 를 설치하는 데 필요 ──
:node
where npm >nul 2>nul
if not errorlevel 1 goto :node_ok
if defined NOWINGET goto :manual_node
echo [2/5] Node.js 를 설치합니다...
winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
set "RESTART=1"
goto :git
:node_ok
echo [2/5] Node.js 확인 완료

rem ── 3) Git : 윈도우에서 Claude Code 가 쓰는 부품 ──
:git
where git >nul 2>nul
if not errorlevel 1 goto :git_ok
if defined NOWINGET goto :manual_git
echo [3/5] Git 을 설치합니다...
winget install -e --id Git.Git --accept-source-agreements --accept-package-agreements
set "RESTART=1"
goto :check_restart
:git_ok
echo [3/5] Git 확인 완료

:check_restart
if not defined RESTART goto :install_parts
echo.
echo ==============================================
echo   기본 프로그램 설치가 끝났습니다.
echo   이 창을 닫고 "설치하기.bat" 을 한 번 더 더블클릭해 주세요.
echo   새로 설치한 프로그램은 창을 다시 열어야 인식됩니다.
echo ==============================================
echo.
pause
exit /b

:install_parts
echo.
echo [4/5] 필요한 부품과 Claude Code, Codex 를 설치합니다. 몇 분 걸릴 수 있어요...
%PY% -m pip install --disable-pip-version-check -q -r requirements.txt
if errorlevel 1 goto :fail
call npm install -g @anthropic-ai/claude-code @openai/codex
if errorlevel 1 goto :fail
echo       완료
echo.
echo [5/5] 구독 계정으로 로그인합니다.
call "%~dp0로그인하기.bat" nopause
echo.
echo ==============================================
echo   설치 끝! 이제 "글쓰기.bat" 을 더블클릭하면 웹페이지가 열립니다.
echo ==============================================
echo.
pause
exit /b

:fail
echo.
echo 설치 중 오류가 났습니다. 위의 메시지를 복사해서 Claude에게 보여주세요.
pause
exit /b

:manual_python
echo 이 PC에서는 자동 설치가 안 됩니다. 파이썬 다운로드 페이지를 열어 드릴게요.
echo  1. "Download Python" 버튼을 눌러 설치 파일을 받습니다
echo  2. 설치 첫 화면 아래의 "Add python.exe to PATH" 를 꼭 체크하고 "Install Now"
echo  3. 설치가 끝나면 "설치하기.bat" 을 다시 더블클릭해 주세요
start "" https://www.python.org/downloads/
pause
exit /b

:manual_node
echo 이 PC에서는 자동 설치가 안 됩니다. Node.js 다운로드 페이지를 열어 드릴게요.
echo  "LTS" 버전을 받아 기본 설정 그대로 설치한 뒤 "설치하기.bat" 을 다시 더블클릭해 주세요.
start "" https://nodejs.org/
pause
exit /b

:manual_git
echo 이 PC에서는 자동 설치가 안 됩니다. Git 다운로드 페이지를 열어 드릴게요.
echo  기본 설정 그대로 설치한 뒤 "설치하기.bat" 을 다시 더블클릭해 주세요.
start "" https://git-scm.com/download/win
pause
exit /b

:find_python
set "PY="
py --version >nul 2>nul && set "PY=py" && exit /b
python --version >nul 2>nul && set "PY=python" && exit /b
exit /b
