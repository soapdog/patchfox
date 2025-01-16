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
const socialGraph = require("./utils/socialGraph");
const maxMessages = 20;

/**
 * Returns a function that filters messages based on who published the message.
 */
const socialFilter = async (ssb, hops) => {
  const { id } = ssb;
  const graph = await socialGraph.getSocialGraph(ssb);
  const relationshipObject = graph[id];

  if (!relationshipObject) {
    return true
  }

  const followingList = Object.entries(relationshipObject)
    .filter(([, val]) => val >= socialGraph.weightings.following)
    .map(([key]) => key);

  const blockingList = Object.entries(relationshipObject)
    .filter(([, val]) => val === socialGraph.weightings.blocking)
    .map(([key]) => key);

  return pull.filter((thread) => {
    if (blockingList.includes(thread.root.value.author)) {
      return false;
    }
    if (hops <= 1 && thread.root.value.author === id) {
      return true;
    } else if (hops <= 1) {
      return followingList.includes(thread.root.value.author);
    } else if (hops > 1 && thread.root.value.author !== id) {
      return !followingList.includes(thread.root.value.author);
    }
  });
};

const collector = (ssb, page, resolve, reject) => {
  return async (err, collectedThreads) => {
    if (err) {
      console.error("get latests posts", err);
      reject(err);
    } else {
      resolve(
        await Promise.all(
          collectedThreads
            .slice((page - 1) * maxMessages)
            .map(async (thread) => {
              const root = await processMsg(ssb, thread.root);

              return {
                messages: [root],
                replyCount: thread.replyCount,
              };
            })
        )
      );
    }
  };
};

module.exports = {
  getProfileFeed: async (ssb, feedId, page = 1) => {
    return new Promise(async (resolve, reject) => {
      try {
        pull(
          ssb.threads.profileSummary({
            id: feedId,
            allowlist: ["post", "blog", "contact"],
          }),
          pull.take(maxMessages * page),
          pull.collect(collector(ssb, page, resolve, reject))
        );
      } catch (err) {
        reject(err);
      }
    });
  },
  getPublicFeed: async (ssb, hops, page = 1) => {
    return new Promise(async (resolve, reject) => {
      try {
        const socialFilterInstance = await socialFilter(ssb, hops);
        pull(
          ssb.threads.publicSummary({ allowlist: ["post", "blog"] }),
          socialFilterInstance,
          pull.take(maxMessages * page),
          pull.collect(collector(ssb, page, resolve, reject))
        );
      } catch (err) {
        reject(err);
      }
    });
  },
};
