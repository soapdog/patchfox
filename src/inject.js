const client = require("ssb-client");
const config = require("ssb-config");

const inject = (data) => {
    console.log("Saved Data", data);
    return new Promise((resolve, reject) => {
        client(data.keys, {
            remote: data.remote,
            caps: config.caps,
            manifest: data.manifest
        }, (err, s) => {

            if (err) {
                reject("Connecting to sbot, <a href=\"#/setup\">go back to setup</a> and check your settings. Also, make sure <i>sbot</i> is running (is scuttle-shell icon appearing on your machine?).");
            } else {
                resolve({sbot: s, remote: data.remote, keys: data.keys, manifest: data.manifest});
            }
        });
    });
};

module.exports = inject;
