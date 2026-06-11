@echo off
chcp 65001 >nul
title 이스타항공 e-Book 미리보기
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  [안내] 이 PC에 Node.js가 없어 로컬 미리보기 서버를 띄울 수 없습니다.
  echo        - PDF 웹진은 GitHub Pages 등 웹주소에 올리면 설치 없이 바로 동작합니다.
  echo        - 로컬 미리보기가 필요하면 https://nodejs.org 에서 Node.js 설치 후 다시 실행하세요.
  echo.
  pause
  exit /b
)
echo 미리보기 서버를 시작합니다. 잠시 후 브라우저가 자동으로 열립니다...
node "%~dp0serve.js"
pause
