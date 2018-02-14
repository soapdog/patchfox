@echo off

node json2msg.js < test-start.json | node ../host-app.js | node msg2json.js
REM sbot whoami
REM timeout /t 120
REM node json2msg.js < test-end.json | node bin.js | node msg2json.js