#!/bin/sh
echo adding to git
git commit -am "[[ release ]] commit before tentative release."
rm -rf ./web-ext-artifacts
echo rebuilding web extension...
npm run clean-build
echo building web extension...
cd ./dist
web-ext build --overwrite-dest
mv ./web-ext-artifacts ../
cd ..
echo compressing source..
git archive -o source.zip HEAD
mv ./source.zip ./web-ext-artifacts
echo done
