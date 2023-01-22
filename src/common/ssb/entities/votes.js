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
const ref = require("ssb-ref");
const { where, votesFor, toPullStream } = require("ssb-db2/operators");

module.exports = {
  getVotes: async (ssb, msgId) => {
    const rawVotes = await new Promise((resolve, reject) => {
      pull(
        ssb.db.query(where(votesFor(msgId)), toPullStream()),
        pull.filter(
          (ref) =>
            ref.value.content.type === "vote" &&
            ref.value.content.vote &&
            typeof ref.value.content.vote.value === "number" &&
            ref.value.content.vote.value >= 0 &&
            ref.value.content.vote.link === msgId
        ),
        pull.collect((err, collectedMessages) => {
          if (err) {
            reject(err);
          } else {
            resolve(collectedMessages);
          }
        })
      );
    });

    // { @key: 1, @key2: 0, @key3: 1 }
    // only one vote per person!
    const reducedVotes = rawVotes.reduce((acc, vote) => {
      acc[vote.value.author] = vote.value.content.vote;
      return acc;
    }, {});

    // gets *only* the people who voted 1
    // [ {@key, %link, value:1, expression}, ... ]
    const voters = Object.entries(reducedVotes)
      .filter(([, vote]) => vote.value === 1)
      .map(([key, vote]) => ({key, ...vote}));

    return voters;
  },
  vote: async (ssb, msgId) => {
    return new Promise(async (resolve, reject) => {
      try {
        ssb.db.publish(
          {
            timestamp: Date.now(),
            author: ssb.id,
            type: "vote",
            vote: {
              link: msgId,
              value: 1,
              expression: "👍🏻",
            },
          },
          (err, kvt) => {
            if (err) {
              return reject(err);
            }
            resolve(kvt);
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  },
};
