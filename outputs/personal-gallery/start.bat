@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "GALLERY_PYTHON="
if exist "%USERPROFILE%\anaconda3\python.exe" set "GALLERY_PYTHON=%USERPROFILE%\anaconda3\python.exe"
if not defined GALLERY_PYTHON for /f "delims=" %%P in ('where python 2^>nul') do if not defined GALLERY_PYTHON set "GALLERY_PYTHON=%%P"
if not defined GALLERY_PYTHON (
  echo 请先安装 Python 3.9 或更高版本，再运行本文件。
  pause
  exit /b 1
)
if not exist ".venv\Scripts\python.exe" (
  echo 正在创建本项目专用运行环境……
  "%GALLERY_PYTHON%" -m venv .venv
  if errorlevel 1 (
    echo 创建运行环境失败，请检查 Python 安装。
    pause
    exit /b 1
  )
)
set "GALLERY_PYTHON=%~dp0.venv\Scripts\python.exe"
"%GALLERY_PYTHON%" -c "import flask, flask_sock" >nul 2>&1
if errorlevel 1 (
  echo 正在安装运行依赖……
  "%GALLERY_PYTHON%" -m pip install -r requirements.txt
  if errorlevel 1 (
    echo 安装失败，请检查网络后重试。
    pause
    exit /b 1
  )
)
echo.
echo 郝贵彬的个人作品展览馆
echo 浏览器访问：http://127.0.0.1:8766/
echo 请保持这个窗口运行，关闭窗口会停止网站。
echo.
"%GALLERY_PYTHON%" app.py --open-browser
pause
