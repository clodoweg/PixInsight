@echo off
rem Copie tous les .tiff de Fits\<annee>\<cible>\ vers Works\Astro\<annee>\ (en ecrasant), puis affiche un recap.
chcp 65001 >nul
setlocal

set "SRC=C:\Users\User\Mon Drive\Astronomy\Fits"
set "DST=C:\Users\User\Mon Drive\Works\Astro"
set "LOG=%TEMP%\copie_tiff_recap.txt"

set /a NOUVEAUX=0
set /a REMPLACES=0
set /a ERREURS=0
if exist "%LOG%" del "%LOG%"

if not exist "%SRC%\" (
  echo Dossier source introuvable : %SRC%
  pause
  exit /b 1
)

echo Copie des .tiff en cours...
echo.

rem Chaque sous-dossier de Fits (annee) ; les .tiff sont cherches dans tous ses sous-dossiers.
for /d %%Y in ("%SRC%\*") do call :annee "%%Y"

echo ============ RECAP ============
if exist "%LOG%" (type "%LOG%") else (echo Aucun fichier .tiff trouve.)
echo -------------------------------
echo Nouveaux : %NOUVEAUX%
echo Remplacés : %REMPLACES%
echo Erreurs : %ERREURS%
echo ===============================
exit /b 0

:annee
rem %1 = sous-dossier de Fits (for /r n'accepte pas une variable de boucle comme racine)
for /r "%~1" %%F in (*.tiff) do call :copier "%%F" "%~nx1"
exit /b 0

:copier
rem %1 = fichier .tiff source, %2 = nom du sous-dossier (annee)
if /i not "%~x1"==".tiff" exit /b 0
if not exist "%DST%\%~2\" mkdir "%DST%\%~2"
set "ETAT=nouveau"
if exist "%DST%\%~2\%~nx1" set "ETAT=remplacé"
copy /y "%~1" "%DST%\%~2\" >nul 2>&1
if errorlevel 1 (
  set /a ERREURS+=1
  echo [ERREUR]   %~2\%~nx1 >> "%LOG%"
  exit /b 0
)
if "%ETAT%"=="nouveau" (set /a NOUVEAUX+=1) else (set /a REMPLACES+=1)
echo [%ETAT%] %~2\%~nx1   ^(depuis %~dp1^) >> "%LOG%"
exit /b 0
