@echo off
rem Double-click this to open the board with its buttons working.
rem
rem Opening index.html directly also works and shows everything — but a page opened from a file
rem cannot write one, so the answer buttons do not appear. This starts the small local server that
rem can, and opens the page for you. Close the window when you are done.
cd /d "%~dp0"
node serve.mjs
if errorlevel 1 (
  echo.
  echo Node could not run. Install it from https://nodejs.org and try again.
  pause
)
