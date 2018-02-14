#!/usr/local/bin/node

const createSsbParty = require('ssb-party');
const readline = require('readline');
const nativeMessage = require('chrome-native-messaging');
const md = require('ssb-markdown');
const router = require('tiny-router');

function getReplyFor(msg, sbot, cb) {
    switch (msg.cmd) {
        case "whoami":
            sbot.whoami((err, feed) => {
                cb(feed.id)
            })
            break;
        case "publish":
            sbot.publish(msg.data, (err, data) => {
                if (err) {
                    cb({cmd: msg.cmd, error: err, data: false});
                } else {
                    cb({cmd: msg.cmd, error: false, data: data});
                }
            })
            break;
        case "get":
            sbot.get(msg.id, (err, data) => {
                if (err) {
                    cb({cmd: msg.cmd, error: err, data: false});
                } else {
                    if (data.content.type == 'post') {
                        data.content.markdown = md.block(data.content.text, data.content.mentions);
                    }
                    cb({cmd: msg.cmd, error: false, data: data});
                }
            })
            break;
        case "get-related-messages":
            sbot.relatedMessages(msg.data, (err, data) => {
                if (err) {
                    cb({cmd: msg.cmd, error: err, data: false});
                } else {
                    cb({cmd: msg.cmd, error: false, data: data});
                }
            })
            break;
        case "blobs-get":
            sbot.blobs.get(msg.id, (err, data) => {
                if (err) {
                    cb({cmd: msg.cmd, error: err, data: false});
                } else {
                    cb({cmd: msg.cmd, error: false, data: data});
                }
            })
            break;
    }
}

createSsbParty(function (err, sbot) {
    if (err) {
        console.error(err);
    }

    router.get("/blob/{blobid}", function(req, res) {
        var blobid = req.body.blobid;
        sbot.blobs.get(blobid, (err, data) => {
            if (err) {
                res.send("error loading blob: " + JSON.stringify(err), "text/plain")
            } else {
                res.sendImage(data)
            }
        })
    });

    //router.listen(7777);

    process.stdin
        .pipe(new nativeMessage.Input())
        .pipe(new nativeMessage.Transform(function (msg, push, done) {
            getReplyFor(msg, sbot, data => {
                push(data);
                done();
            });
        }))
        .pipe(new nativeMessage.Output())
        .pipe(process.stdout);
});