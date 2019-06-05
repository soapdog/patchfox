@echo off
cd .\dist
call web-ext build --overwrite-dest
cd ..
