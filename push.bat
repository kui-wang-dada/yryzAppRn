@echo off
git status |findstr /c:"Unmerged paths"&& goto UNMEGED || goto ADD

git status |findstr /c:"nothing to commit, working tree clean"&& goto EXIT || goto ADD

:ADD
git add .
goto COMMIT

:COMMIT

set /p message=commit message:
git commit -am "%message%"
git pull
git merge origin/master
for /f "delims=" %%t in ('git rev-parse --abbrev-ref HEAD') do set branch=%%t
git merge origin/%branch%
git status |findstr /c:"Unmerged paths"&& goto UNMEGED || goto PUSH

:PUSH

git push
goto EXIT

:UNMEGED
echo error : unmerge file need fix!!!


:EXIT
git status







