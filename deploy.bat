@echo off
echo [1/3] Staging changes...
git add .
echo [2/3] Committing changes...
set /p msg="Enter commit message: "
git commit -m "%msg%"
echo [3/3] Pushing to GitHub...
git push origin main
echo Done! Your portfolio is updating at https://tearn1.github.io/Asemahe-Nkwali.Port2026/
pause