@echo off
rem maj_pc.bat : met a jour le depot PixInsight puis copie les scripts clodoweg dans PixInsight.
rem Double-clic suffit. La toute premiere fois seulement, Windows demande l'administrateur
rem pour donner a ton compte le droit d'ecrire dans le dossier clodoweg ; ensuite plus jamais.
setlocal
set "DEPOT=C:\Dev\PixInsight"
set "SOURCE=%DEPOT%\docs\process-icons\scripts"
set "CIBLE=C:\Program Files\PixInsight\src\scripts\clodoweg"

echo === git pull dans %DEPOT% ===
cd /d "%DEPOT%" || (echo Dossier %DEPOT% introuvable. & pause & exit /b 1)
git pull
if errorlevel 1 (echo git pull a echoue : rien n'est copie. & pause & exit /b 1)

rem test d'ecriture dans le dossier cible (sans droits admin)
call :test_ecriture
if errorlevel 1 call :donner_droits
call :test_ecriture
if errorlevel 1 (echo Pas le droit d'ecrire dans %CIBLE%. & pause & exit /b 1)

echo === copie de %SOURCE% vers %CIBLE% ===
xcopy "%SOURCE%\*" "%CIBLE%\" /E /I /Y
if errorlevel 1 (echo La copie a echoue. & pause & exit /b 1)
echo Termine. Relance PixInsight si des scripts ont change.
exit /b 0

:test_ecriture
if not exist "%CIBLE%" mkdir "%CIBLE%" >nul 2>&1
copy /y nul "%CIBLE%\_cw_test.tmp" >nul 2>&1 || exit /b 1
del "%CIBLE%\_cw_test.tmp" >nul 2>&1
exit /b 0

:donner_droits
rem une seule fois : donne a ton compte le droit Modifier sur le dossier clodoweg
echo Premiere fois : autorisation administrateur pour donner les droits sur %CIBLE%...
set "TMPCMD=%TEMP%\cw_droits.cmd"
> "%TMPCMD%" echo @echo off
>> "%TMPCMD%" echo if not exist "%CIBLE%" mkdir "%CIBLE%"
>> "%TMPCMD%" echo icacls "%CIBLE%" /grant "%USERDOMAIN%\%USERNAME%:(OI)(CI)M" /T
powershell -NoProfile -Command "Start-Process -FilePath '%TMPCMD%' -Verb RunAs -Wait"
del "%TMPCMD%" >nul 2>&1
exit /b 0
