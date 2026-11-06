@echo off
rem Copie tous les .tif (et les anciens .tiff) de Fits\<annee>\<cible>\ vers Works\Astro\<annee>\ (seulement si la source est plus recente : les .tiff inchanges ne sont pas recopies), puis affiche un recap.
rem Ensuite le .tiff d'origine est SUPPRIME de Fits, seulement si la copie existe bien dans Works\Astro (copie, remplace ou deja la).
rem Un fichier qui REMPLACERAIT un fichier deja dans Works\Astro n'est pas copie tout de suite : a la fin, une question O/N par fichier
rem (O = remplace puis original supprime de Fits ; N = rien ne change, original garde dans Fits). Demande de l'utilisateur, 6 novembre 2026.
chcp 65001 >nul
setlocal

set "SRC=C:\Users\User\Mon Drive\Astronomy\Fits"
set "DST=C:\Users\User\Mon Drive\Works\Astro"
set "LOG=%TEMP%\copie_tiff_recap.txt"
set "ATT=%TEMP%\copie_tiff_attente.txt"

set /a NOUVEAUX=0
set /a REMPLACES=0
set /a INCHANGES=0
set /a ERREURS=0
set /a SUPPRIMES=0
set /a REFUSES=0
if exist "%LOG%" del "%LOG%"
if exist "%ATT%" del "%ATT%"

if not exist "%SRC%\" (
  echo Dossier source introuvable : %SRC%
  pause
  exit /b 1
)

echo Copie des .tif / .tiff en cours...
echo.

rem Chaque sous-dossier de Fits (annee) ; les .tiff sont cherches dans tous ses sous-dossiers.
for /d %%Y in ("%SRC%\*") do call :annee "%%Y"

rem Remplacements : une question par fichier, a la fin
if exist "%ATT%" (
  echo.
  echo ===== REMPLACEMENTS A VALIDER =====
  for /f "usebackq tokens=1,2 delims=|" %%A in ("%ATT%") do call :demander "%%A" "%%B"
  del "%ATT%"
  echo.
)

echo ============ RECAP ============
if exist "%LOG%" (type "%LOG%") else (echo Aucun fichier copié.)
echo -------------------------------
echo Nouveaux : %NOUVEAUX%
echo Remplacés : %REMPLACES%
echo Remplacements refusés (gardés dans Fits) : %REFUSES%
echo Inchangés (non recopiés) : %INCHANGES%
echo Erreurs : %ERREURS%
echo Supprimés de Fits : %SUPPRIMES%
echo ===============================
exit /b 0

:annee
rem %1 = sous-dossier de Fits (for /r n'accepte pas une variable de boucle comme racine)
for /r "%~1" %%F in (*.tif *.tiff) do call :copier "%%F" "%~nx1"
exit /b 0

:copier
rem %1 = fichier .tiff source, %2 = nom du sous-dossier (annee)
rem .tif (Export_TIFF depuis le 22 octobre 2026) ou ancien .tiff ; deja traite (supprime) : on passe
if /i not "%~x1"==".tif" if /i not "%~x1"==".tiff" exit /b 0
if not exist "%~f1" exit /b 0
if not exist "%DST%\%~2\" mkdir "%DST%\%~2"
set "ETAT=nouveau"
if exist "%DST%\%~2\%~nx1" set "ETAT=remplacé"
rem fichier deja dans Works\Astro et source plus recente : remplacement mis en attente (question a la fin)
rem (hors bloc entre parentheses : un chemin avec une parenthese ne casse rien)
if not "%ETAT%"=="remplacé" goto copie
robocopy "%~dp1." "%DST%\%~2" "%~nx1" /XO /L /R:0 /W:0 /NJH /NJS /NFL /NDL /NP >nul 2>&1
if errorlevel 8 goto copie
if not errorlevel 1 goto copie
>> "%ATT%" echo %~f1^|%~2
exit /b 0
:copie
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
call :supprimer "%~f1"
exit /b 0

:supprimer
rem %1 = original dans Fits, supprime (la copie existe a l'arrivee)
del /q "%~f1" >nul 2>&1
if exist "%~f1" (
  set /a ERREURS+=1
  echo [ERREUR]   %~nx1 : suppression impossible dans %~dp1 >> "%LOG%"
) else (
  set /a SUPPRIMES+=1
)
exit /b 0

:demander
rem %1 = fichier source dans Fits, %2 = annee ; question O/N avant de remplacer le fichier de Works\Astro
echo.
echo %~2\%~nx1
for %%S in ("%~f1") do echo   Fits  : %%~tS  %%~zS octets  (nouveau)
for %%D in ("%DST%\%~2\%~nx1") do echo   Astro : %%~tD  %%~zD octets  (actuel)
choice /c ON /n /m "  Remplacer le fichier de Works\Astro ? [O/N] "
if errorlevel 2 (
  set /a REFUSES+=1
  echo [gardé]   %~2\%~nx1 : remplacement refusé, original gardé dans Fits >> "%LOG%"
  exit /b 0
)
robocopy "%~dp1." "%DST%\%~2" "%~nx1" /R:1 /W:1 /NJH /NJS /NFL /NDL /NP >nul 2>&1
if errorlevel 8 (
  set /a ERREURS+=1
  echo [ERREUR]   %~2\%~nx1 : remplacement raté, original gardé >> "%LOG%"
  exit /b 0
)
set /a REMPLACES+=1
echo [remplacé] %~2\%~nx1   ^(depuis %~dp1^) >> "%LOG%"
call :supprimer "%~f1"
exit /b 0
