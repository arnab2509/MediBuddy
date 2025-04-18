@echo off
echo WARNING: This script will rewrite git history to remove sensitive files.
echo Make sure you have pushed all your changes to a backup branch first.
echo This operation is DESTRUCTIVE and CANNOT be undone.
echo.
echo Press Ctrl+C to cancel or any key to continue...
pause > nul

REM Remove .env files from git history
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch backend/.env frontend/.env admin/.env" --prune-empty --tag-name-filter cat -- --all

REM Remove any other sensitive files
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch backend/seedDoctors.js" --prune-empty --tag-name-filter cat -- --all

echo.
echo Sensitive files have been removed from git history.
echo Run the following commands to push the changes:
echo.
echo git push origin --force --all
echo git push origin --force --tags
echo.
echo Make sure to update your credentials since they may have been compromised.
pause 