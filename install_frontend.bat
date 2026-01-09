@echo off
echo ========================================
echo Installation du Frontend OneHealth
echo ========================================

REM Installer les dépendances npm
echo.
echo Installation des dépendances npm...
npm install --legacy-peer-deps

echo.
echo ========================================
echo Installation terminée avec succès !
echo ========================================
echo.
echo Pour lancer le frontend, exécutez : start_frontend.bat
pause
