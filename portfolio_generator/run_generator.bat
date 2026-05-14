@echo off
cd /d "%~dp0\.."
set "BUNDLED_PY=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
if exist "%BUNDLED_PY%" (
  "%BUNDLED_PY%" portfolio_generator\generator_app.py
) else (
  python portfolio_generator\generator_app.py
)
pause
