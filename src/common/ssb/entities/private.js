/*

File adapted from Perihelion by Nicolas Santini.
 
Perihelion is an awesome SSB client, get its source from:

https://github.com/nsantini/perihelion

MIT License

Copyright (c) 2022 Nicolas Santini

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/


const pull = require("pull-stream");
const processMsg = require("./utils/message");

const collector = (ssb, resolve, reject) => {
  return async (err, collectedThreads) => {
    if (err) {
      console.error("get latests posts", err);
      reject(err);
    } else {
      resolve(
        await Promise.all(
          collectedThreads.map(async (thread) => {
            thread.messages = thread.messages || [];
            const replyCount = thread.messages.length - 1;
            thread.messages.slice(0, 1);
            const messages = await Promise.all(
              thread.messages.map(async (message) => {
                const processed = await processMsg(ssb, message);
                return processed;
              })
            );

            return {
              messages,
              replyCount,
            };
          })
        )
      );
    }
  };
};

module.exports = {
  getPrivateFeed: async (ssb) => {
    return new Promise(async (resolve, reject) => {
      try {
        const maxMessages = 20;
        pull(
          ssb.threads.private({
            allowlist: ["post", "blog"],
          }),
          pull.take(maxMessages),
          pull.collect(collector(ssb, resolve, reject))
        );
      } catch (err) {
        reject(err);
      }
    });
  },
};
