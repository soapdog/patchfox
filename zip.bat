@echo off
echo adding to git
call git commit -am "commit before tentative release."
call rimraf .\web-ext-artifacts
echo rebuilding web extension...
call npm run clean-build
echo building web extension...
cd .\dist
call web-ext build --overwrite-dest
move .\web-ext-artifacts ..\
cd ..
echo compressing source..
call git archive -o source.zip HEAD
move .\source.zip .\web-ext-artifacts
echo done