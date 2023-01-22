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


const blob = require("../blob");
const votes = require("../votes");
const profile = require("../profile");

module.exports = async (ssb, msg) => {
  let text = msg.value.content.text;
  if (msg.value.content.type === "blog") {
    const blog = await blob.getBlob(ssb, msg.value.content.blog);
    text = `# ${msg.value.content.title}\n\n> ${
      msg.value.content.summary
    }\n\n---\n${Buffer.from(blog || "", "base64").toString("utf-8")})`;
  } else if (msg.value.content.type === "contact") {
    const userProfile = await profile.getRawProfile(ssb, msg.value.content.contact);
    if (msg.value.content.hasOwnProperty("following")) text = msg.value.content.following ? "Followed " : "Unfollowed ";
    else text = msg.value.content.blocking ? "Blocked " : "Unblocked "
    text += `@[${
      userProfile.name || msg.value.content.contact.slice(1, 1 + 8)
    }](${msg.value.content.contact})`;
  }
  const voters = await votes.getVotes(ssb, msg.key);
  return {
    msgId: msg.key,
    author: msg.value.author,
    timestamp: msg.value.timestamp,
    text,
    recps: msg.value.content.recps,
    voters,
  };
};
