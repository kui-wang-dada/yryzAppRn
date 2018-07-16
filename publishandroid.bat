
node ./config/env.js %1

cd ./android
node ./readkey.js
./gradlew assembleRelease
cd ..
start android\app\build\outputs\apk