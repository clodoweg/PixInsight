@echo off
rem Copie tous les .tiff de Fits\<annee>\<cible>\ vers Works\Astro\<annee>\ (seulement si la source est plus recente : les .tiff inchanges ne sont pas recopies), puis affiche un recap.
rem Ensuite le .tiff d'origine est SUPPRIME de Fits, seulement si la copie existe bien dans Works\Astro (copie, remplace ou deja la).
chcp 65001 >nul
setlocal

set "SRC=C:\Users\User\Mon Drive\Astronomy\Fits"
set "DST=C:\Users\User\Mon Drive\Works\Astro"
set "LOG=%TEMP%\copie_tiff_recap.txt"

set /a NOUVEAUX=0
set /a REMPLACES=0
set /a INCHANGES=0
set /a ERREURS=0
set /a SUPPRIMES=0
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
if exist "%LOG%" (type "%LOG%") else (echo Aucun fichier copié.)
echo -------------------------------
echo Nouveaux : %NOUVEAUX%
echo Remplacés : %REMPLACES%
echo Inchangés (non recopiés) : %INCHANGES%
echo Erreurs : %ERREURS%
echo Supprimés de Fits : %SUPPRIMES%
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
rem robocopy /XO : source plus ancienne sautée ; même date et même taille : sautée aussi.
rem Code retour : 0 = rien copié, 1 = copié, 8 ou plus = erreur.
robocopy "%~dp1." "%DST%\%~2" "%~nx1" /XO /R:1 /W:1 /NJH /NJS /NFL /NDL /NP >nul 2>&1
if errorlevel 8 (
  set /a ERREURS+=1
  echo [ERREUR]   %~2\%~nx1 : copie ratée, original gardé >> "%LOG%"
  exit /b 0
)
if not errorlevel 1 (
  set /a INCHANGES+=1
) else (
  if "%ETAT%"=="nouveau" (set /a NOUVEAUX+=1) else (set /a REMPLACES+=1)
  echo [%ETAT%] %~2\%~nx1   ^(depuis %~dp1^) >> "%LOG%"
)
rem copie (ou deja presente) : l'original est supprime de Fits, seulement si le fichier existe bien a l'arrivee
if not exist "%DST%\%~2\%~nx1" (
  set /a ERREURS+=1
  echo [ERREUR]   %~2\%~nx1 : absent de l'arrivée, original gardé >> "%LOG%"
  exit /b 0
)
del /q "%~f1" >nul 2>&1
if exist "%~f1" (
  set /a ERREURS+=1
  echo [ERREUR]   %~nx1 : suppression impossible dans %~dp1 >> "%LOG%"
) else (
  set /a SUPPRIMES+=1
)
exit /b 0
