@echo off
rem maj_pc.bat : met a jour le depot PixInsight puis copie les scripts clodoweg dans PixInsight.
rem A lancer par clic droit > Executer en tant qu'administrateur (ecriture dans C:\Program Files).
setlocal
set "DEPOT=C:\Dev\PixInsight"
set "SOURCE=%DEPOT%\docs\process-icons\scripts"
set "CIBLE=C:\Program Files\PixInsight\src\scripts\clodoweg"

rem droits administrateur (sinon la copie dans Program Files echoue)
net session >nul 2>&1
if errorlevel 1 (
   echo Relance en administrateur...
   powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
   exit /b
)

echo.
echo === git pull dans %DEPOT% ===
cd /d "%DEPOT%" || (echo Dossier %DEPOT% introuvable. & pause & exit /b 1)
git pull
if errorlevel 1 (echo git pull a echoue : rien n'est copie. & pause & exit /b 1)

echo.
echo === copie de %SOURCE% vers %CIBLE% ===
if not exist "%CIBLE%" mkdir "%CIBLE%"
xcopy "%SOURCE%\*" "%CIBLE%\" /E /I /Y
if errorlevel 1 (echo La copie a echoue. & pause & exit /b 1)

echo.
echo Termine. Relance PixInsight si des scripts ont change.
pause
