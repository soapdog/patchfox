#!/usr/bin/env node

var nativeMessage = require('chrome-native-messaging');

process.stdin
    .pipe(new nativeMessage.Input())
    .pipe(new nativeMessage.Debug())
    .pipe(process.stdout)
;
