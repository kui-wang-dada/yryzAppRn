#!/usr/bin/env bash
node ./config/env.js $1
rm -rf ./android/app/build/outputs/apk
cd ./android
node ./readkey.js
./gradlew assembleRelease
cd ..
open ./android/app/build/outputs/apk