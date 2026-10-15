@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 글쓰기 듀오 - 설치
echo.
echo ==============================================
echo   글쓰기 듀오 설치를 시작합니다
echo ==============================================
echo.

call :find_python
if defined PY goto :have_python

echo [1/3] 파이썬이 없어서 설치합니다. 몇 분 걸릴 수 있어요...
where winget >nul 2>nul
if errorlevel 1 goto :no_winget
winget install -e --id Python.Python.3.12 --scope user --accept-source-agreements --accept-package-agreements
call :find_python
if defined PY goto :have_python
echo.
echo 파이썬 설치는 끝났습니다.
echo 이 창을 닫고 "설치하기.bat" 을 한 번 더 더블클릭해 주세요.
echo.
pause
exit /b

:no_winget
echo.
echo 이 PC에서는 자동 설치가 안 됩니다. 파이썬 다운로드 페이지를 열어 드릴게요.
echo  1. 노란색 "Download Python" 버튼을 눌러 설치 파일을 받습니다
echo  2. 설치 첫 화면 아래의 "Add python.exe to PATH" 를 꼭 체크합니다
echo  3. "Install Now" 를 누릅니다
echo  4. 설치가 끝나면 "설치하기.bat" 을 다시 더블클릭해 주세요
start "" https://www.python.org/downloads/
echo.
pause
exit /b

:have_python
echo [1/3] 파이썬 확인 완료
echo.
echo [2/3] 필요한 부품을 설치합니다...
%PY% -m pip install --disable-pip-version-check -q -r requirements.txt
if errorlevel 1 (
  echo 부품 설치 중 오류가 났습니다. 위의 메시지를 복사해서 Claude에게 보여주세요.
  pause
  exit /b
)
echo       완료
echo.
echo [3/3] API 키 설정 파일을 준비합니다...
if not exist ".env" copy ".env.example" ".env" >nul
echo       메모장이 열리면 API 키 두 개를 붙여넣고 저장한 뒤 닫아 주세요.
echo       키가 아직 없으면 그냥 닫아도 됩니다. 연습 모드는 키 없이 돌아가요.
notepad ".env"
echo.
echo ==============================================
echo   설치 끝! 이제 "글쓰기.bat" 을 더블클릭하면 웹페이지가 열립니다.
echo ==============================================
echo.
pause
exit /b

:find_python
set "PY="
py --version >nul 2>nul && set "PY=py" && exit /b
python --version >nul 2>nul && set "PY=python" && exit /b
exit /b
