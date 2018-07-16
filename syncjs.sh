#!/usr/bin/env bash

cd ../rn-yryz

git pull
cd ../yryz-app

cp -R ../rn-yryz/js/* ./js
git add .
git commit -m "syncjs"
git fetch origin dev
git merge origin/dev
git push
